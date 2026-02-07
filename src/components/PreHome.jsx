// src/components/PreHome.jsx
import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import Toast from './Toast';

const PreHome = ({
  showToast,
  isLoading,
  loadingProgress,
  onConfirm,
  onDeny,
  onSkip
}) => {
  const containerRef = useRef();
  const brandingRef = useRef();

  useGSAP(() => {
    if (showToast) {
      // Appare il contenitore principale
      gsap.to(containerRef.current, {
        autoAlpha: 1,
        duration: 0.6,
        ease: 'power2.out'
      });
      // Animazione d'entrata per il branding in alto
      gsap.fromTo(brandingRef.current,
        { y: -20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, delay: 0.3, ease: "power3.out" }
      );
    } else {
      gsap.to(containerRef.current, {
        autoAlpha: 0,
        duration: 0.4,
        ease: 'power2.in',
        onComplete: () => {
          if (containerRef.current) {
            containerRef.current.style.display = 'none';
          }
        }
      });
    }
  }, [showToast]);

  if (!showToast && containerRef.current?.style.opacity === '0') {
    return null;
  }

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[200] flex items-center justify-center"
      style={{ opacity: 0 }}
    >
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: 'url(/img/pre-home/io.webp)',
          filter: 'brightness(0.7)'
        }}
      />

      {/* Overlays scuri */}
      <div className="absolute inset-0 bg-black/20" />
      <div className="absolute inset-0 bg-black/60" />

      {/* --- BRANDING IN ALTO --- */}
      <div
        ref={brandingRef}
        className="absolute top-12 left-0 w-full px-6 text-center z-10"
      >
        <p className="text-lg font-light leading-relaxed text-white tracking-wide">
          <span className="">Alessandro Cuoghi</span>
          <span className=" text-agile-sky px-3 drop-shadow-[0_0_10px_rgba(0,212,255,0.8)] ">
            — Front End Developer —
          </span>
          <span className="">Agileontheweb</span>
        </p>
      </div>

      {/* Toast - Rimane centrato esattamente dove era prima */}
      <Toast
        isVisible={showToast}
        isLoading={isLoading}
        loadingProgress={loadingProgress}
        onConfirm={onConfirm}
        onDeny={onDeny}
        onSkip={onSkip}
      />
    </div>
  );
};

export default PreHome;