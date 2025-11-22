import { useEffect } from "react";
import { usePrefersColorThemeStore } from "./store";


const PrefersColorSchemeSetup = ({
    children,
}: {
    children: React.ReactElement,
}) => {
  
    const dispatch = usePrefersColorThemeStore((state) => state.dispatch);
    const theme = usePrefersColorThemeStore((state) => state.value);
    const colorSchemeInSystemSettingsIsDark = usePrefersColorThemeStore((state) => state.colorSchemeInSystemSettingsIsDark);

    useEffect(() => {

        const abortController = new AbortController();

        window.matchMedia('(prefers-color-scheme: dark)')
        .addEventListener('change', e => {
            console.log({ isDark: e.matches })
            dispatch({
                type: 'SET_COLOR_SCHEME_IN_SYSTEM_SETTINGS_IS_DARK',
                payload: e.matches,
            });
        }, {
            signal: abortController.signal,
        });

        return () => {
            abortController.abort();
        };
    }, []);

    useEffect( () => {

        const root = window.document.documentElement;
        root.classList.remove("light", "dark");
        
        const isDark = theme === 'prefers-color-scheme-dark' || (
            theme === 'prefers-color-scheme-system' && colorSchemeInSystemSettingsIsDark
        );

        root.classList.add(isDark ? 'dark' : 'light');
    }, [theme, colorSchemeInSystemSettingsIsDark]);

    return children;
};


export {
    PrefersColorSchemeSetup,
};