// src/contexts/useInitialAnimation.js
import { SOUNDS } from './SoundContext';
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
  playSoundForced,
  isScrollingRef // Aggiungi questo parametro
) => {

  const isInitialAnimationRunning = useRef(false);

  const runInitialScrollAnimation = () => {
    if (!scrollContainerRef.current || isInitialAnimationRunning.current) return;
    isInitialAnimationRunning.current = true;

    const experiencesOldestToNewest = [...sortedExperiences].reverse();
    const firstExperience = experiencesOldestToNewest[0];
    const firstCard = cardsRef.current[firstExperience.id];
    if (!firstCard) return;

    const offset = window.innerWidth < 768 ? 180 : 100;

    gsap.set(contentWrapperRef.current, { display: "block", opacity: 0 });
    gsap.set(asideRef.current, { opacity: 1, x: '-100%' });
    scrollContainerRef.current.scrollHeight; // Forza il reflow
    const startPosition = firstCard.offsetTop - offset;
    scrollContainerRef.current.scrollTop = startPosition;
    setSelectedId(firstExperience.id);

    const lastExperience = experiencesOldestToNewest[experiencesOldestToNewest.length - 1];
    const lastCard = cardsRef.current[lastExperience.id];
    if (!lastCard) return;
    const endPosition = lastCard.offsetTop - offset;

    const tl = gsap.timeline({
      onComplete: () => {
        isInitialAnimationRunning.current = false;
        setSelectedId(lastExperience.id);
        // Assicuriamoci che anche isScrollingRef sia resettato
        isScrollingRef.current = false;
      }
    });

    tl.to(contentWrapperRef.current, {
      opacity: 1,
      duration: 0.5,
      ease: "power1.inOut"
    });

    tl.to(scrollContainerRef.current, {
      scrollTop: endPosition,
      duration: 2.5,
      ease: "power2.inOut",
      // RIMOSSO: onUpdate con setSelectedId
      // Gli ScrollTrigger gestiranno l'aggiornamento automaticamente
    }, "<");

    // tl.to(scrollContainerRef.current, {
    //   scrollTop: endPosition,
    //   duration: 2.5,
    //   ease: "power2.inOut",
    //   onUpdate: () => {
    //     const currentScrollTop = scrollContainerRef.current.scrollTop + offset;
    //     let activeId = firstExperience.id;
    //     for (const exp of experiencesOldestToNewest) {
    //       const card = cardsRef.current[exp.id];
    //       if (card && card.offsetTop <= currentScrollTop) {
    //         activeId = exp.id;
    //       } else {
    //         break;
    //       }
    //     }
    //     setSelectedId(activeId);
    //   }
    // }, "<");

    tl.to(asideRef.current, {
      x: '0%',
      duration: 0.8,
      ease: "expo.out"
    }, 1.9);

    tl.to(navbarRef.current, {
      opacity: 1,
      duration: 0.8,
      ease: "expo.out"
    });

    gsap.timeline().call(() => {
      playSoundForced('EPIC_TRANSITION', 0.1);
    }, null, "+=0.1");
  };

  return { runInitialScrollAnimation, isInitialAnimationRunning };
};