import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';


const resources = {
  it: {
    translation: {
      navbar: { home: "Home", experiences: "Esperienze", contacts: "Contatti" },
      common: { close: "Chiudi", view: "Vedi Progetto" },
      experiences: {}
    }
  },
  en: {
    translation: {
      navbar: { home: "Home", experiences: "Experiences", contacts: "Contact" },
      common: { close: "Close", view: "View Project" },
      experiences: {}
    }
  },
  es: {
    translation: {
      navbar: { home: "Inicio", experiences: "Experiencias", contacts: "Contacto" },
      common: { close: "Cerrar", view: "Ver Proyecto" },
      experiences: {}
    }
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'it',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;