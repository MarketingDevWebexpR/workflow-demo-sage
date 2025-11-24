import React, { useEffect, useRef, useState, useMemo,  } from "react";
import { PageRenderer } from "./page-renderer/page-renderer";
import useEditedComponentIdReset from "./hooks/use-edited-component-id-reset";
import useEditedPageUpdate from "./hooks/use-edited-page-update";
import { useViewLoader } from "../hooks/use-view-loader";
import { FilePen } from "lucide-react";
import useScaleToFitParent from "../../../hooks/use-scale-to-fit-parent";
import { cn } from "../../../lib/utils";
import { type TPageComponent } from "../models/page.model";
import { throttle } from "lodash";
import { type IModuleComponent, type IModuleConfig } from "../../config";
import { type TComponentHighlighterProps, ComponentHighlighter } from "./component-highlighter";
import { DropPreview, type TDropPreviewProps } from "./drop-preview";
import { usePageStore } from "../store/page.store";
import styles from "./page-editor.module.scss";
import { Empty } from "../../../components/ui/empty/empty";
import { useWorkflowAutomationStore } from "../../workflow/store/workflow-automation.store";


// Composant mémorisé pour le rendu de la page
const MemoizedPageRenderer = React.memo(
    React.forwardRef<
        HTMLDivElement,
        {
            layerId: string;
            layerTitle: string;
            style: React.CSSProperties;
            className: string;
        }
    >(({ layerId, layerTitle, style, className }, ref) => (
        <PageRenderer
            layerId={layerId}
            layerTitle={layerTitle}
            ref={ref}
            style={style}
            className={className}
        />
    ))
);

// Composant mémorisé pour le message de bienvenue
const WelcomeMessage = React.memo(() => {
    return (
        <Empty
            Icon={FilePen}
            title="Welcome to the designer"
            description="Create a new page to get started"
            className={styles.welcomeMessage}
        />
    );
});

// Encadrement des composants à mettre en évidence
const MemoizedComponentHighlighter = React.memo(({
    componentRect,
    savedRect,
    isEditing,
    componentTitle,
    ComponentIcon,
}: TComponentHighlighterProps) => (
    <ComponentHighlighter
        componentRect={componentRect}
        savedRect={savedRect}
        isEditing={isEditing}
        componentTitle={componentTitle}
        ComponentIcon={ComponentIcon}
    />
));

// Barre de prévisualisation du drop
const MemoizedDropPreview = React.memo(({
    previewRect,
    dragOverInfos,
    dragOverComponentTitle
}: TDropPreviewProps) => (
    <DropPreview
        previewRect={previewRect}
        dragOverInfos={dragOverInfos}
        dragOverComponentTitle={dragOverComponentTitle}
    />
));


