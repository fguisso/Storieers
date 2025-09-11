import { useCallback, useEffect, useRef, useState } from 'react';
import type { VideoItem } from '../types/models';
import { useHls } from '../hooks/useHls';
import { isWithinGestureWindow } from '../utils/gesturePlay';

export function StoryPlayer({
  video,
  muted,
  onEnded,
  onError,
  autoStart = false,
}: {
  video: VideoItem;
  muted: boolean;
  onEnded: () => void;
  onError: (e: unknown) => void;
  autoStart?: boolean;
}) {
  const ref = useRef<HTMLVideoElement | null>(null);
  const [showInitialSpinner, setShowInitialSpinner] = useState(true);
  const [isVideoReady, setIsVideoReady] = useState(false);

  // HLS: NÃO dependemos de `muted` aqui
  useHls({
    videoEl: ref.current,
    hlsUrl: video.hlsUrl,
    onEnded,
    onError: (e) => {
      onError(e);
    },
  });

  // Aplicar mute no elemento sem tocar no HLS/source
  useEffect(() => {
    if (ref.current) {
      ref.current.muted = muted;
    }
  }, [muted]);

  // Função para tentar tocar o vídeo
  const attemptPlay = useCallback(() => {
    if (!ref.current) return;
    ref.current.play().catch((error: unknown) => {
      console.log('Play failed, retrying...', error);
      setTimeout(() => {
        ref.current?.play().catch(() => {
          console.log('Play failed completely');
        });
      }, 100);
    });
  }, []);

  // Reset quando o vídeo muda
  useEffect(() => {
    if (!ref.current) return;

    setIsVideoReady(false);
    setShowInitialSpinner(true);

    // Tentar tocar imediatamente se ainda estivermos na janela do gesto
    if (isWithinGestureWindow() || autoStart) {
      attemptPlay();
    }
  }, [video.id, autoStart, attemptPlay]);

  // Tentar play quando o vídeo está pronto
  useEffect(() => {
    if (isVideoReady) {
      attemptPlay();
    }
  }, [isVideoReady, attemptPlay]);

  // Event listeners para o vídeo
  useEffect(() => {
    const videoEl = ref.current;
    if (!videoEl) return;

    const hideInitial = () => {
      setShowInitialSpinner(false);
      setIsVideoReady(true);
    };

    const handleCanPlay = () => {
      setIsVideoReady(true);
      if (autoStart) attemptPlay();
    };

    const handleLoadedData = () => {
      if (autoStart) attemptPlay();
    };

    videoEl.addEventListener('loadeddata', handleLoadedData);
    videoEl.addEventListener('canplay', handleCanPlay);
    videoEl.addEventListener('playing', hideInitial);

    return () => {
      videoEl.removeEventListener('loadeddata', handleLoadedData);
      videoEl.removeEventListener('canplay', handleCanPlay);
      videoEl.removeEventListener('playing', hideInitial);
    };
  }, [video.id, autoStart, attemptPlay]);

  // Forçar play quando autoStart está ativo
  useEffect(() => {
    if (autoStart && ref.current) {
      if (isWithinGestureWindow() || ref.current.readyState >= 3) {
        attemptPlay();
      }
    }
  }, [autoStart, attemptPlay]);

  return (
    <div className="story-container relative h-screen w-screen overflow-hidden">
      <video
        ref={ref}
        className="video-el"
        playsInline
        // o muted “visual” no atributo não força re-mount; controlado via effect
        muted={muted}
        autoPlay
        preload="auto"
        crossOrigin="anonymous"
      />
      {showInitialSpinner && (
        <div className="absolute inset-0 z-40 grid place-content-center pointer-events-none">
          <div className="loading-spinner" />
        </div>
      )}
    </div>
  );
}

export default StoryPlayer;

