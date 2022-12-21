import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import Backend from 'i18next-xhr-backend';
import { initReactI18next } from 'react-i18next';
i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .use(Backend)
    .init({
        react: {
            useSuspense: false
        },
        lng: "vi", //Đặt mặc định là tiếng Việt
        fallbackLng: 'vi',
        debug: false,
        interpolation: {
            escapeValue: false, // not needed for react as it escapes by default
        },
        backend: {
            loadPath: '/assets/locales/{{lng}}/translation.json',
        },
        detection: {
            order: ['cookie', 'htmlTag', 'localStorage', 'path', 'subdomain'],
            caches: ['cookie'],

        }
    });

export default i18n;
