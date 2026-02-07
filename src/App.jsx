// ORIGINALE src/App.jsx
import { useState, useRef, useMemo } from 'react';
import { experiences as initialExperiences } from './data';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useScrollTriggers } from './hooks/useScrollTriggers';

// Componenti
import Navbar from './components/Navbar';
import Timeline from './components/Timeline';
import ExperienceContent from './components/ExperienceContent';
import VideoSection from './components/VideoSection';
import Presentation from './components/Presentation';
import GithubSection from './components/GithubSection';
import Footer from './components/Footer';

// Contesti e Manager
import { SoundProvider, useSoundContext, SOUNDS } from './contexts/SoundContext.jsx';
import InteractionToastManager from './components/InteractionToastManager';
import { useInitialAnimation } from './contexts/useInitialAnimation.js';

gsap.registerPlugin(ScrollTrigger);

function AppContent() {
  const { playSound, playSoundForced } = useSoundContext();
  const scrollContainerRef = useRef();
  const contentWrapperRef = useRef();
  const asideRef = useRef();
  const navbarRef = useRef();
  const presentationRef = useRef();
  const githubRef = useRef();
  const videoSectionRef = useRef();
  const isScrollingRef = useRef(false);
  const cardsRef = useRef({});

  const [isAppVisible, setIsAppVisible] = useState(false);
  const [hasInteractedWithToast, setHasInteractedWithToast] = useState(false);

  const sortedExperiences = useMemo(() => {
    return [...initialExperiences].sort((a, b) => b.id - a.id);
  }, []);

  const [selectedId, setSelectedId] = useState(sortedExperiences[0].id);
  const lastSoundTimeRef = useRef(0);


  const handleOpenPresentation = () => presentationRef.current?.open();
  const handleOpenGithub = () => githubRef.current?.open();
  const handleOpenVideo = (videoId, projectTitle) => {
    videoSectionRef.current?.open(videoId, projectTitle);
  };

  const { runInitialScrollAnimation, isInitialAnimationRunning } = useInitialAnimation(
    cardsRef,
    scrollContainerRef,
    contentWrapperRef,
    asideRef,
    navbarRef,
    sortedExperiences,
    setSelectedId,
    playSoundForced,
    isScrollingRef
  );

  useScrollTriggers({
    cardsRef,
    scrollContainerRef,
    selectedId,
    setSelectedId,
    isScrollingRef,
    isInitialAnimationRunning,
    playSound,
    lastSoundTimeRef
  });


  const handleTimelineClick = (id) => {
    if (isInitialAnimationRunning.current) return;
    playSound(SOUNDS.BOOM_SWOOSH, 0.1);

    // FAI SOLO QUESTO: cambia lo stato. NIENT'ALTRO.
    setSelectedId(id);
  };

  const handleSkipAnimation = () => {
    console.log("SKIP ANIMATION: Attivazione immediata dell'app");
    setHasInteractedWithToast(true);
    setIsAppVisible(true);

    // Rendi visibili gli elementi animati da GSAP
    gsap.to(asideRef.current, { opacity: 1, x: '0%', duration: 0.5 });
    gsap.to(navbarRef.current, { opacity: 1, duration: 0.5 });
    gsap.to(contentWrapperRef.current, { display: "block", opacity: 1, duration: 0.5 });
  };

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-agile-navy font-sans">
      <div ref={navbarRef} className="opacity-0">
        <Navbar
          onOpenPresentation={handleOpenPresentation}
          onOpenGithub={handleOpenGithub}
          animationsEnabled={hasInteractedWithToast}
        />
      </div>

      <main
        className={`flex-1 flex flex-col md:flex-row pt-14 md:pt-20 overflow-hidden transition-all duration-500 ${isAppVisible ? 'opacity-100' : 'opacity-0'}`}>
        <aside
          ref={asideRef}
          className="sticky z-40 w-full md:relative md:top-0 md:w-20 h-auto md:h-full flex flex-row md:flex-col items-center border-b md:border-b-0 md:border-r border-white/5 py-2 md:py-6 px-4 md:px-0 bg-agile-navy/95 md:bg-agile-navy/50 backdrop-blur-sm overflow-x-auto md:overflow-y-auto no-scrollbar opacity-0"
        >
          <div className="flex-1 w-full">
            <Timeline
              experiences={sortedExperiences}
              selectedId={selectedId}
              onSelect={handleTimelineClick}
              isAnimationRunning={false} // Quando si skippa, l'animazione non è mai in esecuzione

            />
          </div>
        </aside>

        <section
          ref={scrollContainerRef}
          className="flex-1 h-full overflow-y-auto pt-6 md:pt-12 px-4 md:pr-12 pb-8 scroll-smooth"
          style={{ scrollBehavior: 'auto' }}

        >
          <div ref={contentWrapperRef} className="hidden">
            {sortedExperiences.map((exp) => (
              <ExperienceContent
                key={exp.id}
                ref={el => cardsRef.current[exp.id] = el}
                experience={exp}
                data-id={exp.id}
                style={{ opacity: selectedId === exp.id ? 1 : 0.4 }}
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

      <InteractionToastManager
        onInteractionComplete={() => setHasInteractedWithToast(true)}
        onAnimationStart={handleSkipAnimation}
      />
    </div>
  );
}

function App() {
  return (
    <SoundProvider>
      <AppContent />
    </SoundProvider>
  );
}

export default App;