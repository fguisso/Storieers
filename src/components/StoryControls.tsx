import { useRef, useState } from 'react';
import { useSwipeable } from 'react-swipeable';

export function StoryControls({ onPrev, onNext, originalUrl }: {
	onPrev: () => void;
	onNext: () => void;
	originalUrl: string;
}) {
	const handlers = useSwipeable({
		onSwipedLeft: () => onNext(),
		onSwipedRight: () => onPrev(),
		trackTouch: true,
		delta: 50,
	});

	const holdTimerRef = useRef<number | null>(null);
	const [isHolding, setIsHolding] = useState(false);

	const clearHold = () => {
		if (holdTimerRef.current !== null) {
			window.clearTimeout(holdTimerRef.current);
			holdTimerRef.current = null;
		}
	};

	const pauseVideo = () => {
		const el = document.querySelector('video');
		if (el && !el.paused) {
			el.pause();
		}
	};
	const playVideo = () => {
		const el = document.querySelector('video');
		if (el && el.paused) {
			void el.play();
		}
	};

	const startHold = (e: React.MouseEvent | React.TouchEvent | React.PointerEvent) => {
		// Check if the click is on a UI control element
		const target = e.target as HTMLElement;
		if (target?.closest('[data-ui-control="true"]')) {
			return;
		}

		pauseVideo();
		clearHold();
		holdTimerRef.current = window.setTimeout(() => setIsHolding(true), 600);
	};

	const endHold = () => {
		const wasHolding = isHolding;
		setIsHolding(false);
		clearHold();
		if (!wasHolding) playVideo();
	};

	const cancelHold = () => {
		setIsHolding(false);
		clearHold();
		playVideo();
	};

	return (
		<div
			className="absolute inset-0"
			style={{ touchAction: 'none' }}
			{...handlers}
			onPointerDown={startHold}
			onPointerUp={endHold}
			onPointerCancel={cancelHold}
			onPointerLeave={cancelHold}
		>
			<div className="tap-zone tap-left" onClick={onPrev} />
			<div className="tap-zone tap-right" onClick={onNext} />
			<a className="absolute bottom-6 left-4 z-50 text-white bg-black/60 px-3 py-1 rounded" href={originalUrl} target="_blank" rel="noreferrer">
				Ver no PeerTube
			</a>
		</div>
	);
}
export default StoryControls;