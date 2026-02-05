// src/components/InteractionToast.jsx
import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';

const InteractionToast = ({ isVisible, onConfirm, onDeny }) => {
  const containerRef = useRef();

  useGSAP(() => {
    const tl = gsap.timeline();

    if (isVisible) {
      tl.set(containerRef.current, { display: 'flex', autoAlpha: 0, y: 50 })
        .to(containerRef.current, {
          autoAlpha: 1,
          y: 0,
          duration: 0.6,
          ease: 'back.out(1.7)'
        });
    } else {
      tl.to(containerRef.current, { autoAlpha: 0, y: 20, duration: 0.3 })
        .set(containerRef.current, { display: 'none' });
    }
  }, [isVisible]);


  return (
    <div ref={containerRef} className="toast-container">
      <p className="toast-text">
        Benvenuti su Agileontheweb Studio:
        Vuoi abilitare l'audio e gli effetti sonori?
      </p>

      <div className="toast-actions">
        <button onClick={onConfirm} className="btn-toast-confirm cursor-pointer">
          SÌ
        </button>
        <button onClick={onDeny} className="btn-toast-deny cursor-pointer">
          NO
        </button>
      </div>
    </div>
  );
};

export default InteractionToast;