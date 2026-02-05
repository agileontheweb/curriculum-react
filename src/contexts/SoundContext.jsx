import { createContext, useContext, useState, useRef, useCallback } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';

const SoundContext = createContext(null);

export const SoundProvider = ({ children }) => {
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [hasInteractedWithAudio, setHasInteractedWithAudio] = useState(false);

  // TRE riferimenti audio
  const backgroundMusicRef = useRef(null);
  const presentationMusicRef = useRef(null);
  const githubMusicRef = useRef(null);

  // Stato per sapere quale traccia è attiva. Può essere 'background', 'presentation', 'github'
  const [activeMode, setActiveMode] = useState('background');
  const isInitialized = useRef(false);

  // Funzione generica per gestire il crossfade
  const setMode = useCallback((newMode) => {
    if (!isInitialized.current || !soundEnabled) return;

    const tl = gsap.timeline();
    const currentMusicRef = getMusicRefForMode(activeMode);
    const targetMusicRef = getMusicRefForMode(newMode);

    if (currentMusicRef === targetMusicRef) return; // Non fare nulla se la modalità è la stessa

    // 1. Abbassa la musica corrente
    tl.to(currentMusicRef, { volume: 0, duration: 1.5, ease: "power2.inOut" });
    // 2. Allo stesso tempo, alza la musica target
    tl.to(targetMusicRef, { volume: 0.2, duration: 1.5, ease: "power2.inOut" }, "<");

    setActiveMode(newMode);
  }, [activeMode, soundEnabled]);

  // Funzioni di comodo per le vecchie funzioni
  const setPresentationMode = useCallback((isActive) => setMode(isActive ? 'presentation' : 'background'), [setMode]);
  const setGithubMode = useCallback((isActive) => setMode(isActive ? 'github' : 'background'), [setMode]);

  // Helper per ottenere il ref giusto
  const getMusicRefForMode = (mode) => {
    switch (mode) {
      case 'presentation': return presentationMusicRef.current;
      case 'github': return githubMusicRef.current;
      default: return backgroundMusicRef.current;
    }
  };

  const toggleSound = useCallback(() => {
    if (!isInitialized.current) return;
    const activeMusicRef = getMusicRefForMode(activeMode);
    if (soundEnabled) {
      activeMusicRef.pause();
    } else {
      activeMusicRef.play().catch(e => console.error("Play bloccato:", e));
    }
    setSoundEnabled(prev => !prev);
  }, [soundEnabled, activeMode]);

  const playSound = useCallback((soundFile) => {
    if (!soundEnabled) return;
    const audio = new Audio(soundFile);
    audio.volume = 0.5;
    audio.play().catch(error => console.error("Errore nel suono:", error));
  }, [soundEnabled]);

  // Funzione per inizializzare gli elementi audio senza riprodurli
  const initializeAudio = useCallback(() => {
    if (isInitialized.current) return;
    isInitialized.current = true;
    setHasInteractedWithAudio(true);

    // Carica i file audio ma non avviarli
    if (backgroundMusicRef.current) {
      backgroundMusicRef.current.src = '/audio/epic-spectrum-64k.mp3';
      backgroundMusicRef.current.volume = 0.2;
    }

    if (presentationMusicRef.current) {
      presentationMusicRef.current.src = '/audio/freesound_community-sadness-in-roads-to-nowhere-23407.mp3';
      presentationMusicRef.current.volume = 0.01;
    }

    if (githubMusicRef.current) {
      githubMusicRef.current.src = '/audio/freesound_community-opening-scene-59933.mp3';
      githubMusicRef.current.volume = 0.01;
    }
  }, []);

  // Funzione per avviare la riproduzione dopo l'interazione dell'utente
  const startPlayback = useCallback(() => {
    if (!isInitialized.current) return;
    setSoundEnabled(true);

    // Avvia la riproduzione solo della musica di background
    if (backgroundMusicRef.current) {
      backgroundMusicRef.current.play().catch(e => console.error("Play bloccato:", e));
    }

    // Le altre musiche rimangono in pausa con volume quasi nullo
    if (presentationMusicRef.current) {
      presentationMusicRef.current.play().catch(e => console.error("Play bloccato:", e));
    }

    if (githubMusicRef.current) {
      githubMusicRef.current.play().catch(e => console.error("Play bloccato:", e));
    }
  }, []);

  const handleUserChoice = useCallback(() => {
    setHasInteractedWithAudio(true);
  }, []);

  const value = {
    soundEnabled,
    hasInteractedWithAudio,
    activeMode, // Esponi la modalità attuale
    toggleSound,
    playSound,
    initializeAudio, // Funzione per inizializzare senza riprodurre
    startPlayback, // Funzione per avviare la riproduzione
    setPresentationMode,
    setGithubMode // Espone la nuova funzione
  };

  return (
    <SoundContext.Provider value={value}>
      {/* TRE elementi audio */}
      <audio ref={backgroundMusicRef} loop />
      <audio ref={presentationMusicRef} loop preload="auto" />
      <audio ref={githubMusicRef} loop preload="auto" />
      {children}
    </SoundContext.Provider>
  );
};

export const useSoundContext = () => {
  const context = useContext(SoundContext);
  if (context === null) {
    throw new Error("useSoundContext deve essere usato all'interno di un SoundProvider");
  }
  return context;
};