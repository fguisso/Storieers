import { useEffect, useRef, useState } from 'react';
import type { VideoItem } from '../types/models';
import { useHls } from '../hooks/useHls';

export function StoryPlayer({ video, muted, onEnded, onError, autoStart = false }: { video: VideoItem; muted: boolean; onEnded: () => void; onError: (e: unknown) => void; autoStart?: boolean; }) {
	const ref = useRef<HTMLVideoElement | null>(null);
	const [showInitialSpinner, setShowInitialSpinner] = useState(true);

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

	useEffect(() => {
		if (!ref.current) return;
		
		// Se autoStart for true, força o play imediatamente
		if (autoStart) {
			ref.current.muted = true; // Ensure muted for autoplay
			ref.current.play().catch((error) => {
				console.log('AutoStart play failed, trying again:', error);
				// If autoplay fails, try again after a short delay
				setTimeout(() => {
					ref.current?.play().catch(() => {
						console.log('AutoStart play failed completely');
					});
				}, 100);
			});
		} else {
			// Comportamento normal de autoplay
			ref.current.muted = true; // Ensure muted for autoplay
			ref.current.play().catch((error) => {
				console.log('Autoplay failed, trying again:', error);
				// If autoplay fails, try again after a short delay
				setTimeout(() => {
					ref.current?.play().catch(() => {
						console.log('Autoplay failed completely');
					});
				}, 100);
			});
		}
	}, [video.id, autoStart]);

	// useEffect específico para autoStart quando o componente é montado
	useEffect(() => {
		if (autoStart && ref.current) {
			// Força o play imediatamente quando o componente é montado com autoStart
			const playVideo = () => {
				if (ref.current) {
					ref.current.muted = true;
					ref.current.play().catch((error) => {
						console.log('Immediate autoStart play failed:', error);
						// Tenta novamente após um pequeno delay
						setTimeout(() => {
							ref.current?.play().catch(() => {
								console.log('Immediate autoStart play failed completely');
							});
						}, 200);
					});
				}
			};

			// Tenta tocar imediatamente
			playVideo();
		}
	}, [autoStart]);

	useEffect(() => {
		const videoEl = ref.current;
		if (!videoEl) return;
		setShowInitialSpinner(true);

		const hideInitial = () => setShowInitialSpinner(false);

		videoEl.addEventListener('loadeddata', hideInitial);
		videoEl.addEventListener('canplay', hideInitial);
		videoEl.addEventListener('playing', hideInitial);

		return () => {
			videoEl.removeEventListener('loadeddata', hideInitial);
			videoEl.removeEventListener('canplay', hideInitial);
			videoEl.removeEventListener('playing', hideInitial);
		};
	}, [video.id]);

	return (
		<div className="story-container">
			<video ref={ref} className="video-el" playsInline muted={muted} autoPlay />
			{showInitialSpinner && (
				<div className="absolute inset-0 z-40 grid place-content-center pointer-events-none">
					<div className="loading-spinner" />
				</div>
			)}
		</div>
	);
}
export default StoryPlayer;