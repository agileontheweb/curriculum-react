import { useState, useRef, useMemo, useEffect } from 'react';
import { experiences as initialExperiences } from './data';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { HiArrowsUpDown } from "react-icons/hi2"; // Icona React

import Navbar from './components/Navbar';
import Timeline from './components/Timeline';
import ExperienceContent from './components/ExperienceContent';

gsap.registerPlugin(ScrollTrigger);

function App() {
  const [isReversed, setIsReversed] = useState(false);
  const scrollContainerRef = useRef();

  // Ordiniamo le esperienze: useMemo serve a non ricalcolare l'ordine a ogni piccolo render
  const sortedExperiences = useMemo(() => {
    return [...initialExperiences].sort((a, b) =>
      isReversed ? b.id - a.id : a.id - b.id
    );
  }, [isReversed]);

  const [selectedId, setSelectedId] = useState(sortedExperiences[0].id);

  const sidebarRef = useRef();

  useEffect(() => {
    // Cerchiamo il pallino attivo dentro la sidebar
    const activeDot = sidebarRef.current?.querySelector('.dot-active');

    if (activeDot) {
      // Scrolliamo la sidebar in modo che il pallino sia al centro
      activeDot.scrollIntoView({
        behavior: 'smooth',
        block: 'center', // Questo lo porta al centro del contenitore
      });
    }
  }, [selectedId]); // Scatta ogni volta che cambia l'anno attivo

  useGSAP(() => {
    // Ogni volta che cambia l'ordine, dobbiamo distruggere i vecchi trigger e crearne di nuovi
    ScrollTrigger.getAll().forEach(t => t.kill());

    const cards = gsap.utils.toArray('.experience-wrapper');
    cards.forEach((card) => {
      ScrollTrigger.create({
        trigger: card,
        scroller: scrollContainerRef.current,
        start: "top 250px",
        end: "bottom 250px",
        onToggle: (self) => {
          if (self.isActive) {
            setSelectedId(Number(card.dataset.id));
          }
        },
      });
    });
  }, [isReversed]); // Si riattiva quando cambia l'ordine

  const handleTimelineClick = (id) => {
    const targetCard = document.querySelector(`[data-id="${id}"]`);
    if (targetCard) {
      targetCard.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-agile-navy font-sans">
      <Navbar />
      <main className="flex-1 flex flex-row gap-4 md:gap-12 pt-20 overflow-hidden">

        {/* Sidebar con Timeline e Toggle */}
        <aside
          ref={sidebarRef}
          className="w-16 md:w-32 h-full overflow-y-auto custom-scrollbar py-12 flex flex-col items-center border-r border-white/5 scroll-py-20">
          <button
            onClick={() => setIsReversed(!isReversed)}
            className="mb-8 p-3 rounded-full bg-white/5 hover:bg-agile-sky/20 text-agile-sky transition-all border border-white/10 group active:scale-95"
            title={isReversed ? "Mostra dal più vecchio" : "Mostra dal più recente"}
          >
            <HiArrowsUpDown className={`w-5 h-5 transition-transform duration-500 ${isReversed ? 'rotate-180' : ''}`} />
          </button>

          <div className="flex-1 overflow-y-auto custom-scrollbar w-full flex justify-center">
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
          className="flex-1 h-full overflow-y-auto custom-scrollbar py-12 pr-4 md:pr-12"
        >
          <div>
            {sortedExperiences.map((exp) => (
              <div
                key={`${isReversed ? 'rev' : 'fwd'}-${exp.id}`} // Key dinamica per forzare il refresh del DOM al cambio ordine
                data-id={exp.id}
                className="experience-wrapper transition-opacity duration-500 scroll-mt-8 mb-24"
                style={{ opacity: selectedId === exp.id ? 1 : 0.4 }}
              >
                <ExperienceContent experience={exp} />
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}

export default App;