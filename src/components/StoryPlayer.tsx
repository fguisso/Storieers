import { useEffect, useRef, useState } from 'react';
import type { VideoItem } from '../types/models';
import { useHls } from '../hooks/useHls';

export function StoryPlayer({ video, muted, onEnded, onError }: { video: VideoItem; muted: boolean; onEnded: () => void; onError: (e: unknown) => void; }) {
	const ref = useRef<HTMLVideoElement | null>(null);
	const [userGestureNeeded, setUserGestureNeeded] = useState(false);

	useHls({
		videoEl: ref.current,
		hlsUrl: video.hlsUrl,
		mp4Url: video.mp4Url,
		muted,
		onEnded,
		onError: (e) => {
			onError(e);
			setUserGestureNeeded(true);
		},
	});

	useEffect(() => {
		if (!ref.current) return;
		// Try autoplay on video change
		ref.current.play().catch(() => setUserGestureNeeded(true));
	}, [video.id]);

	return (
		<div className="story-container">
			<video ref={ref} className="video-el" playsInline muted={muted} autoPlay />
			{userGestureNeeded && (
				<div className="absolute inset-0 z-40 flex items-center justify-center text-white" onClick={() => { setUserGestureNeeded(false); ref.current?.play().catch(() => undefined); }}>
					<div className="bg-black/60 px-4 py-2 rounded">Toque para iniciar</div>
				</div>
			)}
		</div>
	);
}
export default StoryPlayer;