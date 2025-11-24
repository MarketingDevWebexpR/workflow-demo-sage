import { toast } from 'sonner';
import { insertPlaceholderBeforeElement, deleteElementById, updateElementJsonAttribute, getElementJsonAttribute } from '../utils/manipulate-workflow-elements';
import { useWorkflowAutomationStore } from '../store/workflow-automation.store';
import workflowItemServices from '../services/workflow-item.services';
import { extractErrorMessage } from '../../../utils/error.utils';

/**
 * Hook personnalisé pour gérer les actions contextuelles sur les éléments de workflow
 * Centralise toute la logique de manipulation (insert, delete, duplicate, etc.)
 *
 * @param elementId - L'ID unique de l'élément de workflow
 * @param elementType - Le type d'élément (pour personnaliser les messages)
 * @returns Objet contenant les handlers pour chaque action
 */
export function useWorkflowElementActions(elementId: string, elementType: 'action' | 'condition' | 'placeholder' | 'status' = 'action') {
    console.log({elementId, elementType});
    const selectedWorkflow = useWorkflowAutomationStore((s) => s.workflowItem.selected.item);
    const dispatch = useWorkflowAutomationStore((s) => s.dispatch);

    /**
     * Met à jour le workflow dans SharePoint avec gestion optimiste
     */
    const updateWorkflow = async (updatedWorkflowText: string) => {
        if (!selectedWorkflow) {
            toast.error('Error', {
                description: 'No workflow selected',
            });
            return false;
        }

        try {
            // Mise à jour optimiste pour UX instantanée
            const optimisticWorkflow = {
                ...selectedWorkflow,
                WorkflowText: updatedWorkflowText,
            };

            dispatch({
                type: 'UPDATE_WORKFLOW_ITEM_OPTIMISTIC',
                payload: optimisticWorkflow,
            });

            // Mise à jour dans SharePoint
            dispatch({ type: 'UPDATE_WORKFLOW_ITEM' });

            const result = await workflowItemServices.update.execute({
                sp: null,
                id: selectedWorkflow.Id,
                props: {
                    Title: undefined,
                    Description: undefined,
                    IsEnabled: undefined,
                    FragmentId: undefined,
                    WorkflowText: updatedWorkflowText,
                    Preferences: undefined,
                },
            });

            if (result instanceof Error) {
                toast.error('Error updating workflow', {
                    description: extractErrorMessage(result),
                });
                dispatch({
                    type: 'UPDATE_WORKFLOW_ITEM_FULFILLED',
                    payload: result,
                });
                return false;
            } else {
                dispatch({
                    type: 'UPDATE_WORKFLOW_ITEM_FULFILLED',
                    payload: result,
                });
                return true;
            }
        } catch (error) {
            toast.error('Error updating workflow', {
                description: extractErrorMessage(error as Error),
            });
            return false;
        }
    };

    /**
     * Insère un nouveau placeholder avant cet élément
     */
    const handleInsertBefore = async () => {
        if (!selectedWorkflow?.WorkflowText) {
            toast.error('Error', {
                description: 'No workflow selected',
            });
            return;
        }

        const newStepText = 'New step here';
        const updatedWorkflowText = insertPlaceholderBeforeElement(
            selectedWorkflow.WorkflowText,
            elementId,
            newStepText
        );

        await updateWorkflow(updatedWorkflowText);
    };

    /**
     * Insère un nouveau placeholder après cet élément
     * TODO: Implémenter insertPlaceholderAfterElement dans manipulate-workflow-elements.ts
     */
    const handleInsertAfter = async () => {
        toast.info('Coming soon', {
            description: 'Insert after functionality will be implemented soon',
        });
        // TODO: Implémenter la logique
    };

    /**
     * Supprime cet élément du workflow
     */
    const handleDelete = async () => {
        if (!selectedWorkflow?.WorkflowText) {
            toast.error('Error', {
                description: 'No workflow selected',
            });
            return;
        }

        const updatedWorkflowText = deleteElementById(
            selectedWorkflow.WorkflowText,
            elementId
        );

        await updateWorkflow(updatedWorkflowText);
    };

    /**
     * Déplace cet élément vers le haut
     * TODO: Implémenter moveElementUp dans manipulate-workflow-elements.ts
     */
    const handleMoveUp = async () => {
        toast.info('Coming soon', {
            description: 'Move up functionality will be implemented soon',
        });
        // TODO: Implémenter la logique
    };

    /**
     * Déplace cet élément vers le bas
     * TODO: Implémenter moveElementDown dans manipulate-workflow-elements.ts
     */
    const handleMoveDown = async () => {
        toast.info('Coming soon', {
            description: 'Move down functionality will be implemented soon',
        });
        // TODO: Implémenter la logique
    };

    // PAS ENCORE TESTÉ !! C'est justeune suggestion de l'IA
    /**
     * Met à jour un attribut JSON sur cet élément
     * @param attributeName - Le nom de l'attribut (ex: 'data', 'config', 'props')
     * @param jsonData - Les données JSON à sauvegarder
     */
    const handleUpdateJsonAttribute = async (attributeName: string, jsonData: Record<string, any>) => {
        if (!selectedWorkflow?.WorkflowText) {
            toast.error('Error', {
                description: 'No workflow selected',
            });
            return false;
        }

        const updatedWorkflowText = updateElementJsonAttribute(
            selectedWorkflow.WorkflowText,
            elementId,
            attributeName,
            jsonData
        );

        return await updateWorkflow(updatedWorkflowText);
    };

    /**
     * Récupère un attribut JSON de cet élément
     * @param attributeName - Le nom de l'attribut (ex: 'data', 'config', 'props')
     * @returns Les données JSON parsées ou null
     */
    const getJsonAttribute = (attributeName: string): Record<string, any> | null => {
        if (!selectedWorkflow?.WorkflowText) {
            return null;
        }

        return getElementJsonAttribute(
            selectedWorkflow.WorkflowText,
            elementId,
            attributeName
        );
    };

    return {
        handleInsertBefore,
        handleInsertAfter,
        handleDelete,
        handleMoveUp,
        handleMoveDown,
        handleUpdateJsonAttribute,
        getJsonAttribute,
    };
}

