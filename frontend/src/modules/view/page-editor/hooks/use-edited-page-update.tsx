import { useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { usePageStore } from "../../store/page.store";
import { useWorkflowAutomationStore } from "../../../workflow/store/workflow-automation.store";
import ViewServices from "../../../workflow/services/view.services";

/**
 * Hook qui sauvegarde automatiquement les modifications de la view vers Supabase
 * Debounce de 2 secondes
 */
const useEditedPageUpdate = (): void => {

    const { stepId } = useParams<{ stepId: string }>();
    const selectedWorkflow = useWorkflowAutomationStore(state => state.workflowItem.selected.item);

    // Recuperer les components depuis selected.item
    const selectedView = usePageStore(state => state.selected.item);
    const editedPageComponents = selectedView?.Components;
    const dispatch = usePageStore(state => state.dispatch);

    // Ref pour eviter les sauvegardes au premier montage
    const isFirstRender = useRef(true);
    const lastSavedComponentsRef = useRef<string | null>(null);

    useEffect(() => {

        // Verifications de base
        if (!selectedWorkflow?.Id || !stepId || !editedPageComponents) {
            return;
        }

        // Skip au premier render
        if (isFirstRender.current) {
            isFirstRender.current = false;
            lastSavedComponentsRef.current = editedPageComponents;
            return;
        }

        // Skip si identique a la derniere sauvegarde
        if (editedPageComponents === lastSavedComponentsRef.current) {
            return;
        }

        // Debounce de 2 secondes avant la sauvegarde
        const timeoutId = setTimeout(async () => {
            // Indiquer qu'on est en train de sauvegarder
            dispatch({ type: 'SET_VIEW_SAVE_STATUS', payload: { status: 'saving' } });

            try {
                // Sauvegarder vers Supabase via ViewServices
                await ViewServices.upsert(
                    selectedWorkflow.Id.toString(),
                    stepId,
                    { components: editedPageComponents }
                );

                lastSavedComponentsRef.current = editedPageComponents;
                dispatch({ type: 'SET_VIEW_SAVE_STATUS', payload: { status: 'success' } });

                // Reinitialiser le statut apres 2 secondes
                setTimeout(() => {
                    dispatch({ type: 'SET_VIEW_SAVE_STATUS', payload: { status: 'idle' } });
                }, 2000);

            } catch (error) {
                dispatch({
                    type: 'SET_VIEW_SAVE_STATUS',
                    payload: {
                        status: 'error',
                        error: error instanceof Error ? error.message : 'Unknown error'
                    }
                });
            }
        }, 2000);

        return () => {
            clearTimeout(timeoutId);
        };

    }, [editedPageComponents, stepId, selectedWorkflow?.Id, dispatch]);
};

export default useEditedPageUpdate;
