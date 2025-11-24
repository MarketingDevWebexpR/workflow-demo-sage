import { create } from "zustand";
import { redux } from "zustand/middleware";
import { reducer, initialState, type TPageStoreState } from "./page.reducer";
import { type TPageModuleAction } from "./page.actions";
import { useEffect } from "react";
import { MODULES_MAP } from "../../modules-map";


const usePageStore = create(redux<TPageStoreState, TPageModuleAction>(reducer, initialState));


const Provider = ({ children }: { children: React.ReactElement }) => {
    const dispatch = usePageStore((state) => state.dispatch);

    useEffect(() => {
        // Chargement initial des pages
        const fetchAllPages = async () => {
            dispatch({ type: 'FETCH_ALL_PAGE' });
            alert('TODO: Appeler l\'API pour récupérer les pages');
            const result = await fetch('/api/pages');
            const data = await result.json();
            dispatch({ type: 'FETCH_ALL_PAGE_FULFILLED', payload: data });
        };

        const initialFetch = async () => {
            void fetchAllPages();
        };

        void initialFetch();

        const abortController = new AbortController();
        document.addEventListener(`INITIAL_FETCH:${MODULES_MAP["./page/module.config"].id}`, initialFetch, { signal: abortController.signal });

        return () => {
            abortController.abort();
        };
    }, [dispatch,]);

    return children;
};


export {
    usePageStore,
    Provider,
};
