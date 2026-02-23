/**
 * useTranslation.ts
 * Custom hook that provides the translation function t() based on
 * the farmer's preferred language from LanguageContext.
 *
 * Usage:
 *   const { t, language, isLoading } = useTranslation();
 *   <Text>{t('greeting', { name: 'Kaushik' })}</Text>
 */

import {
    translations,
    type SupportedLanguage,
    type TranslationKey,
} from '../constants/translations';
import { useLanguage } from '../contexts/LanguageContext';

/** Default language code when context is unavailable */
const DEFAULT_LANGUAGE: SupportedLanguage = 'en';

/**
 * useTranslation
 * Reads the current language from LanguageContext and returns
 * a t() helper that resolves translation keys.
 *
 * When language changes in LanguageContext (e.g. from Settings),
 * every component using this hook re-renders automatically.
 *
 * @returns {{ t, language, isLoading }}
 *  - t(key, params?)  → translated string with placeholders replaced
 *  - language          → active SupportedLanguage code
 *  - isLoading         → true while reading initial language
 */
export const useTranslation = () => {
    const { language, isLoading } = useLanguage();

    /**
     * Translate a key, optionally replacing {placeholder} tokens.
     *
     * @param key    - Translation key (e.g. 'greeting')
     * @param params - Optional map of placeholder → value
     *                 e.g. { name: 'Kaushik' } replaces {name}
     * @returns The translated string with placeholders filled in
     */
    const t = (key: TranslationKey, params?: Record<string, string | number>): string => {
        // Resolve from current language, fall back to English
        let text = translations[language]?.[key] ?? translations[DEFAULT_LANGUAGE][key] ?? key;

        // Replace {placeholder} tokens if params provided
        if (params) {
            Object.entries(params).forEach(([placeholder, value]) => {
                text = text.replace(new RegExp(`\\{${placeholder}\\}`, 'g'), String(value));
            });
        }

        return text;
    };

    return { t, language, isLoading };
};
