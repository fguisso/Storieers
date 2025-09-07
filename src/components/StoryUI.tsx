import { useStories } from '../context/StoriesProvider';
import ProgressBar from './ProgressBar';
import StoryPlayer from './StoryPlayer';
import StoryControls from './StoryControls';
import RightSideButtons from './RightSideButtons';

export default function StoryUI() {
	const { stories, currentIndex, next, prev, muted, toggleMuted, loading, error } = useStories();
	const current = stories[currentIndex];

	const getCurrentTime = () => {
		const el = document.querySelector('video');
		return el ? el.currentTime : 0;
	};

	if (loading) return <div className="h-screen w-screen grid place-content-center text-white">Carregando…</div>;
	if (error) return <div className="h-screen w-screen grid place-content-center text-white">Erro: {error}</div>;
	if (!current) return <div className="h-screen w-screen grid place-content-center text-white">Nenhum vídeo</div>;

	return (
		<div className="relative h-screen w-screen bg-black text-white">
			<StoryPlayer
				video={current}
				muted={muted}
				onEnded={next}
				onError={next}
			/>

			<div className="overlay-top" />
			<div className="overlay-bottom" />

			<div className="absolute top-2 left-2 right-2 z-40">
				<ProgressBar count={stories.length} currentIndex={currentIndex} duration={current.duration || 0} getCurrentTime={getCurrentTime} />
			</div>

			<div className="absolute bottom-16 left-4 right-4 z-30">
				<div className="text-lg font-semibold drop-shadow">{current.title}</div>
				<div className="text-sm opacity-90">@{current.author}@{current.instance}</div>
			</div>

			<RightSideButtons muted={muted} toggleMuted={toggleMuted} />
			<StoryControls onPrev={prev} onNext={next} muted={muted} toggleMuted={toggleMuted} originalUrl={current.originalPageUrl} />
		</div>
	);
}