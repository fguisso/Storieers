import { useStories } from '../context/StoriesProvider';
import ProgressBar from './ProgressBar';
import StoryPlayer from './StoryPlayer';
import StoryControls from './StoryControls';
import RightSideButtons from './RightSideButtons';

interface StoryUIProps {
  onStoriesEnd?: () => void;
}

export default function StoryUI({ onStoriesEnd }: StoryUIProps) {
	const { stories, currentIndex, next, prev, muted, toggleMuted, loading, error } = useStories();
	const current = stories[currentIndex];

	const getCurrentTime = () => {
		const el = document.querySelector('video');
		return el ? el.currentTime : 0;
	};

	const handleVideoEnd = () => {
		if (currentIndex === stories.length - 1) {
			// Se é o último vídeo, chama onStoriesEnd para voltar à página inicial
			onStoriesEnd?.();
		} else {
			// Se não é o último, vai para o próximo
			next();
		}
	};

	if (loading) return <div className="h-screen w-screen bg-black grid place-content-center text-white text-xl">Carregando…</div>;
	if (error) return <div className="h-screen w-screen grid place-content-center text-white">Erro: {error}</div>;
	if (!current) return <div className="h-screen w-screen grid place-content-center text-white">Nenhum vídeo</div>;

	return (
		<div className="relative h-screen w-screen bg-black text-white">
			<StoryPlayer
				video={current}
				muted={muted}
				onEnded={handleVideoEnd}
				onError={handleVideoEnd}
			/>

			<div className="overlay-top" />
			<div className="overlay-bottom" />

			{/* Botão de fechar */}
			<button
				onClick={onStoriesEnd}
				className="absolute top-4 right-4 z-50 w-10 h-10 rounded-full bg-black/50 hover:bg-black/70 flex items-center justify-center text-white transition-colors duration-200"
				aria-label="Fechar stories"
			>
				<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
				</svg>
			</button>

			<div className="absolute top-2 left-2 right-2 z-40">
				<ProgressBar count={stories.length} currentIndex={currentIndex} duration={current.duration || 0} getCurrentTime={getCurrentTime} />
			</div>

			<div className="absolute bottom-16 left-4 right-4 z-30">
				<div className="text-lg font-semibold drop-shadow">{current.title}</div>
				<div className="text-sm opacity-90">@{current.author}@{current.instance}</div>
			</div>

			<RightSideButtons muted={muted} toggleMuted={toggleMuted} />
			<StoryControls onPrev={prev} onNext={next} originalUrl={current.originalPageUrl} />
		</div>
	);
}