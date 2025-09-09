import Hls from 'hls.js';
import { useEffect } from 'react';

const getLastBw = () => {
  const v = localStorage.getItem('hls:lastBwKbps');
  return v ? Number(v) * 1000 : 500_000; // 500 Kbps seed
};
const saveBw = (hls: Hls) => {
  const est = (hls as any)?.bandwidthEstimate;
  if (est) localStorage.setItem('hls:lastBwKbps', String(Math.round(est / 1000)));
};

export interface UseHlsOptions {
	videoEl: HTMLVideoElement | null;
	hlsUrl?: string;
	muted: boolean;
	onEnded: () => void;
	onError: (err: unknown) => void;
}

export function useHls({ videoEl, hlsUrl, muted, onEnded, onError }: UseHlsOptions) {
	// Initialize/destroy HLS only when element or source changes
	useEffect(() => {
		if (!videoEl) return;

		let hls: Hls | null = null;

		const setup = async () => {
			try {
				videoEl.muted = muted;
				videoEl.setAttribute('playsinline', 'true');
				videoEl.autoplay = true;
				videoEl.controls = false;
				(videoEl as any).crossOrigin = 'anonymous';

				videoEl.onended = onEnded;
				videoEl.onerror = () => onError(new Error('Video element error'));

				if (hlsUrl && Hls.isSupported()) {
					hls = new Hls({
						capLevelToPlayerSize: true,
						startLevel: -1,
						abrEwmaDefaultEstimate: getLastBw(),
						maxBufferLength: 12,
						maxBufferSize: 20 * 1000 * 1000,
						startFragPrefetch: true,
						lowLatencyMode: false,
						xhrSetup: (xhr: XMLHttpRequest) => {
							xhr.withCredentials = false;
						},
					});
					hls.on(Hls.Events.ERROR, (_: unknown, data: { fatal?: boolean; type?: string }) => {
						if (data?.fatal) {
							try { hls?.destroy(); } catch { /* ignore destroy errors */ }
							hls = null;
							onError(new Error(`HLS fatal: ${data?.type}`));
						}
					});
					hls.on(Hls.Events.LEVEL_SWITCHED, () => saveBw(hls!));
					hls.on(Hls.Events.LEVEL_LOADED, () => saveBw(hls!));
					hls.on(Hls.Events.FRAG_LOADED, () => saveBw(hls!));
					hls.attachMedia(videoEl);
					hls.loadSource(hlsUrl);
					await videoEl.play().catch(() => undefined);
					return;
				}

				// Native HLS (Safari)
				if (hlsUrl && videoEl.canPlayType('application/vnd.apple.mpegurl')) {
					videoEl.src = hlsUrl;
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
		};
	}, [videoEl, hlsUrl, onEnded, onError]);

	// Keep muted in sync without reinitializing; ensure playback continues on unmute
	useEffect(() => {
		if (!videoEl) return;
		videoEl.muted = muted;
		if (!muted) {
			void videoEl.play().catch(() => undefined);
		}
	}, [videoEl, muted]);
}