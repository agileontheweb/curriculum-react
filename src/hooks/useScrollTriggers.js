// src/hooks/useScrollTriggers.js
import { useGSAP } from '@gsap/react';
import { useRef, useEffect } from 'react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SOUNDS } from '../contexts/SoundContext';

export const useScrollTriggers = ({
  cardsRef,
  scrollContainerRef,
  selectedId,
  setSelectedId,
  isScrollingRef,
  isInitialAnimationRunning,
  playSound,
  lastSoundTimeRef
}) => {
  const selectedIdRef = useRef(selectedId);

  useEffect(() => {
    selectedIdRef.current = selectedId;
  }, [selectedId]);

  useGSAP(() => {
    const cards = Object.values(cardsRef.current);
    const triggers = [];

    cards.forEach((card) => {
      if (!card) return;

      const trigger = ScrollTrigger.create({
        trigger: card,
        scroller: scrollContainerRef.current,
        start: "top 250px",
        end: "bottom 250px",
        onToggle: (self) => {
          // --- INIZIO DEBUG ---
          // Aggiungiamo un log per vedere cosa succede
          console.log(`ScrollTrigger onToggle per card ${card.getAttribute('data-id')}, isActive: ${self.isActive}`);

          // COMMENTIAMO TUTTA LA LOGICA INTERNA
          /*
          if (self.isActive && !isScrollingRef.current && !isInitialAnimationRunning.current) {
            const newId = Number(card.getAttribute('data-id'));

            if (newId !== selectedIdRef.current) {
              const now = Date.now();
              if (now - lastSoundTimeRef.current > 300) {
                playSound(SOUNDS.SWOOSH_OUT, 0.3);
                lastSoundTimeRef.current = now;
              }
            }

            setSelectedId(newId);
          }
          */
          // --- FINE DEBUG ---
        },
      });

      triggers.push(trigger);
    });

    return () => {
      triggers.forEach(trigger => trigger.kill());
    };
  }, []);
};