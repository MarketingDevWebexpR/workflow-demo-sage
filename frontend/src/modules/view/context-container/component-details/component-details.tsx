import React, { useState } from "react";
import { getArrayFromStringifiedJson } from "../../../../utils/json.utils";
import { type TPageComponent } from "../../models/page.model";
import { usePageStore } from "../../store/page.store";
import styles from "./component-details.module.scss";
import CategoryTabs, { CategoryTabTrigger } from "../../../../components/ui/category-tabs/category-tabs";
import { Info } from "lucide-react";
import { config } from "../../../misc/module.config";


export default function ComponentDetails(): React.ReactElement {

    const selectedView = usePageStore(state => state.selected.item);
    const editedComponentId = usePageStore(state => state.editedComponentId);
    const moduleConfigs = [config];

    const [activeCategory, setActiveCategory] = useState<'props' | 'about'>('props');

    const editedComponent = getArrayFromStringifiedJson<TPageComponent>(selectedView?.Components || '[]')
        .find(component => component.id === editedComponentId);

    const moduleComponent = moduleConfigs
        .map(moduleConfig => moduleConfig.components)
        .flat()
        .find(moduleComponent => moduleComponent.Component.displayName === editedComponent?.displayName);

    const PropsForm = moduleComponent?.PropsForm
        ? moduleComponent.PropsForm
        : () => <div
            className={styles.componentDetailsNotCustomizable}
        >
            <Info size={16} />
            Component Details Not Customizable
        </div>

    const Icon = moduleComponent?.Icon;
    const componentTitle = moduleComponent?.titleKey ? moduleComponent.titleKey : '';

    return <div
        className={styles.componentDetails}
        data-component-details
    >
        <div className={styles.componentDetailsHeader}>
            <h3 className={styles.componentDetailsTitle}>
                <span className={styles.componentDetailsTitleIconWrapper}>
                    {Icon ? <Icon className={styles.componentDetailsTitleIcon} /> : null}
                </span>
                <span>{componentTitle}</span>
            </h3>
        </div>
        <div className={styles.componentDetailsContent}>
            <CategoryTabs
                activeCategory={activeCategory}
                onCategoryChange={(categoryId: string) => setActiveCategory(categoryId as 'props' | 'about')}
                className={styles.componentDetailsTabs}
            >
                <CategoryTabTrigger
                    id="props"
                    title="Properties"
                >Properties</CategoryTabTrigger>
                <CategoryTabTrigger
                    id="about"
                    title="About"
                >About</CategoryTabTrigger>
            </CategoryTabs>
            {
                activeCategory === 'props'
                    ? <PropsForm />
                    : <div className={styles.componentDetailsAbout}>
                        <div className={styles.componentDetailsAboutItemKey}>ID</div><div className={styles.componentDetailsAboutItemValue}>{editedComponentId}</div>
                        <div className={styles.componentDetailsAboutItemKey}>Name</div><div className={styles.componentDetailsAboutItemValue}>{editedComponent?.displayName}</div>
                        <div className={styles.componentDetailsAboutItemKey}>Updated At</div><div className={styles.componentDetailsAboutItemValue}>{
                            editedComponent?.updatedAt
                                ? new Date(editedComponent.updatedAt).toLocaleString()
                                : 'Not Available'
                        }</div>
                        <div className={styles.componentDetailsAboutItemKey}>Context</div><div className={styles.componentDetailsAboutItemValue}>{editedComponent?.context}</div>
                        <div className={styles.componentDetailsAboutItemKey}>Props</div><div className={styles.componentDetailsAboutItemValue}>
                            <pre>{JSON.stringify(editedComponent?.props, null, 8)}
                            </pre>
                        </div>
                    </div>
            }
        </div>
    </div>;
}
