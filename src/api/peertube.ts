import { z } from 'zod';
import type { VideoItem } from '../types/models';

const INSTANCE = import.meta.env.VITE_INSTANCE as string;
const START_VIDEO = import.meta.env.VITE_START_VIDEO as string;
const PAGE_COUNT = parseInt(import.meta.env.VITE_PAGE_COUNT || '20', 10);
const MAX_DURATION = parseInt(import.meta.env.VITE_MAX_DURATION || '120', 10);

const baseUrl = INSTANCE?.replace(/\/$/, '') ?? '';
const api = (path: string) => `${baseUrl}${path}`;

const SearchVideosSchema = z.object({
	data: z.array(z.object({
		id: z.number(),
		uuid: z.string(),
		title: z.string(),
		duration: z.number().optional(),
		thumbnailPath: z.string().optional(),
		url: z.string().optional(),
		videoChannel: z.object({ id: z.number(), name: z.string().optional() }).optional(),
		channel: z.object({ id: z.number(), name: z.string().optional() }).optional(),
		account: z.object({ name: z.string().optional() }).optional(),
	})).default([])
});

const ChannelVideosListSchema = z.object({
	data: z.array(z.object({
		id: z.number(),
		uuid: z.string().optional(),
		name: z.string().optional(),
		title: z.string().optional(),
		duration: z.number().optional(),
		thumbnailPath: z.string().optional(),
		account: z.object({ name: z.string().optional() }).optional(),
	})).default([]),
});

const VideoDetailsSchema = z.object({
	id: z.number(),
	uuid: z.string(),
	title: z.string(),
	description: z.string().optional(),
	duration: z.number().optional(),
	thumbnailPath: z.string().optional(),
	url: z.string().optional(),
	account: z.object({ name: z.string().optional(), url: z.string().optional() }).optional(),
	videoChannel: z.object({ id: z.number(), name: z.string().optional(), url: z.string().optional() }).optional(),
	files: z.array(z.object({ fileUrl: z.string().url().optional() })).optional(),
	streamingPlaylists: z.array(z.object({
		playlistUrl: z.string().url().optional(),
		files: z.array(z.object({ resolution: z.object({ id: z.number().optional() }).optional() })).optional(),
	})).optional(),
});

async function httpJson<T>(url: string): Promise<T> {
	const res = await fetch(url);
	if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
	return res.json() as Promise<T>;
}

export async function resolveStartVideo(): Promise<{ videoId: number; uuid: string; channelId?: number }>
{
	const searchUrl = api(`/api/v1/search/videos?search=${encodeURIComponent(START_VIDEO)}`);
	try {
		const search = await httpJson<unknown>(searchUrl);
		const parsed = SearchVideosSchema.safeParse(search);
		if (parsed.success && parsed.data.data.length > 0) {
			const v = parsed.data.data[0];
			const channelId = (v.channel || v.videoChannel)?.id;
			return { videoId: v.id, uuid: v.uuid, channelId };
		}
	} catch {
		// ignore search failure; fallback to direct video lookup below
	}

	// fallback: GET /api/v1/videos/{shortId}
	const shortId = START_VIDEO.split('/w/')[1]?.split(/[?#]/)[0];
	if (!shortId) throw new Error('Invalid VITE_START_VIDEO');
	const detailsUrl = api(`/api/v1/videos/${shortId}`);
	const details = await httpJson<unknown>(detailsUrl);
	const parsedDetails = VideoDetailsSchema.parse(details);
	return { videoId: parsedDetails.id, uuid: parsedDetails.uuid, channelId: parsedDetails.videoChannel?.id };
}

function buildThumbnailUrl(thumbnailPath?: string): string {
	if (!thumbnailPath) return '';
	const host = baseUrl.replace(/^https?:\/\//, '');
	return `https://${host}${thumbnailPath}`;
}

function buildOriginalUrl(uuid: string): string {
	return `${baseUrl}/w/${uuid}`;
}

function extractHlsUrl(video: z.infer<typeof VideoDetailsSchema>): string | undefined {
	const playlists = video.streamingPlaylists;
	if (!playlists || playlists.length === 0) return undefined;
	// Prefer master playlist
	const master = playlists.find(p => p.playlistUrl);
	return master?.playlistUrl;
}

function extractMp4Url(video: z.infer<typeof VideoDetailsSchema>): string | undefined {
	const files = video.files || [];
	const mp4 = files.find(f => !!f.fileUrl);
	return mp4?.fileUrl;
}

export async function fetchChannelVideos(channelId: number): Promise<VideoItem[]> {
	const listUrl = api(`/api/v1/video-channels/${channelId}/videos?sort=-publishedAt&count=${PAGE_COUNT}`);
	const listUnknown = await httpJson<unknown>(listUrl);
	const listParsed = ChannelVideosListSchema.parse(listUnknown);
	const items = listParsed.data;

	const details = await Promise.all(items.map(async (it) => {
		try {
			const d = await httpJson<unknown>(api(`/api/v1/videos/${it.id}`));
			return VideoDetailsSchema.parse(d);
		} catch {
			return undefined;
		}
	}));

	const host = baseUrl.replace(/^https?:\/\//, '');
	const videos: VideoItem[] = [];
	for (let i = 0; i < items.length; i++) {
		const raw = items[i];
		const d = details[i];
		const id = Number(raw?.id ?? d?.id);
		const uuid = String((raw as { uuid?: string }).uuid ?? d?.uuid ?? '');
		if (!id || !uuid) continue;
		const title = String(raw?.name ?? raw?.title ?? d?.title ?? '');
		const duration = Number(raw?.duration ?? d?.duration ?? 0);
		if (MAX_DURATION && duration > MAX_DURATION) continue;
		const thumbnailUrl = buildThumbnailUrl(raw?.thumbnailPath ?? d?.thumbnailPath);
		const hlsUrl = d ? extractHlsUrl(d) : undefined;
		const mp4Url = d ? extractMp4Url(d) : undefined;
		videos.push({
			id,
			uuid,
			title,
			author: d?.account?.name || raw?.account?.name || 'author',
			authorUrl: d?.account?.url,
			instance: host,
			thumbnailUrl,
			duration: Number.isFinite(duration) ? duration : 0,
			hlsUrl,
			mp4Url,
			originalPageUrl: buildOriginalUrl(uuid),
		});
	}
	return videos;
}