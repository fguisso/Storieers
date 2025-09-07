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

		const setup = async () => {
			try {
				videoEl.muted = muted;
				if (muted) {
					videoEl.setAttribute('muted', '');
				} else {
					videoEl.removeAttribute('muted');
				}
				videoEl.setAttribute('playsinline', 'true');
				videoEl.setAttribute('webkit-playsinline', 'true');
				videoEl.setAttribute('autoplay', '');
				videoEl.setAttribute('preload', 'auto');
				videoEl.autoplay = true;
				videoEl.preload = 'auto';
				videoEl.controls = false;

				videoEl.onended = onEnded;
				videoEl.onerror = () => onError(new Error('Video element error'));

				if (hlsUrl && Hls.isSupported()) {
					hls = new Hls({
						maxBufferSize: 60 * 1000 * 1000,
						maxMaxBufferLength: 30,
					});
					hls.on(Hls.Events.ERROR, (_, data) => {
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
					hls.loadSource(hlsUrl);
					hls.attachMedia(videoEl);
					let played = false;
					const tryPlay = () => {
						if (played) return;
						played = true;
						videoEl.play().catch(() => undefined);
					};
					hls.on(Hls.Events.MANIFEST_PARSED, () => { tryPlay(); });
					videoEl.addEventListener('canplay', tryPlay, { once: true } as EventListenerOptions);
					setTimeout(() => { tryPlay(); }, 0);
					return;
				}

				// Native HLS (Safari) or fallback to MP4
				if (hlsUrl && videoEl.canPlayType('application/vnd.apple.mpegurl')) {
					videoEl.src = hlsUrl;
					videoEl.load();
					const tryPlayNative = () => { videoEl.play().catch(() => undefined); };
					videoEl.addEventListener('canplay', tryPlayNative, { once: true } as EventListenerOptions);
					setTimeout(() => { tryPlayNative(); }, 0);
					return;
				}

				if (mp4Url) {
					videoEl.src = mp4Url;
					videoEl.load();
					const tryPlayMp4 = () => { videoEl.play().catch(() => undefined); };
					videoEl.addEventListener('canplay', tryPlayMp4, { once: true } as EventListenerOptions);
					setTimeout(() => { tryPlayMp4(); }, 0);
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
		};
	}, [videoEl, hlsUrl, mp4Url, onEnded, onError]);

	// Update muted state without reinitializing the media source
	useEffect(() => {
		if (!videoEl) return;
		videoEl.muted = muted;
		if (muted) {
			videoEl.setAttribute('muted', '');
		} else {
			videoEl.removeAttribute('muted');
		}
	}, [videoEl, muted]);
}