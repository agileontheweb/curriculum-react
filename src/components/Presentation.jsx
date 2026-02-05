import { forwardRef, useImperativeHandle, useRef } from 'react';
import { HiXMark } from "react-icons/hi2";
import { useTranslation } from 'react-i18next';
import { useSoundContext } from '../contexts/SoundContext';
import gsap from 'gsap';
import YouTubePlayer from './YouTubePlayer';

const Presentation = forwardRef((props, ref) => {
  const { t } = useTranslation();
  const { setPresentationMode } = useSoundContext(); // 2. Estrai la funzione
  const containerRef = useRef();
  const contentRef = useRef();
  const closeBtnRef = useRef();

  useImperativeHandle(ref, () => ({
    open() {
      setPresentationMode(true); // 3. Attiva la modalità presentazione (crossfade)

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
      setPresentationMode(false); // 4. Disattiva la modalità presentazione (crossfade inverso)

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

        {/* Titolo sezione */}
        <div className="text-center mb-8">
          <p className="text-sm md:text-base uppercase tracking-widest text-slate-400 font-semibold">
            Presentazione
          </p>
        </div>

        {/* Header - Nome e Titolo */}
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-5xl font-extrabold text-agile-navy mb-4">
            Alessandro Cuoghi
          </h1>
          <div className="flex flex-col md:flex-row items-center justify-center gap-2 md:gap-4 text-lg md:text-xl">
            <p className="text-slate-500 font-light">
              alias <span className="text-agile-sky font-semibold">AgileOnTheWeb</span>
            </p>
            <span className="hidden md:inline text-slate-300">|</span>
            <p className="text-agile-sky font-bold">
              {t('presentation.title')}
            </p>
          </div>
        </div>

        {/* Intro breve (primo paragrafo) */}
        <div className="max-w-3xl mx-auto mb-12 text-center">
          <p className="text-lg md:text-xl text-slate-700 leading-relaxed">
            {t('presentation.intro')}
          </p>
        </div>

        {/* Video */}
        <div className="max-w-4xl mx-auto mb-16">
          <div className="w-full aspect-video rounded-2xl overflow-hidden shadow-2xl bg-black">
            <YouTubePlayer videoId={t('presentation.videoId')} />
          </div>
        </div>

        {/* Intro Extended (dopo il video) */}
        <div className="max-w-3xl mx-auto mb-12 text-base md:text-lg text-slate-700 leading-relaxed space-y-4">
          {t('presentation.intro_extended').split('\n\n').map((paragraph, i) => (
            <p key={i}>{paragraph}</p>
          ))}
        </div>

        {/* AI Evolution Section */}
        <div className="max-w-3xl mx-auto mb-12">
          <h3 className="text-xl md:text-2xl font-bold text-agile-navy mb-6">
            {t('presentation.ai_evolution_title')}
          </h3>
          <div className="text-base md:text-lg text-slate-700 leading-relaxed space-y-4">
            {t('presentation.ai_evolution').split('\n\n').map((paragraph, i) => (
              <p key={i}>{paragraph}</p>
            ))}
          </div>
        </div>

        {/* Il Mio Percorso */}
        <div className="max-w-3xl mx-auto mb-12">
          <h3 className="text-2xl md:text-3xl font-bold text-agile-navy mb-6 text-center">
            {t('presentation.about_me_title')}
          </h3>
          <div className="text-base md:text-lg text-slate-700 leading-relaxed space-y-4">
            {t('presentation.about_me').split('\n\n').map((paragraph, i) => (
              <p key={i}>{paragraph}</p>
            ))}
          </div>
        </div>


        {/* Filosofia */}
        <div className="max-w-3xl mx-auto mb-12">
          <div className="bg-slate-50 p-8 rounded-2xl border-l-4 border-agile-sky shadow-md">
            <h3 className="text-lg font-bold uppercase tracking-widest text-agile-sky mb-4">
              {t('presentation.philosophy_title')}
            </h3>
            <div className="text-slate-600 leading-relaxed space-y-3">
              {t('presentation.philosophy').split('\n\n').map((paragraph, i) => (
                <p key={i}>{paragraph}</p>
              ))}
            </div>
          </div>
        </div>

        {/* Metodologia e Valori */}
        <div className="max-w-3xl mx-auto mb-12">
          <div className="text-base md:text-lg text-slate-700 leading-relaxed space-y-4">
            {t('presentation.extra_text').split('\n\n').map((paragraph, i) => (
              <p key={i}>{paragraph}</p>
            ))}
          </div>
        </div>

        {/* Tech Stack */}
        <div className="max-w-3xl mx-auto pt-8 border-t border-slate-200">
          <h4 className="text-lg font-bold uppercase tracking-widest text-agile-sky mb-4 text-center">
            {t('presentation.tech_title')}
          </h4>
          <p className="text-sm md:text-base text-slate-600 leading-relaxed text-center">
            {t('presentation.tech_stack')}
          </p>
        </div>

      </div>
    </div>
  );
});

Presentation.displayName = 'Presentation';
export default Presentation;