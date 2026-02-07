// src/components/InteractionToastManager.jsx
import { useState } from 'react';
import { useSoundContext } from '../contexts/SoundContext';
import { useAudioPreloader } from '../hooks/useAudioPreloader';
import PreHome from './PreHome';

const InteractionToastManager = ({ onInteractionComplete, onAnimationStart }) => {
  const [showToast, setShowToast] = useState(true);
  const {
    initializeAudio,
    startPlayback,
    soundEnabled,
    toggleSound
  } = useSoundContext();
  const { preloadAudio, loadingProgress, isPreloading } = useAudioPreloader();

  const handleConfirm = async () => {
    initializeAudio();
    await preloadAudio();
    startPlayback();
    setShowToast(false);
    // Il mosaico partirà ora, e quando finirà chiamerà onExitComplete
  };

  const handleDeny = async () => {
    initializeAudio();
    if (soundEnabled) toggleSound();
    await preloadAudio();
    setShowToast(false);
    // Il mosaico partirà ora, e quando finirà chiamerà onExitComplete
  };

  const handleSkip = async () => {
    initializeAudio();
    await preloadAudio();
    startPlayback();
    setShowToast(false);
    // Il mosaico partirà ora, e quando finirà chiamerà onExitComplete
  };

  // Quando il mosaico finisce l'animazione di uscita:
  const handleMosaicComplete = () => {
    onAnimationStart?.(); // Questo setterà showPreHome(false) in App.jsx
  };

  return (
    <PreHome
      showToast={showToast}
      isLoading={isPreloading}
      loadingProgress={loadingProgress}
      onConfirm={handleConfirm}
      onDeny={handleDeny}
      onSkip={handleSkip}
      onExitComplete={handleMosaicComplete} // ← QUI è la chiave!
    />
  );
};

export default InteractionToastManager;