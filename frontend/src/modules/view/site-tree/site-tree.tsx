import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { EllipsisVertical, File, ChevronRight, ChevronDown, Box, Layers, Loader2, Circle, ListTree } from "lucide-react";
import { Empty } from "../../../components/ui/empty/empty";
import { cn } from "../../../lib/utils";
import { usePageStore } from "../store/page.store";
import { throttle } from "lodash";
import { BranchHighlighter, type TBranchHighlighterProps } from "./branch-highlighter";
import styles from "./site-tree.module.scss";
import { paths } from "../../../layout/router.constants";
import { useNavigate, useLocation } from "react-router-dom";
import type { TPageComponent } from "../models/page.model";
import { getArrayFromStringifiedJson } from "../../../utils/json.utils";


// Type pour notre arbre
type TreeNode = {
    id: string;
    type: 'page' | 'component' | 'layer';
    title: string;
    children?: TreeNode[];
    pageId?: number;
}

// Encadrement des composants à mettre en évidence
const MemoizedBranchHighlighter = React.memo(({
    branchRect,
    savedRect,
    isEditing,
}: TBranchHighlighterProps) => (
    <BranchHighlighter
        branchRect={branchRect}
        savedRect={savedRect}
        isEditing={isEditing}
    />
));

// Props pour le composant TreeNodeComponent
type TreeNodeProps = {
    node: TreeNode;
    level: number;
    expandedNodes: Record<string, boolean>;
    toggleNodeExpanded: (nodeId: string, e: React.MouseEvent) => void;
    hasUnsavedChanges: boolean;
    hoveredComponentId: string | null;
    editedComponentId: string | null;
    editedId: number | null;
    isUpdating: boolean;
    pages: any[];
    onNodeClick: (node: TreeNode) => void;
    onPageActionClick: (node: TreeNode, e: React.MouseEvent) => void;
}

// Composant mémorisé pour chaque nœud de l'arbre
const TreeNodeComponent = React.memo(({
    node,
    level,
    expandedNodes,
    toggleNodeExpanded,
    hasUnsavedChanges,
    hoveredComponentId,
    editedComponentId,
    editedId,
    isUpdating,
    pages,
    onNodeClick,
    onPageActionClick
}: TreeNodeProps) => {
    const expanded = !!expandedNodes[node.id];
    const hasChildNodes = !!node.children && node.children.length > 0;

    return (
        <div
            className={styles.treeNode}
            key={`tree-${node.id}`}
            {...level === 0 ? {
                'data-key': `tree-${node.id}`,
                'data-page-tree-root': true
            } : {
                'data-branch-id': node.id
            }}
        >
            <div className={styles.treeNodeStatic}>
                <div
                    className={cn(
                        styles.treeNodeRow,
                        {
                            [styles.treeNodeRowHovered]: hoveredComponentId === node.id && !editedComponentId,
                            [styles.treeNodeRowEdited]: (
                                node.type === 'page' && parseInt(node.id) === editedId
                            ) || (
                                    node.type === 'component' && node.id === editedComponentId
                                ),
                            [styles.treeNodeRowPage]: node.type === 'page',
                            [styles.treeNodeRowPageEdited]: node.type === 'page' && parseInt(node.id) === editedId
                        },
                    )}
                    style={{
                        '--tree-line-left': `calc(2rem + 1.25rem * ${level - 1} + 20px / 2 - 1px)`,
                        '--tree-content-left': `calc(2rem + 1.25rem * ${level})`,
                    } as React.CSSProperties}
                    onClick={() => onNodeClick(node)}
                >
                    {level > 0 && (
                        <span
                            className={styles.treeNodeRowLine}
                        />
                    )}

                    {hasChildNodes ? (
                        <span
                            className={cn(styles.treeNodeRowToggle, {
                                [styles.treeNodeRowToggleExpanded]: expanded,
                            })}
                            onClick={(e) => toggleNodeExpanded(node.id, e)}
                        >
                            {expanded ?
                                <ChevronDown className={styles.treeNodeRowToggleIcon} size={14} /> :
                                <ChevronRight className={styles.treeNodeRowToggleIcon} size={14} />
                            }
                        </span>
                    ) : (
                        <span className={styles.treeNodeRowTypeIcon}>
                            {node.type === 'page' ? (
                                <File size={14} />
                            ) : node.type === 'component' ? (
                                <Box size={14} />
                            ) : (
                                <Layers size={14} />
                            )}
                        </span>
                    )}

                    <span className={styles.treeNodeRowTitle}>{node.title}</span>

                    <div className={styles.treeNodeRowEnd}>
                        {node.type === 'page'  && <span
                            className={styles.treeNodeRowEndAction}
                            onClick={(e) => onPageActionClick(node, e)}
                        >
                            <EllipsisVertical size={16} className={styles.treeNodeRowEndActionIcon} />
                        </span>}

                        {node.type === 'page' && node.id === editedId?.toString() && isUpdating && <span className={styles.treeNodeRowEndSpinner}>
                            <Loader2 className={styles.treeNodeRowEndSpinnerIcon} size={16} />
                        </span>}

                        {node.type === 'page' && node.id === editedId?.toString() && hasUnsavedChanges && !isUpdating && <span className={styles.treeNodeRowEndChangesIndicator}>
                            <Circle className={styles.treeNodeRowEndChangesIndicatorIcon} size={8} />
                        </span>}
                    </div>
                </div>
            </div>

            {expanded && hasChildNodes && (
                <div className="tree-children">
                    {node.children?.map(child => (
                        <TreeNodeComponent
                            key={`tree-node-${child.id}`}
                            node={child}
                            level={level + 1}
                            expandedNodes={expandedNodes}
                            hasUnsavedChanges={hasUnsavedChanges}
                            toggleNodeExpanded={toggleNodeExpanded}
                            hoveredComponentId={hoveredComponentId}
                            editedComponentId={editedComponentId}
                            editedId={editedId}
                            isUpdating={false}
                            pages={pages}
                            onNodeClick={onNodeClick}
                            onPageActionClick={onPageActionClick}
                        />
                    ))}
                </div>
            )}
        </div>
    );
});

