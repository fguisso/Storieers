import { useEffect, useRef, useState } from 'react';
import type { VideoItem } from '../types/models';
import { useHls } from '../hooks/useHls';

export function StoryPlayer({ video, muted, onEnded, onError, autoStart = false }: { video: VideoItem; muted: boolean; onEnded: () => void; onError: (e: unknown) => void; autoStart?: boolean; }) {
	const ref = useRef<HTMLVideoElement | null>(null);
	const [showInitialSpinner, setShowInitialSpinner] = useState(true);
	const [isVideoReady, setIsVideoReady] = useState(false);

	useHls({
		videoEl: ref.current,
		hlsUrl: video.hlsUrl,
		mp4Url: video.mp4Url,
		muted,
		onEnded,
		onError: (e) => {
			onError(e);
		},
	});

	// Função para tentar tocar o vídeo
	const attemptPlay = () => {
		if (!ref.current) return;
		
		ref.current.muted = true; // Ensure muted for autoplay
		ref.current.play().catch((error) => {
			console.log('Play failed, retrying...', error);
			// Retry after a short delay
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
		
		// Try to play immediately
		attemptPlay();
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
					ref.current.muted = true;
					ref.current.play().catch((error) => {
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

			// Tenta tocar imediatamente
			forcePlay();
		}
	}, [autoStart]);

	// useEffect para monitorar quando o vídeo está pronto e forçar play
	useEffect(() => {
		const videoEl = ref.current;
		if (!videoEl || !autoStart) return;

		const handleVideoReady = () => {
			if (videoEl.readyState >= 3) { // HAVE_FUTURE_DATA
				videoEl.play().catch((error) => {
					console.log('Video ready play failed:', error);
				});
			}
		};

		// Tenta tocar quando o vídeo está pronto
		handleVideoReady();

		// Adiciona listeners para tentar tocar quando o vídeo estiver pronto
		videoEl.addEventListener('loadeddata', handleVideoReady);
		videoEl.addEventListener('canplay', handleVideoReady);
		videoEl.addEventListener('canplaythrough', handleVideoReady);

		return () => {
			videoEl.removeEventListener('loadeddata', handleVideoReady);
			videoEl.removeEventListener('canplay', handleVideoReady);
			videoEl.removeEventListener('canplaythrough', handleVideoReady);
		};
	}, [autoStart, video.id]);

	return (
		<div className="story-container">
			<video 
				ref={ref} 
				className="video-el" 
				playsInline 
				muted={muted} 
				autoPlay 
				preload="auto"
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