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

	const holdConfirmTimerRef = useRef<number | null>(null);
	const pressStartTimeRef = useRef<number>(0);
	const holdConfirmedRef = useRef(false);
	const allowTapNavRef = useRef(false);
	const suppressTapRef = useRef(false);
	const touchActiveRef = useRef(false);
	const [longPressActive, setLongPressActive] = useState(false);

	const clearHoldConfirmTimer = () => {
		if (holdConfirmTimerRef.current !== null) {
			window.clearTimeout(holdConfirmTimerRef.current);
			holdConfirmTimerRef.current = null;
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

	const HOLD_CONFIRM_MS = 600;

	const handlePressStart = (e: React.MouseEvent | React.TouchEvent) => {
		// Detect touch start and ignore subsequent emulated mouse events
		if ('touches' in e) {
			if (e.touches.length > 1) return; // ignore multi-touch
			touchActiveRef.current = true;
		} else if (touchActiveRef.current) {
			// Ignore mouse down immediately after touchstart
			return;
		}
		clearHoldConfirmTimer();
		allowTapNavRef.current = false;
		holdConfirmedRef.current = false;
		pressStartTimeRef.current = Date.now();
		// Immediately pause on contact
		pauseVideo();
		holdConfirmTimerRef.current = window.setTimeout(() => {
			setLongPressActive(true);
			holdConfirmedRef.current = true;
		}, HOLD_CONFIRM_MS);
	};

	const handlePressEnd = () => {
		const wasActive = longPressActive;
		clearHoldConfirmTimer();
		const elapsed = Date.now() - pressStartTimeRef.current;
		// If user released quickly and did not confirm hold, treat as navigation tap
		if (!holdConfirmedRef.current && elapsed < HOLD_CONFIRM_MS) {
			allowTapNavRef.current = true;
			setLongPressActive(false);
			// Resume since it was a quick tap intended for other controls
			resumeVideo();
		} else {
			// Keep paused; suppress click navigation and clear after a tick
			allowTapNavRef.current = false;
			setLongPressActive(false);
			suppressTapRef.current = true;
			window.setTimeout(() => { suppressTapRef.current = false; }, 80);
		}
	};

	const handlePressCancel = () => {
		clearHoldConfirmTimer();
		// Cancel behaves like quick release (resume and allow nav)
		allowTapNavRef.current = true;
		setLongPressActive(false);
		resumeVideo();
		// Allow mouse events again shortly after touch ends/cancels
		window.setTimeout(() => { touchActiveRef.current = false; }, 80);
	};

	return (
		<div
			className="absolute inset-0"
			{...handlers}
			onMouseDownCapture={handlePressStart}
			onMouseUpCapture={handlePressEnd}
			onMouseLeave={handlePressCancel}
			onTouchStartCapture={handlePressStart}
			onTouchEndCapture={handlePressEnd}
			onTouchCancelCapture={handlePressCancel}
		>
			<div
				className="tap-zone tap-left"
				onClick={() => {
					if (suppressTapRef.current || !allowTapNavRef.current) { suppressTapRef.current = false; return; }
					allowTapNavRef.current = false;
					onPrev();
				}}
			/>
			<div
				className="tap-zone tap-right"
				onClick={() => {
					if (suppressTapRef.current || !allowTapNavRef.current) { suppressTapRef.current = false; return; }
					allowTapNavRef.current = false;
					onNext();
				}}
			/>
			<a className="absolute bottom-3 left-3 z-40 text-white bg-black/50 px-3 py-1 rounded" href={originalUrl} target="_blank" rel="noreferrer">
				Ver no PeerTube
			</a>
		</div>
	);
}
export default StoryControls;