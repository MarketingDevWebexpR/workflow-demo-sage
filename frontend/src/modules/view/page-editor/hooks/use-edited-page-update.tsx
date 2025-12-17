import { useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { usePageStore } from "../../store/page.store";
import { useWorkflowAutomationStore } from "../../../workflow/store/workflow-automation.store";
import { API_WORKFLOWS_URL } from "../../../../lib/api";

/**
 * Hook qui sauvegarde automatiquement les modifications de la view vers l'API
 * Debounce de 2 secondes
 */
const useEditedPageUpdate = (): void => {

    const { stepId } = useParams<{ stepId: string }>();
    const selectedWorkflow = useWorkflowAutomationStore(state => state.workflowItem.selected.item);

    // Récupérer les components depuis selected.item
    const selectedView = usePageStore(state => state.selected.item);
    const editedPageComponents = selectedView?.Components;
    const dispatch = usePageStore(state => state.dispatch);

    // Ref pour éviter les sauvegardes au premier montage
    const isFirstRender = useRef(true);
    const lastSavedComponentsRef = useRef<string | null>(null);

    useEffect(() => {

        // Vérifications de base
        if (!selectedWorkflow?.Id || !stepId || !editedPageComponents) {
            return;
        }

        // Skip au premier render
        if (isFirstRender.current) {
            isFirstRender.current = false;
            lastSavedComponentsRef.current = editedPageComponents;
            return;
        }

        // Skip si identique à la dernière sauvegarde
        if (editedPageComponents === lastSavedComponentsRef.current) {
            return;
        }

        // Debounce de 2 secondes avant la sauvegarde
        const timeoutId = setTimeout(async () => {
            // Indiquer qu'on est en train de sauvegarder
            dispatch({ type: 'SET_VIEW_SAVE_STATUS', payload: { status: 'saving' } });

            try {
                // Sauvegarder vers l'API /views
                const response = await fetch(`${API_WORKFLOWS_URL}/${selectedWorkflow.Id}/views/${stepId}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        components: editedPageComponents,
                    }),
                });

                const result = await response.json();

                if (!response.ok || !result.success) {
                    dispatch({ 
                        type: 'SET_VIEW_SAVE_STATUS', 
                        payload: { 
                            status: 'error',
                            error: result.error || 'Erreur inconnue'
                        } 
                    });
                } else {
                    lastSavedComponentsRef.current = editedPageComponents;
                    dispatch({ type: 'SET_VIEW_SAVE_STATUS', payload: { status: 'success' } });
                    
                    // Réinitialiser le statut après 2 secondes
                    setTimeout(() => {
                        dispatch({ type: 'SET_VIEW_SAVE_STATUS', payload: { status: 'idle' } });
                    }, 2000);
                }

            } catch (error) {
                dispatch({ 
                    type: 'SET_VIEW_SAVE_STATUS', 
                    payload: { 
                        status: 'error',
                        error: error instanceof Error ? error.message : 'Erreur inconnue'
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
