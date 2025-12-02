import React, { useState, useMemo, useEffect } from 'react';
import styles from './polygon-sidebar-ihm-view.module.scss';
import { SiteTree } from '../../../../../modules/view/site-tree/site-tree';
import FancyTabs from '../../../../../modules/misc/components/fancy-tabs/fancy-tabs';
import { AiUiBuilder } from './ai-ui-builder/ai-ui-builder';
import { ComponentsPicker } from './components-picker/components-picker';
import { SelectedComponent } from './selected-component/selected-component';
import { usePageStore } from '../../../../../modules/view/store/page.store';


type TPolygonSidebarIhmViewProps = {
    onNavigate: (viewIndex: number) => void;
}

type TabKey = 'ai-builder' | 'site-tree' | 'components' | 'selected-component';

const PolygonSidebarIhmView = ({ }: TPolygonSidebarIhmViewProps): React.ReactElement => {
    const [activeTab, setActiveTab] = useState<TabKey>('ai-builder');
    const editedComponentId = usePageStore(state => state.editedComponentId);

    // Basculer automatiquement vers "selected-component" quand un composant est édité
    useEffect(() => {
        if (editedComponentId) {
            setActiveTab('selected-component');
        }
    }, [editedComponentId]);

    // Map élégant pour associer chaque tab à son composant
    const tabComponents: Record<TabKey, React.ReactElement> = useMemo(() => ({
        'ai-builder': <AiUiBuilder />,
        'site-tree': <SiteTree className={styles.siteTree} />,
        'components': <ComponentsPicker />,
        'selected-component': <SelectedComponent />,
    }), []);

    return <div className={styles.polygonSidebarIhmView}>
        <FancyTabs
            className={styles.fancyTabs}
            defaultValue="ai-builder"
            value={activeTab}
            values={[
                { value: 'ai-builder', label: 'AI Builder' },
                { value: 'site-tree', label: 'Tree View' },
                { value: 'components', label: 'Components' },
                { value: 'selected-component', label: 'Selected' },
            ]}
            onValueChange={(value) => setActiveTab(value as TabKey)}
        />
        
        {/* Rendu élégant du composant actif */}
        <div className={styles.polygonSidebarIhmViewContent}>
            {tabComponents[activeTab]}
        </div>
    </div>;
};


export {
    PolygonSidebarIhmView,
};

