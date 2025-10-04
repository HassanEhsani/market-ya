import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import ru from './locales/ru.json';
import en from './locales/en.json';
import fa from './locales/fa.json';
import tg from './locales/tg.json';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      ru: { translation: ru },
      en: { translation: en },
      fa: { translation: fa },
      tg: { translation: tg },
    },
    lng: localStorage.getItem('lang') || 'fa', // زبان پیش‌فرض از localStorage
    fallbackLng: 'fa',
    supportedLngs: ['fa', 'en', 'ru', 'tg'],
    debug: false,
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
    },
  });

export default i18n;
