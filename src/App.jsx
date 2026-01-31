import { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

function App() {
  const boxRef = useRef(); // Il riferimento all'elemento DOM
  const containerRef = useRef(); // Il riferimento al contenitore (opzionale ma consigliato)

  // Questo è l'hook ufficiale per React
  useGSAP(() => {
    // Animazione semplice: ruota e sposta verso destra
    gsap.to(boxRef.current, {
      x: 200,
      rotation: 360,
      duration: 2,
      repeat: -1,
      yoyo: true,
      ease: "power1.inOut"
    });
  }, { scope: containerRef }); // 'scope' limita la ricerca dei selettori a questo contenitore

  return (
    <div ref={containerRef} className="min-h-screen bg-slate-900 flex flex-col items-center justify-center gap-8">
      <h1 className="text-white text-3xl font-bold">Test GSAP + React</h1>

      {/* Il nostro quadrato da animare */}
      <div
        ref={boxRef}
        className="w-24 h-24 bg-sky-400 rounded-xl shadow-lg flex items-center justify-center text-slate-900 font-bold"
      >
        GSAP
      </div>

      <p className="text-slate-400">Se il quadrato gira e si muove, siamo pronti!</p>
    </div>
  );
}

export default App;