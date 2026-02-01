import { forwardRef, useImperativeHandle, useRef } from 'react';
import { HiXMark } from "react-icons/hi2";
import { useTranslation } from 'react-i18next';
import gsap from 'gsap';
import YouTubePlayer from './YouTubePlayer';

const Presentation = forwardRef((props, ref) => {
  const { t } = useTranslation();
  const containerRef = useRef();
  const contentRef = useRef();
  const closeBtnRef = useRef();

  useImperativeHandle(ref, () => ({
    open() {
      const tl = gsap.timeline();
      tl.set(containerRef.current, { width: 0, visibility: 'visible' })
        .to(containerRef.current, {
          width: '100%',
          duration: 0.8,
          ease: "expo.inOut"
        })
        .to([contentRef.current, closeBtnRef.current], {
          opacity: 1,
          y: 0,
          duration: 0.5,
          stagger: 0.1
        }, "-=0.2");
    },
    close() {
      const tl = gsap.timeline();
      tl.to([contentRef.current, closeBtnRef.current], { opacity: 0, y: 10, duration: 0.3 })
        .to(containerRef.current, {
          left: '100%',
          duration: 0.7,
          ease: "expo.in",
          onComplete: () => {
            gsap.set(containerRef.current, { left: 0, width: 0, visibility: 'hidden' });
          }
        });
    }
  }));

  return (
    <div ref={containerRef} className="presentation-wrapper">
      <button
        ref={closeBtnRef}
        className="presentation-close"
        onClick={() => ref.current.close()}
      >
        <HiXMark className="w-8 h-8 md:w-10 md:h-10" />
      </button>

      <div ref={contentRef} className="presentation-content overflow-y-auto">
        {/* Titolo sempre in alto */}
        <h2 className="text-4xl md:text-6xl font-bold mb-8 text-agile-navy">
          {t('presentation.title')}
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">

          {/* COLONNA TESTI */}
          <div className="flex flex-col space-y-8 order-1">
            {/* 1. About Me */}
            <div className="text-lg text-slate-700 leading-relaxed">
              <p>{t('presentation.about_me')}</p>
            </div>

            {/* 2. VIDEO (Visibile SOLO in mobile tra il testo e la filosofia) */}
            <div className="lg:hidden w-full aspect-video rounded-2xl overflow-hidden shadow-xl bg-black">
              <YouTubePlayer videoId={t('presentation.videoId')} />
            </div>

            {/* 3. Filosofia */}
            <div className="bg-slate-50 p-6 rounded-xl border-l-4 border-agile-sky shadow-sm">
              <h3 className="text-sm font-bold uppercase tracking-widest text-agile-sky mb-2">
                {t('presentation.philosophy_title')}
              </h3>
              <p className="italic text-slate-600">
                "{t('presentation.philosophy')}"
              </p>
            </div>

            {/* 4. Extra Text (Aggiungilo nel tuo it.json) */}
            <div className="text-lg text-slate-700 leading-relaxed">
              <p>{t('presentation.extra_text')}</p>
            </div>

            {/* 5. Tech Stack */}
            <div className="pt-4 text-sm text-slate-400 font-medium border-t border-slate-100">
              {t('presentation.tech_title')}: React • GSAP • Tailwind • Vite
            </div>
          </div>

          {/* COLONNA VIDEO (Visibile SOLO in desktop a destra) */}
          <div className="hidden lg:block lg:sticky lg:top-8 w-full aspect-video rounded-3xl overflow-hidden shadow-2xl bg-black">
            <YouTubePlayer videoId={t('presentation.videoId')} />
          </div>

        </div>
      </div>
    </div>
  );
});

Presentation.displayName = 'Presentation';
export default Presentation;