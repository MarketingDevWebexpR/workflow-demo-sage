import { useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { usePageStore } from '../store/page.store';
import ViewServices from '../../workflow/services/view.services';

/**
 * Hook qui charge la view depuis Supabase quand on change de stepId
 * et nettoie le store quand on quitte
 */
export function useViewLoader(workflowId: string | undefined): void {

    const { stepId } = useParams<{ stepId: string }>();
    const dispatch = usePageStore(state => state.dispatch);
    const lastStepIdRef = useRef<string | null>(null);

    // Nettoyage quand on demonte le composant
    useEffect(() => {
        return () => {
            dispatch({ type: 'SELECT_PAGE', payload: null });
        };
    }, [dispatch]);

    useEffect(() => {
        if (!workflowId || !stepId) {
            console.log('[useViewLoader] No workflowId or stepId');
            return;
        }

        // Ne charger que si on change d'etape
        if (lastStepIdRef.current === stepId) {
            console.log('[useViewLoader] Same stepId, skip');
            return;
        }

        lastStepIdRef.current = stepId;

        const loadOrCreateView = async () => {
            try {
                // Tenter de charger la vue existante
                const existingView = await ViewServices.getByStepId(workflowId, stepId);

                if (existingView) {
                    // La vue existe deja en base de donnees
                    console.log('[useViewLoader] Existing view loaded', existingView);
                    dispatch({
                        type: 'SELECT_PAGE',
                        payload: {
                            Id: parseInt(existingView.Id, 10),
                            Title: `View ${stepId}`,
                            Path: '',
                            Created: existingView.createdAt,
                            Modified: existingView.updatedAt,
                            Components: existingView.components,
                        },
                    });
                } else {
                    // La vue n'existe pas, on doit la creer en base de donnees
                    console.log('[useViewLoader] View not found, creating...');

                    const newView = await ViewServices.upsert(workflowId, stepId, {
                        components: '[]',
                    });

                    if (newView) {
                        // Vue creee avec succes
                        console.log('[useViewLoader] View created successfully', newView.Id);
                        dispatch({
                            type: 'SELECT_PAGE',
                            payload: {
                                Id: parseInt(newView.Id, 10),
                                Title: `View ${stepId}`,
                                Path: '',
                                Created: newView.createdAt,
                                Modified: newView.updatedAt,
                                Components: newView.components,
                            },
                        });
                    } else {
                        console.error('[useViewLoader] Failed to create view');
                    }
                }
            } catch (error) {
                console.error('[useViewLoader] Error loading/creating view', error);
            }
        };

        loadOrCreateView();
    }, [workflowId, stepId, dispatch]);
}
