import Hls from 'hls.js';
import { useEffect } from 'react';

const getLastBw = () => {
  const v = localStorage.getItem('hls:lastBwKbps');
  return v ? Number(v) * 1000 : 500_000; // 500 Kbps seed
};
const saveBw = (hls: Hls & { bandwidthEstimate?: number }) => {
  const est = hls.bandwidthEstimate;
  if (est) localStorage.setItem('hls:lastBwKbps', String(Math.round(est / 1000)));
};

export interface UseHlsOptions {
	videoEl: HTMLVideoElement | null;
	hlsUrl?: string;
	onEnded: () => void;
	onError: (err: unknown) => void;
}

export function useHls({ videoEl, hlsUrl, onEnded, onError }: UseHlsOptions) {
	// Initialize/destroy HLS only when element or source changes
	useEffect(() => {
		if (!videoEl) return;

		let hls: Hls | null = null;

		const setup = async () => {
			try {
				videoEl.setAttribute('playsinline', 'true');
				videoEl.autoplay = true;
				videoEl.controls = false;
                                videoEl.crossOrigin = 'anonymous';

				videoEl.onended = onEnded;
				videoEl.onerror = () => onError(new Error('Video element error'));

                                if (hlsUrl && Hls.isSupported()) {
                                        hls = new Hls({
                                                // Prefer quick startup with lowest rendition
                                                startLevel: 0,
                                                capLevelToPlayerSize: true,
                                                abrEwmaDefaultEstimate: getLastBw(),
                                                // Skip bandwidth test to avoid delaying first frame
                                                testBandwidth: false,
                                                // Conservative buffer sizes for faster play
                                                maxBufferLength: 30,
                                                backBufferLength: 90,
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
					return;
				}

				// Native HLS (Safari)
				if (hlsUrl && videoEl.canPlayType('application/vnd.apple.mpegurl')) {
					videoEl.src = hlsUrl;
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
}