import styles from './radii.module.scss';


const labels = {
    none: 'None',
    xs: 'XS',
    sm: 'S',
    md: 'M',
    lg: 'L',
    xl: 'XL',
    '2xl': '2XL',
    '3xl': '3XL',
    '4xl': '4XL',
    '5xl': '5XL',
    '6xl': '6XL',
    '7xl': '7XL',
    '8xl': '8XL',
    full: 'Full',
} as const;

const radii = new Map<TRadiusKey, {
    label: string;
    value: string;
}>(
    [
        ['none', {
            label: labels.none,
            value: styles.radiusNone,
        }],
        ['xs', {
            label: labels.xs,
            value: styles.radiusXs,
        }],
        ['sm', {
            label: labels.sm,
            value: styles.radiusSm,
        }],
        ['md', {
            label: labels.md,
            value: styles.radiusMd,
        }],
        ['lg', {
            label: labels.lg,
            value: styles.radiusLg,
        }],
        ['xl', {
            label: labels.xl,
            value: styles.radiusXl,
        }],
        ['2xl', {
            label: labels['2xl'],
            value: styles.radius2xl,
        }],
        ['3xl', {
            label: labels['3xl'],
            value: styles.radius3xl,
        }],
        ['4xl', {
            label: labels['4xl'],
            value: styles.radius4xl,
        }],
        ['5xl', {
            label: labels['5xl'],
            value: styles.radius5xl,
        }],
        ['6xl', {   
            label: labels['6xl'],
            value: styles.radius6xl,
        }],
        ['7xl', {
            label: labels['7xl'],
            value: styles.radius7xl,
        }],
        ['8xl', {
            label: labels['8xl'],
            value: styles.radius8xl,
        }],
        ['full', {
            label: labels.full,
            value: styles.radiusFull,
        }],
    ]
);

const getRadius = (key: TRadiusKey) => radii.get(key) ?? radii.get('none')!;

type TRadiusKey = keyof typeof labels;


export {
    radii,
    getRadius,
    type TRadiusKey,
};