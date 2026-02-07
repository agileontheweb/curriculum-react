// src/components/Toast.jsx
import { useRef, useMemo } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';

const Toast = ({ isVisible, isLoading, loadingProgress, onConfirm, onDeny, onSkip }) => {
  const containerRef = useRef();
  const progressBarRef = useRef();
  const textRef = useRef();

  // Nuova sequenza di testi focalizzata sull'esperienza
  const loadingText = useMemo(() => {
    if (loadingProgress < 16) return "Caricamento risorse creative";
    if (loadingProgress < 32) return "Rendering interfaccia adattiva";
    if (loadingProgress < 48) return "Configurazione ambiente interattivo";
    if (loadingProgress < 64) return "Ottimizzazione asset grafici";
    if (loadingProgress < 85) return "Pronti per l'esperienza"; // Più spazio per leggere
    return "Buona navigazione"; // Messaggio finale (85% - 100%)
  }, [loadingProgress]);

  useGSAP(() => {
    if (isVisible) {
      gsap.set(containerRef.current, { display: 'flex', autoAlpha: 0, y: 50 });
      gsap.to(containerRef.current, { autoAlpha: 1, y: 0, duration: 0.6, ease: 'back.out(1.7)' });
    } else {
      gsap.to(containerRef.current, { autoAlpha: 0, y: 20, duration: 0.3, onComplete: () => gsap.set(containerRef.current, { display: 'none' }) });
    }
  }, [isVisible]);

  useGSAP(() => {
    if (isLoading) {
      gsap.fromTo(textRef.current,
        { opacity: 0, y: 10, filter: "blur(6px)" },
        { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.5, ease: "power2.out" }
      );
    }
  }, [loadingText, isLoading]);

  return (
    <div ref={containerRef} className="toast-container flex flex-col items-center text-center p-10">
      {!isLoading ? (
        <>
          {/* Testo iniziale con la tua nuova struttura */}
          <p className="toast-text text-lg leading-relaxed text-center">
            <span className="block italic">Vuoi abilitare gli effetti sonori?</span>
          </p>

          <div className="toast-actions">
            <button onClick={onConfirm} className="btn-toast-confirm cursor-pointer">SÌ</button>
            <button onClick={onDeny} className="btn-toast-deny cursor-pointer">NO</button>
            <button onClick={onSkip} className="btn-toast-deny cursor-pointer">SKIP</button>

          </div>
        </>
      ) : (
        <div className="w-full flex flex-col items-center">
          <div className="h-20 flex items-center justify-center mb-8">
            <h2 ref={textRef} className="text-2xl md:text-3xl font-black tracking-tighter text-white uppercase italic">
              {loadingText}
            </h2>
          </div>

          {/* Progress Bar originale */}
          <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden max-w-md">
            <div
              ref={progressBarRef}
              className="h-full bg-gradient-to-r from-blue-500 to-purple-500 origin-left transition-transform duration-150 ease-linear"
              style={{ transform: `scaleX(${loadingProgress / 100})` }}
            />
          </div>

          <p className="toast-text mt-4 text-[10px] opacity-50 tracking-[0.3em] uppercase font-mono">
            Setup Status — {Math.round(loadingProgress)}%
          </p>
        </div>
      )
      }
    </div >
  );
};

export default Toast;