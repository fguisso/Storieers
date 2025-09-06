export function formatAuthor(author: string, instanceHost: string): string {
	if (author.includes('@')) return author;
	return `@${author}@${instanceHost}`;
}

export function clamp(value: number, min: number, max: number): number {
	return Math.max(min, Math.min(max, value));
}