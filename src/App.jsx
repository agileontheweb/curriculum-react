import { useState, useRef, useMemo } from 'react';
import { experiences as initialExperiences } from './data';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import Navbar from './components/Navbar';
import Timeline from './components/Timeline';
import ExperienceContent from './components/ExperienceContent';
import Presentation from './components/Presentation';
import GithubSection from './components/GithubSection';
import Footer from './components/Footer';

gsap.registerPlugin(ScrollTrigger);

function App() {
  const scrollContainerRef = useRef();
  const presentationRef = useRef();
  const githubRef = useRef();
  const isScrollingRef = useRef(false);
  const cardsRef = useRef({});

  const sortedExperiences = useMemo(() => {
    return [...initialExperiences].sort((a, b) => b.id - a.id);
  }, []);

  const [selectedId, setSelectedId] = useState(sortedExperiences[0].id);

  const handleOpenPresentation = () => presentationRef.current?.open();
  const handleOpenGithub = () => githubRef.current?.open();

  useGSAP(() => {
    const cards = Object.values(cardsRef.current);

    cards.forEach((card) => {
      if (!card) return;

      ScrollTrigger.create({
        trigger: card,
        scroller: scrollContainerRef.current,
        start: "top 250px",
        end: "bottom 250px",
        onToggle: (self) => {
          if (self.isActive && !isScrollingRef.current) {
            setSelectedId(Number(card.getAttribute('data-id')));
          }
        },
      });
    });
  }, [sortedExperiences]);

  const handleTimelineClick = (id) => {
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
    <div className="h-screen flex flex-col overflow-hidden bg-agile-navy font-sans">
      <Navbar onOpenPresentation={handleOpenPresentation} />
      <Navbar
        onOpenPresentation={handleOpenPresentation}
        onOpenGithub={handleOpenGithub}
      />

      <main className="flex-1 flex flex-col md:flex-row pt-14 md:pt-20 overflow-hidden">
        <aside className="sticky z-40 w-full md:relative md:top-0 md:w-20 h-auto md:h-full flex flex-row md:flex-col items-center border-b md:border-b-0 md:border-r border-white/5 py-2 md:py-6 px-4 md:px-0 bg-agile-navy/95 md:bg-agile-navy/50 backdrop-blur-sm overflow-x-auto md:overflow-y-auto no-scrollbar">
          <div className="flex-1 w-full">
            <Timeline
              experiences={sortedExperiences}
              selectedId={selectedId}
              onSelect={handleTimelineClick}
            />
          </div>
        </aside>

        <section
          ref={scrollContainerRef}
          className="flex-1 h-full overflow-y-auto pt-6 md:pt-12 px-4 md:pr-12 pb-8 scroll-smooth"
        >
          <div>
            {sortedExperiences.map((exp) => (
              <ExperienceContent
                key={exp.id}
                ref={el => cardsRef.current[exp.id] = el}
                experience={exp}
                data-id={exp.id}
                style={{ opacity: selectedId === exp.id ? 1 : 0.4 }}
              />
            ))}
          </div>
        </section>
      </main>

      <Presentation ref={presentationRef} />
      <GithubSection ref={githubRef} username="agileontheweb" />
      <Footer />
    </div>
  );
}

export default App;