// src/components/PreHome.jsx
import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import Toast from './Toast';
import MosaicImage from './MosaicImage';

const PreHome = ({
  showToast,
  isLoading,
  loadingProgress,
  onConfirm,
  onDeny,
  onSkip,
  onStartScroll,
  onExitComplete
}) => {
  const containerRef = useRef();
  const logoRef = useRef();
  const nameRef = useRef();
  const roleRef = useRef();
  const toastWrapperRef = useRef();

  const splitLettersWithMask = (text) => {
    return text.split("").map((char, i) => (
      <span key={i} className="inline-block overflow-hidden align-bottom">
        <span className="letter inline-block translate-y-full">
          {char === " " ? "\u00A0" : char}
        </span>
      </span>
    ));
  };


  useGSAP(() => {
    if (showToast) {
      const tl = gsap.timeline();
      const polygons = logoRef.current.querySelectorAll('polygon');
      tl.to(containerRef.current, { autoAlpha: 1, duration: 0.1 });

      const logoRect = logoRef.current.getBoundingClientRect();
      const centerY = window.innerHeight / 2 - logoRect.top - (logoRect.height / 2);

      tl.fromTo(polygons[2], { y: 250, opacity: 0, scale: 0.5 }, { y: 0, opacity: 1, scale: 1, duration: 0.7, ease: "expo.out" }, "+=0.8");
      tl.fromTo([polygons[0], polygons[1]], { opacity: 0, scale: 0.8, filter: 'blur(5px)' }, { opacity: 1, scale: 1, filter: 'blur(0px)', duration: 0.6, stagger: 0.15, ease: "power4.out" }, "-=0.3");
      tl.to(nameRef.current.querySelectorAll('.letter'), { y: 0, duration: 0.7, stagger: 0.02, ease: "power3.out" }, "-=0.4");
      tl.to(roleRef.current.querySelectorAll('.letter, .separator'), { y: 0, duration: 0.7, stagger: 0.01, ease: "power3.out" }, "-=0.5");
      tl.fromTo(toastWrapperRef.current, { y: 15, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, ease: "power2.out" }, "-=0.2");
    } else {
      const tlOut = gsap.timeline({
        onStart: () => {
          // ✅ Appena inizia l'animazione di uscita, avvisa App di mostrare il contenuto
          onStartScroll?.();
        }
      });


      // 1. Facciamo sparire i testi velocemente
      tlOut.to([logoRef.current, nameRef.current, roleRef.current, toastWrapperRef.current], {
        autoAlpha: 0,
        y: -20,
        duration: 0.4,
        ease: "power2.in"
      });

      // 2. IMPORTANTISSIMO: Rendi trasparente lo sfondo del contenitore PreHome
      // così vediamo attraverso i buchi del mosaico.
      tlOut.to(containerRef.current, {
        backgroundColor: "transparent",
        duration: 0.2
      }, 0);
    }
  }, [showToast]);
  return (
    <div ref={containerRef} className="fixed inset-0 z-[200] bg-black" style={{ opacity: 0 }}>
      <div className="absolute inset-0 z-0 overflow-hidden">
        <MosaicImage
          imagePath="/img/pre-home/io.webp"
          isExiting={!showToast}
          onComplete={onExitComplete} />
      </div>
      <div
        className="absolute inset-0 bg-black/65 z-[1] transition-opacity duration-500"
        style={{ opacity: showToast ? 1 : 0 }}
      />
      <div className="absolute top-28 left-0 w-full px-6 flex flex-col items-center z-10 text-center">

        {/* LOGO - Dimensioni ridotte (8x8 -> 10x10) */}
        <div className="mb-6 w-8 h-8 md:w-10 md:h-10 opacity-90">
          <svg
            ref={logoRef}
            viewBox="0 0 161.43 139.8"
            className="w-full h-full drop-shadow-[0_0_10px_rgba(255,255,255,0.1)]"
          >
            <defs>
              <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style={{ stopColor: '#ffffff', stopOpacity: 1 }} />
                <stop offset="100%" style={{ stopColor: '#d1d5db', stopOpacity: 1 }} />
              </linearGradient>
            </defs>
            <g>
              <polygon fill="url(#logoGradient)" points="80.71,62.96 80.71,0 161.43,139.8 125.08,139.8" style={{ opacity: 0 }} />
              <polygon fill="url(#logoGradient)" points="36.35,139.8 0,139.8 80.71,0 80.71,62.96" style={{ opacity: 0 }} />
              <polygon fill="url(#logoGradient)" points="80.71,110.35 63.71,139.8 80.71,139.8 97.72,139.8" style={{ opacity: 0 }} />
            </g>
          </svg>
        </div>

        {/* NOME - Font ridotto e tracking aumentato */}
        <h1 ref={nameRef} className="text-base md:text-lg font-light text-white/90 tracking-[0.4em] uppercase mb-2">
          {splitLettersWithMask("Alessandro Cuoghi")}
        </h1>

        {/* RUOLO / STUDIO - Ancora più fine */}
        <h2 ref={roleRef} className="flex items-center justify-center flex-wrap">
          <span className="text-agile-sky text-[9px] md:text-[10px] tracking-[0.3em] uppercase font-bold drop-shadow-[0_0_5px_rgba(0,212,255,0.3)]">
            {splitLettersWithMask("Front End Developer")}
          </span>
          <span className="separator inline-block overflow-hidden mx-3">
            <span className="letter inline-block translate-y-full text-white/20 text-[9px] md:text-[10px]">/</span>
          </span>
          <span className="text-white/40 text-[9px] md:text-[10px] tracking-[0.3em] uppercase font-medium">
            {splitLettersWithMask("Agileontheweb Studio 2026")}
          </span>
        </h2>
      </div>

      <div ref={toastWrapperRef} className="absolute bottom-12 left-0 w-full flex justify-center z-20" style={{ opacity: 0 }}>
        <div className="w-full max-w-xs px-6">
          <Toast isVisible={showToast} isLoading={isLoading} loadingProgress={loadingProgress} onConfirm={onConfirm} onDeny={onDeny} onSkip={onSkip} />
        </div>
      </div>
    </div>
  );
};

export default PreHome;