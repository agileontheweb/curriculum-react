import { useRef, useState } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { TextPlugin } from 'gsap/TextPlugin';
import { HiEnvelope, HiChevronDown } from "react-icons/hi2";
import logo from '../assets/logo-agileontheweb-gradient.svg';

gsap.registerPlugin(TextPlugin);

export default function Navbar() {
  const textRef = useRef();
  const [selectedLang, setSelectedLang] = useState('ITA');
  const [isLangOpen, setIsLangOpen] = useState(false);

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

  const handleLangSelect = (lang) => {
    setSelectedLang(lang);
    setIsLangOpen(false);
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-content">
          <div className="navbar-brand">
            <img src={logo} alt="Logo AgileOnTheWeb" className="navbar-logo" />
            <span className="navbar-title">
              <span ref={textRef}></span>
            </span>
          </div>
          <div className="navbar-actions">
            {/* Dropdown Lingua */}
            <div className="language-dropdown">
              <button
                className="language-trigger"
                onClick={() => setIsLangOpen(!isLangOpen)}
              >
                <span>{selectedLang}</span>
                <HiChevronDown className={`w-4 h-4 transition-transform duration-300 ${isLangOpen ? 'rotate-180' : ''}`} />
              </button>

              {isLangOpen && (
                <div className="language-menu">
                  <button
                    className={`language-option ${selectedLang === 'ITA' ? 'active' : ''}`}
                    onClick={() => handleLangSelect('ITA')}
                  >
                    ITA
                  </button>
                  <button
                    className={`language-option ${selectedLang === 'ENG' ? 'active' : ''}`}
                    onClick={() => handleLangSelect('ENG')}
                  >
                    ENG
                  </button>
                  <button
                    className={`language-option ${selectedLang === 'ESP' ? 'active' : ''}`}
                    onClick={() => handleLangSelect('ESP')}
                  >
                    ESP
                  </button>
                </div>
              )}
            </div>

            <button className="navbar-cta">
              <HiEnvelope className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}