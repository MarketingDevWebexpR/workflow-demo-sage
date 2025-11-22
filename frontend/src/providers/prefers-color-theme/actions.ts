type TColorSchemeValue = 'prefers-color-scheme-system' | 'prefers-color-scheme-light' | 'prefers-color-scheme-dark';

const SET_COLOR_SCHEME_IN_SYSTEM_SETTINGS_IS_DARK = 'SET_COLOR_SCHEME_IN_SYSTEM_SETTINGS_IS_DARK' as const;
const SET_COLOR_SCHEME = 'SET_COLOR_SCHEME' as const;

interface ISetColorSchemeInSystemSettingsIsDark {
    type: typeof SET_COLOR_SCHEME_IN_SYSTEM_SETTINGS_IS_DARK,
    payload: boolean,
}

interface ISetColorScheme {
    type: typeof SET_COLOR_SCHEME,
    payload: TColorSchemeValue,
}

type TPrefersColorThemeAction = ISetColorSchemeInSystemSettingsIsDark
| ISetColorScheme;


export {
    type TPrefersColorThemeAction,
    type TColorSchemeValue,
};