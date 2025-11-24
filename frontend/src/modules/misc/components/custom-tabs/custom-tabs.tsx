import React, { useState } from "react";
import CategoryTabs from "../../../../components/ui/category-tabs/category-tabs";
import { CategoryTabTrigger } from "../../../../components/ui/category-tabs/category-tabs";
import { z } from "zod";
import { PageRenderer } from "../../../view/page-editor/page-renderer/page-renderer";
import { cn } from "../../../../lib/utils";
import { type TPageComponent } from "../../../view/models/page.model";
import { getObjectFromStringifiedJson } from "../../../../utils/json.utils";
import { appLaunchTimestamp } from "../../../../utils/number.utils";
import { v4 as uuidv4 } from 'uuid';
import styles from './custom-tabs.module.scss';


const ConfigurableCustomTabsPropsSchema = z.object({
    tabs: z.array(
        z.object({
            id: z.string(),
            title: z.string(),
        })
    ),
});

type TConfigurableCustomTabsProps = z.infer<typeof ConfigurableCustomTabsPropsSchema>;

type TStaticCustomTabsProps = {};

type TCustomTabsProps = TConfigurableCustomTabsProps & TStaticCustomTabsProps & React.HTMLAttributes<HTMLDivElement>;

function getLayerIds(pageComponent: TPageComponent): { [key: string]: { id: string, title: string } } {

    const props = pageComponent.props as TConfigurableCustomTabsProps;

    return props?.tabs?.reduce((acc, tab) => {
        acc[`${pageComponent.id}.props.tabs.${tab.id}.components`] = {
            id: `${pageComponent.id}.props.tabs.${tab.id}.components`,
            title: tab.title
        };
        return acc;
    }, {} as { [key: string]: { id: string, title: string } }) ?? {};
}

function getDefaultProps(): TConfigurableCustomTabsProps {
    return {
        tabs: [
            {
                id: `${appLaunchTimestamp}-${uuidv4()}`,
                title: 'Onglet 1'
            },
            {
                id: `${appLaunchTimestamp}-${uuidv4()}`,
                title: 'Onglet 2'
            },
            {
                id: `${appLaunchTimestamp}-${uuidv4()}`,
                title: 'Onglet 3'
            },
        ],
    };
}

const CustomTabs = React.forwardRef<HTMLDivElement, TCustomTabsProps>(
    ({ className, ...props }, ref) => {

        const tabs = props?.tabs || [];

        const [activeTabId, setActiveTabId] = useState<string>(tabs[0]?.id?.toString());

        const component = {
            id: props['data-page-component-id' as keyof typeof props],
            props: getObjectFromStringifiedJson<TConfigurableCustomTabsProps | undefined>(props['data-page-component-props' as keyof typeof props])
        } as TPageComponent;

        const layerTabs = getLayerIds(component);

        return <div
            ref={ref}
            className={cn(styles.customTabs, className)}
            {...props}
        >
            <CategoryTabs
                activeCategory={activeTabId}
                onCategoryChange={setActiveTabId}
                data-keep-pointer-events
            >
                {tabs.map(tab => (
                    <CategoryTabTrigger
                        key={tab.id}
                        id={tab.id.toString()}
                        title={tab.title}
                    >{tab.title}</CategoryTabTrigger>
                ))}
            </CategoryTabs>
            {activeTabId
                ? <PageRenderer
                    className={styles.customTabsPageRenderer}
                    layerId={layerTabs[`${component.id}.props.tabs.${activeTabId}.components`]?.id}
                    layerTitle={layerTabs[`${component.id}.props.tabs.${activeTabId}.components`]?.title}
                />
                : null}
        </div>
    }
);

CustomTabs.displayName = 'CustomTabs';


export {
    CustomTabs,
    getLayerIds,
    getDefaultProps,
    ConfigurableCustomTabsPropsSchema,
    type TConfigurableCustomTabsProps,
    type TStaticCustomTabsProps,
    type TCustomTabsProps,
};
