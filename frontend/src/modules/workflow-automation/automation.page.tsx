import React, { useState, useEffect, useRef, useCallback } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { MoreVertical, Edit3, Power, Download, Upload, Trash2, Copy, History, Share2, SlidersHorizontal, ArrowLeft } from "lucide-react";
import { AutomationIndex } from "../../components/ui/automation-index/automation-index";
// import { isPolygon } from "../../../../utils/sharepoint.utils"; // ❌ SharePoint - Supprimé
import { WorkflowRoot } from "./components/workflow-root/WorkflowRoot";
import { createWorkflowFromText } from "../../modules/workflow-automation/engine/create-workflow-from-text";
import { useWorkflowAutomationStore } from "../../modules/workflow-automation/store/workflow-automation.store";
import { Button } from "../../components/ui/button/button";
import styles from "./automation.page.module.scss";
// import workflowItemServices from "../../modules/workflow-automation/services/workflow-item.services"; // ❌ SharePoint services - À remplacer par API
import { type TCreateWorkflowItemProps, DEFAULT_WORKFLOW_PREFERENCES, type TWorkflowPreferences } from "../../modules/workflow-automation/models/workflow-item.model";
import { toast } from "sonner";
import { extractErrorMessage } from "../../utils/error.utils";
// import { PnPContext } from "../../contexts/pnp.context"; // ❌ PnP - Supprimé
// import { CurrentUserContext } from "../../contexts/current-user.context"; // ❌ SharePoint context - Supprimé
import { TimerBarToast } from "../../components/ui/sonner/timer-bar-toast/timer-bar-toast";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "../../components/ui/dropdown-menu/dropdown-menu";
import { NumericSlider } from "../../components/ui/slider/numeric-slider";
import { getAtomicWorkflowText } from "../../modules/workflow-automation/engine/get-atomic-workflow-text";
import { Switch } from "../../components/ui/form/base-fields/switch/switch";
// import { useTranslation } from "../../../../i18n/react"; // ❌ i18n - Supprimé

// ✅ Textes hardcodés (pas d'i18n)
const TEXTS = {
    errorUpdatingPreferences: "Erreur lors de la mise à jour des préférences",
    preferencesUpdated: "Préférences mises à jour",
    workflowCreated: "Workflow créé avec succès",
    errorCreatingWorkflow: "Erreur lors de la création du workflow",
    deleteConfirm: "Êtes-vous sûr de vouloir supprimer ce workflow ?",
    workflowDeleted: "Workflow supprimé",
    errorDeletingWorkflow: "Erreur lors de la suppression",
};


