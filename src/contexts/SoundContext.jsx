import { createContext, useContext, useState, useRef, useCallback } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';

// NUOVO: Oggetto centrale per tutti i percorsi dei file audio
export const SOUNDS = {
  // EPIC_TRANSITION: '/audio/dragon-studio-epic-transition-478367.mp3',
  EPIC_TRANSITION: '/audio/alexis_gaming_cam-impact-transition-impact-dramatic-boom-346103.mp3',
  BOOM_SWOOSH: '/audio/dragon-studio-boom-swoosh-05-416170.mp3',
  SWOOSH_OUT: '/audio/soundreality-whoosh-end-384629.mp3',
  CLICK: '/audio/47313572-ui-sounds-pack-4-6-359744.mp3',
  HOVER: '/audio/denielcz-immersivecontrol-button-click-sound-463065.mp3',
  CINEMATIC_FLASHBACK: '/audio/dragon-studio-cinematic-flashback-transition-463199.mp3',
  BACKGROUND_MUSIC: '/audio/epic-spectrum-64k.mp3',
  PRESENTATION_MUSIC: '/audio/freesound_community-sadness-in-roads-to-nowhere-23407.mp3',
  GITHUB_MUSIC: '/audio/freesound_community-opening-scene-59933.mp3',
};

const SoundContext = createContext(null);

export const SoundProvider = ({ children }) => {
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [hasInteractedWithAudio, setHasInteractedWithAudio] = useState(false);

  // riferimenti audio
  const backgroundMusicRef = useRef(null);
  const presentationMusicRef = useRef(null);
  const githubMusicRef = useRef(null);

  // Stato per sapere quale traccia è attiva. Può essere 'background', 'presentation', 'github'
  const [activeMode, setActiveMode] = useState('background');
  const isInitialized = useRef(false);

  // Funzione generica per gestire il crossfade
  const setMode = useCallback((newMode) => {
    if (!isInitialized.current || !soundEnabled) return;

    const currentMusicRef = getMusicRefForMode(activeMode);
    const targetMusicRef = getMusicRefForMode(newMode);

    if (!currentMusicRef || !targetMusicRef || currentMusicRef === targetMusicRef) {
      return;
    }

    // Usa i percorsi centralizzati da SOUNDS
    if (!targetMusicRef.src) {
      switch (newMode) {
        case 'presentation':
          targetMusicRef.src = SOUNDS.PRESENTATION_MUSIC;
          targetMusicRef.volume = 0.01;
          break;
        case 'github':
          targetMusicRef.src = SOUNDS.GITHUB_MUSIC;
          targetMusicRef.volume = 0.01;
          break;
      }
      targetMusicRef.play().catch(e => console.error("Errore: la traccia target non è partita:", e));
    }

    const tl = gsap.timeline();

    tl.to(currentMusicRef, { volume: 0, duration: 1.5, ease: "power2.inOut" });
    tl.to(targetMusicRef, { volume: 0.2, duration: 1.5, ease: "power2.inOut" }, "<");

    setActiveMode(newMode);
  }, [activeMode, soundEnabled]);

  const setPresentationMode = useCallback((isActive) => setMode(isActive ? 'presentation' : 'background'), [setMode]);
  const setGithubMode = useCallback((isActive) => setMode(isActive ? 'github' : 'background'), [setMode]);

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

  const playSoundForced = useCallback((soundFile) => {
    const audio = new Audio(soundFile);
    audio.volume = 0.5;
    audio.play().catch(error => console.error("Errore nel suono forzato:", error));
  }, []);

  //  Inizializza SOLO la traccia di background
  const initializeAudio = useCallback(() => {
    if (isInitialized.current) return;
    isInitialized.current = true;
    setHasInteractedWithAudio(true);

    if (backgroundMusicRef.current) {
      backgroundMusicRef.current.src = SOUNDS.BACKGROUND_MUSIC;
      backgroundMusicRef.current.volume = 0.05;
    }
  }, []);

  //  Avvia SOLO la traccia di background
  const startPlayback = useCallback(() => {
    if (!isInitialized.current) return;
    setSoundEnabled(true);

    if (backgroundMusicRef.current) {
      backgroundMusicRef.current.play().catch(e => console.error("Play bloccato:", e));
    }
  }, []);

  const handleUserChoice = useCallback(() => {
    setHasInteractedWithAudio(true);
  }, []);

  const value = {
    soundEnabled,
    hasInteractedWithAudio,
    activeMode,
    toggleSound,
    playSound,
    playSoundForced,
    initializeAudio,
    startPlayback,
    setPresentationMode,
    setGithubMode,
    SOUNDS
  };

  return (
    <SoundContext.Provider value={value}>
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