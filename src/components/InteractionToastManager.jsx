// src/components/InteractionToastManager.jsx - Versione senza suoni
import { useState } from 'react';
import PreHome from './PreHome';

const InteractionToastManager = ({ onInteractionComplete, onAnimationStart }) => {
  const [showToast, setShowToast] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const handleConfirm = () => {
    setIsLoading(true);
    // Simuliamo un caricamento di 3 secondi per l'esempio
    setTimeout(() => {
      setIsLoading(false);
      setShowToast(false);
      onInteractionComplete();
      if (onAnimationStart) onAnimationStart(); // Chiama handleStartApp
    }, 3000);
  };

  const handleDeny = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setShowToast(false);
      onInteractionComplete();
      if (onAnimationStart) onAnimationStart(); // Chiama handleStartApp
    }, 3000);
  };

  const handleSkip = () => {
    setShowToast(false);
    onInteractionComplete();
    if (onAnimationStart) onAnimationStart(); // Chiama handleStartApp
  };

  return (
    <PreHome
      showToast={showToast}
      isLoading={isLoading}
      loadingProgress={isLoading ? 50 : 0} // Progress bar fittizia
      onConfirm={handleConfirm}
      onDeny={handleDeny}
      onSkip={handleSkip}
    />
  );
};

export default InteractionToastManager;