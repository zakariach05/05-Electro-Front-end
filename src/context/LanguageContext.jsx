import React, { createContext, useState, useContext, useEffect } from 'react';
import fr from '../locales/fr.json';
import en from '../locales/en.json';
import ar from '../locales/ar.json';

const LanguageContext = createContext();

const translations = { fr, en, ar };

export const LanguageProvider = ({ children }) => {
    const [language, setLanguage] = useState(localStorage.getItem('lang') || 'fr');

    useEffect(() => {
        localStorage.setItem('lang', language);
        document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
        document.documentElement.lang = language;
    }, [language]);

    const t = (key) => {
        const keys = key.split('.');
        let value = translations[language];

        for (const k of keys) {
            if (value[k]) {
                value = value[k];
            } else {
                return key; // Return key if translation not found
            }
        }
        return value;
    };

    return (
        <LanguageContext.Provider value={{ language, setLanguage, t }}>
            {children}
        </LanguageContext.Provider>
    );
};

export const useLanguage = () => useContext(LanguageContext);
