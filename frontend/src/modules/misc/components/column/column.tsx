import React from "react";
import { cn } from "../../../../lib/utils";
import { type TPageComponent } from "../../../view/models/page.model";
import { PageRenderer } from "../../../view/page-editor/page-renderer/page-renderer";
import { z } from "zod";
import { spacings, getSpacing, type TSpacingKey } from "../../data/spacings";


const ConfigurableColumnPropsSchema = z.object({
    gapSize: z.enum(Object.keys(spacings) as [TSpacingKey, ...TSpacingKey[]]),
})

type TConfigurableColumnProps = z.infer<typeof ConfigurableColumnPropsSchema>;

type TStaticColumnProps = {
    col: TPageComponent[];
}

type TColumnProps = TConfigurableColumnProps & TStaticColumnProps & React.HTMLAttributes<HTMLDivElement>

function getDefaultProps(): TConfigurableColumnProps {
    return {
        gapSize: 'md',
    };
}

function getLayerIds(pageComponent: TPageComponent): { [key: string]: { id: string, title: string } } {

    return {
        colContent: {
            id: pageComponent.id,
            title: 'Contenu de la colonne',
        },
    };
}

const Column = React.forwardRef<HTMLDivElement, TColumnProps>(
    ({  className, ...props }, ref) => {

        const component = {
            id: props['data-page-component-id' as keyof typeof props],
        } as TPageComponent;

        const layerIds = getLayerIds(component);

        return <PageRenderer
            ref={ref}
            className={cn(getSpacing(props.gapSize).value.gap, className)}
            layerId={layerIds.colContent.id}
            layerTitle={layerIds.colContent.title}
            {...props}
        />;
    }
);

Column.displayName = 'Column';


export {
    Column,
    getLayerIds,
    getDefaultProps,
    ConfigurableColumnPropsSchema,
    type TConfigurableColumnProps,
    type TStaticColumnProps,
    type TColumnProps,
};