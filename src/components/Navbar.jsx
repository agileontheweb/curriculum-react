import { useRef, useState } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { TextPlugin } from 'gsap/TextPlugin';
import { HiEnvelope, HiChevronDown } from "react-icons/hi2";
import logo from '../assets/logo-agileontheweb-gradient.svg';
import { useTranslation } from 'react-i18next';
gsap.registerPlugin(TextPlugin);

export default function Navbar() {
  const { t, i18n } = useTranslation();
  const textRef = useRef();
  const [selectedLang, setSelectedLang] = useState('ITA');
  const [isLangOpen, setIsLangOpen] = useState(false);

  const langLabels = {
    it: 'ITA',
    en: 'ENG',
    es: 'ESP'
  };

  useGSAP(() => {
    const tl = gsap.timeline({
      delay: 0.5,
      repeat: -1,
      repeatDelay: 2
    });

    tl.to(textRef.current, {
      duration: 1.5,
      text: "Alessandro Cuoghi",
      ease: "none",
    })
      .to({}, { duration: 2 })
      .to(textRef.current, {
        duration: 1,
        text: "Agileontheweb",
        ease: "power2.inOut",
      })
      .to({}, { duration: 2 })
      .to(textRef.current, {
        duration: 1,
        text: "Curriculum 2026",
        ease: "power2.inOut",
      })
      .to({}, { duration: 2 })
      .to(textRef.current, {
        duration: 1.2,
        text: "Alessandro Cuoghi",
        ease: "power2.inOut",
      })
      .to({}, { duration: 3 });

  }, []);

  const handleLangSelect = (langCode) => {
    i18n.changeLanguage(langCode);
    setIsLangOpen(false);
  };
  const currentLang = i18n.language?.split('-')[0] || 'it';

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-content">

          <div className="navbar-brand flex items-center">
            <img src={logo} alt="Logo AgileOnTheWeb" className="navbar-logo" />
            <span className="navbar-title">
              <span ref={textRef}></span>
            </span>
          </div>

          <div className="navbar-actions">
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
                  <button className="language-option" onClick={() => handleLangSelect('it')}>ITA</button>
                  <button className="language-option" onClick={() => handleLangSelect('en')}>ENG</button>
                  <button className="language-option" onClick={() => handleLangSelect('es')}>ESP</button>
                </div>
              )}
            </div>
            <button className="navbar-cta hidden md:flex">
              <HiEnvelope className="w-5 h-5" />
            </button>
          </div>

        </div>
      </div>
    </nav>
  );
}