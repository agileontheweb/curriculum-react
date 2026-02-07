// src/components/InteractionToastManager.jsx
import { useState, useEffect } from 'react';
import { useSoundContext } from '../contexts/SoundContext';
import { useAudioPreloader } from '../hooks/useAudioPreloader';
import PreHome from './PreHome';

const InteractionToastManager = ({ onInteractionComplete, onAnimationStart }) => {
  const { initializeAudio, startPlayback } = useSoundContext();
  const { preloadAudio, loadingProgress, isPreloading } = useAudioPreloader();

  const [showToast, setShowToast] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    initializeAudio();
  }, [initializeAudio]);

  const handleSkip = () => {
    // Imposta subito lo stato a "non mostrare" il toast
    setShowToast(false);
    // Notifica al componente App che l'interazione è completata
    onInteractionComplete();
    // Avvia l'animazione (se esiste)
    if (onAnimationStart && typeof onAnimationStart === 'function') {
      onAnimationStart();
    }
  };

  const handleConfirm = async () => {
    setIsLoading(true);

    // USA preloadAudio dall'hook (non preloadAllAudio direttamente!)
    await preloadAudio();

    // Piccolo delay per far vedere il 100%
    setTimeout(() => {
      startPlayback();
      setIsLoading(false);
      setShowToast(false);
      onInteractionComplete();

      if (onAnimationStart && typeof onAnimationStart === 'function') {
        setTimeout(() => onAnimationStart(), 300);
      }
    }, 500);
  };

  const handleDeny = async () => {
    setIsLoading(true);

    // USA preloadAudio dall'hook
    await preloadAudio();

    setTimeout(() => {
      setIsLoading(false);
      setShowToast(false);
      onInteractionComplete();

      if (onAnimationStart && typeof onAnimationStart === 'function') {
        setTimeout(() => onAnimationStart(), 300);
      }
    }, 500);
  };

  return (
    <PreHome
      showToast={showToast}
      isLoading={isLoading}
      loadingProgress={loadingProgress}
      onConfirm={handleConfirm}
      onDeny={handleDeny}
      onSkip={handleSkip}
    />
  );
};

export default InteractionToastManager;