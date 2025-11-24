import { create } from "zustand";
import { redux } from "zustand/middleware";
import { reducer, initialState, type TWorkflowAutomationStoreState } from "./workflow-automation.reducer";
import { type TWorkflowAutomationModuleAction } from "./workflow-automation.actions";
import { useEffect } from "react";
import WorkflowItemServices from "../services/workflow-item.services";


const useWorkflowAutomationStore = create(redux<TWorkflowAutomationStoreState, TWorkflowAutomationModuleAction>(reducer, initialState));

const Provider = ({ children }: { children: React.ReactElement }) => {
    const dispatch = useWorkflowAutomationStore((state) => state.dispatch);

    useEffect(() => {
        // Chargement initial des flux de travail
        const fetchAllWorkflowItems = async () => {
            dispatch({ type: 'FETCH_ALL_WORKFLOW_ITEM' });
            const result = await WorkflowItemServices.fetchAll.execute({
                sp: null, // Plus besoin de SharePoint context
                orderBy: ['Id', false], // 'Id' au lieu de 'ID' pour correspondre au modèle
            });
            dispatch({ type: 'FETCH_ALL_WORKFLOW_ITEM_FULFILLED', payload: result });
        };

        const initialFetch = async () => {
            void fetchAllWorkflowItems();
        };

        void initialFetch();

        // Event listener pour recharger les workflows si nécessaire
        const abortController = new AbortController();
        document.addEventListener('WORKFLOW_AUTOMATION:REFETCH', initialFetch, { signal: abortController.signal });

        return () => {
            abortController.abort();
        };
    }, [dispatch]);

    return children;
};


export {
    useWorkflowAutomationStore,
    Provider,
};

