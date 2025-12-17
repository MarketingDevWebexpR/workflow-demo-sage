/**
 * Color model types and constants for color-related components.
 * Used by ColorBadge, ColorSchemeSelector, and ColorBadgeCell components.
 */

/**
 * Available color schemes for UI components.
 */
export const COLOR_SCHEMES = {
    GRAY: 'gray',
    RED: 'red',
    ORANGE: 'orange',
    AMBER: 'amber',
    YELLOW: 'yellow',
    LIME: 'lime',
    GREEN: 'green',
    EMERALD: 'emerald',
    TEAL: 'teal',
    CYAN: 'cyan',
    SKY: 'sky',
    BLUE: 'blue',
    INDIGO: 'indigo',
    VIOLET: 'violet',
    PURPLE: 'purple',
    FUCHSIA: 'fuchsia',
    PINK: 'pink',
    ROSE: 'rose',
} as const;

/**
 * Type representing valid color scheme values.
 */
export type TColorScheme = (typeof COLOR_SCHEMES)[keyof typeof COLOR_SCHEMES];

/**
 * CSS class configuration for a color scheme.
 */
export interface IColorSchemeClasses {
    readonly background: string;
    readonly text: string;
    readonly border: string;
}

/**
 * Mapping of color schemes to their CSS classes.
 * Uses Tailwind-style class naming convention.
 */
export const COLOR_SCHEME_CLASSES: Record<TColorScheme, IColorSchemeClasses> = {
    [COLOR_SCHEMES.GRAY]: {
        background: 'bg-gray-100',
        text: 'text-gray-800',
        border: 'border-gray-200',
    },
    [COLOR_SCHEMES.RED]: {
        background: 'bg-red-100',
        text: 'text-red-800',
        border: 'border-red-200',
    },
    [COLOR_SCHEMES.ORANGE]: {
        background: 'bg-orange-100',
        text: 'text-orange-800',
        border: 'border-orange-200',
    },
    [COLOR_SCHEMES.AMBER]: {
        background: 'bg-amber-100',
        text: 'text-amber-800',
        border: 'border-amber-200',
    },
    [COLOR_SCHEMES.YELLOW]: {
        background: 'bg-yellow-100',
        text: 'text-yellow-800',
        border: 'border-yellow-200',
    },
    [COLOR_SCHEMES.LIME]: {
        background: 'bg-lime-100',
        text: 'text-lime-800',
        border: 'border-lime-200',
    },
    [COLOR_SCHEMES.GREEN]: {
        background: 'bg-green-100',
        text: 'text-green-800',
        border: 'border-green-200',
    },
    [COLOR_SCHEMES.EMERALD]: {
        background: 'bg-emerald-100',
        text: 'text-emerald-800',
        border: 'border-emerald-200',
    },
    [COLOR_SCHEMES.TEAL]: {
        background: 'bg-teal-100',
        text: 'text-teal-800',
        border: 'border-teal-200',
    },
    [COLOR_SCHEMES.CYAN]: {
        background: 'bg-cyan-100',
        text: 'text-cyan-800',
        border: 'border-cyan-200',
    },
    [COLOR_SCHEMES.SKY]: {
        background: 'bg-sky-100',
        text: 'text-sky-800',
        border: 'border-sky-200',
    },
    [COLOR_SCHEMES.BLUE]: {
        background: 'bg-blue-100',
        text: 'text-blue-800',
        border: 'border-blue-200',
    },
    [COLOR_SCHEMES.INDIGO]: {
        background: 'bg-indigo-100',
        text: 'text-indigo-800',
        border: 'border-indigo-200',
    },
    [COLOR_SCHEMES.VIOLET]: {
        background: 'bg-violet-100',
        text: 'text-violet-800',
        border: 'border-violet-200',
    },
    [COLOR_SCHEMES.PURPLE]: {
        background: 'bg-purple-100',
        text: 'text-purple-800',
        border: 'border-purple-200',
    },
    [COLOR_SCHEMES.FUCHSIA]: {
        background: 'bg-fuchsia-100',
        text: 'text-fuchsia-800',
        border: 'border-fuchsia-200',
    },
    [COLOR_SCHEMES.PINK]: {
        background: 'bg-pink-100',
        text: 'text-pink-800',
        border: 'border-pink-200',
    },
    [COLOR_SCHEMES.ROSE]: {
        background: 'bg-rose-100',
        text: 'text-rose-800',
        border: 'border-rose-200',
    },
};
