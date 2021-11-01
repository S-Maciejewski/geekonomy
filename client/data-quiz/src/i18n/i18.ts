import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'

import translationEn from './locales/en.json'
import translationPl from './locales/pl.json'

const resources = {
    en: {
        translation: translationEn,
    },
    pl: {
        translation: translationPl,
    },
}

// @ts-ignore
i18n.use(LanguageDetector)
    .use(initReactI18next)
    .init({
        resources,
        fallbackLng: 'en',
        // keySeparator: false,
        interpolation: {
            escapeValue: false,
        },
    })

export default i18n
