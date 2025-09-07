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
		if (el && !el.paused) el.pause();
	};
	const playVideo = () => {
		const el = document.querySelector('video');
		if (el && el.paused) void el.play();
	};

	const startHold = (e: React.MouseEvent | React.TouchEvent | React.PointerEvent) => {
		// Ignore touches/clicks from UI controls
		const native = (e as any).nativeEvent as Event & { composedPath?: () => EventTarget[] };
		const path = native?.composedPath?.();
		if (path && path.some((n) => (n as HTMLElement)?.dataset?.uiControl === 'true')) return;

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
			<a className="absolute bottom-3 left-3 z-40 text-white bg-black/50 px-3 py-1 rounded" href={originalUrl} target="_blank" rel="noreferrer">
				Ver no PeerTube
			</a>
		</div>
	);
}
export default StoryControls;