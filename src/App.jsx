// src/App.jsx
import { useState, useRef, useMemo, useEffect } from 'react';
import { experiences as initialExperiences } from './data';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Componenti
import Navbar from './components/Navbar';
import Timeline from './components/Timeline';
import ExperienceContent from './components/ExperienceContent';
import VideoSection from './components/VideoSection';
import Presentation from './components/Presentation';
import GithubSection from './components/GithubSection';
import Footer from './components/Footer';
import PreHome from './components/PreHome';
// Hook dell'animazione
import { useInitialAnimation } from './contexts/useInitialAnimation.js';
import { SoundProvider, useSoundContext, SOUNDS } from './contexts/SoundContext.jsx';
import InteractionToastManager from './components/InteractionToastManager';

gsap.registerPlugin(ScrollTrigger);

function AppContent() {
  const { playSound, playSoundForced, initializeAudio, startPlayback, soundEnabled } = useSoundContext();
  const [showPreHome, setShowPreHome] = useState(true);
  const [showMainContent, setShowMainContent] = useState(false); // ← NUOVO stato

  const scrollContainerRef = useRef();
  const contentWrapperRef = useRef();
  const asideRef = useRef();
  const navbarRef = useRef();
  const presentationRef = useRef();
  const githubRef = useRef();
  const videoSectionRef = useRef();
  const isScrollingRef = useRef(false);
  const cardsRef = useRef({});

  const sortedExperiences = useMemo(() => {
    return [...initialExperiences].sort((a, b) => b.id - a.id);
  }, []);

  const [selectedId, setSelectedId] = useState(sortedExperiences[0].id);
  const [isReady, setIsReady] = useState(false);

  const { runInitialScrollAnimation, isInitialAnimationRunning } = useInitialAnimation(
    cardsRef,
    scrollContainerRef,
    contentWrapperRef,
    asideRef,
    navbarRef,
    sortedExperiences,
    setSelectedId,
    isScrollingRef,
    () => setIsReady(true),
    playSoundForced,
    soundEnabled
  );

  const handleOpenPresentation = () => presentationRef.current?.open();
  const handleOpenGithub = () => githubRef.current?.open();
  const handleOpenVideo = (videoId, projectTitle) => {
    videoSectionRef.current?.open(videoId, projectTitle);
  };



  const handleStartApp = () => {
    setShowMainContent(true);
    setTimeout(() => {
      runInitialScrollAnimation();
    }, 100); // Piccolo delay per assicurarsi che il DOM sia pronto

  };

  const handleMosaicComplete = () => {
    setShowPreHome(false);
  };

  useGSAP(() => {
    if (!isReady) return;

    console.log("Inizializzazione ScrollTrigger...");
    const cards = Object.values(cardsRef.current);
    cards.forEach((card) => {
      if (!card) return;
      ScrollTrigger.create({
        trigger: card,
        scroller: scrollContainerRef.current,
        start: "top 30%",
        end: "bottom 30%",
        onToggle: (self) => {
          if (self.isActive && !isScrollingRef.current) {
            const id = Number(card.getAttribute('data-id'));
            setSelectedId(id);
            playSound(SOUNDS.BOOM_SWOOSH, 0.05);
          }
        },
      });
    });
    return () => ScrollTrigger.getAll().forEach(t => t.kill());
  }, [isReady, isInitialAnimationRunning]);

  const handleTimelineClick = (id) => {
    if (isInitialAnimationRunning.current) return;
    playSound(SOUNDS.BOOM_SWOOSH, 0.1);
    const targetCard = cardsRef.current[id];
    if (targetCard) {
      isScrollingRef.current = true;
      setSelectedId(id);
      const offset = window.innerWidth < 768 ? 180 : 100;
      const targetPosition = targetCard.offsetTop - offset;
      scrollContainerRef.current?.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
      });
      setTimeout(() => { isScrollingRef.current = false; }, 800);
    }
  };

  return (
    <>
      {showPreHome && (
        <InteractionToastManager
          onInteractionComplete={() => { }}
          onAnimationStart={handleStartApp}
          onMosaicComplete={handleMosaicComplete} // ← NUOVO callback

        />
      )}
      <div className="h-screen flex flex-col overflow-hidden bg-agile-navy font-sans"
        style={{
          opacity: showMainContent ? 1 : 0,
          visibility: showMainContent ? 'visible' : 'hidden',
          transition: 'opacity 0.3s ease-in',
          pointerEvents: showMainContent ? 'auto' : 'none'
        }}
      >
        <div ref={navbarRef} className="opacity-0">
          <Navbar
            onOpenPresentation={handleOpenPresentation}
            onOpenGithub={handleOpenGithub}
          />
        </div>

        <main className="flex-1 flex flex-col md:flex-row pt-14 md:pt-20 overflow-hidden">

          <aside
            ref={asideRef}
            className="sticky z-40 w-full md:relative md:top-0 md:w-20 h-auto md:h-full flex flex-row md:flex-col items-center border-b md:border-b-0 md:border-r border-white/5 py-2 md:py-6 px-4 md:px-0 bg-agile-navy/95 md:bg-agile-navy/50 backdrop-blur-sm overflow-x-auto md:overflow-y-auto no-scrollbar opacity-0"
            style={{ transform: 'translateX(-100%)' }}
          >
            <div className="flex-1 w-full">
              <Timeline
                experiences={sortedExperiences}
                selectedId={selectedId}
                onSelect={handleTimelineClick}
                isAnimationRunning={isInitialAnimationRunning.current}
              />
            </div>
          </aside>


          <section
            ref={scrollContainerRef}
            className={`flex-1 h-full overflow-y-auto pt-6 md:pt-12 px-4 md:pr-12 pb-8 ${!isReady ? 'pointer-events-none select-none' : ''
              }`}
            style={{ scrollBehavior: 'auto' }}

          >
            <div ref={contentWrapperRef} style={{ opacity: 0 }}>
              {sortedExperiences.map((exp) => (
                <ExperienceContent
                  key={exp.id}
                  ref={el => cardsRef.current[exp.id] = el}
                  experience={exp}
                  data-id={exp.id}
                  style={{
                    opacity: !isReady ? 0.4 : (selectedId === exp.id ? 1 : 0.4),
                    transition: 'opacity 0.5s ease'
                  }}
                  onOpenVideo={handleOpenVideo}
                />
              ))}
            </div>
          </section>
        </main>

        <Presentation ref={presentationRef} />
        <GithubSection ref={githubRef} username="agileontheweb" />
        <VideoSection ref={videoSectionRef} />
        <Footer />
      </div>

    </>
  );
}

export default function App() {
  return (
    <SoundProvider>
      <AppContent />
    </SoundProvider>
  );
}