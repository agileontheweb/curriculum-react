// src/components/Toast.jsx
import { useRef, useMemo } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';

const Toast = ({ isVisible, isLoading, loadingProgress, onConfirm, onDeny, onSkip }) => {
  const containerRef = useRef();
  const textRef = useRef();

  const loadingText = useMemo(() => {
    if (loadingProgress < 20) return "Risorse creative";
    if (loadingProgress < 45) return "Interfaccia adattiva";
    if (loadingProgress < 70) return "Asset grafici";
    if (loadingProgress < 90) return "Esperienza pronta";
    return "Benvenuto";
  }, [loadingProgress]);

  // Animazione d'entrata del container (molto fluida)
  useGSAP(() => {
    if (isVisible) {
      gsap.fromTo(containerRef.current,
        { autoAlpha: 0, y: 30 },
        { autoAlpha: 1, y: 0, duration: 1, ease: 'power4.out', delay: 0.5 }
      );
    }
  }, [isVisible]);

  // Effetto "glitch/fade" al cambio del testo di caricamento
  useGSAP(() => {
    if (isLoading) {
      gsap.fromTo(textRef.current,
        { opacity: 0, x: -5, filter: "blur(4px)" },
        { opacity: 1, x: 0, filter: "blur(0px)", duration: 0.4, ease: "power2.out" }
      );
    }
  }, [loadingText, isLoading]);

  return (
    <div ref={containerRef} className="w-full flex flex-col items-center">
      {!isLoading ? (
        <div className="flex flex-col items-center gap-6 w-full">
          {/* Testo su riga singola con tracking coerente */}
          <p className="text-white/60 text-[10px] md:text-xs tracking-[0.3em] uppercase font-light whitespace-nowrap">
            Vuoi abilitare gli effetti sonori?
          </p>

          {/* Pulsanti con larghezza fissa per simmetria */}
          <div className="flex items-center justify-center gap-4 w-full">
            <button
              onClick={onConfirm}
              className="w-24 py-2 text-[10px] tracking-[0.2em] text-agile-sky border border-agile-sky/30 hover:bg-agile-sky hover:text-black transition-all duration-300 ease-out"
            >
              SÌ
            </button>
            <button
              onClick={onDeny}
              className="w-24 py-2 text-[10px] tracking-[0.2em] text-white/40 border border-white/10 hover:border-white/40 hover:text-white transition-all duration-300"
            >
              NO
            </button>
            <button
              onClick={onSkip}
              className="text-[9px] tracking-[0.2em] text-white/20 hover:text-white/60 transition-colors uppercase px-2"
            >
              Skip
            </button>
          </div>
        </div>
      ) : (
        <div className="w-full flex flex-col items-center max-w-[280px]">
          {/* Label di caricamento */}
          <div className="flex justify-between w-full mb-3 px-1">
            <span ref={textRef} className="text-[10px] text-white/70 tracking-[0.2em] uppercase font-light">
              {loadingText}
            </span>
            <span className="text-[10px] text-agile-sky font-mono tabular-nums">
              {Math.round(loadingProgress)}%
            </span>
          </div>

          {/* Progress Bar Sottilissima (High-tech) */}
          <div className="w-full h-[1px] bg-white/10 relative overflow-hidden">
            <div
              className="absolute inset-0 bg-agile-sky origin-left transition-transform duration-300 ease-out shadow-[0_0_8px_rgba(0,212,255,0.8)]"
              style={{ transform: `scaleX(${loadingProgress / 100})` }}
            />
          </div>

          <span className="mt-4 text-[8px] text-white/20 tracking-[0.5em] uppercase">
            System Initializing
          </span>
        </div>
      )
      }
    </div >
  );
};

export default Toast;