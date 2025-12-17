import { useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { usePageStore } from '../store/page.store';
import { API_WORKFLOWS_URL } from '../../../lib/api';

/**
 * Hook qui charge la view depuis l'API quand on change de stepId
 * et nettoie le store quand on quitte
 */
export function useViewLoader(workflowId: string | undefined): void {

    const { stepId } = useParams<{ stepId: string }>();
    const dispatch = usePageStore(state => state.dispatch);
    const lastStepIdRef = useRef<string | null>(null);

    // 🧹 Nettoyage quand on démonte le composant
    useEffect(() => {
        return () => {
            dispatch({ type: 'SELECT_PAGE', payload: null });
        };
    }, [dispatch]);

    useEffect(() => {
        if (!workflowId || !stepId) {
            console.log('🔴 [useViewLoader] Pas de workflowId ou stepId');
            return;
        }

        // Ne charger que si on change d'étape
        if (lastStepIdRef.current === stepId) {
            console.log('🟡 [useViewLoader] Même stepId, skip');
            return;
        }

        lastStepIdRef.current = stepId;

        const loadOrCreateView = async () => {
            try {
                // Tenter de charger la vue existante
                const getResponse = await fetch(`${API_WORKFLOWS_URL}/${workflowId}/views/${stepId}`);
                const getResult = await getResponse.json();

                if (getResult.success && getResult.exists && getResult.data) {
                    // ✅ La vue existe déjà en base de données
                    console.log('✅ [useViewLoader] Vue existante chargée', getResult.data);
                    dispatch({
                        type: 'SELECT_PAGE',
                        payload: {
                            Id: parseInt(getResult.data._id || getResult.data.Id || Date.now(), 10),
                            Title: `View ${stepId}`,
                            Path: '',
                            Created: getResult.data.createdAt || new Date().toISOString(),
                            Modified: getResult.data.updatedAt || new Date().toISOString(),
                            Components: getResult.data.components || '[]',
                        },
                    });
                } else if (getResult.success && !getResult.exists) {
                    // ⚠️ La vue n'existe pas, on doit la créer en base de données
                    console.log('⚠️ [useViewLoader] Vue inexistante, création en cours...');
                    
                    const createResponse = await fetch(
                        `${API_WORKFLOWS_URL}/${workflowId}/views/${stepId}`,
                        {
                            method: 'PUT',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({
                                components: '[]',
                            }),
                        }
                    );

                    const createResult = await createResponse.json();

                    if (createResult.success && createResult.data) {
                        // ✅ Vue créée avec succès
                        console.log('✅ [useViewLoader] Vue créée avec succès', createResult.data._id || createResult.data.Id);
                        dispatch({
                            type: 'SELECT_PAGE',
                            payload: {
                                Id: parseInt(createResult.data._id || createResult.data.Id, 10),
                                Title: `View ${stepId}`,
                                Path: '',
                                Created: createResult.data.createdAt || new Date().toISOString(),
                                Modified: createResult.data.updatedAt || new Date().toISOString(),
                                Components: createResult.data.components || '[]',
                            },
                        });
                    } else {
                        console.error('❌ [useViewLoader] Échec de la création de la vue', createResult.error);
                    }
                } else {
                    console.error('❌ [useViewLoader] Réponse inattendue du serveur', getResult);
                }
            } catch (error) {
                console.error('❌ [useViewLoader] Erreur lors du chargement/création de la vue', error);
            }
        };

        loadOrCreateView();
    }, [workflowId, stepId, dispatch]);
}

