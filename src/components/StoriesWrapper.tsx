import { useState } from 'react';
import { flushSync } from 'react-dom';
import { StoriesProvider } from '../context/StoriesProvider';
import HomePage from './HomePage';
import StoryUI from './StoryUI';

export default function StoriesWrapper() {
  const [showStories, setShowStories] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const handleAvatarClick = () => {
    // Monta a tela de stories imediatamente dentro do mesmo gesto do usuário
    flushSync(() => {
      setShowStories(true);
      setIsTransitioning(false);
    });

    // Desbloqueia e inicia o vídeo imediatamente no mesmo gesto
    const videoEl = document.querySelector('video');
    if (videoEl) {
      try { videoEl.muted = true; } catch { /* ignore */ }
      try { videoEl.setAttribute('playsinline', 'true'); } catch { /* ignore */ }
      const directPlay = () => { try { void videoEl.play(); } catch { /* ignore */ } };
      directPlay();
      // Redundância: tentar tocar assim que o player sinalizar capacidade
      videoEl.addEventListener('canplay', directPlay, { once: true });
      videoEl.addEventListener('loadeddata', directPlay, { once: true });
    }
  };

  const handleStoriesEnd = () => {
    setIsTransitioning(true);
    setTimeout(() => {
      setShowStories(false);
      setIsTransitioning(false);
    }, 300);
  };

  if (showStories) {
    return (
      <div className={`transition-opacity duration-300 ${isTransitioning ? 'opacity-0' : 'opacity-100'}`}>
        <StoriesProvider>
          <StoryUI onStoriesEnd={handleStoriesEnd} autoStart={true} />
        </StoriesProvider>
      </div>
    );
  }

  return (
    <div className={`transition-opacity duration-300 ${isTransitioning ? 'opacity-0' : 'opacity-100'}`}>
      <HomePage onAvatarClick={handleAvatarClick} />
    </div>
  );
}