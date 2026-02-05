import { useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { HiXMark, HiOutlineGlobeAlt, HiArrowTopRightOnSquare, HiPlayCircle } from "react-icons/hi2";
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import YouTubePlayer from './YouTubePlayer';
import { useTranslation } from 'react-i18next';
import { useSoundContext, SOUNDS } from '../contexts/SoundContext';

const ExperienceModal = ({ experience, onClose, onOpenVideo }) => {
  const overlayRef = useRef();
  const modalRef = useRef();
  const { t } = useTranslation();
  const { playSound } = useSoundContext();
  const [showVideo, setShowVideo] = useState(false);

  useGSAP(() => {
    document.body.style.overflow = 'hidden';
    playSound(SOUNDS.SWOOSH_OUT);

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
      onStart: () => playSound(SOUNDS.SWOOSH_OUT),
      onComplete: () => {
        onClose();
      }
    });
  };

  if (!experience) return null;
  const expKey = `experiences.${experience.year}`;

  const projectsList = t(`${expKey}.projectsList`, { returnObjects: true }) || [];
  const generalVideoId = t(`${expKey}.videoId`);

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
        <button onClick={handleClose}
          onMouseEnter={() => playSound(SOUNDS.HOVER)}
          className="cursor-pointer detail-close-btn active:scale-90 transition-transform">
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

              <p className="space-y-4 text-slate-300 font-light text-sm leading-relaxed mb-8">
                {t(`${expKey}.fullDescription`)}
              </p>

              {generalVideoId && showVideo && (
                <div className="mt-8 rounded-lg overflow-hidden bg-black aspect-video">
                  <YouTubePlayer videoId={generalVideoId} title={t(`${expKey}.title`)} />
                </div>
              )}
              {generalVideoId && !showVideo && (
                <div className="mt-8 rounded-lg bg-white/5 animate-pulse aspect-video" />
              )}

              {projectsList.length > 0 && (
                <div className="space-y-6">
                  <h4 className="text-agile-sky font-semibold text-base uppercase tracking-wider">Progetti Principali</h4>
                  <ul className="space-y-5">
                    {projectsList.map((project) => (
                      <li key={project.id} className="border-l border-slate-700 pl-6">
                        <div className="flex items-center justify-between mb-2">
                          <h5 className="text-white font-semibold text-base">{project.name}</h5>
                          <div className="flex items-center gap-3">
                            {project.projectUrl && (
                              <a
                                href={project.projectUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-agile-sky hover:text-white transition-colors flex items-center gap-1 text-sm"
                              >
                                <HiOutlineGlobeAlt size={16} />
                                Live
                                <HiArrowTopRightOnSquare size={14} />
                              </a>
                            )}
                            {project.videoId && (
                              <button
                                onClick={() => onOpenVideo(project.videoId, project.name)}
                                className="text-agile-sky hover:text-white transition-colors flex items-center gap-1 text-sm"
                              >
                                <HiPlayCircle size={16} />
                                Video
                              </button>
                            )}
                          </div>
                        </div>
                        <p className="text-slate-300 font-light text-sm leading-relaxed mb-3">{project.description}</p>
                      </li>
                    ))}
                  </ul>
                </div>
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