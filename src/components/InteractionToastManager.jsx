import { useState, useEffect } from 'react';
import { useSoundContext } from '../contexts/SoundContext';
import Toast from './Toast';

const InteractionToastManager = ({ onInteractionComplete, onAnimationStart }) => {
  const { initializeAudio, startPlayback } = useSoundContext();
  const [showToast, setShowToast] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    initializeAudio();
  }, [initializeAudio]);

  const handleConfirm = () => {
    setIsLoading(true);
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

  const handleDeny = () => {
    setShowToast(false);
    onInteractionComplete();

    //  Esegui l'animazione di scrolling anche se l'utente sceglie NO
    if (onAnimationStart && typeof onAnimationStart === 'function') {
      setTimeout(() => onAnimationStart(), 300);
    }
  };

  return (
    <>
      {showToast && (
        <>
          <div className="fixed inset-0 z-[199] bg-black/60 backdrop-blur-sm" />
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