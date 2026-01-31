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
      { opacity: 0, y: 10 },
      { opacity: 1, y: 0, duration: 0.3 }
    );
  }, [selectedId]);

  return (
    <div className="min-h-screen flex flex-col items-center">
      <Navbar />

      <main className="w-full flex flex-row gap-4 md:gap-12 pt-32 pb-20 px-4">
        <Timeline
          experiences={experiences}
          selectedId={selectedId}
          onSelect={setSelectedId}
        />

        <ExperienceContent
          ref={contentRef}
          experience={activeExperience}
        />
      </main>
    </div>
  );
}

export default App;