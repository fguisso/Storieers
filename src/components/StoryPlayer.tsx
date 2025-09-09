import { useEffect, useRef, useState } from 'react';
import type { VideoItem } from '../types/models';
import { useHls } from '../hooks/useHls';
import { isWithinGestureWindow } from '../utils/gesturePlay';

export function StoryPlayer({ video, muted, onEnded, onError, autoStart = false }: { video: VideoItem; muted: boolean; onEnded: () => void; onError: (e: unknown) => void; autoStart?: boolean; }) {
	const ref = useRef<HTMLVideoElement | null>(null);
	const [showInitialSpinner, setShowInitialSpinner] = useState(true);
	const [isVideoReady, setIsVideoReady] = useState(false);

	// HLS: NÃO dependemos de `muted` aqui
	useHls({
		videoEl: ref.current,
		hlsUrl: video.hlsUrl,
		onEnded,
		onError: (e) => {
			onError(e);
		},
	});

	// Aplicar mute no elemento sem tocar no HLS/source
	useEffect(() => {
		if (ref.current) ref.current.muted = muted;
	}, [muted]);

	// Função para tentar tocar o vídeo
	const attemptPlay = () => {
		if (!ref.current) return;
		
		ref.current.play().then(() => {
			// ok
		}).catch((error: unknown) => {
			console.log('Play failed, retrying...', error);
			setTimeout(() => {
				ref.current?.play().catch(() => {
					console.log('Play failed completely');
				});
			}, 100);
		});
	};

	// useEffect para tentar play quando o vídeo muda
	useEffect(() => {
		if (!ref.current) return;
		
		// Reset states when video changes
		setIsVideoReady(false);
		setShowInitialSpinner(true);
		
		// Tentar tocar imediatamente se ainda estivermos na janela do gesto
		if (isWithinGestureWindow()) {
			attemptPlay();
		}
	}, [video.id]);

	// useEffect para tentar play quando o vídeo está pronto
	useEffect(() => {
		if (isVideoReady && ref.current) {
			attemptPlay();
		}
	}, [isVideoReady]);

	useEffect(() => {
		const videoEl = ref.current;
		if (!videoEl) return;
		setShowInitialSpinner(true);

		const hideInitial = () => {
			setShowInitialSpinner(false);
			setIsVideoReady(true);
		};

		const handleCanPlay = () => {
			setIsVideoReady(true);
			// Se autoStart estiver ativo, tenta tocar imediatamente
			if (autoStart) {
				attemptPlay();
			}
		};

		videoEl.addEventListener('loadeddata', hideInitial);
		videoEl.addEventListener('canplay', handleCanPlay);
		videoEl.addEventListener('playing', hideInitial);

		return () => {
			videoEl.removeEventListener('loadeddata', hideInitial);
			videoEl.removeEventListener('canplay', handleCanPlay);
			videoEl.removeEventListener('playing', hideInitial);
		};
	}, [video.id, autoStart]);

	// useEffect específico para autoStart - força o play quando o componente é montado
	useEffect(() => {
		if (autoStart && ref.current) {
			// Força o play imediatamente quando autoStart é true
			const forcePlay = () => {
				if (ref.current) {
					ref.current.play().catch((error: unknown) => {
						console.log('Force play failed, retrying...', error);
						// Retry multiple times with increasing delays
						setTimeout(() => {
							ref.current?.play().catch(() => {
								setTimeout(() => {
									ref.current?.play().catch(() => {
										console.log('Force play failed completely');
									});
								}, 300);
							});
						}, 100);
					});
				}
			};

			// Só força se estivermos na janela do gesto OU já temos dados para tocar
			if (isWithinGestureWindow() || ref.current.readyState >= 3) {
				forcePlay();
			}
		}
	}, [autoStart]);

	return (
		<div className="story-container relative h-screen w-screen overflow-hidden">
			<video 
				ref={ref} 
				className="video-el" 
				playsInline 
				muted={muted} 
				autoPlay 
				preload="auto"
				crossOrigin="anonymous"
				onLoadedData={() => {
					if (autoStart && ref.current) {
						ref.current.play().catch(() => {
							console.log('AutoStart play on loadedData failed');
						});
					}
				}}
				onCanPlay={() => {
					if (autoStart && ref.current) {
						ref.current.play().catch(() => {
							console.log('AutoStart play on canPlay failed');
						});
					}
				}}
			/>
			{showInitialSpinner && (
				<div className="absolute inset-0 z-40 grid place-content-center pointer-events-none">
					<div className="loading-spinner" />
				</div>
			)}
		</div>
	);
}
export default StoryPlayer;