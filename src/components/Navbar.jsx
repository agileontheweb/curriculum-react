import { useRef, useState } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { TextPlugin } from 'gsap/TextPlugin';
import { HiChevronDown, HiBars3BottomRight } from "react-icons/hi2";
import { useTranslation } from 'react-i18next';
import Sidebar from './Sidebar';
import logo from '../assets/logo-agileontheweb-gradient.svg';

gsap.registerPlugin(TextPlugin);

export default function Navbar({ onOpenPresentation }) {
  const { t, i18n } = useTranslation();

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
      onClick: () => onCloseMenu(() => onOpenPresentation()) // Chiude e poi apre
    },
    {
      labelKey: 'navbar.github',
      href: '#curriculum',
      onClick: () => onCloseMenu()
    },
    {
      labelKey: 'navbar.contacts',
      href: '#contatti',
      onClick: () => onCloseMenu()
    }
  ];

  useGSAP(() => {
    const tl = gsap.timeline({ delay: 0.2 });
    tl.to(textRef.current, { duration: 0.6, text: "Curriculum 2026", ease: "none" })
      .to({}, { duration: 2 })
      .to(textRef.current, { duration: 0.8, text: "Agileontheweb", ease: "power2.inOut" })
      .to({}, { duration: 2 })
      .to(textRef.current, { duration: 0.8, text: "Alessandro Cuoghi", ease: "power2.inOut" });
  }, []);

  const { contextSafe } = useGSAP({ scope: sidebarRef });

  const onOpenMenu = contextSafe(() => {
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
    i18n.changeLanguage(langCode);
    setIsLangOpen(false);
  };

  return (
    <>
      <nav className="navbar">
        <div className="navbar-container">
          <div className="navbar-content">

            {/* BRAND */}
            <div className="navbar-brand flex items-center">
              <img src={logo} alt="Logo AgileOnTheWeb" className="navbar-logo" />
              <span className="navbar-title">
                <span ref={textRef}></span>
              </span>
            </div>

            {/* ACTIONS */}
            <div className="navbar-actions">
              {/* Lingue */}
              <div className="language-dropdown">
                <button
                  className="language-trigger"
                  onClick={() => setIsLangOpen(!isLangOpen)}
                >
                  <span>{langLabels[currentLang] || 'ITA'}</span>
                  <HiChevronDown className={`w-4 h-4 transition-transform duration-300 ${isLangOpen ? 'rotate-180' : ''}`} />
                </button>

                {isLangOpen && (
                  <div className="language-menu">
                    {Object.keys(langLabels).map((lang) => (
                      <button
                        key={lang}
                        className={`language-option ${currentLang === lang ? 'active' : ''}`}
                        onClick={() => handleLangSelect(lang)}
                      >
                        {langLabels[lang]}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <button className="hamburger-btn" onClick={onOpenMenu}>
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