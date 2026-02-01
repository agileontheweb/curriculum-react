import { useRef } from 'react';
import { createPortal } from 'react-dom';
import { HiXMark, HiOutlineCommandLine, HiOutlineGlobeAlt } from "react-icons/hi2";
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import YouTubePlayer from './YouTubePlayer';
// 1. Importa useTranslation
import { useTranslation } from 'react-i18next';

const ExperienceModal = ({ experience, onClose }) => {
  const overlayRef = useRef();
  const modalRef = useRef();
  // 2. Inizializza la traduzione
  const { t } = useTranslation();

  useGSAP(() => {
    const tl = gsap.timeline();
    tl.fromTo(overlayRef.current,
      { autoAlpha: 0, backdropFilter: "blur(0px)" },
      { autoAlpha: 1, backdropFilter: "blur(16px)", duration: 0.4 }
    );
    tl.fromTo(modalRef.current,
      { scale: 0.95, opacity: 0, y: 30 },
      { scale: 1, opacity: 1, y: 0, duration: 0.5, ease: "power3.out" },
      "-=0.2"
    );
    return () => { document.body.style.overflow = 'auto'; };
  }, []);

  const handleClose = () => {
    gsap.to(overlayRef.current, {
      autoAlpha: 0,
      duration: 0.3,
      onComplete: onClose
    });
  };

  if (!experience) return null;

  // 3. Scorciatoia per la chiave i18n
  const expKey = `experiences.${experience.year}`;

  return createPortal(
    <div ref={overlayRef} className="detail-overlay" onClick={handleClose}>
      <div ref={modalRef} className="detail-modal" onClick={(e) => e.stopPropagation()}>

        <button onClick={handleClose} className="detail-close-btn">
          <HiXMark size={24} />
        </button>

        <div className="detail-header-compact">
          <div className="detail-meta-line">
            <span className="text-agile-sky font-bold font-mono tracking-tighter">
              {experience.year}
            </span>
            <span className="opacity-20">|</span>
            {/* TRADOTTO */}
            <h2 className="detail-title-inline">{t(`${expKey}.title`)}</h2>
            <span className="opacity-20">|</span>
            {/* DA DATA.JS (FISSO) */}
            <span className="italic font-light text-slate-400">{experience.company}</span>
          </div>

          <div className="detail-stack-line">
            <span className="detail-section-label !mb-0 mr-2 flex items-center gap-1">
              <HiOutlineCommandLine className="text-agile-sky" /> {t('common.technologies')}:
            </span>
            <div className="flex flex-wrap gap-x-3 gap-y-1">
              {experience.skills.map((skill, i) => (
                <span key={skill} className="flex items-center gap-2 text-slate-300">
                  {skill}
                  {i < experience.skills.length - 1 && <span className="opacity-20 text-white">•</span>}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="detail-content-body">
          <div className="max-w-4xl mx-auto">
            <article className="detail-rich-text">
              <span className="detail-section-label">Overview</span>

              {/* DESCRIZIONE BREVE TRADOTTA */}
              <p className="text-white text-xl md:text-2xl font-medium leading-snug mb-6">
                {t(`${expKey}.description`)}
              </p>

              <div className="space-y-4 text-slate-300 font-light leading-relaxed">
                {/* DESCRIZIONE LUNGA TRADOTTA (gestendo i paragrafi) */}
                {(t(`${expKey}.fullDescription`) || "").split('\n').map((paragraph, i) => (
                  <p key={i}>{paragraph}</p>
                ))}
              </div>

              {experience.videoId && (
                <YouTubePlayer
                  videoId={experience.videoId}
                  title={t(`${expKey}.title`)}
                />
              )}

              {experience.projectUrl && (
                <div className="pt-10 pb-4">
                  <a
                    href={experience.projectUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-3 px-8 py-4 bg-agile-sky text-white rounded-xl font-bold hover:brightness-110 hover:translate-y--1 transition-all shadow-lg shadow-agile-sky/20"
                  >
                    <HiOutlineGlobeAlt size={22} />
                    {t('common.view_project')}
                  </a>
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