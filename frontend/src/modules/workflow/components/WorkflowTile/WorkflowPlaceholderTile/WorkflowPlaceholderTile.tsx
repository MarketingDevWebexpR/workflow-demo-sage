import * as React from 'react';
import { useState, useEffect } from 'react';
import * as Icons from 'lucide-react';
import styles from './WorkflowPlaceholderTile.module.scss';
import workflowTileStyles from '../WorkflowTile.module.scss';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuItemContent,
    DropdownMenuItemIcon,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuSubTrigger,
    DropdownMenuTrigger,
} from '../../../../misc/components/dropdown-menu/dropdown-menu';
import { placeholderOptions, workflowCategories, getCategoryColor } from '../../../data/workflow-placeholder-options';
import { generateWorkflowElementText, insertBeforePlaceholderById } from '../../../utils/insert-workflow-element';
import workflowItemServices from '../../../services/workflow-item.services';
import { useWorkflowAutomationStore } from '../../../store/workflow-automation.store';
import { type TMapPoint } from '../../../useCases/mapEngine/mapEngineParts_02_01_2024_test/calcMapPoints';
import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuSeparator, ContextMenuTrigger } from '../../../../misc/components/context-menu/context-menu';
import { Plus, Trash2 } from 'lucide-react';
import { useWorkflowElementActions } from '../../../hooks/use-workflow-element-actions';


