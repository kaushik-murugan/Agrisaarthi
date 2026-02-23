/**
 * LanguageContext.tsx
 * Provides app-wide language state via React Context.
 * When the farmer changes language in Settings, every screen
 * that uses useTranslation() re-renders immediately.
 */

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LANGUAGE_MAP, type SupportedLanguage } from '../constants/translations';

/** AsyncStorage key where farmer profile is persisted */
const PROFILE_KEY = 'farmer_profile';

/** Default language when no profile exists */
const DEFAULT_LANGUAGE: SupportedLanguage = 'en';

interface LanguageContextType {
    /** Current active language code */
    language: SupportedLanguage;
    /** Update language — writes to both context + AsyncStorage */
    setLanguage: (lang: SupportedLanguage) => void;
    /** Re-read language from AsyncStorage (e.g. after profile changes) */
    refreshLanguage: () => Promise<void>;
    /** True while initial language is being loaded */
    isLoading: boolean;
}

const LanguageContext = createContext<LanguageContextType>({
    language: DEFAULT_LANGUAGE,
    setLanguage: () => { },
    refreshLanguage: async () => { },
    isLoading: true,
});

/**
 * LanguageProvider
 * Wraps the app tree and provides language state to all children.
 */
export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [language, setLanguageState] = useState<SupportedLanguage>(DEFAULT_LANGUAGE);
    const [isLoading, setIsLoading] = useState(true);

    /** Read language from AsyncStorage farmer_profile */
    const refreshLanguage = useCallback(async () => {
        try {
            const raw = await AsyncStorage.getItem(PROFILE_KEY);
            if (raw) {
                const profile = JSON.parse(raw);
                const displayName: string | undefined =
                    profile.preferredLanguage ?? profile.language;
                if (displayName && LANGUAGE_MAP[displayName]) {
                    setLanguageState(LANGUAGE_MAP[displayName]);
                    return;
                }
            }
        } catch (error) {
            console.error('[LanguageContext] Failed to load language:', error);
        }
        setLanguageState(DEFAULT_LANGUAGE);
    }, []);

    /** Load on mount */
    useEffect(() => {
        const init = async () => {
            await refreshLanguage();
            setIsLoading(false);
        };
        init();
    }, [refreshLanguage]);

    /** Update language in context + persist to AsyncStorage */
    const setLanguage = useCallback((lang: SupportedLanguage) => {
        setLanguageState(lang);
    }, []);

    return (
        <LanguageContext.Provider value={{ language, setLanguage, refreshLanguage, isLoading }}>
            {children}
        </LanguageContext.Provider>
    );
};

/** Hook to access LanguageContext */
export const useLanguage = () => useContext(LanguageContext);

export default LanguageContext;
