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
		title: z.string().optional(),
		name: z.string().optional(),
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

type ChannelListItem = z.infer<typeof ChannelVideosListSchema>['data'][number];

const AccountVideosListSchema = ChannelVideosListSchema;

const VideoDetailsSchema = z.object({
	id: z.number(),
	uuid: z.string(),
	title: z.string().optional(),
	name: z.string().optional(),
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

const ChannelDetailsSchema = z.object({ id: z.number(), uuid: z.string() });

const AccountChannelsSchema = z.object({
	data: z.array(z.object({ id: z.number(), name: z.string().optional() })).default([]),
});

async function httpJson<T>(url: string): Promise<T> {
	const res = await fetch(url);
	if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
	return res.json() as Promise<T>;
}

async function httpJsonMaybe<T>(url: string): Promise<T | undefined> {
	const res = await fetch(url);
	if (!res.ok) return undefined;
	return res.json() as Promise<T>;
}

async function getVideoDetails(idOrUuid: number | string) {
	const details = await httpJson<unknown>(api(`/api/v1/videos/${idOrUuid}`));
	return VideoDetailsSchema.parse(details);
}

async function getFirstChannelIdByAccountName(accountName: string | undefined): Promise<number | undefined> {
	if (!accountName) return undefined;
	try {
		const list = await httpJson<unknown>(api(`/api/v1/accounts/${encodeURIComponent(accountName)}/video-channels?count=1`));
		const parsed = AccountChannelsSchema.safeParse(list);
		if (parsed.success && parsed.data.data.length > 0) {
			return parsed.data.data[0].id;
		}
	} catch {
		// ignore and return undefined
	}
	return undefined;
}

export async function resolveStartVideo(): Promise<{ videoId: number; uuid: string; channelId?: number; accountName?: string }>
{
	let foundId: number | undefined;
	let foundUuid: string | undefined;
	let foundChannelId: number | undefined;
	let foundAccountName: string | undefined;

	const searchUrl = api(`/api/v1/search/videos?search=${encodeURIComponent(START_VIDEO)}`);
	try {
		const search = await httpJson<unknown>(searchUrl);
		const parsed = SearchVideosSchema.safeParse(search);
		if (parsed.success && parsed.data.data.length > 0) {
			const v = parsed.data.data[0];
			foundId = v.id;
			foundUuid = v.uuid;
			foundChannelId = (v.channel || v.videoChannel)?.id;
			foundAccountName = v.account?.name;
		}
	} catch {
		// ignore search failure; fallback below
	}

	// If channel still unknown, fetch video details by id or short uuid
	if (!foundChannelId) {
		const idOrShort = foundId ?? START_VIDEO.split('/w/')[1]?.split(/[?#]/)[0];
		if (idOrShort) {
			try {
				const d = await getVideoDetails(idOrShort);
				foundId = d.id;
				foundUuid = d.uuid;
				foundChannelId = d.videoChannel?.id ?? foundChannelId;
				foundAccountName = d.account?.name ?? foundAccountName;
			} catch {
				// details fetch failure; try account-based fallback below
			}
		}
	}

	// Final fallback: use account's first channel
	if (!foundChannelId) {
		foundChannelId = await getFirstChannelIdByAccountName(foundAccountName);
	}

	if (!foundId || !foundUuid) {
		throw new Error('Could not resolve start video');
	}

	return { videoId: foundId, uuid: foundUuid, channelId: foundChannelId, accountName: foundAccountName };
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
	const master = playlists.find(p => p.playlistUrl);
	return master?.playlistUrl;
}

function extractMp4Url(video: z.infer<typeof VideoDetailsSchema>): string | undefined {
	const files = video.files || [];
	const mp4 = files.find(f => !!f.fileUrl);
	return mp4?.fileUrl;
}

export async function fetchChannelVideos(channelId: number | undefined, accountName?: string): Promise<VideoItem[]> {
	let items: ChannelListItem[] | undefined;

	// Try by channel numeric id
	if (typeof channelId === 'number') {
		const listUnknown = await httpJsonMaybe<unknown>(api(`/api/v1/video-channels/${channelId}/videos?sort=-publishedAt&count=${PAGE_COUNT}`));
		if (listUnknown) {
			items = ChannelVideosListSchema.parse(listUnknown).data;
		}

		// If not found, try resolving channel uuid then list by uuid
		if (!items || items.length === 0) {
			const channelDetails = await httpJsonMaybe<unknown>(api(`/api/v1/video-channels/${channelId}`));
			const parsedDetails = channelDetails ? ChannelDetailsSchema.safeParse(channelDetails) : undefined;
			if (parsedDetails?.success) {
				const uuid = parsedDetails.data.uuid;
				const byUuid = await httpJsonMaybe<unknown>(api(`/api/v1/video-channels/${uuid}/videos?sort=-publishedAt&count=${PAGE_COUNT}`));
				if (byUuid) items = ChannelVideosListSchema.parse(byUuid).data;
			}
		}
	}

	// Fallback to account videos
	if ((!items || items.length === 0) && accountName) {
		const acc = await httpJsonMaybe<unknown>(api(`/api/v1/accounts/${encodeURIComponent(accountName)}/videos?sort=-publishedAt&count=${PAGE_COUNT}`));
		if (acc) {
			items = AccountVideosListSchema.parse(acc).data;
		}
	}

	const details = await Promise.all((items || []).map(async (it) => {
		try {
			const d = await httpJson<unknown>(api(`/api/v1/videos/${it.id}`));
			return VideoDetailsSchema.parse(d);
		} catch {
			return undefined;
		}
	}));

	const host = baseUrl.replace(/^https?:\/\//, '');
	const videos: VideoItem[] = [];
	for (let i = 0; i < (items || []).length; i++) {
		const raw = (items as ChannelListItem[])[i];
		const d = details[i];
		const id = Number(raw?.id ?? d?.id);
		const uuid = String(raw?.uuid ?? d?.uuid ?? '');
		if (!id || !uuid) continue;
		const title = String(raw?.name ?? raw?.title ?? d?.title ?? d?.name ?? '');
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