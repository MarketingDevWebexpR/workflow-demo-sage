/**
 * i18n React hooks stub
 * This is a stub file to satisfy TypeScript imports.
 * Replace with actual i18n implementation when available.
 */

type TranslationFunction = (key: string, options?: Record<string, unknown>) => string;
type Locale = 'en' | 'fr' | string;

interface UseTranslationReturn {
    t: TranslationFunction;
    i18n: {
        language: string;
        changeLanguage: (lang: string) => Promise<void>;
    };
    locale: Locale;
    setLocale: (locale: Locale) => void;
}

/**
 * Hook to access translation functions
 * @returns Translation utilities
 */
export const useTranslation = (): UseTranslationReturn => {
    const t: TranslationFunction = (key: string, _options?: Record<string, unknown>) => {
        // Return the key as fallback - replace with actual translation logic
        return key;
    };

    return {
        t,
        i18n: {
            language: 'en',
            changeLanguage: async (_lang: string) => {
                // Stub implementation
            },
        },
        locale: 'en',
        setLocale: (_locale: Locale) => {
            // Stub implementation
        },
    };
};

export type { TranslationFunction, UseTranslationReturn, Locale };
