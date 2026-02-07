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
    const scroller = scrollContainerRef.current;
    const wrapper = contentWrapperRef.current;

    if (!scroller || !wrapper) return;
    if (isInitialAnimationRunning.current) return;

    const oldestExp = sortedExperiences[sortedExperiences.length - 1]; // 1994
    const newestExp = sortedExperiences[0]; // 2026
    const oldestCard = cardsRef.current[oldestExp.id];

    if (!oldestCard) return;

    // Calcoliamo la posizione della card del 1994
    const offset = window.innerWidth < 768 ? 180 : 100;
    const startPos = oldestCard.offsetTop - offset;

    isInitialAnimationRunning.current = true;
    isScrollingRef.current = true;
    scroller.scrollTop = startPos;

    setSelectedId(newestExp.id);
    gsap.set(asideRef.current, { x: '-100%', opacity: 1 });
    gsap.set(navbarRef.current, { opacity: 0 });

    const tl = gsap.timeline({
      onComplete: () => {
        isScrollingRef.current = false;
        isInitialAnimationRunning.current = false;
      }
    });

    tl.to(wrapper, {
      opacity: 1,
      duration: 0.4
    });

    tl.to(scroller, {
      scrollTop: 0,
      duration: 3,
      ease: "power2.inOut"
    }, "-=0.2");

    tl.to(asideRef.current, {
      x: '0%',
      duration: 1.2,
      ease: "expo.out"
    }, "-=1");

    tl.to(navbarRef.current, {
      opacity: 1,
      duration: 0.8
    }, "-=0.8");
  };

  return { runInitialScrollAnimation, isInitialAnimationRunning };
};