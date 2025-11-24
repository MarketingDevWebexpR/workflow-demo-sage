import React from "react";
import { cn } from "../../../../lib/utils";
import { type TPageComponent } from "../../../view/models/page.model";
import { PageRenderer } from "../../../view/page-editor/page-renderer/page-renderer";
import { getSpacing, type TSpacingKey } from "../../data/spacings";
import { z } from "zod";
import { spacings } from "../../data/spacings";
import { getBackground, type TBackgroundKey } from "../../data/backgrounds";
import { backgrounds } from "../../data/backgrounds";
import styles from './section-1-column.module.scss';


const ConfigurableSectionPropsSchema = z.object({
    paddingTop: z.enum(Object.keys(spacings) as [TSpacingKey, ...TSpacingKey[]]),
    paddingBottom: z.enum(Object.keys(spacings) as [TSpacingKey, ...TSpacingKey[]]),
    paddingLeft: z.enum(Object.keys(spacings) as [TSpacingKey, ...TSpacingKey[]]),
    paddingRight: z.enum(Object.keys(spacings) as [TSpacingKey, ...TSpacingKey[]]),
    marginTop: z.enum(Object.keys(spacings) as [TSpacingKey, ...TSpacingKey[]]),
    marginBottom: z.enum(Object.keys(spacings) as [TSpacingKey, ...TSpacingKey[]]),
    marginLeft: z.enum(Object.keys(spacings) as [TSpacingKey, ...TSpacingKey[]]),
    marginRight: z.enum(Object.keys(spacings) as [TSpacingKey, ...TSpacingKey[]]),
    background: z.enum(Array.from(backgrounds.entries()).map(([id]) => id) as [TBackgroundKey, ...TBackgroundKey[]]),
})

type TConfigurableSectionProps = z.infer<typeof ConfigurableSectionPropsSchema>;

type TStaticSectionProps = {};

type TSectionProps = TConfigurableSectionProps & TStaticSectionProps & React.HTMLAttributes<HTMLDivElement>;

function getLayerIds(pageComponent: TPageComponent): { [key: string]: { id: string, title: string } } {
    return {
        sectionContent: {
            id: `${pageComponent.id}.props.col`,
            title: 'Section simple'
        },
    };
}

function getDefaultProps(): TConfigurableSectionProps {
    return {
        paddingTop: 'none',
        paddingBottom: 'none',
        paddingLeft: 'md',
        paddingRight: 'md',
        marginTop: 'none',
        marginBottom: 'none',
        marginLeft: 'none',
        marginRight: 'none',
        background: 'none',
    };
}

const Section = React.forwardRef<HTMLDivElement, TSectionProps>(
    ({
        className,
        ...props
    }, ref) => {

        const component = { id: props['data-page-component-id' as keyof typeof props] } as TPageComponent;
        const layerIds = getLayerIds(component).sectionContent;

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
                
                getBackground(props.background).value,
                styles.section1Column,
                className,
            )}
            {...props}
        >
            <div className={styles.section1ColumnContent}>
                <div className={styles.section1ColumnContentInner}>
                    <PageRenderer
                        className={styles.section1ColumnPageRenderer}
                        layerId={layerIds.id}
                        layerTitle={layerIds.title}
                    />
                </div>
            </div>
        </section>;
    }
);

Section.displayName = 'Section1Column';


export {
    Section,
    getLayerIds,
    getDefaultProps,
    ConfigurableSectionPropsSchema,
    type TConfigurableSectionProps,
    type TStaticSectionProps,
    type TSectionProps,
}