import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

import translationFR from "./locales/fr/translation.json";
import translationMG from "./locales/mg/translation.json";

const resources = {
  fr: {
    translation: translationFR,
  },
  mg: {
    translation: translationMG,
  },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,

    fallbackLng: "fr",
    supportedLngs: ["fr", "mg"],
    nonExplicitSupportedLngs: true,

    debug: false,

    interpolation: {
      escapeValue: false,
    },

    detection: {
      order: ["localStorage"],
      caches: ["localStorage"],
    },
  });

export default i18n;