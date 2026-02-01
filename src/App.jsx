import { useState, useRef, useMemo, useEffect } from 'react';
import { experiences as initialExperiences } from './data';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import Navbar from './components/Navbar';
import Timeline from './components/Timeline';
import ExperienceContent from './components/ExperienceContent';
import Presentation from './components/Presentation';
import Footer from './components/Footer';

gsap.registerPlugin(ScrollTrigger);

function App() {
  const scrollContainerRef = useRef();
  const sidebarRef = useRef();
  const presentationRef = useRef();
  const isScrollingRef = useRef(false);

  // Esperienze sempre in ordine decrescente (dal più recente)
  const sortedExperiences = useMemo(() => {
    return [...initialExperiences].sort((a, b) => b.id - a.id);
  }, []);

  const [selectedId, setSelectedId] = useState(sortedExperiences[0].id);

  const handleOpenPresentation = () => presentationRef.current?.open();
  useEffect(() => {
    if (isScrollingRef.current) return;

    const activeDot = sidebarRef.current?.querySelector('.dot-active');

    if (activeDot) {
      activeDot.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
        inline: 'center',
      });
    }
  }, [selectedId]);

  useGSAP(() => {
    ScrollTrigger.getAll().forEach(t => t.kill());

    const cards = gsap.utils.toArray('.experience-wrapper');
    cards.forEach((card) => {
      ScrollTrigger.create({
        trigger: card,
        scroller: scrollContainerRef.current,
        start: "top 250px",
        end: "bottom 250px",
        onToggle: (self) => {
          if (self.isActive && !isScrollingRef.current) {
            setSelectedId(Number(card.dataset.id));
          }
        },
      });
    });
  }, []);

  const handleTimelineClick = (id) => {
    const targetCard = document.querySelector(`[data-id="${id}"]`);
    if (targetCard) {
      isScrollingRef.current = true;
      setSelectedId(id);

      const isMobile = window.innerWidth < 768;
      const offset = isMobile ? 180 : 100;

      const targetPosition = targetCard.offsetTop - offset;

      scrollContainerRef.current?.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
      });

      setTimeout(() => {
        const activeDot = sidebarRef.current?.querySelector(`[data-year="${id}"]`)?.closest('.timeline-item');
        if (activeDot) {
          activeDot.scrollIntoView({
            behavior: 'smooth',
            block: 'center',
            inline: 'center',
          });
        }

        setTimeout(() => {
          isScrollingRef.current = false;
        }, 1000);
      }, 100);
    }
  };

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-agile-navy font-sans">
      <Navbar />
      <main className="flex-1 flex flex-col md:flex-row pt-14 md:pt-20 overflow-hidden">

        {/* Sidebar con Timeline */}
        <aside
          ref={sidebarRef}
          className="sticky z-40 w-full md:relative md:top-0 md:w-20 h-auto md:h-full flex flex-row md:flex-col items-center border-b md:border-b-0 md:border-r border-white/5 py-2 md:py-6 px-4 md:px-0 bg-agile-navy/95 md:bg-agile-navy/50 backdrop-blur-sm overflow-x-auto md:overflow-y-auto no-scrollbar"
        >
          <div className="flex-1 w-full">
            <Timeline
              experiences={sortedExperiences}
              selectedId={selectedId}
              onSelect={handleTimelineClick}
            />
          </div>
        </aside>

        {/* Content Section */}
        <section
          ref={scrollContainerRef}
          className="flex-1 h-full overflow-y-auto pt-6 md:pt-12 px-4 md:pr-12 pb-8"
        >
          <div>
            {sortedExperiences.map((exp) => (
              <div
                key={exp.id}
                data-id={exp.id}
                className="experience-wrapper transition-opacity duration-500 scroll-mt-44 md:scroll-mt-24 mb-24"
                style={{ opacity: selectedId === exp.id ? 1 : 0.4 }}
              >
                <ExperienceContent experience={exp} />
              </div>
            ))}
          </div>
        </section>
      </main>
      <Presentation ref={presentationRef} />
      <Footer />
    </div>
  );
}

export default App;