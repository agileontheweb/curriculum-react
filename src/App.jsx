import { useState, useRef } from 'react';
import { experiences } from './data';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';

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
    <div className="min-h-screen bg-slate-900 text-white p-4 md:p-10 flex flex-col items-center">
      <h1 className="text-2xl font-black mb-12 text-sky-500 uppercase tracking-tighter">Timeline 1998 - 2026</h1>

      <div className="w-full  flex flex-row gap-4 md:gap-12">

        {/* TIMELINE (Sempre a sinistra) */}
        <div className="relative flex flex-col items-center w-16 md:w-24 shrink-0">
          <div className="absolute top-0 bottom-0 w-px bg-slate-800 left-1/2"></div>

          <div className="flex flex-col gap-8 w-full">
            {experiences.map((exp) => (
              <div key={exp.id} className="relative flex flex-col items-center group">
                {/* Anno - sopra il pallino su mobile per risparmiare spazio */}
                <span className={`text-[10px] md:text-xs font-mono mb-1 transition-colors ${selectedId === exp.id ? 'text-sky-400' : 'text-slate-600'}`}>
                  {exp.year}
                </span>

                <button
                  onClick={() => setSelectedId(exp.id)}
                  className={`relative z-10 w-4 h-4 md:w-5 md:h-5 rounded-full transition-all border-2 ${selectedId === exp.id
                    ? "bg-sky-500 border-white scale-110 shadow-[0_0_10px_rgba(14,165,233,0.5)]"
                    : "bg-slate-900 border-slate-700 hover:border-sky-500"
                    }`}
                />
              </div>
            ))}
          </div>
        </div>

        {/* CONTENUTO (Sempre a destra) */}
        <div className="flex-1">
          <div
            ref={contentRef}
            className="sticky top-10 bg-slate-800/40 border border-slate-700/50 p-6 md:p-10 rounded-3xl backdrop-blur-sm"
          >
            <span className="text-sky-400 font-mono font-bold tracking-widest">{activeExperience.year}</span>
            <h2 className="text-3xl md:text-5xl font-black text-white leading-none mt-2">{activeExperience.title}</h2>
            <p className="text-lg md:text-xl text-slate-500 mt-2">{activeExperience.company}</p>

            <div className="h-px bg-slate-700/50 my-6"></div>

            <p className="text-slate-300 text-base md:text-lg leading-relaxed">
              {activeExperience.description}
            </p>

            <div className="flex flex-wrap gap-2 mt-8">
              {activeExperience.skills.map(skill => (
                <span key={skill} className="px-3 py-1 bg-slate-950 text-slate-400 text-[10px] font-bold uppercase border border-slate-800 rounded">
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

export default App;