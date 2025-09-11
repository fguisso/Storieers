import { useState } from 'react';
import { StoriesProvider } from '../context/StoriesProvider';
import HomePage from './HomePage';
import StoryUI from './StoryUI';
import { markUserGesture } from '../utils/gesturePlay';

export default function StoriesWrapper() {
  const [showStories, setShowStories] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const handleAvatarClick = () => {
    // Marcar gesto e abrir imediatamente para aproveitar a janela de autoplay
    markUserGesture();
    setIsTransitioning(true);
    setShowStories(true);
    setIsTransitioning(false);
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
