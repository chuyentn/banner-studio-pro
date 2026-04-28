import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import viTranslation from '../locales/vi.json';
import enTranslation from '../locales/en.json';

// Only use LanguageDetector in browser (SSR-safe)
const isBrowser = typeof window !== 'undefined';

const initPromise = (async () => {
  const instance = i18n.use(initReactI18next);

  if (isBrowser) {
    const { default: LanguageDetector } = await import('i18next-browser-languagedetector');
    instance.use(LanguageDetector);
  }

  await instance.init({
    resources: {
      en: { translation: enTranslation },
      vi: { translation: viTranslation },
    },
    fallbackLng: 'vi',
    lng: isBrowser ? undefined : 'vi', // Force 'vi' on server, detect on client
    interpolation: {
      escapeValue: false,
    },
  });
})();

export { initPromise };
export default i18n;
