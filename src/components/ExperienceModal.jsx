import { useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { HiXMark, HiOutlineCommandLine, HiOutlineGlobeAlt } from "react-icons/hi2";
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import YouTubePlayer from './YouTubePlayer';
import { useTranslation } from 'react-i18next';

const ExperienceModal = ({ experience, onClose }) => {
  const overlayRef = useRef();
  const modalRef = useRef();
  const { t } = useTranslation();

  const [showVideo, setShowVideo] = useState(false);

  useGSAP(() => {
    document.body.style.overflow = 'hidden';

    const tl = gsap.timeline({
      onComplete: () => setShowVideo(true)
    });

    tl.to(overlayRef.current, {
      autoAlpha: 1,
      duration: 0.2,
      ease: "none"
    });

    tl.fromTo(modalRef.current,
      { opacity: 0, y: 30 },
      {
        opacity: 1,
        y: 0,
        duration: 0.25,
        ease: "power2.out",
        clearProps: "transform",
        force3D: true
      },
      "-=0.1"
    );

    return () => { document.body.style.overflow = 'auto'; };
  }, []);

  const handleClose = () => {
    gsap.to(overlayRef.current, {
      autoAlpha: 0,
      duration: 0.15,
      onComplete: onClose
    });
  };

  if (!experience) return null;
  const expKey = `experiences.${experience.year}`;

  return createPortal(
    <div
      ref={overlayRef}
      className="detail-overlay bg-agile-navy/98"
      style={{ visibility: 'hidden' }}
      onClick={handleClose}
    >
      <div
        ref={modalRef}
        className="detail-modal will-change-transform"
        onClick={(e) => e.stopPropagation()}
      >
        <button onClick={handleClose} className="detail-close-btn active:scale-90 transition-transform">
          <HiXMark size={24} />
        </button>

        <div className="detail-header-compact">
          <div className="detail-meta-line">
            <span className="text-agile-sky font-bold font-mono tracking-tighter">
              {experience.year}
            </span>
            <span className="opacity-20">|</span>
            <h2 className="detail-title-inline">{t(`${expKey}.title`)}</h2>
          </div>
        </div>

        <div className="detail-content-body">
          <div className="max-w-4xl mx-auto">
            <article className="detail-rich-text">
              <p className="text-white text-lg font-medium leading-snug mb-6">
                {t(`${expKey}.description`)}
              </p>

              <div className="space-y-4 text-slate-300 font-light text-sm leading-relaxed">
                {(t(`${expKey}.fullDescription`) || "").split('\n').map((paragraph, i) => (
                  <p key={i}>{paragraph}</p>
                ))}
              </div>

              {/* Il video appare solo a fine animazione */}
              {experience.videoId && showVideo && (
                <div className="mt-6 rounded-lg overflow-hidden bg-black aspect-video">
                  <YouTubePlayer
                    videoId={experience.videoId}
                    title={t(`${expKey}.title`)}
                  />
                </div>
              )}
              {experience.videoId && !showVideo && (
                <div className="mt-6 rounded-lg bg-white/5 animate-pulse aspect-video" />
              )}
            </article>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default ExperienceModal;