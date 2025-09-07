import React from 'react';

export default function RightSideButtons({ muted, toggleMuted }: { muted: boolean; toggleMuted: () => void; }) {
	return (
		<div className="absolute bottom-20 right-3 z-50 flex flex-col items-center gap-3 pointer-events-auto" data-ui-control="true">
			<button
				aria-label={muted ? 'Ativar som' : 'Silenciar'}
				data-ui-control="true"
				onClick={(e) => { e.stopPropagation(); toggleMuted(); }}
				onMouseDown={(e) => e.stopPropagation()}
				onTouchStart={(e) => e.stopPropagation()}
				className="bg-black/60 text-white rounded-full w-12 h-12 grid place-content-center shadow-md active:scale-95"
			>
				{muted ? (
					// Muted state icon (speaker with X)
					<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
						<path d="M5 9H8.5L13 5.5V18.5L8.5 15H5V9Z" fill="currentColor"/>
						<path d="M16 9L20 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
						<path d="M20 9L16 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
					</svg>
				) : (
					// Unmuted state icon (speaker with waves)
					<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
						<path d="M5 9H8.5L13 5.5V18.5L8.5 15H5V9Z" fill="currentColor"/>
						<path d="M16 8C17.6569 9.65685 17.6569 12.3431 16 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
						<path d="M18.5 5.5C21.5376 8.53757 21.5376 13.4624 18.5 16.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
					</svg>
				)}
			</button>
		</div>
	);
}