export default function WorkflowPlaceholderTile(props: TMapPoint) {
    const [open, setOpen] = useState(false);
    const dispatch = useWorkflowAutomationStore((state) => state.dispatch);
    const selectedWorkflow = useWorkflowAutomationStore((state) => state.workflowItem.selected.item);
    const selectedPlaceholderId = useWorkflowAutomationStore((state) => state.designer.selectedPlaceholderId);

    // Hook pour les actions du menu contextuel (clic droit)
    const { handleInsertBefore, handleDelete } = useWorkflowElementActions(props.item.id, 'placeholder');



    useEffect(() => {
        console.log('use effect open', open);
        if( open ) {
            console.log('option // props', props);
            dispatch({ type: 'SET_SELECTED_PLACEHOLDER_ID', payload: props.item.id });
        } else {
            dispatch({ type: 'SET_SELECTED_PLACEHOLDER_ID', payload: null });
        }
    }, [open]);

    const handleOptionSelect = async (optionId: string) => {
        console.log('[WorkflowPlaceholderTile] Option selected:', optionId);
        console.log('[WorkflowPlaceholderTile] Selected placeholder ID:', selectedPlaceholderId);
        setOpen(false);

        if (!selectedWorkflow?.WorkflowText) {
            console.warn('[WorkflowPlaceholderTile] No workflow text to update');
            return;
        }

        if (!selectedPlaceholderId) {
            console.warn('[WorkflowPlaceholderTile] No placeholder ID selected');
            return;
        }

        // Find the selected option
        const selectedOption = placeholderOptions.find(opt => opt.id === optionId);
        if (!selectedOption) {
            console.error('[WorkflowPlaceholderTile] Option not found:', optionId);
            return;
        }

        // Generate the XML text for this element
        const newElementText = generateWorkflowElementText(selectedOption);
        console.log('[WorkflowPlaceholderTile] Generated element:', newElementText);

        // Insert before the selected placeholder using its ID directly!
        // Much simpler and more robust than the old index-based approach
        const updatedWorkflowText = insertBeforePlaceholderById(
            selectedWorkflow.WorkflowText,
            newElementText,
            selectedPlaceholderId
        );

        console.log('[WorkflowPlaceholderTile] Updated workflow text:', updatedWorkflowText);

        // Update dans le store immédiatement (optimistic update)
        const updatedWorkflow = { ...selectedWorkflow, WorkflowText: updatedWorkflowText };
        dispatch({ type: 'SELECT_WORKFLOW_ITEM', payload: updatedWorkflow });

        // Update en arrière-plan dans SharePoint
        if (selectedWorkflow?.Id) {
            dispatch({ type: 'UPDATE_WORKFLOW_ITEM' });
            const result = await workflowItemServices.update.execute({
                sp: null,
                id: selectedWorkflow.Id,
                props: {
                    Title: undefined,
                    Description:undefined,
                    IsEnabled: undefined,
                    FragmentId: undefined,
                    WorkflowText: updatedWorkflowText,
                    Preferences: undefined,
                },
            });
            dispatch({ type: 'UPDATE_WORKFLOW_ITEM_FULFILLED', payload: result });

            if (result instanceof Error) {
                console.error('[WorkflowPlaceholderTile] Error updating workflow:', result);
                // Rollback en cas d'erreur
                dispatch({ type: 'SELECT_WORKFLOW_ITEM', payload: selectedWorkflow });
            }
        }
    };

    // Group options by category
    const categoriesMap = new Map<string, typeof placeholderOptions>();
    placeholderOptions.forEach(option => {
        if (!categoriesMap.has(option.category)) {
            categoriesMap.set(option.category, []);
        }
        const categoryArray = categoriesMap.get(option.category);
        if (categoryArray) {
            categoryArray.push(option);
        }
    });

    // Séparer les catégories avec sous-menus et les autres (qui iront dans "Autre")
    const submenuCategories: Array<{
        category: typeof workflowCategories[string];
        options: typeof placeholderOptions;
    }> = [];
    const otherOptions: typeof placeholderOptions = [];

    Array.from(categoriesMap.entries()).forEach(([categoryName, options]) => {
        const category = workflowCategories[categoryName];
        if (category?.isSubmenu) {
            submenuCategories.push({ category, options });
        } else {
            otherOptions.push(...options);
        }
    });

    return (
        <ContextMenu>
            <DropdownMenu open={open} onOpenChange={(isOpen) => {
                setOpen(isOpen);
                if (!isOpen) {
                    console.log('option // set null');
                    // Reset le placeholder sélectionné quand le menu se ferme
                    dispatch({ type: 'SET_SELECTED_PLACEHOLDER_ID', payload: null });
                }
            }}>
                <DropdownMenuTrigger asChild>
                    <ContextMenuTrigger asChild>
                        <div
                            className={ [
                                workflowTileStyles.commonItem,
                                styles.workflowPlaceholderTile,
                            ].join(' ') }
                            data-id={ props.item.id }
                        >
                            <Icons.Plus size={16} />
                            <span className={styles.text}>{props.item?.title}</span>
                        </div>
                    </ContextMenuTrigger>
                </DropdownMenuTrigger>
            <DropdownMenuContent
                className={styles.dropdownContent}
                align="start"
                sideOffset={8}
            >
                <DropdownMenuLabel className={styles.dropdownLabel}>
                    Add element
                </DropdownMenuLabel>
                <DropdownMenuSeparator />

                {/* Catégories avec sous-menus */}
                {submenuCategories.map(({ category, options }, categoryIndex) => {
                    const CategoryIcon = category.Icon;
                    return (
                        <React.Fragment key={category.id}>
                            {categoryIndex > 0 && <DropdownMenuSeparator />}
                            <DropdownMenuSub>
                                <DropdownMenuSubTrigger
                                    className={styles.categoryLabel}
                                    style={{ '--workflow-category-color': category.color,
                                        '--workflow-category-border-color': category.borderColor,
                                     } as React.CSSProperties}
                                >
                                    <CategoryIcon size={16} />
                                    {category.name}
                                </DropdownMenuSubTrigger>
                                <DropdownMenuSubContent className={styles.dropdownContent}>
                                    {options.map((option) => {
                                        const Icon = option.Icon;
                                        const categoryColor = getCategoryColor(option.category);

                                        return (
                                            <DropdownMenuItem
                                                key={option.id}
                                                onClick={() => handleOptionSelect(option.id)}
                                                style={{ '--workflow-category-color': categoryColor } as React.CSSProperties}
                                            >
                                                <DropdownMenuItemContent>
                                                    {Icon && <DropdownMenuItemIcon icon={Icon} className={styles.optionIcon} />}
                                                    <div className={styles.optionText}>
                                                        <div className={styles.optionTitle}>{option.title}</div>
                                                        <div className={styles.optionDescription}>{option.description}</div>
                                                    </div>
                                                </DropdownMenuItemContent>
                                            </DropdownMenuItem>
                                        );
                                    })}
                                </DropdownMenuSubContent>
                            </DropdownMenuSub>
                        </React.Fragment>
                    );
                })}

                {/* Séparateur avant "Autre" */}
                {otherOptions.length > 0 && <DropdownMenuSeparator />}

                {/* Catégorie "Autre" pour tout le reste */}
                {otherOptions.length > 0 && (
                    <DropdownMenuSub>
                        <DropdownMenuSubTrigger className={styles.categoryLabel}>
                            <Icons.MoreHorizontal size={16} />
                            Other category
                        </DropdownMenuSubTrigger>
                        <DropdownMenuSubContent className={styles.dropdownContent}>
                            {otherOptions.map((option) => {
                                const Icon = option.Icon;
                                const categoryColor = getCategoryColor(option.category);

                                return (
                                    <DropdownMenuItem
                                        key={option.id}
                                        onClick={() => handleOptionSelect(option.id)}
                                        style={{ '--workflow-category-color': categoryColor } as React.CSSProperties}
                                    >
                                        <DropdownMenuItemContent>
                                            {Icon && <DropdownMenuItemIcon icon={Icon} />}
                                            <div className={styles.optionText}>
                                                <div className={styles.optionTitle}>{option.title}</div>
                                                <div className={styles.optionDescription}>{option.description}</div>
                                            </div>
                                        </DropdownMenuItemContent>
                                    </DropdownMenuItem>
                                );
                            })}
                        </DropdownMenuSubContent>
                    </DropdownMenuSub>
                )}
            </DropdownMenuContent>
            </DropdownMenu>
            <ContextMenuContent style={{ minWidth: '200px' }}>
                <ContextMenuItem onSelect={handleInsertBefore}>
                    <Plus size={16} style={{ marginRight: 'var(--spacing-2)', color: 'var(--primary-color-500)' }} />
                    Insert before
                </ContextMenuItem>
                <ContextMenuSeparator />
                <ContextMenuItem
                    onSelect={handleDelete}
                    style={{ color: 'var(--text-destructive)' }}
                >
                    <Trash2 size={16} style={{ marginRight: 'var(--spacing-2)', }} />
                    Delete
                </ContextMenuItem>
            </ContextMenuContent>
        </ContextMenu>
    );
}

