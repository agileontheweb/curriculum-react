// src/contexts/SoundContext.jsx
import { createContext, useContext, useState, useRef, useCallback } from 'react';
import gsap from 'gsap';

export const SOUNDS = {
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

  // Audio refs per le musiche loop
  const backgroundMusicRef = useRef(null);
  const presentationMusicRef = useRef(null);
  const githubMusicRef = useRef(null);

  // Web Audio API
  const audioContextRef = useRef(null);
  const audioBuffers = useRef({});

  const [activeMode, setActiveMode] = useState('background');
  const isInitialized = useRef(false);

  const preloadAllAudio = useCallback(() => {
    return new Promise((resolve) => {
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
      }

      const audioFiles = Object.entries(SOUNDS);
      const totalFiles = audioFiles.length;
      let loadedFiles = 0;

      const checkComplete = () => {
        loadedFiles++;
        if (loadedFiles === totalFiles) {
          resolve();
        }
      };

      audioFiles.forEach(([key, src]) => {
        if (key === 'BACKGROUND_MUSIC' || key === 'PRESENTATION_MUSIC' || key === 'GITHUB_MUSIC') {
          const audio = new Audio();
          audio.preload = 'auto';

          audio.addEventListener('canplaythrough', () => {
            checkComplete();
          }, { once: true });

          audio.addEventListener('error', (e) => {
            console.warn(`Errore caricamento ${key}:`, e);
            checkComplete();
          }, { once: true });

          audio.src = src;
          audio.load();
          return;
        }

        fetch(src)
          .then(response => response.arrayBuffer())
          .then(arrayBuffer => audioContextRef.current.decodeAudioData(arrayBuffer))
          .then(audioBuffer => {
            audioBuffers.current[key] = audioBuffer;
            checkComplete();
          })
          .catch(error => {
            console.warn(`Errore caricamento ${key}:`, error);
            checkComplete();
          });
      });
    });
  }, []);

  const getMusicRefForMode = (mode) => {
    switch (mode) {
      case 'presentation': return presentationMusicRef.current;
      case 'github': return githubMusicRef.current;
      default: return backgroundMusicRef.current;
    }
  };

  const setMode = useCallback((newMode) => {
    if (!isInitialized.current || !soundEnabled) return;

    const currentMusicRef = getMusicRefForMode(activeMode);
    const targetMusicRef = getMusicRefForMode(newMode);

    if (!currentMusicRef || !targetMusicRef || currentMusicRef === targetMusicRef) {
      return;
    }

    if (targetMusicRef.paused) {
      targetMusicRef.play().catch(e => console.error("Errore play:", e));
    }

    // Determina il volume target in base alla modalità
    const targetVolume = newMode === 'background' ? 0.05 : 0.2;

    const tl = gsap.timeline();
    tl.to(currentMusicRef, { volume: 0, duration: 1.5, ease: "power2.inOut" });
    tl.to(targetMusicRef, { volume: targetVolume, duration: 1.5, ease: "power2.inOut" }, "<");

    setActiveMode(newMode);
  }, [activeMode, soundEnabled]);

  const setPresentationMode = useCallback((isActive) => setMode(isActive ? 'presentation' : 'background'), [setMode]);
  const setGithubMode = useCallback((isActive) => setMode(isActive ? 'github' : 'background'), [setMode]);


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

  // Suona usando AudioBuffer (zero network!)
  const playSound = useCallback((soundKey, volume = 0.5) => {
    if (!soundEnabled || !audioContextRef.current) return;

    const key = Object.keys(SOUNDS).find(k => SOUNDS[k] === soundKey) || soundKey;
    const buffer = audioBuffers.current[key];

    if (buffer) {
      const source = audioContextRef.current.createBufferSource();
      const gainNode = audioContextRef.current.createGain();

      source.buffer = buffer;
      gainNode.gain.value = Math.min(Math.max(volume, 0), 1);

      source.connect(gainNode);
      gainNode.connect(audioContextRef.current.destination);

      source.start(0);
    } else {
      console.warn(`Audio buffer ${key} non trovato`);
    }
  }, [soundEnabled]);

  const playSoundForced = useCallback((soundKey, volume = 0.5) => {
    if (!soundEnabled || !audioContextRef.current) return;

    const key = Object.keys(SOUNDS).find(k => SOUNDS[k] === soundKey) || soundKey;
    const buffer = audioBuffers.current[key];

    if (buffer) {
      const source = audioContextRef.current.createBufferSource();
      const gainNode = audioContextRef.current.createGain();

      source.buffer = buffer;
      gainNode.gain.value = Math.min(Math.max(volume, 0), 1);

      source.connect(gainNode);
      gainNode.connect(audioContextRef.current.destination);

      source.start(0);
    } else {
      console.warn(`Audio buffer ${key} non trovato`);
    }
  }, [soundEnabled]);

  const initializeAudio = useCallback(() => {
    if (isInitialized.current) return;
    isInitialized.current = true;
    setHasInteractedWithAudio(true);

    if (backgroundMusicRef.current) {
      backgroundMusicRef.current.src = SOUNDS.BACKGROUND_MUSIC;
      backgroundMusicRef.current.volume = 0.05;
    }

    if (presentationMusicRef.current) {
      presentationMusicRef.current.src = SOUNDS.PRESENTATION_MUSIC;
      presentationMusicRef.current.volume = 0.01;
    }

    if (githubMusicRef.current) {
      githubMusicRef.current.src = SOUNDS.GITHUB_MUSIC;
      githubMusicRef.current.volume = 0.01;
    }
  }, []);

  const startPlayback = useCallback(() => {
    if (!isInitialized.current) return;
    setSoundEnabled(true);

    if (backgroundMusicRef.current) {
      backgroundMusicRef.current.play().catch(e => console.error("Play bloccato:", e));
    }
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
    preloadAllAudio,
    SOUNDS
  };

  return (
    <SoundContext.Provider value={value}>
      <audio ref={backgroundMusicRef} loop />
      <audio ref={presentationMusicRef} loop />
      <audio ref={githubMusicRef} loop />
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