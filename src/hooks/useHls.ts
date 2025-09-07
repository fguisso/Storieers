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
				videoEl.setAttribute('playsinline', 'true');
				videoEl.autoplay = true;
				videoEl.controls = false;
				videoEl.crossOrigin = 'anonymous'; // evita cookies e preflight

				videoEl.onended = onEnded;
				videoEl.onerror = () => onError(new Error('Video element error'));

				if (hlsUrl && Hls.isSupported()) {
					hls = new Hls({
						// startup rápido e estável
						capLevelToPlayerSize: true,      // não comece 1080p em tela pequena
						startLevel: -1,                  // auto, mas com seed de banda
						abrEwmaDefaultEstimate: getLastBw(),
						maxBufferLength: 12,             // buffer curto favorece TTFF
						maxBufferSize: 20 * 1000 * 1000, // ~20MB
						startFragPrefetch: true,         // já puxa o 1º fragmento
						lowLatencyMode: false,           // VOD
						// CORS anônimo; sem headers custom => sem preflight
						xhrSetup: (xhr) => {
							xhr.withCredentials = false;
						},
					});
					
					hls.on(Hls.Events.LEVEL_SWITCHED, () => saveBw(hls!));
					hls.on(Hls.Events.LEVEL_LOADED, () => saveBw(hls!));
					hls.on(Hls.Events.FRAG_LOADED, () => saveBw(hls!));
					
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
					await videoEl.play().catch(() => undefined);
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
		};
	}, [videoEl, hlsUrl, mp4Url, muted, onEnded, onError]);
}