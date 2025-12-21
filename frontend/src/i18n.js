
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

const resources = {
    en: {
        translation: {
            "welcome": "Welcome to World Job Market",
            "find_work": "Find Work",
            "hire_talent": "Hire Talent",
            "search_placeholder": "Search jobs...",
            "filter_budget": "Budget",
            "chat": "Chat",
            "dispute": "File a Dispute",
            "submit": "Submit"
        }
    },
    bn: {
        translation: {
            "welcome": "বিশ্ব কর্ম বাজারে স্বাগতম",
            "find_work": "কাজ খুঁজুন",
            "hire_talent": "ট্যালেন্ট ভাড়া করুন",
            "search_placeholder": "কাজ অনুসন্ধান করুন...",
            "filter_budget": "বাজেট",
            "chat": "চ্যাট",
            "dispute": "বিরোধ দায়ের করুন",
            "submit": "জমা দিন"
        }
    }
};

i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        resources,
        fallbackLng: "en",
        interpolation: {
            escapeValue: false
        }
    });

export default i18n;
