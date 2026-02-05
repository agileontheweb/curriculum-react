import { useState, useEffect } from 'react';
import { useSoundContext } from '../contexts/SoundContext';
import Toast from './Toast';

const InteractionToastManager = ({ onInteractionComplete }) => {
  const { initializeAudio, startPlayback } = useSoundContext();
  const [showToast, setShowToast] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Inizializza gli elementi audio senza riprodurli
    initializeAudio();
  }, [initializeAudio]);

  const handleConfirm = () => {
    setIsLoading(true);
    setTimeout(() => {
      startPlayback();
      setIsLoading(false);
      setShowToast(false);
      onInteractionComplete();
    }, 500);
  };

  const handleDeny = () => {
    setShowToast(false);
    onInteractionComplete(); // Notifica che l'interazione è completa
  };

  return (
    <>
      {showToast && (
        <>
          {/* Overlay con effetto blur */}
          <div className="fixed inset-0 z-[199] bg-black/60 backdrop-blur-sm" />

          {/* Toast */}
          <Toast
            isVisible={showToast}
            isLoading={isLoading}
            onConfirm={handleConfirm}
            onDeny={handleDeny}
          />
        </>
      )}
    </>
  );
};

export default InteractionToastManager;