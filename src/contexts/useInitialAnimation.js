// src/contexts/useInitialAnimation.js
import { useRef } from 'react';
import gsap from 'gsap';

export const useInitialAnimation = (
  cardsRef,
  scrollContainerRef,
  contentWrapperRef,
  asideRef,
  navbarRef,
  sortedExperiences,
  setSelectedId,
  isScrollingRef
) => {
  const isInitialAnimationRunning = useRef(false);

  const runInitialScrollAnimation = () => {
    if (!scrollContainerRef.current || !contentWrapperRef.current || !asideRef.current || !navbarRef.current) {
      console.error("[HOOK] Errore: uno dei ref necessari per l'animazione è null!");
      return;
    }
    if (isInitialAnimationRunning.current) {
      console.log("[HOOK] Animazione già in corso, esco.");
      return;
    }

    // Ordina le esperienze dalla più vecchia alla più nuova
    const experiencesOldestToNewest = [...sortedExperiences].reverse();
    const firstExperience = experiencesOldestToNewest[0]; // La più vecchia (es. 1994)
    const lastExperience = experiencesOldestToNewest[experiencesOldestToNewest.length - 1]; // La più recente (es. 2026)

    const firstCard = cardsRef.current[firstExperience.id];
    const lastCard = cardsRef.current[lastExperience.id];

    if (!firstCard || !lastCard) {
      console.error("[HOOK] Errore: card iniziale o finale non trovata.");
      isScrollingRef.current = false;
      isInitialAnimationRunning.current = false;
      return;
    }

    const offset = window.innerWidth < 768 ? 180 : 100;

    // --- LOGICA CHIAVE: Calcola le posizioni di inizio e fine ---
    const startPosition = firstCard.offsetTop - offset;
    const endPosition = lastCard.offsetTop - offset;

    console.log(`[HOOK] Posizioni -> Start (prima card): ${startPosition}, End (ultima card): ${endPosition}`);

    // --- IMPOSTA LO STATO INIZIALE CON GSAP ---
    // Questo è fondamentale: impostiamo la posizione di scroll iniziale e lo stato di React
    // PRIMA che l'animazione visibile parta.
    gsap.set(contentWrapperRef.current, { display: "block", opacity: 0 });
    gsap.set(asideRef.current, { opacity: 1, x: '-100%' });
    gsap.set(navbarRef.current, { opacity: 0 });
    gsap.set(scrollContainerRef.current, { scrollTop: startPosition }); // <--- QUESTA RIGA È FONDAMENTALE

    // Forza un reflow per assicurarsi che il browser abbia applicato gli stili
    scrollContainerRef.current.scrollTop;

    // Imposta lo stato iniziale di React sulla prima (più vecchia) esperienza
    setSelectedId(firstExperience.id);

    // Blocca lo scroll manuale durante l'animazione
    isScrollingRef.current = true;
    isInitialAnimationRunning.current = true;

    const tl = gsap.timeline({
      onComplete: () => {
        console.log("[HOOK] Animazione GSAP completata con successo.");
        // Alla fine, imposta lo stato sull'ultima (più recente) esperienza
        setSelectedId(lastExperience.id);
        isScrollingRef.current = false;
        isInitialAnimationRunning.current = false;
      },
      onInterrupt: () => {
        console.warn("[HOOK] Animazione GSAP interrotta.");
        isScrollingRef.current = false;
        isInitialAnimationRunning.current = false;
      }
    });

    // 1. Fai apparire il contenuto
    tl.to(contentWrapperRef.current, {
      opacity: 1,
      duration: 0.5,
      ease: "power1.inOut"
    });

    // 2. Anima lo scroll dalla posizione di partenza (prima card) a quella finale (ultima card)
    tl.to(scrollContainerRef.current, {
      scrollTop: endPosition,
      duration: 2.5,
      ease: "power2.inOut",
    }, "<");

    // 3. Fai entrare la sidebar da sinistra
    tl.to(asideRef.current, {
      x: '0%',
      duration: 0.8,
      ease: "expo.out"
    }, 1.9);

    // 4. Fai apparire la navbar
    tl.to(navbarRef.current, {
      opacity: 1,
      duration: 0.8,
      ease: "expo.out"
    });

    console.log("[HOOK] Timeline GSAP creata e avviata.");
  };

  return { runInitialScrollAnimation, isInitialAnimationRunning };
};