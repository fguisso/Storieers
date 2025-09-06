import { useEffect, useRef, useState } from 'react';
import type { VideoItem } from '../types/models';
import { useHls } from '../hooks/useHls';

export function StoryPlayer({ video, muted, onEnded, onError }: { video: VideoItem; muted: boolean; onEnded: () => void; onError: (e: unknown) => void; }) {
	const ref = useRef<HTMLVideoElement | null>(null);
	const [isBuffering, setIsBuffering] = useState(true);

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
		setIsBuffering(true);

		const handleWaiting = () => setIsBuffering(true);
		const handleCanPlay = () => setIsBuffering(false);
		const handlePlaying = () => setIsBuffering(false);
		const handleLoadedData = () => setIsBuffering(false);

		videoEl.addEventListener('waiting', handleWaiting);
		videoEl.addEventListener('canplay', handleCanPlay);
		videoEl.addEventListener('playing', handlePlaying);
		videoEl.addEventListener('loadeddata', handleLoadedData);

		return () => {
			videoEl.removeEventListener('waiting', handleWaiting);
			videoEl.removeEventListener('canplay', handleCanPlay);
			videoEl.removeEventListener('playing', handlePlaying);
			videoEl.removeEventListener('loadeddata', handleLoadedData);
		};
	}, [video.id]);

	return (
		<div className="story-container">
			<video ref={ref} className="video-el" playsInline muted={muted} autoPlay />
			{isBuffering && (
				<div className="absolute inset-0 z-40 grid place-content-center pointer-events-none">
					<div className="loading-spinner" />
				</div>
			)}
		</div>
	);
}
export default StoryPlayer;