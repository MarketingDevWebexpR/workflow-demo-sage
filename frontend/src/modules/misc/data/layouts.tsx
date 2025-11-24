import styles from './layouts.module.scss';


const labels = {
    fitContent: 'Fit content',
    equalSplit: '50 / 50',
    leftHeavy: '65 / 35',
    rightHeavy: '35 / 65',
    leftCompact: '75 / 25',
    rightCompact: '25 / 75',
} as const;

const layouts = new Map<TLayoutKey, {
    label: string;
    value: string;
}>(
    [
        ['fitContent', {
            label: labels.fitContent,
            value: styles.layoutFitContent,
        }],
        ['leftCompact', {
            label: labels.leftCompact,
            value: styles.layoutLeftCompact,
        }],
        ['leftHeavy', {
            label: labels.leftHeavy,
            value: styles.layoutLeftHeavy,
        }],
        ['equalSplit', {
            label: labels.equalSplit,
            value: styles.layoutEqualSplit,
        }],
        ['rightHeavy', {
            label: labels.rightHeavy,
            value: styles.layoutRightHeavy,
        }],
        ['rightCompact', {
            label: labels.rightCompact,
            value: styles.layoutRightCompact,
        }],
    ]
);

const getLayout = (key: TLayoutKey) => layouts.get(key) ?? layouts.get('equalSplit')!;

type TLayoutKey = keyof typeof labels;


export {
    layouts,
    getLayout,
    type TLayoutKey,
};