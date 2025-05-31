import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Import translation files
import enTranslations from './locales/en.json';
import frTranslations from './locales/fr.json';
import haTranslations from './locales/ha.json';
import twTranslations from './locales/tw.json';
import deTranslations from './locales/de.json';
import dagTranslations from './locales/dag.json';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: 'en',
    lng: 'en', // Force default language to English
    debug: process.env.NODE_ENV === 'development',
    
    // Languages we support
    supportedLngs: ['en', 'fr', 'ha', 'tw', 'de', 'dag'],
    
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
      },
      de: {
        translation: deTranslations
      },
      dag: {
        translation: dagTranslations
      }
    },

    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage'],
    }
  });

export default i18n;