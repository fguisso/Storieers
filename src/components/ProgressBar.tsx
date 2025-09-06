import { useEffect, useRef, useState } from 'react';

export function ProgressBar({ count, currentIndex, duration, getCurrentTime }: {
	count: number;
	currentIndex: number;
	duration: number;
	getCurrentTime: () => number;
}) {
	const [progress, setProgress] = useState(0);
	const raf = useRef<number | null>(null);

	useEffect(() => {
		if (!duration || duration <= 0) { setProgress(0); return; }
		const tick = () => {
			const t = getCurrentTime();
			const ratio = Math.max(0, Math.min(1, t / duration));
			setProgress(ratio);
			raf.current = requestAnimationFrame(tick);
		};
		raf.current = requestAnimationFrame(tick);
		return () => {
			if (raf.current) cancelAnimationFrame(raf.current);
		};
	}, [currentIndex, duration, getCurrentTime]);

	return (
		<div className="progress-container">
			{Array.from({ length: count }).map((_, i) => (
				<div key={i} className="progress-segment">
					<div className="progress-fill" style={{ width: `${i < currentIndex ? 100 : i === currentIndex ? progress * 100 : 0}%` }} />
				</div>
			))}
		</div>
	);
}
export default ProgressBar;