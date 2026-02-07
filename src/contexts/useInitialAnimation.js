import { useRef } from 'react';
import gsap from 'gsap';
import { SOUNDS } from '../contexts/SoundContext';
export const useInitialAnimation = (
  cardsRef,
  scrollContainerRef,
  contentWrapperRef,
  asideRef,
  navbarRef,
  sortedExperiences,
  setSelectedId,
  isScrollingRef,
  onCompleteCallback,
  playSoundForced,
  soundEnabled
) => {
  const isInitialAnimationRunning = useRef(false);

  const runInitialScrollAnimation = () => {
    const playIfEnabled = (sound, vol) => {
      if (soundEnabled) {
        playSoundForced(sound, vol);
      }
    }
    const scroller = scrollContainerRef.current;
    const wrapper = contentWrapperRef.current;

    if (!scroller || !wrapper) return;
    if (isInitialAnimationRunning.current) return;

    const oldestExp = sortedExperiences[sortedExperiences.length - 1]; // 1994
    const newestExp = sortedExperiences[0]; // 2026
    const oldestCard = cardsRef.current[oldestExp.id];

    if (!oldestCard) return;

    const offset = window.innerWidth < 768 ? 180 : 100;
    const startPos = oldestCard.offsetTop - offset;

    isInitialAnimationRunning.current = true;
    isScrollingRef.current = true;
    scroller.scrollTop = startPos;

    setSelectedId(newestExp.id);
    gsap.set(asideRef.current, { x: '-100%', opacity: 1 });
    gsap.set(navbarRef.current, { opacity: 0 });

    const tl = gsap.timeline({
      onStart: () => {
        playIfEnabled(SOUNDS.EPIC_TRANSITION, 0.2);
      },
      onComplete: () => {
        isScrollingRef.current = false;
        isInitialAnimationRunning.current = false;
        if (onCompleteCallback) onCompleteCallback();
        playIfEnabled(SOUNDS.CLICK, 0.1);
      }
    });

    tl.to(wrapper, {
      opacity: 1,
      duration: 0.4
    });

    tl.to(scroller, {
      scrollTop: 0,
      duration: 3,
      ease: "power2.inOut",
      onStart: () => {
        playIfEnabled(SOUNDS.CINEMATIC_FLASHBACK, 0.15);
      }
    }, "-=0.2");

    tl.to(asideRef.current, {
      x: '0%',
      duration: 1.2,
      ease: "expo.out",
      onStart: () => {
        playIfEnabled(SOUNDS.SWOOSH_OUT, 0.1);
      }
    }, "-=1");

    tl.to(navbarRef.current, {
      opacity: 1,
      duration: 0.8
    }, "-=0.8");
  };

  return { runInitialScrollAnimation, isInitialAnimationRunning };
};