import { useRef, useState } from 'react';
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

	const longPressTimerRef = useRef<number | null>(null);
	const suppressTapRef = useRef(false);
	const [longPressActive, setLongPressActive] = useState(false);

	const clearLongPressTimer = () => {
		if (longPressTimerRef.current !== null) {
			window.clearTimeout(longPressTimerRef.current);
			longPressTimerRef.current = null;
		}
	};

	const pauseVideo = () => {
		const el = document.querySelector('video');
		if (el && !el.paused) {
			el.pause();
		}
	};

	const resumeVideo = () => {
		const el = document.querySelector('video');
		if (el && el.paused) {
			void el.play();
		}
	};

	const LONG_PRESS_MS = 800;

	const handlePressStart = () => {
		clearLongPressTimer();
		longPressTimerRef.current = window.setTimeout(() => {
			setLongPressActive(true);
			pauseVideo();
		}, LONG_PRESS_MS);
	};

	const handlePressEnd = () => {
		const wasActive = longPressActive;
		clearLongPressTimer();
		if (wasActive) {
			resumeVideo();
			setLongPressActive(false);
			suppressTapRef.current = true;
			window.setTimeout(() => { suppressTapRef.current = false; }, 0);
		}
	};

	return (
		<div
			className="absolute inset-0"
			{...handlers}
			onMouseDown={handlePressStart}
			onMouseUp={handlePressEnd}
			onMouseLeave={handlePressEnd}
			onTouchStart={handlePressStart}
			onTouchEnd={handlePressEnd}
		>
			<div className="tap-zone tap-left" onClick={() => { if (suppressTapRef.current || longPressActive) { suppressTapRef.current = false; return; } onPrev(); }} />
			<div className="tap-zone tap-right" onClick={() => { if (suppressTapRef.current || longPressActive) { suppressTapRef.current = false; return; } onNext(); }} />
			<a className="absolute bottom-3 left-3 z-40 text-white bg-black/50 px-3 py-1 rounded" href={originalUrl} target="_blank" rel="noreferrer">
				Ver no PeerTube
			</a>
		</div>
	);
}
export default StoryControls;