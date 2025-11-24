import React from "react";
import { cn } from "../../../../lib/utils";
import { Accordion as AccordionComponent, AccordionContent, AccordionItem, AccordionTrigger } from "../../../../components/ui/accordion/accordion";
import { z } from "zod";
import { appLaunchTimestamp } from "../../../../utils/number.utils";
import { v4 as uuidv4 } from 'uuid';
import { type TPageComponent } from "../../../view/models/page.model";
import { PageRenderer } from "../../../view/page-editor/page-renderer/page-renderer";
import { getObjectFromStringifiedJson } from "../../../../utils/json.utils";
import styles from './accordion.module.scss';


const ConfigurableAccordionPropsSchema = z.object({
    items: z.array(
        z.object({
            id: z.string(),
            title: z.string(),
        })
    ),
});

type TConfigurableAccordionProps = z.infer<typeof ConfigurableAccordionPropsSchema>;

type TAccordionProps = TConfigurableAccordionProps &React.HTMLAttributes<HTMLDivElement>

function getLayerIds(pageComponent: TPageComponent): { [key: string]: { id: string, title: string } } {

    const props = pageComponent.props as TConfigurableAccordionProps;

    return props?.items?.reduce((acc, item) => {
        acc[`${pageComponent.id}.props.items.${item.id}.components`] = {
            id: `${pageComponent.id}.props.items.${item.id}.components`,
            title: item.title
        };
        return acc;
    }, {} as { [key: string]: { id: string, title: string } }) ?? {};
}

function getDefaultProps(): TConfigurableAccordionProps {
    return {
        items: [
            {
                id: `${appLaunchTimestamp}-${uuidv4()}`,
                title: 'Item 1'
            },
            {
                id: `${appLaunchTimestamp}-${uuidv4()}`,
                title: 'Item 2'
            },
            {
                id: `${appLaunchTimestamp}-${uuidv4()}`,
                title: 'Item 3'
            },
        ],
    };
}

const Accordion = React.forwardRef<HTMLDivElement, TAccordionProps>(
    ({ className, ...props }, ref) => {

        const items = props?.items || [];

        const component = {
            id: props['data-page-component-id' as keyof typeof props],
            props: getObjectFromStringifiedJson<TConfigurableAccordionProps | undefined>(props['data-page-component-props' as keyof typeof props])
        } as TPageComponent;

        const layerItems = getLayerIds(component);

        return <div
            className={cn(styles.accordion, className)}
            ref={ref}
            {...props}
        >
            <AccordionComponent type="single" collapsible className={styles.accordionComponent}>
                {
                    items.map(({ id, title }, index) => (
                        <AccordionItem key={id} value={id} className={styles.accordionItem}>
                            <AccordionTrigger className={styles.accordionTrigger} data-keep-pointer-events>
                                <div className={styles.accordionTriggerContent}>
                                    <span className={styles.accordionTriggerContentIndex}>{index + 1}</span>
                                    <span className={styles.accordionTriggerContentTitle}>{title}</span>
                                </div>
                            </AccordionTrigger>
                            <AccordionContent>
                                <PageRenderer
                                    className={styles.accordionPageRenderer}
                                    layerId={layerItems[`${component.id}.props.items.${id}.components`]?.id}
                                    layerTitle={layerItems[`${component.id}.props.items.${id}.components`]?.title}
                                />
                            </AccordionContent>
                        </AccordionItem>
                    ))}
            </AccordionComponent>
        </div>
    }
);

Accordion.displayName = 'Accordion';


export {
    Accordion,
    getLayerIds,
    getDefaultProps,
    ConfigurableAccordionPropsSchema,
    type TConfigurableAccordionProps,
    type TAccordionProps,
};
