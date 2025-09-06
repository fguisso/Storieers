import { useSwipeable } from 'react-swipeable';

export function StoryControls({ onPrev, onNext, muted, toggleMuted, originalUrl }: {
	onPrev: () => void;
	onNext: () => void;
	muted: boolean;
	toggleMuted: () => void;
	originalUrl: string;
}) {
	const handlers = useSwipeable({
		onSwipedLeft: () => onNext(),
		onSwipedRight: () => onPrev(),
		trackTouch: true,
		delta: 50,
	});

	return (
		<div className="absolute inset-0" {...handlers}>
			<div className="tap-zone tap-left" onClick={onPrev} />
			<div className="tap-zone tap-right" onClick={onNext} />
			<button className="mute-badge bg-black/60 text-white px-3 py-1 rounded" onClick={toggleMuted}>
				{muted ? 'Unmute' : 'Mute'}
			</button>
			<a className="absolute bottom-3 left-3 z-40 text-white bg-black/50 px-3 py-1 rounded" href={originalUrl} target="_blank" rel="noreferrer">
				Ver no PeerTube
			</a>
		</div>
	);
}
export default StoryControls;