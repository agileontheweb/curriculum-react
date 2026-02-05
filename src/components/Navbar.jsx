import { useRef, useState } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { TextPlugin } from 'gsap/TextPlugin';
import { HiChevronDown, HiBars3BottomRight, HiSpeakerWave, HiSpeakerXMark } from "react-icons/hi2";
import { useTranslation } from 'react-i18next';
import Sidebar from './Sidebar';
import logo from '../assets/logo-agileontheweb-gradient.svg';
import { useSoundContext, SOUNDS } from '../contexts/SoundContext';

gsap.registerPlugin(TextPlugin);

export default function Navbar({ onOpenPresentation, onOpenGithub, animationsEnabled }) {
  const { t, i18n } = useTranslation();
  const { soundEnabled, hasInteractedWithAudio, toggleSound, playSound } = useSoundContext();

  // Refs
  const textRef = useRef();
  const sidebarRef = useRef();

  // States
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const langLabels = { it: 'ITA', en: 'ENG', es: 'ESP' };
  const currentLang = i18n.language?.split('-')[0] || 'it';

  const navLinks = [
    {
      labelKey: 'navbar.presentation',
      onClick: () => onCloseMenu(() => onOpenPresentation())
    },
    {
      labelKey: 'navbar.github',
      onClick: () => onCloseMenu(() => onOpenGithub())
    },
    {
      labelKey: 'navbar.contacts',
      href: '#contatti',
      onClick: () => onCloseMenu()
    }
  ];

  useGSAP(() => {
    if (!animationsEnabled) return;

    const tl = gsap.timeline({ delay: 0.2 });
    tl.to(textRef.current, { duration: 0.6, text: "Curriculum 2026", ease: "none" })
      .to({}, { duration: 2 })
      .to(textRef.current, { duration: 0.8, text: "Agileontheweb", ease: "power2.inOut" })
      .to({}, { duration: 2 })
      .to(textRef.current, { duration: 0.8, text: "Alessandro Cuoghi", ease: "power2.inOut" });
  }, [animationsEnabled]);

  const { contextSafe } = useGSAP({ scope: sidebarRef });

  const onOpenMenu = contextSafe(() => {
    playSound(SOUNDS.CINEMATIC_FLASHBACK);

    setIsMenuOpen(true);
    const tl = gsap.timeline();
    tl.to("#sidemenu-overlay", { display: 'block', opacity: 1, duration: 0.3 })
      .to(sidebarRef.current, { x: 0, duration: 0.5, ease: "expo.out" }, "-=0.2")
      .to(".nav-link-item", {
        opacity: 1,
        x: 0,
        stagger: 0.1,
        duration: 0.4,
        ease: "power2.out"
      }, "-=0.2");
  });

  const onCloseMenu = contextSafe((callback) => {
    playSound(SOUNDS.CINEMATIC_FLASHBACK);
    const tl = gsap.timeline({
      onComplete: () => {
        setIsMenuOpen(false);
        if (callback && typeof callback === 'function') {
          callback();
        }
      }
    });
    tl.to(".nav-link-item", { opacity: 0, x: 50, duration: 0.2, stagger: 0.05 })
      .to(sidebarRef.current, { x: '100%', duration: 0.4, ease: "expo.in" })
      .to("#sidemenu-overlay", { opacity: 0, display: 'none', duration: 0.2 });
  });

  const handleLangSelect = (langCode) => {
    playSound(SOUNDS.CLICK);
    i18n.changeLanguage(langCode);
    setIsLangOpen(false);
  };

  return (
    <>
      <nav className="navbar">
        <div className="navbar-container">
          <div className="navbar-content">
            {/* ... (brand) */}
            <div className="navbar-brand flex items-center">
              <img src={logo} alt="Logo AgileOnTheWeb" className="navbar-logo" />
              <span className="navbar-title">
                <span ref={textRef}></span>
              </span>
            </div>

            {/* ACTIONS */}
            <div className="navbar-actions flex items-center gap-4">
              {hasInteractedWithAudio && (
                <button
                  onClick={() => {
                    playSound(SOUNDS.CLICK);
                    toggleSound();
                  }}
                  onMouseEnter={() => playSound(SOUNDS.HOVER)}
                  className="cursor-pointer p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-all"
                  title={soundEnabled ? "Disattiva suoni" : "Attiva suoni"}
                >
                  {soundEnabled ? (
                    <HiSpeakerWave className="w-5 h-5" />
                  ) : (
                    <HiSpeakerXMark className="w-5 h-5" />
                  )}
                </button>
              )}

              {/* Lingue */}
              <div className="language-dropdown">
                <button
                  className="language-trigger cursor-pointer"
                  onClick={() => setIsLangOpen(!isLangOpen)}
                  onMouseEnter={() => playSound(SOUNDS.HOVER)}
                >
                  <span>{langLabels[currentLang] || 'ITA'}</span>
                  <HiChevronDown className={`w-4 h-4 transition-transform duration-300 ${isLangOpen ? 'rotate-180' : ''}`} />
                </button>

                {isLangOpen && (
                  <div className="language-menu">
                    {Object.keys(langLabels).map((lang) => (
                      <button
                        key={lang}
                        className={`cursor-pointer language-option ${currentLang === lang ? 'active' : ''}`}
                        onClick={() => handleLangSelect(lang)}
                        onMouseEnter={() => playSound(SOUNDS.HOVER)}
                      >
                        {langLabels[lang]}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <button
                className="hamburger-btn cursor-pointer"
                onClick={() => {
                  playSound(SOUNDS.CLICK);
                  onOpenMenu();
                }}
                onMouseEnter={() => playSound(SOUNDS.HOVER)}
              >
                <HiBars3BottomRight className="w-8 h-8 md:w-9 md:h-9" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      <Sidebar
        ref={sidebarRef}
        onClose={onCloseMenu}
        links={navLinks}
      />
    </>
  );
}