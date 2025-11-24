import styles from './spacings.module.scss';


const labels = {
	none: 'None',
	xs: 'XS',
	sm: 'S',
	md: 'M',
	lg: 'L',
	xl: 'XL',
	'2xl': '2XL',
} as const;

const spacings = new Map<TSpacingKey, {
	label: string;
	value: {
		gap: string;
		paddingBlock: string;
		paddingInline: string;
		paddingTop: string;
		paddingBottom: string;
		paddingLeft: string;
		paddingRight: string;
		marginTop: string;
		marginBottom: string;
		marginLeft: string;
		marginRight: string;
		rowGap: string;
		columnGap: string;
	};
}>(
	[
		['none', {
			label: labels.none,
			value: {
				gap: styles.spacingNoneGap,
				paddingBlock: styles.spacingNonePaddingBlock,
				paddingInline: styles.spacingNonePaddingInline,
				paddingTop: styles.spacingNonePaddingTop,
				paddingBottom: styles.spacingNonePaddingBottom,
				paddingLeft: styles.spacingNonePaddingLeft,
				paddingRight: styles.spacingNonePaddingRight,
				marginTop: styles.spacingNoneMarginTop,
				marginBottom: styles.spacingNoneMarginBottom,
				marginLeft: styles.spacingNoneMarginLeft,
				marginRight: styles.spacingNoneMarginRight,
				rowGap: styles.spacingNoneRowGap,
				columnGap: styles.spacingNoneColumnGap,
			},
		}],
		['xs', {
			label: labels.xs,
			value: {
				gap: styles.spacingXsGap,
				paddingBlock: styles.spacingXsPaddingBlock,
				paddingInline: styles.spacingXsPaddingInline,
				paddingTop: styles.spacingXsPaddingTop,
				paddingBottom: styles.spacingXsPaddingBottom,
				paddingLeft: styles.spacingXsPaddingLeft,
				paddingRight: styles.spacingXsPaddingRight,
				marginTop: styles.spacingXsMarginTop,
				marginBottom: styles.spacingXsMarginBottom,
				marginLeft: styles.spacingXsMarginLeft,
				marginRight: styles.spacingXsMarginRight,
				rowGap: styles.spacingXsRowGap,
				columnGap: styles.spacingXsColumnGap,
			},
		}],
		['sm', {
			label: labels.sm,
			value: {
				gap: styles.spacingSmGap,
				paddingBlock: styles.spacingSmPaddingBlock,
				paddingInline: styles.spacingSmPaddingInline,
				paddingTop: styles.spacingSmPaddingTop,
				paddingBottom: styles.spacingSmPaddingBottom,
				paddingLeft: styles.spacingSmPaddingLeft,
				paddingRight: styles.spacingSmPaddingRight,
				marginTop: styles.spacingSmMarginTop,
				marginBottom: styles.spacingSmMarginBottom,
				marginLeft: styles.spacingSmMarginLeft,
				marginRight: styles.spacingSmMarginRight,
				rowGap: styles.spacingSmRowGap,
				columnGap: styles.spacingSmColumnGap,
			},
		}],
		['md', {
			label: labels.md,
			value: {
				gap: styles.spacingMdGap,
				paddingBlock: styles.spacingMdPaddingBlock,
				paddingInline: styles.spacingMdPaddingInline,
				paddingTop: styles.spacingMdPaddingTop,
				paddingBottom: styles.spacingMdPaddingBottom,
				paddingLeft: styles.spacingMdPaddingLeft,
				paddingRight: styles.spacingMdPaddingRight,
				marginTop: styles.spacingMdMarginTop,
				marginBottom: styles.spacingMdMarginBottom,
				marginLeft: styles.spacingMdMarginLeft,
				marginRight: styles.spacingMdMarginRight,
				rowGap: styles.spacingMdRowGap,
				columnGap: styles.spacingMdColumnGap,
			},
		}],
		['lg', {
			label: labels.lg,
			value: {
				gap: styles.spacingLgGap,
				paddingBlock: styles.spacingLgPaddingBlock,
				paddingInline: styles.spacingLgPaddingInline,
				paddingTop: styles.spacingLgPaddingTop,
				paddingBottom: styles.spacingLgPaddingBottom,
				paddingLeft: styles.spacingLgPaddingLeft,
				paddingRight: styles.spacingLgPaddingRight,
				marginTop: styles.spacingLgMarginTop,
				marginBottom: styles.spacingLgMarginBottom,
				marginLeft: styles.spacingLgMarginLeft,
				marginRight: styles.spacingLgMarginRight,
				rowGap: styles.spacingLgRowGap,
				columnGap: styles.spacingLgColumnGap,
			},
		}],
		['xl', {
			label: labels.xl,
			value: {
				gap: styles.spacingXlGap,
				paddingBlock: styles.spacingXlPaddingBlock,
				paddingInline: styles.spacingXlPaddingInline,
				paddingTop: styles.spacingXlPaddingTop,
				paddingBottom: styles.spacingXlPaddingBottom,
				paddingLeft: styles.spacingXlPaddingLeft,
				paddingRight: styles.spacingXlPaddingRight,
				marginTop: styles.spacingXlMarginTop,
				marginBottom: styles.spacingXlMarginBottom,
				marginLeft: styles.spacingXlMarginLeft,
				marginRight: styles.spacingXlMarginRight,
				rowGap: styles.spacingXlRowGap,
				columnGap: styles.spacingXlColumnGap,
			},
		}],
		['2xl', {
			label: labels['2xl'],
			value: {
				gap: styles.spacing2xlGap,
				paddingBlock: styles.spacing2xlPaddingBlock,
				paddingInline: styles.spacing2xlPaddingInline,
				paddingTop: styles.spacing2xlPaddingTop,
				paddingBottom: styles.spacing2xlPaddingBottom,
				paddingLeft: styles.spacing2xlPaddingLeft,
				paddingRight: styles.spacing2xlPaddingRight,
				marginTop: styles.spacing2xlMarginTop,
				marginBottom: styles.spacing2xlMarginBottom,
				marginLeft: styles.spacing2xlMarginLeft,
				marginRight: styles.spacing2xlMarginRight,
				rowGap: styles.spacing2xlRowGap,
				columnGap: styles.spacing2xlColumnGap,
			},
		}],
	]
);

const getSpacing = (key: TSpacingKey) => spacings.get(key) ?? spacings.get('none')!;

type TSpacingKey = keyof typeof labels;


export {
	spacings,
	getSpacing,
	type TSpacingKey,
};