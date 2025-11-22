import { type TWorkflowItem } from "../models/workflow-item.model";
import { type TWorkflowAutomationModuleAction } from "./workflow-automation.actions";
import { appUniqueId } from "../../../utils/number.utils";


type TWorkflowAutomationStoreState = {
    workflowItem: {
        selected: {
            item: TWorkflowItem | null,
            isUpdating: boolean,
            isDeleting: boolean,
        },
        isFetching: boolean,
        fetchError: Error | undefined,
        isCreating: boolean,
        isDeletingBulk: boolean,
        idsBeingDeletedInBulk: number[],
        data: TWorkflowItem[],
        processedData: TWorkflowItem[],
        queryText: string | undefined,
        isFormModified: boolean,
    },
    designer: {
        selectedPlaceholderId: string | null,
        hoveredWorkflowElementId: string | null,
        editedWorkflowElementId: string | null,
    },
};

const initialState: TWorkflowAutomationStoreState = {
    workflowItem: {
        selected: {
            item: null,
            isUpdating: false,
            isDeleting: false,
        },
        isFetching: false,
        fetchError: undefined,
        isCreating: false,
        isDeletingBulk: false,
        idsBeingDeletedInBulk: [],
        data: [],
        processedData: [],
        queryText: undefined,
        isFormModified: false,
    },
    designer: {
        selectedPlaceholderId: null,
        hoveredWorkflowElementId: null,
        editedWorkflowElementId: null,
    },
};

