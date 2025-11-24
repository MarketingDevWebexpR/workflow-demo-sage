import styles from './alignments.module.scss';


const labels = {
    stretch: 'Stretch',
    start: 'Start',
    center: 'Center',
    end: 'End',
} as const;

const alignments = new Map<TAlignmentKey, {
    label: string;
    value: string;
}>(
    [
        ['stretch', {
            label: labels.stretch,
            value: styles.alignmentStretch,
        }],
        ['start', {
            label: labels.start,
            value: styles.alignmentStart,
        }],
        ['center', {
            label: labels.center,
            value: styles.alignmentCenter,
        }],
        ['end', {
            label: labels.end,
            value: styles.alignmentEnd,
        }],
    ]
);

const getAlignment = (key: TAlignmentKey) => alignments.get(key) ?? alignments.get('stretch')!;

type TAlignmentKey = keyof typeof labels;


export {
    alignments,
    getAlignment,
    type TAlignmentKey,
};