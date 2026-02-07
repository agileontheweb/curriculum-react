// src/components/InteractionToastManager.jsx
import { useState } from 'react';
import { useSoundContext } from '../contexts/SoundContext';
import { useAudioPreloader } from '../hooks/useAudioPreloader';
import PreHome from './PreHome';

const InteractionToastManager = ({ onInteractionComplete, onAnimationStart, onMosaicComplete }) => {
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

  // Quando il mosaico INIZIA a sparire, mostra il contenuto sotto
  const handleStartScroll = () => {
    onAnimationStart?.();
  };

  // Quando il mosaico è COMPLETAMENTE sparito, smonta PreHome
  const handleMosaicComplete = () => {
    onMosaicComplete?.();
  };



  return (
    <PreHome
      showToast={showToast}
      isLoading={isPreloading}
      loadingProgress={loadingProgress}
      onConfirm={handleConfirm}
      onDeny={handleDeny}
      onSkip={handleSkip}
      onStartScroll={handleStartScroll}
      onExitComplete={handleMosaicComplete} // ← QUI è la chiave!
    />
  );
};

export default InteractionToastManager;