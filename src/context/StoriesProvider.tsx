import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import type { StoriesContextValue, VideoItem } from '../types/models';
import { resolveStartVideo, fetchChannelVideos } from '../api/peertube';

const StoriesContext = createContext<StoriesContextValue | undefined>(undefined);

export function StoriesProvider({ children }: { children: React.ReactNode }) {
	const [stories, setStories] = useState<VideoItem[]>([]);
	const [currentIndex, setCurrentIndex] = useState(0);
	const [muted, setMuted] = useState(true);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | undefined>(undefined);

	useEffect(() => {
		let mounted = true;
		(async () => {
			setLoading(true);
			setError(undefined);
			try {
				const { channelId } = await resolveStartVideo();
				if (!channelId) throw new Error('Channel not found from start video');
				const vids = await fetchChannelVideos(channelId);
				if (mounted) {
					setStories(vids);
					setCurrentIndex(0);
				}
			} catch (err: unknown) {
				const msg = err instanceof Error ? err.message : 'Failed to load';
				if (mounted) setError(msg);
			} finally {
				if (mounted) setLoading(false);
			}
		})();
		return () => { mounted = false; };
	}, []);

	const next = useCallback(() => {
		setCurrentIndex((i) => Math.min(i + 1, Math.max(0, stories.length - 1)));
	}, [stories.length]);

	const prev = useCallback(() => {
		setCurrentIndex((i) => Math.max(i - 1, 0));
	}, []);

	const toggleMuted = useCallback(() => setMuted((m) => !m), []);

	const value: StoriesContextValue = useMemo(() => ({
		stories,
		currentIndex,
		setCurrentIndex,
		next,
		prev,
		muted,
		toggleMuted,
		loading,
		error,
	}), [stories, currentIndex, next, prev, muted, toggleMuted, loading, error]);

	return (
		<StoriesContext.Provider value={value}>
			{children}
		</StoriesContext.Provider>
	);
}

// eslint-disable-next-line react-refresh/only-export-components
export function useStories(): StoriesContextValue {
	const ctx = useContext(StoriesContext);
	if (!ctx) throw new Error('useStories must be used within StoriesProvider');
	return ctx;
}