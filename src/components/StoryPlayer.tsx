import { useEffect, useRef, useState } from 'react';
import type { VideoItem } from '../types/models';
import { useHls } from '../hooks/useHls';

export function StoryPlayer({ video, muted, onEnded, onError }: { video: VideoItem; muted: boolean; onEnded: () => void; onError: (e: unknown) => void; }) {
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
		// Try autoplay on video change
		ref.current.play().catch(() => undefined);
	}, [video.id]);

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