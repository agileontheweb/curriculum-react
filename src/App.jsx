import { useState, useRef } from 'react';
import { experiences } from './data';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import Navbar from './components/Navbar';
import Timeline from './components/Timeline';
import ExperienceContent from './components/ExperienceContent';

gsap.registerPlugin(ScrollTrigger);

function App() {
  const [selectedId, setSelectedId] = useState(experiences[0].id);
  const scrollContainerRef = useRef();
  useGSAP(() => {
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

    return () => ScrollTrigger.getAll().forEach(t => t.kill());
  }, []);

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
        <aside className="w-16 md:w-32 h-full overflow-y-auto custom-scrollbar py-12 flex justify-center">
          <Timeline
            experiences={experiences}
            selectedId={selectedId}
            onSelect={handleTimelineClick}
          />
        </aside>
        <section
          ref={scrollContainerRef}
          className="flex-1 h-full overflow-y-auto custom-scrollbar py-12 pr-4 md:pr-12"
        >
          <div>
            {experiences.map((exp) => (
              <div
                key={exp.id}
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