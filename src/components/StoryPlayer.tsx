import { useEffect, useRef, useState } from 'react';
import type { VideoItem } from '../types/models';
import { useHls } from '../hooks/useHls';
import { isWithinGestureWindow } from '../utils/gesturePlay';

export function StoryPlayer({ video, muted, onEnded, onError, autoStart = false }: { video: VideoItem; muted: boolean; onEnded: () => void; onError: (e: unknown) => void; autoStart?: boolean; }) {
	const ref = useRef<HTMLVideoElement | null>(null);
	const [showInitialSpinner, setShowInitialSpinner] = useState(true);
	const [isVideoReady, setIsVideoReady] = useState(false);
	const [hasAttemptedPlay, setHasAttemptedPlay] = useState(false);

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
		if (ref.current) {
			ref.current.muted = muted;
		}
	}, [muted]);

	// Função para tentar tocar o vídeo
	const attemptPlay = () => {
		if (!ref.current || hasAttemptedPlay) return;
		
		setHasAttemptedPlay(true);
		
		ref.current.play().then(() => {
			setShowInitialSpinner(false);
		}).catch(() => {
			setHasAttemptedPlay(false);
			setTimeout(() => {
				if (ref.current) {
					ref.current.play().catch(() => {
						// Play failed completely
					});
				}
			}, 100);
		});
	};

	// Reset quando o vídeo muda
	useEffect(() => {
		if (!ref.current) return;
		
		setIsVideoReady(false);
		setShowInitialSpinner(true);
		setHasAttemptedPlay(false);
		
		// Tentar tocar imediatamente se ainda estivermos na janela do gesto
		if (isWithinGestureWindow()) {
			attemptPlay();
		} else if (autoStart) {
			attemptPlay();
		}
	}, [video.id, autoStart]);

	// Tentar play quando o vídeo está pronto
	useEffect(() => {
		if (isVideoReady && ref.current && !hasAttemptedPlay) {
			attemptPlay();
		}
	}, [isVideoReady, hasAttemptedPlay]);

	// Event listeners para o vídeo
	useEffect(() => {
		const videoEl = ref.current;
		if (!videoEl) return;

		const hideInitial = () => {
			setShowInitialSpinner(false);
			setIsVideoReady(true);
		};

		const handleCanPlay = () => {
			setIsVideoReady(true);
			if (autoStart && !hasAttemptedPlay) {
				attemptPlay();
			}
		};

		const handleLoadedData = () => {
			if (autoStart && !hasAttemptedPlay) {
				attemptPlay();
			}
		};

		const handlePlaying = () => {
			hideInitial();
		};

		videoEl.addEventListener('loadeddata', handleLoadedData);
		videoEl.addEventListener('canplay', handleCanPlay);
		videoEl.addEventListener('playing', handlePlaying);

		return () => {
			videoEl.removeEventListener('loadeddata', handleLoadedData);
			videoEl.removeEventListener('canplay', handleCanPlay);
			videoEl.removeEventListener('playing', handlePlaying);
		};
	}, [video.id, autoStart, hasAttemptedPlay]);

	// Forçar play quando autoStart está ativo
	useEffect(() => {
		if (autoStart && ref.current && !hasAttemptedPlay) {
			if (isWithinGestureWindow()) {
				attemptPlay();
			} else {
				attemptPlay();
			}
		}
	}, [autoStart, hasAttemptedPlay]);

	return (
		<div className="story-container relative h-screen w-screen overflow-hidden">
			<video 
				ref={ref} 
				className="video-el" 
				playsInline 
				autoPlay 
				preload="auto"
				crossOrigin="anonymous"
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