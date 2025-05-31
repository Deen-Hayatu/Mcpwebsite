import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Import translation files
import enTranslations from './locales/en.json';
import frTranslations from './locales/fr.json';
import haTranslations from './locales/ha.json';
import twTranslations from './locales/tw.json';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: 'en',
    debug: process.env.NODE_ENV === 'development',
    
    // Languages we support
    supportedLngs: ['en', 'fr', 'ha', 'tw'],
    
    interpolation: {
      escapeValue: false, // React already does escaping
    },

    // Load translations
    resources: {
      en: {
        translation: enTranslations
      },
      fr: {
        translation: frTranslations
      },
      ha: {
        translation: haTranslations
      },
      tw: {
        translation: twTranslations
      }
    },

    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage'],
    }
  });

export default i18n;