const reducer = (
    state: TWorkflowAutomationStoreState,
    action: TWorkflowAutomationModuleAction
): TWorkflowAutomationStoreState => {
    switch (action.type) {
        // --- WORKFLOW ITEM --- //
        case 'SELECT_WORKFLOW_ITEM':
            console.log('SELECT_WORKFLOW_ITEM', action.payload);
            return {
                ...state,
                workflowItem: {
                    ...state.workflowItem,
                    selected: {
                        ...state.workflowItem.selected,
                        item: action.payload,
                    }
                },
            };

        case 'FETCH_ALL_WORKFLOW_ITEM':
            return {
                ...state,
                workflowItem: {
                    ...state.workflowItem,
                    isFetching: true,
                    fetchError: undefined,
                },
            };

        case 'FETCH_ALL_WORKFLOW_ITEM_FULFILLED': {
            const result = action.payload;
            if (result instanceof Error) {
                return {
                    ...state,
                    workflowItem: {
                        ...state.workflowItem,
                        isFetching: false,
                        fetchError: result,
                    },
                };
            }
            return {
                ...state,
                workflowItem: {
                    ...state.workflowItem,
                    isFetching: false,
                    data: result,
                    processedData: result,
                },
            };
        }

        case 'SET_FILTERS_WORKFLOW_ITEM':
            return {
                ...state,
                workflowItem: {
                    ...state.workflowItem,
                    processedData: state.workflowItem.data,
                },
            };

        case 'CREATE_WORKFLOW_ITEM_OPTIMISTIC': {
            // Créer un workflow optimiste avec un ID temporaire négatif
            const optimisticId = ( appUniqueId.next().value - 1 ) * -1;
            const now = new Date().toISOString();
            const optimisticWorkflow: TWorkflowItem = {
                ...action.payload,
                Id: optimisticId,
                Created: now,
                Modified: now,
            };

            // Ajouter au début de la liste et sélectionner immédiatement
            return {
                ...state,
                workflowItem: {
                    ...state.workflowItem,
                    isCreating: true,
                    data: [optimisticWorkflow, ...state.workflowItem.data],
                    processedData: [optimisticWorkflow, ...state.workflowItem.processedData],
                    selected: {
                        ...state.workflowItem.selected,
                        item: optimisticWorkflow,
                    },
                },
            };
        }

        case 'CREATE_WORKFLOW_ITEM':
            return {
                ...state,
                workflowItem: {
                    ...state.workflowItem,
                    isCreating: true,
                },
            };

        case 'CREATE_WORKFLOW_ITEM_FULFILLED': {
            const result = action.payload;
            if (result instanceof Error) {
                return {
                    ...state,
                    workflowItem: {
                        ...state.workflowItem,
                        isCreating: false,
                    },
                };
            }

            // Trouver le workflow optimiste (ID négatif) dans la liste data
            const optimisticIndex = state.workflowItem.data.findIndex(item => item.Id < 0);

            if (optimisticIndex === -1) {
                console.log('updatedData optimiscIndex not found', {
                    staeworkflowitemdata: [ ...state.workflowItem.data ],
                });
                // Aucun workflow optimiste trouvé, cas anormal
                console.warn('[CREATE_WORKFLOW_ITEM_FULFILLED] No optimistic workflow found');
                return {
                    ...state,
                    workflowItem: {
                        ...state.workflowItem,
                        isCreating: false,
                    },
                };
            }

            // Remplacer le workflow optimiste par le vrai
            const updatedData = [...state.workflowItem.data];
            console.log('updatedData[optimisticIndex] avant remplacement', updatedData[optimisticIndex]);
            updatedData[optimisticIndex] = result;
            console.log('updatedData[optimisticIndex] après remplacement', updatedData[optimisticIndex]);

            const updatedProcessedData = [...state.workflowItem.processedData];
            const processedOptimisticIndex = updatedProcessedData.findIndex(item => item.Id < 0);
            if (processedOptimisticIndex !== -1) {
                updatedProcessedData[processedOptimisticIndex] = result;
            }

            return {
                ...state,
                workflowItem: {
                    ...state.workflowItem,
                    isCreating: false,
                    data: updatedData,
                    processedData: updatedProcessedData,
                    selected: {
                        ...state.workflowItem.selected,
                        item: result,
                    },
                },
            };
        }

        case 'UPDATE_WORKFLOW_ITEM_OPTIMISTIC': {
            // Mise à jour optimiste immédiate pour UX fluide
            const optimisticUpdate = action.payload;
            const updatedData = state.workflowItem.data.map(item =>
                item.Id === optimisticUpdate.Id ? optimisticUpdate : item
            );
            const updatedProcessedData = state.workflowItem.processedData.map(item =>
                item.Id === optimisticUpdate.Id ? optimisticUpdate : item
            );

            return {
                ...state,
                workflowItem: {
                    ...state.workflowItem,
                    data: updatedData,
                    processedData: updatedProcessedData,
                    selected: {
                        ...state.workflowItem.selected,
                        item: optimisticUpdate,
                    },
                },
            };
        }

        case 'UPDATE_WORKFLOW_ITEM':
            return {
                ...state,
                workflowItem: {
                    ...state.workflowItem,
                    selected: {
                        ...state.workflowItem.selected,
                        isUpdating: true,
                    },
                },
            };

        case 'UPDATE_WORKFLOW_ITEM_FULFILLED': {
            const result = action.payload;
            if (result instanceof Error) {
                return {
                    ...state,
                    workflowItem: {
                        ...state.workflowItem,
                        selected: {
                            ...state.workflowItem.selected,
                            isUpdating: false,
                        },
                    },
                };
            }
            // Mettre à jour le workflow dans la liste data et processedData
            const updatedData = state.workflowItem.data.map(item =>
                item.Id === result.Id ? result : item
            );
            const updatedProcessedData = state.workflowItem.processedData.map(item =>
                item.Id === result.Id ? result : item
            );

            return {
                ...state,
                workflowItem: {
                    ...state.workflowItem,
                    data: updatedData,
                    processedData: updatedProcessedData,
                    selected: {
                        ...state.workflowItem.selected,
                        item: result,
                        isUpdating: false,
                    },
                },
            };
        }

        case 'DELETE_WORKFLOW_ITEM':
            return {
                ...state,
                workflowItem: {
                    ...state.workflowItem,
                    selected: {
                        ...state.workflowItem.selected,
                        isDeleting: true,
                    },
                },
            };

        case 'DELETE_WORKFLOW_ITEM_FULFILLED':
            return {
                ...state,
                workflowItem: {
                    ...state.workflowItem,
                    selected: {
                        ...state.workflowItem.selected,
                        isDeleting: false,
                    },
                },
            };

        case 'DELETE_BULK_WORKFLOW_ITEM':
            return {
                ...state,
                workflowItem: {
                    ...state.workflowItem,
                    isDeletingBulk: true,
                    idsBeingDeletedInBulk: action.payload,
                },
            };

        case 'DELETE_BULK_WORKFLOW_ITEM_FULFILLED':
            return {
                ...state,
                workflowItem: {
                    ...state.workflowItem,
                    isDeletingBulk: false,
                    idsBeingDeletedInBulk: [],
                },
            };

        case 'SET_IS_WORKFLOW_ITEM_FORM_MODIFIED':
            return {
                ...state,
                workflowItem: {
                    ...state.workflowItem,
                    isFormModified: action.payload,
                },
            };

        case 'SET_QUERY_TEXT_WORKFLOW_ITEM':
            return {
                ...state,
                workflowItem: {
                    ...state.workflowItem,
                    queryText: action.payload,
                },
            };

        // --- DESIGNER --- //
        case 'SET_SELECTED_PLACEHOLDER_ID':
            return {
                ...state,
                designer: {
                    ...state.designer,
                    selectedPlaceholderId: action.payload,
                },
            };

        case 'SET_HOVERED_WORKFLOW_ELEMENT_ID':
            return {
                ...state,
                designer: {
                    ...state.designer,
                    hoveredWorkflowElementId: action.payload,
                },
            };

        case 'SET_EDITED_WORKFLOW_ELEMENT_ID':
            return {
                ...state,
                designer: {
                    ...state.designer,
                    editedWorkflowElementId: action.payload,
                },
            };

        default:
            return state;
    }
};

export { initialState, reducer };
export type { TWorkflowAutomationStoreState };
