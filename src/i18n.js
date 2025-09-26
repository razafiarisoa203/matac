import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Import des traductions
import translationFR from './locales/fr/translation.json';
import translationMG from './locales/mg/translation.json';

// Configuration des ressources de traduction
const resources = {
  fr: {
    translation: translationFR
  },
  mg: {
    translation: translationMG
  }
};

i18n
  // Détection automatique de la langue
  .use(LanguageDetector)
  // Passe l'instance i18n à react-i18next
  .use(initReactI18next)
  // Initialisation d'i18next
  .init({
    resources,
    fallbackLng: 'fr',
    debug: false,
    interpolation: {
      escapeValue: false, // Pas besoin d'échapper les caractères HTML
    },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
    }
  });

export default i18n;
