import { type TPrefersColorThemeAction, type TColorSchemeValue } from './actions';


type TPrefersColorThemeStoreState = {
    value: TColorSchemeValue,
    colorSchemeInSystemSettingsIsDark: boolean,
}

const LS_COLOR_SCHEME_VALUE_KEY = 'LS_COLOR_SCHEME_VALUE';
const getInitialColorSchemeValue = (): TColorSchemeValue => {
    return localStorage.getItem( LS_COLOR_SCHEME_VALUE_KEY ) as TColorSchemeValue
        || 'prefers-color-scheme-system';
};

const initialState: TPrefersColorThemeStoreState = {
    value: getInitialColorSchemeValue(),
    colorSchemeInSystemSettingsIsDark: window.matchMedia('(prefers-color-scheme: dark)').matches,
};

const reducer = (
    state: TPrefersColorThemeStoreState,
    action: TPrefersColorThemeAction
): TPrefersColorThemeStoreState => {
    switch (action.type) {

        case 'SET_COLOR_SCHEME_IN_SYSTEM_SETTINGS_IS_DARK':
            return {
                ...state,
                colorSchemeInSystemSettingsIsDark: action.payload,
            };

        case 'SET_COLOR_SCHEME':
            localStorage.setItem(LS_COLOR_SCHEME_VALUE_KEY, action.payload);
            return {
                ...state,
                value: action.payload,
            };

        default:
            return state;
    }
};


export {
    initialState,
    reducer,
    type TPrefersColorThemeStoreState,
    getInitialColorSchemeValue,
};
