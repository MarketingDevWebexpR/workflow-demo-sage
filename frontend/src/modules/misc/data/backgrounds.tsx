import styles from './backgrounds.module.scss';


const labels = {
    none: 'None',
    offsetMinus2: 'Variant -2',
    offsetMinus1: 'Variant -1',
    standard: 'Standard',
    offset1: 'Variant 1',
    offset2: 'Variant 2',
    offset3: 'Variant 3',
    offset4: 'Variant 4',
} as const;

const backgrounds = new Map<TBackgroundKey, {
    label: string;
    value: string;
}>(
    [
        ['none', {
            label: labels.none,
            value: styles.bgTransparent,
        }],
        ['offsetMinus2', {
            label: labels.offsetMinus2,
            value: styles.bgOffsetMinus2,
        }],
        ['offsetMinus1', {
            label: labels.offsetMinus1,
            value: styles.bgOffsetMinus1,
        }],
        ['standard', {
            label: labels.standard,
            value: styles.bgStandard,
        }],
        ['offset1', {
            label: labels.offset1,
            value: styles.bgOffset1,
        }],
        ['offset2', {
            label: labels.offset2,
            value: styles.bgOffset2,
        }],
        ['offset3', {
            label: labels.offset3,
            value: styles.bgOffset3,
        }],
        ['offset4', {
            label: labels.offset4,
            value: styles.bgOffset4,
        }],
    ]
);

const getBackground = (key: TBackgroundKey) => backgrounds.get(key) ?? backgrounds.get('none')!;

type TBackgroundKey = keyof typeof labels;


export {
    backgrounds,
    getBackground,
    type TBackgroundKey,
};