type TSiteTreeProps = {
    className?: string;
}

export function SiteTree({ className }: TSiteTreeProps = {}): React.ReactElement {
    const dispatch = usePageStore(state => state.dispatch);
    const navigate = useNavigate();
    const location = useLocation();

    // Extraire workflowId et stepId depuis l'URL (/workflow/:workflowId/:stepId/ihm)
    const urlMatch = location.pathname.match(/^\/workflow\/([^/]+)\/([^/]+)\/ihm$/);
    const workflowId = urlMatch?.[1] || '';
    const stepId = urlMatch?.[2] || '';

    // Utilisation de usePageStore au lieu de useAppSelector
    const selectedView = usePageStore(state => state.selected.item);
    const editedId = usePageStore(state => state.editedId);
    const hoveredComponentId = usePageStore(state => state.hoveredComponentId);
    const editedComponentId = usePageStore(state => state.editedComponentId);
    const selected = usePageStore(state => state.selected);
    const treeViewScrollTop = usePageStore(state => state.treeViewScrollTop);

    const isUpdating = selected.isUpdating;
    const hasUnsavedChanges = selected.hasUnsavedChanges;

    // État pour suivre les nœuds dépliés (true = déplié, false = replié)
    const [expandedNodes, setExpandedNodes] = useState<Record<string, boolean>>({});

    // Fonction pour basculer l'état déplié/replié d'un nœud
    const toggleNodeExpanded = (nodeId: string, e: React.MouseEvent) => {

        e.stopPropagation();
        setExpandedNodes(prev => ({
            ...prev,
            [nodeId]: !prev[nodeId]
        }));
    };

    // Vérifie si un nœud a des enfants
    // const hasChildren = (node: TreeNode): boolean => {
    //     return !!node.children && node.children.length > 0;
    // };

    // Vérifie si un nœud est actuellement déplié
    // const isNodeExpanded = (nodeId: string): boolean => {
    //     return !!expandedNodes[nodeId];
    // };

    const allModuleComponentInfos = useMemo(() => [
        {
            Component: {
                displayName: 'Component 1',
            },
            context: '1',
            getLayerIds: (_: TPageComponent) => {
                return {
                    '1': {
                        id: '1',
                        title: 'Layer 1',
                    }
                }
            }
        }
    ], []);

    // 🔧 FIX: Mémoriser buildTree pour éviter la re-création à chaque render
    const buildTree = useCallback((
        components: TPageComponent[],
        contextId: string,
        pageId: number
    ): TreeNode[] => {

        return components
            .filter(component => {

                // Vérifier que le === ne pète rien par rapport au === initial
                return component.context === contextId;
            })
            .map((component: TPageComponent) => {

                const moduleComponentInfos = allModuleComponentInfos.find(moduleComponent => moduleComponent.Component.displayName === component.displayName);

                return {
                    id: component.id.toString(),
                    type: 'component' as const,
                    title: component.displayName,
                    pageId,
                    // - Soit le composant n'est pas un composant avec des layers,
                    // et dans ce cas le buildTree renverra un tableau vide;
                    // - Soit le composant possède 1 seul layer,
                    // et dans ce cas on ne prend pas la peine de créer un nœud intermédiaire pour le layer;
                    // - Soit le composant possède plusieurs layers,
                    // et dans ce cas on crée un nœud intermédiaire pour chaque layer.
                    children: moduleComponentInfos && 'getLayerIds' in moduleComponentInfos
                        ? (() => {

                            const layers = moduleComponentInfos.getLayerIds?.(component);
                            const layerEntries = Object.entries(layers ?? {});

                            if (layerEntries.length > 1) {
                                return layerEntries.map(([, layer]) => {

                                    return {
                                        id: layer.id,
                                        type: 'layer' as const,
                                        title: layer.title,
                                        children: buildTree(
                                            components,
                                            layer.id,
                                            pageId
                                        ),
                                    };
                                })
                            } else if (layerEntries.length === 1) {
                                return buildTree(
                                    components,
                                    layerEntries[0][1].id,
                                    pageId
                                );
                            } else {
                                return [];
                            }
                        })()
                        : buildTree(
                            components,
                            component.id.toString(), // à remplacer par le layerId, chaque composant devra avoir sa fonction
                            pageId // on propage le pageId partout
                        )
                };
            });
    }, [allModuleComponentInfos]);

    const isMouseOutsideRef = useRef(false);

    useEffect(() => {

        const abortController = new AbortController();

        const onMouseMove = (e: MouseEvent) => {

            const target = e.target as HTMLElement;

            if (!target.closest('[data-page-tree-root]')) {
                if (!isMouseOutsideRef.current) {
                    isMouseOutsideRef.current = true;
                    dispatch({ type: 'SET_HOVERED_COMPONENT_ID', payload: null });
                }
                return;
            }

            isMouseOutsideRef.current = false;
            const closestBranch = target.closest('[data-branch-id]');
            const branchId = closestBranch?.getAttribute('data-branch-id');

            if (branchId && !editedComponentId) {
                dispatch({ type: 'SET_HOVERED_COMPONENT_ID', payload: branchId });
            }
        };
        const onScroll = (e: Event) => {

            const target = e.target as HTMLElement;

            if (!target.closest('[data-tree-view]')) {
                return;
            }

            if (!editedComponentId) {
                dispatch({ type: 'SET_HOVERED_COMPONENT_ID', payload: null });
                return;
            }

            dispatch({
                type: 'SET_TREE_VIEW_SCROLL_TOP',
                payload: target.closest('[data-tree-view]')?.scrollTop ?? null
            });
        }

        const onScrollThrottled = throttle(onScroll, 0, {
            leading: true,
            trailing: true,
        });
        const onMouseMoveThrottled = throttle(onMouseMove, 10);

        document.addEventListener('mousemove', onMouseMoveThrottled, { signal: abortController.signal });
        document.addEventListener('scroll', onScrollThrottled, {
            signal: abortController.signal,
            capture: true,
        });

        return () => {
            abortController.abort();
        };
    }, [editedComponentId]);

    // Permet d'ouvrir les nœuds intermédiaires dans l'arborescence
    // lorsque le composant sélectionné dans le canvas change
    useEffect(() => {

        if (!editedId) {
            return;
        }

        // A partir du composant sélectionné dans le canvas,
        // on remonte dans le DOM jusqu'au noeud parent afin d'ouvrir
        // tous les nœuds intermédiaires dans l'arborescence

        const elem = document.querySelector(`[data-page-component-id="${editedComponentId}"]`) as HTMLElement | null;

        const toExpand: string[] = [];

        const climbUpTree = (elem: HTMLElement) => {

            const nextElement = elem.parentElement?.closest("[data-page-component-id],[data-layer-id]") as HTMLElement;

            if (nextElement) {

                const { pageComponentId, layerId } = nextElement.dataset;

                toExpand.push(...[
                    pageComponentId,
                    layerId,
                ].filter(Boolean) as string[]);

                climbUpTree(nextElement);
            }
        };

        if (elem) {
            climbUpTree(elem);
            setExpandedNodes(prev => ({
                ...prev,

                // On ouvre le nœud de la page éditée
                [editedId.toString()]: true,

                // On ouvre les nœuds intermédiaires
                ...toExpand.reduce((acc, id) => ({
                    ...acc,
                    [id]: true
                }), {})
            }));
        }
    }, [editedComponentId]);




    const savedHighlightedBranchRectRef = useRef<DOMRect | null>(null);
    const [highlightedBranchRect, setHighlightedBranchRect] = useState<DOMRect | null>(null);

    // Effet pour mettre à jour le rectangle du composant survolé/édité
    useEffect(() => {
        const hoveredBranchElement = document.querySelector(
            `[data-branch-id="${hoveredComponentId}"]`
        );

        const editedBranchElement = document.querySelector(
            `[data-branch-id="${editedComponentId}"]`
        );

        const highlightedBranchElement = editedComponentId ? editedBranchElement : hoveredBranchElement;

        if (!highlightedBranchElement) {
            setHighlightedBranchRect(null);
            return;
        }

        const rect = highlightedBranchElement.getBoundingClientRect();
        setHighlightedBranchRect(rect);
        savedHighlightedBranchRectRef.current = rect;

        const onResize = () => {
            const rect = highlightedBranchElement.getBoundingClientRect();

            const hasValues = Object.values(rect.toJSON()).filter(Boolean).length;

            if (hasValues) {
                setHighlightedBranchRect(rect);
                savedHighlightedBranchRectRef.current = rect;
            }
        };
        const onResizeThrottled = throttle(onResize, 100, {
            leading: true,
            trailing: true,
        });
        const resizeObserver = new ResizeObserver(onResizeThrottled);
        resizeObserver.observe(highlightedBranchElement);

        return () => resizeObserver.disconnect();
    }, [
        hoveredComponentId,
        editedComponentId,
        selectedView,
        treeViewScrollTop,
        // 🔧 FIX: Retirer expandedNodes pour éviter la boucle de re-render
        // expandedNodes,
    ]);




    const tree = useMemo(() => {

        if(!selectedView) {
            return [];
        }

        return [{
            id: selectedView.Id.toString(),
            type: 'page' as const,
            title: selectedView.Title,
            children: buildTree(
                getArrayFromStringifiedJson<TPageComponent>(selectedView.Components || '[]'),
                'page',
                selectedView.Id
            )
        }];
    }, [selectedView, buildTree]);

    const handleNodeClick = useCallback((node: TreeNode) => {
        switch (node.type) {

            case 'page': {
                if( workflowId && stepId ) {
                    // Construire le path avec workflowId et stepId
                    const newPage = paths.workflowIhm
                        .replace(':workflowId', workflowId)
                        .replace(':stepId', stepId);

                    navigate( newPage );
                }
                // dispatch({ type: 'SET_EDITED_PAGE_ID', payload: parseInt(node.id) });
                break;
            }

            case 'component': {

                if (node.pageId) {
                    dispatch({ type: 'SET_EDITED_PAGE_ID', payload: node.pageId });
                }
                dispatch({ type: 'SET_EDITED_COMPONENT_ID', payload: node.id });
                break;
            }

            case 'layer': {
                alert('layer');
                break;
            }
        }
    }, [dispatch, workflowId, stepId, navigate]);

    const handlePageActionClick = useCallback((node: TreeNode, e: React.MouseEvent) => {
        e.stopPropagation();
        // On dispatch la selectedView seulement si l'ID correspond
        if (selectedView && selectedView.Id.toString() === node.id) {
            dispatch({ type: 'SELECT_PAGE', payload: selectedView });
        }
    }, [dispatch, selectedView]);


    return (
        <div className={cn(styles.siteTree, className)}>

            <div
                className={styles.siteTreeContent}
                data-tree-view
            >
                {
                    tree.length > 0
                        ? tree.map((node: TreeNode) => (
                            <TreeNodeComponent
                                key={`tree-root-${node.id}`}
                                node={node}
                                level={0}
                                expandedNodes={expandedNodes}
                                toggleNodeExpanded={toggleNodeExpanded}
                                hasUnsavedChanges={hasUnsavedChanges}
                                hoveredComponentId={hoveredComponentId}
                                editedComponentId={editedComponentId}
                                editedId={editedId}
                                isUpdating={isUpdating}
                                pages={selectedView ? [selectedView] : []}
                                onNodeClick={handleNodeClick}
                                onPageActionClick={handlePageActionClick}
                            />
                        ))
                        : <Empty
                            Icon={ListTree}
                            title="No pages yet"
                            description="Create a new page to get started"
                            className={styles.siteTreeEmpty}
                        />
                }
            </div>

            <MemoizedBranchHighlighter
                branchRect={highlightedBranchRect}
                savedRect={savedHighlightedBranchRectRef}
                isEditing={!!editedComponentId}
            />
        </div>
    );
}