const PageEditor = (): React.ReactElement => {
    const selectedView = usePageStore(state => state.selected.item);
    const editedComponentId = usePageStore(state => state.editedComponentId);
    const hoveredComponentId = usePageStore(state => state.hoveredComponentId);
    const dragOverInfos = usePageStore(state => state.dragOverInfos);
    const editorScrollTop = usePageStore(state => state.editorScrollTop);

    const editedPage = useWorkflowAutomationStore(state => state.workflowItem.selected.item);

    const moduleConfigs = [] as IModuleConfig[];

    // Mémoriser les données des composants depuis selected.item
    const pageComponents = useMemo(() => {
        if (!selectedView?.Components) {
            console.log('⚠️ [PageEditor] Pas de view sélectionnée');
            return [];
        }

        try {
            const components = JSON.parse(selectedView.Components) as TPageComponent[];
            console.log('📦 [PageEditor] Composants chargés depuis selected view:', components.length);
            return components;
        } catch (error) {
            console.error('❌ [PageEditor] Erreur parsing components:', error);
            return [];
        }
    }, [selectedView?.Components]);

    const editedComponent = useMemo(() =>
        pageComponents.find(component => component.id === editedComponentId),
        [pageComponents, editedComponentId]
    );

    const hoveredComponent = useMemo(() =>
        pageComponents.find(component => component.id === hoveredComponentId),
        [pageComponents, hoveredComponentId]
    );

    const allModuleComponentInfos = useMemo(() =>
        moduleConfigs.map(moduleConfig => moduleConfig.components).flat(),
        [moduleConfigs]
    );

    // Utiliser des refs pour les données qui ne déclenchent pas de re-render
    const highlightedComponentInfos = useRef<IModuleComponent | undefined>(undefined);
    highlightedComponentInfos.current = useMemo(() => {
        const highlightedComponent = editedComponent || hoveredComponent;
        return allModuleComponentInfos.find(moduleComponent =>
            moduleComponent.Component.displayName === highlightedComponent?.displayName
        ) || highlightedComponentInfos.current;
    }, [allModuleComponentInfos, editedComponent, hoveredComponent]);

    const dragOverAfterComponent = useMemo(() =>
        pageComponents.find(component => component.id === dragOverInfos?.afterComponentId),
        [pageComponents, dragOverInfos?.afterComponentId]
    );

    const dragOverComponentInfos = useRef<IModuleComponent | undefined>(undefined);
    dragOverComponentInfos.current = useMemo(() =>
        allModuleComponentInfos.find(moduleComponent =>
            moduleComponent.Component.displayName === dragOverAfterComponent?.displayName
        ) || dragOverComponentInfos.current,
        [allModuleComponentInfos, dragOverAfterComponent]
    );

    const pageRendererRef = useRef<HTMLDivElement>(null);

    // 🔄 Charger la view depuis l'API quand on change de stepId
    useViewLoader(editedPage?.Id?.toString());
    
    // 💾 Sauvegarder automatiquement les changements vers l'API
    useEditedPageUpdate();
    
    useEditedComponentIdReset();
    useScaleToFitParent(pageRendererRef, selectedView?.Id ?? null);

    const savedHighlightedComponentRectRef = useRef<DOMRect | null>(null);
    const [highlightedComponentRect, setHighlightedComponentRect] = useState<DOMRect | null>(null);

    // Effet pour mettre à jour le rectangle du composant survolé/édité
    useEffect(() => {
        const hoveredComponentElement = document.querySelector(
            `[data-page-component-id="${hoveredComponentId}"]`
        );

        const editedComponentElement = document.querySelector(
            `[data-page-component-id="${editedComponentId}"]`
        );

        const highlightedComponentElement = editedComponentElement || hoveredComponentElement;

        if (!highlightedComponentElement) {
            setHighlightedComponentRect(null);
            return;
        }

        const rect = highlightedComponentElement.getBoundingClientRect();
        setHighlightedComponentRect(rect);
        savedHighlightedComponentRectRef.current = rect;

        const onResize = () => {
            const rect = highlightedComponentElement.getBoundingClientRect();

            const hasValues = Object.values(rect.toJSON()).filter(Boolean).length;

            if (hasValues) {
                setHighlightedComponentRect(rect);
                savedHighlightedComponentRectRef.current = rect;
            }
        };
        const onResizeThrottled = throttle(onResize, 100, {
            leading: true,
            trailing: true,
        });
        const resizeObserver = new ResizeObserver(onResizeThrottled);
        resizeObserver.observe(highlightedComponentElement);

        return () => resizeObserver.disconnect();
    }, [
        hoveredComponentId,
        editedComponentId,
        selectedView,
        editorScrollTop,
    ]);

    // Mémoriser le calcul du rectangle de la barre de prévisualisation
    const previewBarRect = useMemo(() => {
        if (!dragOverInfos) return null;

        const contextContainer = document.querySelector(`[data-layer-id="${dragOverInfos?.context}"]`);
        const contextContainerRect = contextContainer?.getBoundingClientRect();
        const afterComponentElement = contextContainer?.querySelector(`[data-page-component-id="${dragOverInfos?.afterComponentId}"]`);
        const afterComponentRect = afterComponentElement?.getBoundingClientRect();
        const contextContainerLastChildRect = contextContainer?.lastElementChild?.children[0]?.getBoundingClientRect();

        return afterComponentRect ? {
            left: afterComponentRect?.left,
            top: afterComponentRect?.top,
            width: afterComponentRect?.width,
        } : contextContainerRect ? {
            left: contextContainerRect?.left,
            top: contextContainerLastChildRect?.bottom ?? 0,
            width: contextContainerRect?.width,
        } : null;
    }, [dragOverInfos]);

    // Mémoriser les propriétés pour PageRenderer pour éviter les re-renders inutiles
    const pageRendererProps = useMemo(() => ({
        layerId: "page",
        layerTitle: 'Page',
        style: { transform: 'scale( var(--scale-value) )' },
        className: cn(styles.pageRenderer, { [styles.pageRendererHidden]: !editedPage })
    }), [editedPage]);

    return (
        <div
            className={cn(
                styles.pageEditor,
                !editedPage && styles.pageEditorStart,
            )}
            data-page-editor
        >
            <>
                <MemoizedPageRenderer
                    {...pageRendererProps}
                    ref={pageRendererRef}
                />

                {!editedPage && <WelcomeMessage />}

                <MemoizedComponentHighlighter
                    componentRect={highlightedComponentRect}
                    savedRect={savedHighlightedComponentRectRef}
                    isEditing={!!editedComponentId}
                    componentTitle={highlightedComponentInfos.current?.titleKey || ''}
                    ComponentIcon={highlightedComponentInfos.current?.Icon}
                />

                <MemoizedDropPreview
                    previewRect={previewBarRect}
                    dragOverInfos={dragOverInfos}
                    dragOverComponentTitle={dragOverComponentInfos.current?.titleKey || dragOverComponentInfos.current?.Component.displayName || ''}
                />
            </>
        </div>
    );
};

export {
    PageEditor,
};
