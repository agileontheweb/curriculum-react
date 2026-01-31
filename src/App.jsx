import { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { experiences } from './data';

function App() {
  const boxRef = useRef();
  const containerRef = useRef();

  useGSAP(() => {
    // Sostituito rotation con scale per un effetto zoom più leggibile
    gsap.to(boxRef.current, {
      scale: 1.2,
      opacity: 0.8,
      duration: 1.5,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut"
    });
  }, { scope: containerRef });

  return (
    <div ref={containerRef} className="min-h-screen bg-slate-900 text-white p-10 flex flex-col items-center">

      {/* SEZIONE TEST GSAP - ORA CON ZOOM */}
      <div className="mb-20 text-center">
        <h1 className="text-xl font-light mb-6 uppercase tracking-widest text-slate-500">GSAP Status Check</h1>
        <div
          ref={boxRef}
          className="w-20 h-20 bg-sky-500 rounded-2xl flex items-center justify-center text-white font-black shadow-[0_0_20px_rgba(14,165,233,0.3)] mx-auto"
        >
          OK
        </div>
      </div>

      {/* SEZIONE VISUALIZZAZIONE DATI */}
      <div className="w-full max-w-2xl">
        <h2 className="text-3xl font-bold mb-8 text-sky-400 border-b border-slate-800 pb-4">
          Dataset Loaded
        </h2>

        <div className="flex flex-col gap-6">
          {experiences.map((exp) => (
            <div key={exp.id} className="bg-slate-800/40 p-6 rounded-xl border border-slate-700/50 backdrop-blur-sm">
              <div className="flex justify-between items-baseline mb-3">
                <h3 className="text-xl font-bold text-slate-100">{exp.title}</h3>
                <span className="text-sky-400 font-mono text-sm">{exp.year}</span>
              </div>
              <p className="text-slate-400 text-sm leading-relaxed mb-4">{exp.description}</p>

              <div className="flex flex-wrap gap-2">
                {exp.skills.map(skill => (
                  <span key={skill} className="text-[10px] uppercase tracking-wider bg-slate-900 text-slate-400 px-2 py-1 rounded border border-slate-700">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;