const AutomationPage = (): React.ReactElement => {
    const navigate = useNavigate();
    const { workflowId } = useParams<{ workflowId: string }>();
    const location = useLocation();
    
    // Détection de la vue IHM
    const isIhm = location.pathname.includes('/ihm');
    
    const [isClosing, setIsClosing] = useState(false);
    const [workflowName, setWorkflowName] = useState('');
    const hasCreatedWorkflow = useRef(false);
    // const currentUser = useContext(CurrentUserContext); // ❌ Supprimé
    // const { t } = useTranslation(); // ❌ Supprimé

    // Store
    const dispatch = useWorkflowAutomationStore(s => s.dispatch);
    const allWorkflows = useWorkflowAutomationStore(s => s.workflowItem.processedData);
    const selectedWorkflow = useWorkflowAutomationStore(s => s.workflowItem.selected.item);

    // Debounce pour les préférences
    const savePreferencesTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const pendingPreferencesRef = useRef<TWorkflowPreferences | null>(null);

    // Helper: Récupérer les préférences du workflow sélectionné
    const getWorkflowPreferences = (): TWorkflowPreferences => {
        if (!selectedWorkflow?.Preferences) {
            return DEFAULT_WORKFLOW_PREFERENCES;
        }
        try {
            return JSON.parse(selectedWorkflow.Preferences);
        } catch (e) {
            console.error('Error parsing workflow preferences:', e);
            return DEFAULT_WORKFLOW_PREFERENCES;
        }
    };

    // const { sp } = useContext(PnPContext); // ❌ PnP - Supprimé

    // Fonction de sauvegarde effective des préférences (debounced)
    const savePreferencesToSharePoint = useCallback(async (workflowId: number, preferences: TWorkflowPreferences) => {
        console.log('🔧 TODO: savePreferencesToSharePoint - Appeler API PUT /api/workflows/:id', { workflowId, preferences });
        
        dispatch({ type: 'UPDATE_WORKFLOW_ITEM' });

        // ❌ ANCIEN CODE SharePoint (commenté)
        // const result = await workflowItemServices.update.execute({ sp, id: workflowId, props: {...} });

        // ✅ Appel API pour mettre à jour les préférences
        try {
            const response = await fetch(`/api/workflows/${workflowId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    Preferences: JSON.stringify(preferences),
                }),
            });
            
            const result = await response.json();
            
            if (!response.ok) {
                throw new Error(result.error || 'Erreur API');
            }

            toast.success(TEXTS.preferencesUpdated);
            dispatch({
                type: 'UPDATE_WORKFLOW_ITEM_FULFILLED',
                payload: result.data,
            });
        } catch (error) {
            console.error('❌ Erreur savePreferences:', error);
            toast.error(TEXTS.errorUpdatingPreferences, {
                description: extractErrorMessage(error as Error),
            });
            dispatch({
                type: 'UPDATE_WORKFLOW_ITEM_FULFILLED',
                payload: error as Error,
            });
        }
    }, [dispatch]);

    // Helper: Mettre à jour une préférence spécifique (avec debounce)
    const updateWorkflowPreference = (key: keyof TWorkflowPreferences, value: number | boolean) => {
        if (!selectedWorkflow) return;

        const currentPreferences = getWorkflowPreferences();
        const newPreferences = { ...currentPreferences, [key]: value };
        const preferencesJson = JSON.stringify(newPreferences);

        // Mise à jour optimiste immédiate dans le store pour UX fluide
        const updatedWorkflow = {
            ...selectedWorkflow,
            Preferences: preferencesJson,
        };

        dispatch({
            type: 'UPDATE_WORKFLOW_ITEM_OPTIMISTIC',
            payload: updatedWorkflow,
        });

        // Stocker les préférences à sauvegarder
        pendingPreferencesRef.current = newPreferences;

        // Annuler le timeout précédent
        if (savePreferencesTimeoutRef.current) {
            clearTimeout(savePreferencesTimeoutRef.current);
        }

        // Créer un nouveau timeout (debounce de 800ms)
        savePreferencesTimeoutRef.current = setTimeout(() => {
            if (pendingPreferencesRef.current) {
                void savePreferencesToSharePoint(selectedWorkflow.Id, pendingPreferencesRef.current);
                pendingPreferencesRef.current = null;
            }
        }, 800);
    };

    // Cleanup du timeout au démontage
    useEffect(() => {
        return () => {
            if (savePreferencesTimeoutRef.current) {
                clearTimeout(savePreferencesTimeoutRef.current);
            }
        };
    }, []);

    // Fonction d'export du workflow en JSON
    const exportWorkflow = () => {
        if (!selectedWorkflow) return;

        const workflowData = {
            id: selectedWorkflow.Id,
            title: selectedWorkflow.Title || 'Untitled Workflow',
            description: selectedWorkflow.Description || '',
            workflowText: selectedWorkflow.WorkflowText || '',
            isEnabled: selectedWorkflow.IsEnabled,
            preferences: selectedWorkflow.Preferences ? JSON.parse(selectedWorkflow.Preferences) : {},
            exportDate: new Date().toISOString(),
        };

        const jsonContent = JSON.stringify(workflowData, null, 2);
        const blob = new Blob([jsonContent], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `workflow-${selectedWorkflow.Title?.replace(/[^a-z0-9]/gi, '-').toLowerCase() || 'export'}-${selectedWorkflow.Id}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);

        const toastId = toast.success('Export success', {
            description: <TimerBarToast
                duration={2000}
                dismissToast={() => toast.dismiss(toastId)}
            />,
        });
    };

    // Fonction d'import du workflow depuis un JSON
    const importWorkflow = () => {
        if (!selectedWorkflow) return;

        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json';

        input.onchange = async (e: Event) => {
            const file = (e.target as HTMLInputElement).files?.[0];
            if (!file) return;

            try {
                const text = await file.text();
                const workflowData = JSON.parse(text);

                // Vérifier que workflowText existe
                if (!workflowData.workflowText) {
                    throw new Error('workflowText not found in JSON');
                }

                // Mettre à jour le workflow
                dispatch({ type: 'UPDATE_WORKFLOW_ITEM' });

                const response = await fetch(`/api/workflows/${selectedWorkflow.Id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        WorkflowText: workflowData.workflowText,
                    }),
                });

                const resultData = await response.json();

                if (!response.ok || resultData instanceof Error) {
                    const error = resultData instanceof Error ? resultData : new Error(resultData.message || 'Import failed');
                    toast.error('Import error', {
                        description: extractErrorMessage(error),
                        duration: Number.POSITIVE_INFINITY,
                    });
                    dispatch({
                        type: 'UPDATE_WORKFLOW_ITEM_FULFILLED',
                        payload: error,
                    });
                } else {
                    const toastId = toast.success('Import success', {
                        description: <TimerBarToast
                            duration={2000}
                            dismissToast={() => toast.dismiss(toastId)}
                        />,
                    });
                    dispatch({
                        type: 'UPDATE_WORKFLOW_ITEM_FULFILLED',
                        payload: resultData.data,
                    });
                }
            } catch (error) {
                toast.error('Import error', {
                    description: error instanceof Error ? error.message : 'Invalid JSON format',
                    duration: Number.POSITIVE_INFINITY,
                });
            }
        };

        input.click();
    };

    const preferences = getWorkflowPreferences();

    // Synchroniser le store avec l'URL
    useEffect(() => {
        if (workflowId && workflowId !== 'new') {
            const workflow = allWorkflows.find(w => w.Id.toString() === workflowId);
            if (workflow && (!selectedWorkflow || selectedWorkflow.Id.toString() !== workflowId)) {
                dispatch({ type: 'SELECT_WORKFLOW_ITEM', payload: workflow });
            }
            // Réinitialiser le flag quand on quitte le mode "new"
            if (hasCreatedWorkflow.current) {
                hasCreatedWorkflow.current = false;
            }
        } else if (!workflowId && selectedWorkflow) {
            dispatch({ type: 'SELECT_WORKFLOW_ITEM', payload: null });
            // Réinitialiser le flag et le nom quand on revient à l'index
            if (hasCreatedWorkflow.current) {
                hasCreatedWorkflow.current = false;
            }
            setWorkflowName('');
        }

        // Réinitialiser isClosing quand on change d'URL
        setIsClosing(false);
    }, [workflowId, allWorkflows]);

    const handleCreateClick = (name: string) => {
        setWorkflowName(name);
        setIsClosing(true);
        setTimeout(() => {
            navigate('/workflow/new');
        }, 75);
    };


    useEffect(() => {

        void (async () => {

            if (location.pathname.includes('/workflow/new') && !hasCreatedWorkflow.current) {
                hasCreatedWorkflow.current = true;


                // Format XML - Workflow atomique simple
                const defaultWorkflowText = getAtomicWorkflowText();

                // Déterminer le titre du workflow
                const workflowTitle = workflowName || 'Workflow';

                const data: TCreateWorkflowItemProps = {
                    Title: workflowTitle,
                    Description: workflowTitle,
                    IsEnabled: 0,
                    FragmentId: 'DEFAULT', // à voir pour les classer par fragments dans la tab contents
                    WorkflowText: defaultWorkflowText,
                    Preferences: JSON.stringify(DEFAULT_WORKFLOW_PREFERENCES),
                };

                // Créer immédiatement le workflow de façon optimiste dans le store
                dispatch({
                    type: 'CREATE_WORKFLOW_ITEM_OPTIMISTIC',
                    payload: {
                        Title: data.Title!,
                        Description: data.Description,
                        IsEnabled: data.IsEnabled ? 1 : 0,
                        FragmentId: data.FragmentId!,
                        WorkflowText: data.WorkflowText,
                        Preferences: data.Preferences!,
                    },
                });

                const result = await fetch('/api/workflows', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data),
                });

                console.log('result', result);

                const resultData = await result.json();

                dispatch({ type: 'CREATE_WORKFLOW_ITEM_FULFILLED', payload: resultData.data });

                if (!result.ok || resultData instanceof Error) {
                    const error = resultData instanceof Error ? resultData : new Error(resultData.message || 'Creation failed');
                    toast.error('Error creating workflow', {
                        description: extractErrorMessage(error),
                    });
                    navigate('/');
                } else {
                    // Le workflow est déjà sélectionné et mis à jour dans le reducer
                    // Naviguer vers le workflow avec son vrai ID
                    navigate('/workflow/' + resultData.data?.Id, { replace: true });

                    dispatch({ type: 'SELECT_WORKFLOW_ITEM', payload: resultData.data });
                }
            }

        })();
    }, [location.pathname, dispatch]);

    // Déterminer si on affiche un workflow ou l'index
    const isViewingWorkflow = workflowId && workflowId !== 'new' && !isIhm;
    const isNewWorkflow = workflowId === 'new';

    // Récupérer les workflowInfos depuis le WorkflowText
    const getWorkflowInfos = () => {
        // TOUJOURS utiliser selectedWorkflow.WorkflowText pour éviter les désynchronisations d'UUID
        // On n'affiche le workflow que quand il est dans le store
        if (selectedWorkflow?.WorkflowText) {
            return createWorkflowFromText(selectedWorkflow.WorkflowText);
        }

        return null;
    };

    const workflowInfos = getWorkflowInfos();

    // Si on est en mode IHM, afficher la vue IHM
    if (isIhm && workflowId) {
        return <div className={styles.automationPage}>
            <div className={styles.automationPageContent}>
                <div className={styles.automationPageMain}>
                    <div className={styles.automationPageIhm}>
                        <div className={styles.automationPageIhmHeader}>
                            <Button
                                variant="link"
                                size="sm"
                                onClick={() => navigate(`/workflow/${workflowId}`)}
                            >
                                <ArrowLeft size={16} style={{ marginRight: 'var(--spacing-2)' }} /> Back
                            </Button>
                            <h1>IHM - Workflow {selectedWorkflow?.Title || workflowId}</h1>
                        </div>
                        <div className={styles.automationPageIhmContent}>
                            <h2>Hello World</h2>
                            <p>Interface utilisateur du workflow à venir...</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>;
    }

    return <div className={styles.automationPage}>
        <div className={styles.automationPageContent}>
            <div className={styles.automationPageMain}>
                {!isViewingWorkflow && !isNewWorkflow ? (
                    <AutomationIndex
                        onCreateClick={handleCreateClick}
                        dataState={isClosing ? 'closed' : 'open'}
                    />
                ) : (
                    <>
                        <div className={styles.automationPageHeader} data-state="open">
                            <div className={styles.automationPageHeaderInner}>
                                <div className={styles.automationPageHeaderActions}>
                                    {/* Menu Affichage */}
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="outline" size="sm">
                                                <SlidersHorizontal size={16} style={{ marginRight: 'var(--spacing-2)' }} />
                                                Affichage 
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent
                                            align="end"
                                            className={styles.preferencesDropdown}
                                            sideOffset={8}
                                        >
                                            <DropdownMenuLabel>Display settings</DropdownMenuLabel>
                                            <DropdownMenuSeparator />

                                            <div className={styles.workflowConfigItem}>
                                                <div className={styles.workflowConfigItemLabel}>Tile width</div>
                                                <NumericSlider
                                                    min={0}
                                                    max={800}
                                                    value={preferences.xCoefficient}
                                                    onValueChange={(value) => updateWorkflowPreference('xCoefficient', value)}
                                                    showValue
                                                />
                                            </div>

                                            <div className={styles.workflowConfigItem}>
                                                <div className={styles.workflowConfigItemLabel}>Tile height</div>
                                                <NumericSlider
                                                    min={0}
                                                    max={100}
                                                    value={preferences.yCoefficient}
                                                    onValueChange={(value) => updateWorkflowPreference('yCoefficient', value)}
                                                    showValue
                                                />
                                            </div>

                                            <DropdownMenuSeparator />

                                            <div className={styles.workflowConfigItem}>
                                                <div className={styles.workflowConfigItemLabel}>X axis thickness</div>
                                                <NumericSlider
                                                    min={0}
                                                    max={30}
                                                    value={preferences.xAxisThickness}
                                                    onValueChange={(value) => updateWorkflowPreference('xAxisThickness', value)}
                                                    showValue
                                                />
                                            </div>

                                            <div className={styles.workflowConfigItem}>
                                                <div className={styles.workflowConfigItemLabel}>Y axis thickness</div>
                                                <NumericSlider
                                                    min={0}
                                                    max={30}
                                                    value={preferences.yAxisThickness}
                                                    onValueChange={(value) => updateWorkflowPreference('yAxisThickness', value)}
                                                    showValue
                                                />
                                            </div>

                                            <DropdownMenuSeparator />

                                            <div className={styles.workflowConfigItem}>
                                                <div className={styles.workflowConfigItemLabel}>Element width</div>
                                                <NumericSlider
                                                    min={0}
                                                    max={100}
                                                    value={preferences.elementWidth}
                                                    onValueChange={(value) => updateWorkflowPreference('elementWidth', value)}
                                                    showValue
                                                />
                                            </div>

                                            <div className={styles.workflowConfigItem}>
                                                <div className={styles.workflowConfigItemLabel}>Element height</div>
                                                <NumericSlider
                                                    min={0}
                                                    max={100}
                                                    value={preferences.elementHeight}
                                                    onValueChange={(value) => updateWorkflowPreference('elementHeight', value)}
                                                    showValue
                                                />
                                            </div>

                                            <DropdownMenuSeparator />

                                            <div className={styles.workflowConfigItem}>
                                                <div className={styles.workflowConfigItemLabel}>Connector thickness</div>
                                                <NumericSlider
                                                    min={0}
                                                    max={10}
                                                    value={preferences.connectorThickness}
                                                    onValueChange={(value) => updateWorkflowPreference('connectorThickness', value)}
                                                    showValue
                                                />
                                            </div>

                                            <div className={styles.workflowConfigItem}>
                                                    <div className={styles.workflowConfigItemLabel}>Connector radius</div>
                                                <NumericSlider
                                                    min={0}
                                                    max={50}
                                                    value={preferences.connectorRadius}
                                                    onValueChange={(value) => updateWorkflowPreference('connectorRadius', value)}
                                                    showValue
                                                />
                                            </div>

                                            <div className={styles.workflowConfigItem}>
                                                <div className={styles.workflowConfigItemLabel}>Arrow pointer thickness</div>
                                                <NumericSlider
                                                    min={0}
                                                    max={50}
                                                    value={preferences.arrowPointerThickness}
                                                    onValueChange={(value) => updateWorkflowPreference('arrowPointerThickness', value)}
                                                    showValue
                                                />
                                            </div>

                                            <DropdownMenuSeparator />

                                            <div className={styles.workflowConfigItem}>
                                                <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 'var(--spacing-4)' }}>
                                                    <div className={styles.workflowConfigItemLabel}>Show indexes</div>
                                                    <Switch
                                                        checked={preferences.showIndexes}
                                                        onCheckedChange={(checked) => updateWorkflowPreference('showIndexes', checked)}
                                                    />
                                                </div>
                                            </div>
                                        </DropdownMenuContent>
                                    </DropdownMenu>

                                    {/* Menu Actions */}
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="outline" size="sm">
                                                <MoreVertical size={16} style={{ marginRight: 'var(--spacing-1)' }} />
                                                Actions
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent
                                            align="end"
                                            className={styles.actionsDropdown}
                                            sideOffset={8}
                                        >
                                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                            <DropdownMenuSeparator />

                                            <button
                                                className={styles.dropdownMenuItem}
                                                onClick={() => {
                                                    // TODO: Implémenter l'édition des infos
                                                    console.log('Éditer les informations');
                                                }}
                                            >
                                                <Edit3 size={16} />
                                                <span>Edit info</span>
                                            </button>

                                            <button
                                                className={styles.dropdownMenuItem}
                                                onClick={() => {
                                                    // TODO: Implémenter la duplication
                                                    console.log('Dupliquer le workflow');
                                                }}
                                            >
                                                <Copy size={16} />
                                                <span>Duplicate</span>
                                            </button>

                                            <button
                                                className={styles.dropdownMenuItem}
                                                onClick={() => {
                                                    // TODO: Implémenter l'historique des versions
                                                    console.log('Voir l\'historique des versions');
                                                }}
                                            >
                                                <History size={16} />
                                                <span>Version history</span>
                                            </button>

                                            <button
                                                className={styles.dropdownMenuItem}
                                                onClick={() => {
                                                    // TODO: Implémenter le partage
                                                    console.log('Partager le workflow');
                                                }}
                                            >
                                                <Share2 size={16} />
                                                <span>Share</span>
                                            </button>

                                            <DropdownMenuSeparator />

                                            <button
                                                className={styles.dropdownMenuItem}
                                                onClick={() => {
                                                    // TODO: Implémenter l'activation/désactivation
                                                    console.log('Activer/Désactiver');
                                                }}
                                            >
                                                <Power size={16} />
                                                <span>
                                                    {selectedWorkflow?.IsEnabled ? 'Disable' : 'Enable'}
                                                </span>
                                            </button>

                                            <DropdownMenuSeparator />

                                            <button
                                                className={styles.dropdownMenuItem}
                                                onClick={importWorkflow}
                                            >
                                                <Upload size={16} />
                                                <span>Import</span>
                                            </button>

                                            <button
                                                className={styles.dropdownMenuItem}
                                                onClick={exportWorkflow}
                                            >
                                                <Download size={16} />
                                                <span>Export</span>
                                            </button>

                                            <DropdownMenuSeparator />

                                            <button
                                                className={styles.dropdownMenuItemDestructive}
                                                onClick={() => {
                                                    // TODO: Implémenter la suppression
                                                    console.log('Supprimer');
                                                }}
                                            >
                                                <Trash2 size={16} />
                                                    <span>Delete</span>
                                            </button>
                                        </DropdownMenuContent>
                                    </DropdownMenu>

                                    {/* Partager */}
                                    <Button
                                        variant="default"
                                        size="sm"
                                        onClick={() => {
                                            // TODO: Implémenter le partage
                                            console.log('Partager le workflow');
                                        }}
                                    >
                                        <Share2 size={16} style={{ marginRight: 'var(--spacing-2)' }} />
                                        <span>Partager</span>
                                    </Button>
                                </div>
                            </div>
                        </div>

                        {!selectedWorkflow ? (
                            <div className={styles.automationPageError}>
                                <p>Workflow not found</p>
                            </div>
                        ) : workflowInfos ? (
                            <div className={styles.automationPageWorkflow} data-state="open">
                                <div className={styles.automationPageWorkflowViewer}>
                                    <WorkflowRoot
                                        showSettings={false}
                                        showIndexes={preferences.showIndexes}
                                        workflowInfos={workflowInfos as any}
                                        preferences={preferences}
                                        key={`workflow-root-${selectedWorkflow?.Id}-${selectedWorkflow?.Modified}-${location.pathname}`}
                                    />
                                </div>
                            </div>
                        ) : null}
                    </>
                )}
            </div>
        </div>
    </div>;
};


export {
    AutomationPage,
};

