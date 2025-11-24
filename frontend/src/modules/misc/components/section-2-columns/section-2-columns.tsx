import React from "react";
import { cn } from "../../../../lib/utils";
import { type TPageComponent } from "../../../view/models/page.model";
import {PageRenderer} from "../../../view/page-editor/page-renderer/page-renderer";
import { z } from "zod";
import { getLayout, type TLayoutKey } from "../../data/layouts";
import { layouts } from "../../data/layouts";
import { getBackground, type TBackgroundKey } from "../../data/backgrounds";
import { getSpacing, spacings } from "../../data/spacings";
import { backgrounds } from "../../data/backgrounds";
import { type TSpacingKey } from "../../data/spacings";
import { alignments, getAlignment } from "../../data/alignments";
import { type TAlignmentKey } from "../../data/alignments";
import styles from './section-2-columns.module.scss';
import { getRadius, radii, type TRadiusKey } from "../../data/radii";



const ConfigurableSection2ColumnsPropsSchema = z.object({
    layout: z.enum(Array.from(layouts.entries()).map(([id]) => id) as [TLayoutKey, ...TLayoutKey[]]),
    paddingTop: z.enum(Object.keys(spacings) as [TSpacingKey, ...TSpacingKey[]]),
    paddingBottom: z.enum(Object.keys(spacings) as [TSpacingKey, ...TSpacingKey[]]),
    paddingLeft: z.enum(Object.keys(spacings) as [TSpacingKey, ...TSpacingKey[]]),
    paddingRight: z.enum(Object.keys(spacings) as [TSpacingKey, ...TSpacingKey[]]),
    marginTop: z.enum(Object.keys(spacings) as [TSpacingKey, ...TSpacingKey[]]),
    marginBottom: z.enum(Object.keys(spacings) as [TSpacingKey, ...TSpacingKey[]]),
    marginLeft: z.enum(Object.keys(spacings) as [TSpacingKey, ...TSpacingKey[]]),
    marginRight: z.enum(Object.keys(spacings) as [TSpacingKey, ...TSpacingKey[]]),
    rowGap: z.enum(Object.keys(spacings) as [TSpacingKey, ...TSpacingKey[]]),
    columnGap: z.enum(Object.keys(spacings) as [TSpacingKey, ...TSpacingKey[]]),
    background: z.enum(Array.from(backgrounds.entries()).map(([id]) => id) as [TBackgroundKey, ...TBackgroundKey[]]),
    alignment: z.enum(Array.from(alignments.entries()).map(([id]) => id) as [TAlignmentKey, ...TAlignmentKey[]]),
    radius: z.enum(Array.from(radii.entries()).map(([id]) => id) as [TRadiusKey, ...TRadiusKey[]]),
});

type TConfigurableSection2ColumnsProps = z.infer<typeof ConfigurableSection2ColumnsPropsSchema>;

type TStaticSection2ColumnsProps = {};

type TSection2ColumnsProps = TConfigurableSection2ColumnsProps & TStaticSection2ColumnsProps & React.HTMLAttributes<HTMLDivElement>;

function getLayerIds(pageComponent: TPageComponent): { [key: string]: { id: string, title: string } } {
    return {
        leftColContent: {
            id: `${pageComponent.id}.props.col1`,
            title: 'Partie gauche'
        },
        rightColContent: {
            id: `${pageComponent.id}.props.col2`,
            title: 'Partie droite'
        },
    };
}

function getDefaultProps(): TConfigurableSection2ColumnsProps {
    return {
        layout: 'equalSplit',
        paddingTop: 'none',
        paddingRight: 'md',
        paddingBottom: 'none',
        paddingLeft: 'md',
        background: 'none',
        alignment: 'stretch',
        marginTop: 'none',
        marginBottom: 'none',
        marginLeft: 'none',
        marginRight: 'none',
        rowGap: 'none',
        columnGap: 'none',
        radius: 'none',
    };
}

const Section2Columns = React.forwardRef<HTMLDivElement, TSection2ColumnsProps>(
    ({ className, ...props }, ref) => {

        const component = { id: props['data-page-component-id' as keyof typeof props] } as TPageComponent;
        const layerIds = getLayerIds(component);

        return <section
            ref={ref}
            className={cn(
                getSpacing(props.paddingTop).value.paddingTop,
                getSpacing(props.paddingBottom).value.paddingBottom,
                getSpacing(props.paddingLeft).value.paddingLeft,
                getSpacing(props.paddingRight).value.paddingRight,
                getSpacing(props.marginTop).value.marginTop,
                getSpacing(props.marginBottom).value.marginBottom,
                getSpacing(props.marginLeft).value.marginLeft,
                getSpacing(props.marginRight).value.marginRight,

                getRadius(props.radius).value,

                getBackground(props.background).value,

                className
            )}
            {...props}
        >
            <div className={styles.section2ColumnsContent}>
                <div
                 className={cn(
                    styles.section2ColumnsContentInner,
                    getAlignment(props.alignment).value,
                    getLayout(props.layout).value,
                    getSpacing(props.rowGap).value.rowGap,
                    getSpacing(props.columnGap).value.columnGap,
                 )}>
                    <PageRenderer
                        className={styles.section2ColumnsPageRenderer}
                        layerId={layerIds.leftColContent.id}
                        layerTitle={layerIds.leftColContent.title}
                    />
                    <PageRenderer
                        className={styles.section2ColumnsPageRenderer}
                        layerId={layerIds.rightColContent.id}
                        layerTitle={layerIds.rightColContent.title}
                    />
                </div>
            </div>
        </section>
    }
);

Section2Columns.displayName = 'Section2Columns';


export {
    Section2Columns,
    getLayerIds,
    getDefaultProps,
    ConfigurableSection2ColumnsPropsSchema,
    type TConfigurableSection2ColumnsProps,
    type TStaticSection2ColumnsProps,
    type TSection2ColumnsProps,
};