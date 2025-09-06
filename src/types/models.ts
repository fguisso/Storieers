export interface VideoItem {
	id: number;
	uuid: string;
	title: string;
	author: string;
	authorUrl?: string;
	instance: string;
	thumbnailUrl: string;
	duration: number;
	hlsUrl?: string;
	mp4Url?: string;
	originalPageUrl: string;
}

export interface StoriesContextValue {
	stories: VideoItem[];
	currentIndex: number;
	setCurrentIndex: (index: number) => void;
	next: () => void;
	prev: () => void;
	muted: boolean;
	toggleMuted: () => void;
	loading: boolean;
	error?: string;
}