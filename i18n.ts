import i18n from "i18next";
import { initReactI18next } from "react-i18next";

i18n
  .use(initReactI18next) // Integrates i18n with React
  .init({
    fallbackLng: "en", // Fallback language
    lng: "fr", // Default language

    // path to the translation files
    resources: {
      en: {
        translation: require("./public/locales/en/translation.json"),
      },
      fr: {
        translation: require("./public/locales/fr/translation.json"),
      },
    },

    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
