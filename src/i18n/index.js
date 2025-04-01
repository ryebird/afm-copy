import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import kk from './kk.json';
import ru from './ru.json';

i18n
  .use(LanguageDetector) // Автоматически определяет язык пользователя
  .use(initReactI18next) // Интеграция с React
  .init({
    resources: {
      kk: { translation: kk },
      ru: { translation: ru },
    },
    fallbackLng: 'en', // Язык по умолчанию
    interpolation: {
      escapeValue: false, // Отключаем экранирование для строк
    },
  });

export default i18n;
