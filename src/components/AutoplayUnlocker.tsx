import { useEffect } from 'react';

export default function AutoplayUnlocker() {
	useEffect(() => {
		const handler = () => {
			const el = document.querySelector('video') as HTMLVideoElement | null;
			if (el) {
				el.play().catch(() => undefined);
			}
			window.removeEventListener('pointerdown', handler, true);
			window.removeEventListener('touchstart', handler, true);
			window.removeEventListener('click', handler, true);
		};
		window.addEventListener('pointerdown', handler, true);
		window.addEventListener('touchstart', handler, true);
		window.addEventListener('click', handler, true);
		return () => {
			window.removeEventListener('pointerdown', handler, true);
			window.removeEventListener('touchstart', handler, true);
			window.removeEventListener('click', handler, true);
		};
	}, []);
	return null;
}

