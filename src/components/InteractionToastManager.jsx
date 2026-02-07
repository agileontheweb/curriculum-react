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

  const finish = () => {
    setShowToast(false);
    onInteractionComplete?.();
    onAnimationStart?.();
  };

  const handleConfirm = async () => {
    initializeAudio();
    await preloadAudio(); // Il "depistaggio" di 6 secondi
    startPlayback();      // Attiva i suoni e imposta soundEnabled: true
    finish();
  };

  const handleDeny = async () => {
    initializeAudio();
    // In questo modo l'interfaccia saprà che l'utente ha scelto il silenzio
    if (soundEnabled) toggleSound();

    await preloadAudio(); // Carica comunque i file (depistaggio)
    finish();
  };

  const handleSkip = async () => {
    initializeAudio();
    await preloadAudio();
    startPlayback();
    finish();
  };

  return (
    <PreHome
      showToast={showToast}
      isLoading={isPreloading}
      loadingProgress={loadingProgress}
      onConfirm={handleConfirm}
      onDeny={handleDeny}
      onSkip={handleSkip}
    />
  );
};

export default InteractionToastManager;