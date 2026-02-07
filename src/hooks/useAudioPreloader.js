// src/hooks/useAudioPreloader.js
import { useState, useCallback, useRef } from 'react';
import { useSoundContext } from '../contexts/SoundContext';

export const useAudioPreloader = () => {
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [isPreloading, setIsPreloading] = useState(false);
  const { preloadAllAudio } = useSoundContext();
  const intervalRef = useRef(null);

  const preloadAudio = useCallback(async () => {
    setIsPreloading(true);
    setLoadingProgress(0);

    // 6 secondi permettono una lettura confortevole di tutti i testi
    const MINIMUM_LOADING_TIME = 6000;
    const UPDATE_INTERVAL = 50;
    const TOTAL_STEPS = MINIMUM_LOADING_TIME / UPDATE_INTERVAL;
    const STEP_INCREMENT = 100 / TOTAL_STEPS;

    let currentProgress = 0;
    let preloadComplete = false;

    const preloadPromise = preloadAllAudio().then(() => {
      preloadComplete = true;
    }).catch(() => {
      preloadComplete = true;
    });

    intervalRef.current = setInterval(() => {
      // Incremento costante per una barra fluida
      currentProgress += STEP_INCREMENT;

      // Gestione stop al 95% se i file sono lenti
      if (!preloadComplete && currentProgress >= 95) {
        currentProgress = 95;
      }

      // Se tutto è pronto e abbiamo finito il tempo minimo, chiudiamo
      if (preloadComplete && currentProgress >= 100) {
        currentProgress = 100;
        clearInterval(intervalRef.current);
      }

      setLoadingProgress(Math.min(currentProgress, 100));
    }, UPDATE_INTERVAL);

    try {
      await preloadPromise;
      // Se il caricamento dei file è finito prima dei 6 secondi, 
      // aspettiamo comunque che l'animazione arrivi a 100
      await new Promise(resolve => {
        const check = setInterval(() => {
          if (currentProgress >= 100) {
            clearInterval(check);
            resolve();
          }
        }, 100);
      });
    } finally {
      setIsPreloading(false);
    }
  }, [preloadAllAudio]);

  return { preloadAudio, loadingProgress, isPreloading };
};