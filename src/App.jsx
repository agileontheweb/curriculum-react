import { useState, useRef } from 'react';
import { experiences } from './data';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';

import Navbar from './components/Navbar';
import Timeline from './components/Timeline';
import ExperienceContent from './components/ExperienceContent';

function App() {
  const [selectedId, setSelectedId] = useState(experiences[0].id);
  const activeExperience = experiences.find(e => e.id === selectedId);
  const contentRef = useRef();

  useGSAP(() => {
    gsap.fromTo(contentRef.current,
      { opacity: 0, y: 15 },
      { opacity: 1, y: 0, duration: 0.4, ease: "power2.out" }
    );
  }, [selectedId]);

  return (
    /* 1. h-screen + overflow-hidden sul root per bloccare lo scroll del body */
    <div className="h-screen flex flex-col overflow-hidden bg-agile-navy font-sans">
      <Navbar />

      {/* 2. Il main deve occupare tutto lo spazio rimasto e non scrollare lui stesso */}
      <main className="flex-1 flex flex-row gap-4 md:gap-12 pt-20 overflow-hidden">

        {/* 3. Colonna Timeline: scrolla solo se i contenuti superano l'altezza */}
        <aside className="w-16 md:w-32 h-full overflow-y-auto custom-scrollbar py-12 flex justify-center">
          <Timeline
            experiences={experiences}
            selectedId={selectedId}
            onSelect={setSelectedId}
          />
        </aside>

        {/* 4. Colonna Content: scrolla indipendentemente dalla timeline */}
        <section className="flex-1 h-full overflow-y-auto custom-scrollbar py-12 pr-4 md:pr-12">
          <div>
            <ExperienceContent
              ref={contentRef}
              experience={activeExperience}
            />
          </div>
        </section>

      </main>
    </div>
  );
}

export default App;