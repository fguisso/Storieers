import Hls from 'hls.js';
import { useEffect } from 'react';

export interface UseHlsOptions {
	videoEl: HTMLVideoElement | null;
	hlsUrl?: string;
	mp4Url?: string;
	muted: boolean;
	onEnded: () => void;
	onError: (err: unknown) => void;
}

export function useHls({ videoEl, hlsUrl, mp4Url, muted, onEnded, onError }: UseHlsOptions) {
	useEffect(() => {
		if (!videoEl) return;

		let hls: Hls | null = null;
		let domPlayListener: ((this: HTMLVideoElement, ev: Event) => any) | null = null;

		const setup = async () => {
			try {
				videoEl.muted = muted;
				videoEl.setAttribute('playsinline', 'true');
				videoEl.autoplay = true;
				videoEl.controls = false;

				videoEl.onended = onEnded;
				videoEl.onerror = () => onError(new Error('Video element error'));

				if (hlsUrl && Hls.isSupported()) {
					hls = new Hls({
						maxBufferSize: 60 * 1000 * 1000,
						maxMaxBufferLength: 30,
					});

					// Handle fatal errors with MP4 fallback if available
					hls.on(Hls.Events.ERROR, (_event: unknown, data: { fatal?: boolean; type?: string }) => {
						if (data?.fatal) {
							try { hls?.destroy(); } catch { /* ignore destroy errors */ }
							hls = null;
							if (mp4Url) {
								videoEl.src = mp4Url;
								videoEl.load();
								videoEl.play().catch(onError);
							} else {
								onError(new Error(`HLS fatal: ${data?.type}`));
							}
						}
					});

					// Attach media first, then load source
					hls.attachMedia(videoEl);
					hls.on(Hls.Events.MEDIA_ATTACHED, () => {
						try {
							hls?.loadSource(hlsUrl);
						} catch {
							// noop
						}
					});

					// Start playback as soon as the manifest is parsed
					hls.on(Hls.Events.MANIFEST_PARSED, () => {
						videoEl.play().catch(() => undefined);
					});

					// Also try to play when the browser reports it can play
					const tryPlay = () => {
						videoEl.play().catch(() => undefined);
					};
					domPlayListener = tryPlay;
					videoEl.addEventListener('canplay', tryPlay);
					videoEl.addEventListener('loadeddata', tryPlay);

					return;
				}

				// Native HLS (Safari) or fallback to MP4
				if (hlsUrl && videoEl.canPlayType('application/vnd.apple.mpegurl')) {
					videoEl.src = hlsUrl;
					await videoEl.play().catch(() => undefined);
					return;
				}

				if (mp4Url) {
					videoEl.src = mp4Url;
					await videoEl.play().catch(() => undefined);
					return;
				}

				onError(new Error('No playable source'));
			} catch (err) {
				onError(err);
			}
		};

		setup();

		return () => {
			try { hls?.destroy(); } catch { /* ignore destroy errors */ }
			if (domPlayListener && videoEl) {
				try {
					videoEl.removeEventListener('canplay', domPlayListener);
					videoEl.removeEventListener('loadeddata', domPlayListener);
				} catch { /* ignore cleanup errors */ }
			}
		};
	}, [videoEl, hlsUrl, mp4Url, muted, onEnded, onError]);
}