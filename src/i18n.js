import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import itTranslation from './locales/it.json';
import enTranslation from './locales/en.json';
import esTranslation from './locales/es.json';

const resources = {
  it: {
    translation: itTranslation
  },
  en: {
    translation: enTranslation
  },
  es: {
    translation: esTranslation
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'it',
    debug: true,
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;