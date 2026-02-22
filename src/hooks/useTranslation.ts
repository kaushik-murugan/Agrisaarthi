/**
 * useTranslation.ts
 * Custom hook that provides the translation function t() based on
 * the farmer's preferred language stored in AsyncStorage.
 *
 * Usage:
 *   const { t, language, isLoading } = useTranslation();
 *   <Text>{t('greeting', { name: 'Kaushik' })}</Text>
 */

import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
    translations,
    LANGUAGE_MAP,
    type SupportedLanguage,
    type TranslationKey,
} from '../constants/translations';

/** AsyncStorage key where farmer profile is persisted */
const PROFILE_KEY = 'farmer_profile';

/** Default language code when no profile / language is found */
const DEFAULT_LANGUAGE: SupportedLanguage = 'en';

/**
 * useTranslation
 * Reads the farmer_profile from AsyncStorage, extracts the
 * preferredLanguage field, and returns a t() helper that
 * resolves translation keys to the correct language string.
 *
 * @returns {{ t, language, isLoading }}
 *  - t(key, params?)  → translated string with placeholders replaced
 *  - language          → active SupportedLanguage code
 *  - isLoading         → true while reading from AsyncStorage
 */
export const useTranslation = () => {
    const [language, setLanguage] = useState<SupportedLanguage>(DEFAULT_LANGUAGE);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {
        /**
         * Load the farmer profile and resolve the preferred language.
         * Falls back to English if the profile or language field is missing.
         */
        const loadLanguage = async () => {
            try {
                const raw = await AsyncStorage.getItem(PROFILE_KEY);
                if (raw) {
                    const profile = JSON.parse(raw);
                    // The profile stores the display name (e.g. "Tamil")
                    const displayName: string | undefined = profile.preferredLanguage ?? profile.language;
                    if (displayName && LANGUAGE_MAP[displayName]) {
                        setLanguage(LANGUAGE_MAP[displayName]);
                    }
                }
            } catch (error) {
                console.error('[useTranslation] Failed to load language:', error);
            } finally {
                setIsLoading(false);
            }
        };

        loadLanguage();
    }, []);

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
