import { useEffect } from "react";
import { usePageStore } from "../../store/page.store";


export default function useEditedComponentIdReset(): void {

    const editedComponentId = usePageStore(state => state.editedComponentId);
    const dispatch = usePageStore(state => state.dispatch);

    useEffect(() => {

        const abortController = new AbortController();

        if (editedComponentId) {
            setTimeout(() => {
                document.addEventListener('click', e => {

                    const isClickingInComponentDetails = (e.target as HTMLElement).closest('[data-component-details]');
                    const isClickingInResizableHandle = (e.target as HTMLElement).closest('[data-panel-resize-handle-id]');
                    const isClickingInHTMLElement = (e.target as HTMLElement).nodeName === 'HTML';
                    const isClickingOutsideComponentDetails = !isClickingInComponentDetails && !isClickingInResizableHandle;
                    const isTargetConnected = (e.target as HTMLElement).isConnected === true;
    
                    if (!isClickingOutsideComponentDetails || !isTargetConnected || isClickingInHTMLElement)
                        return;
    
                    dispatch({ type: 'SET_EDITED_COMPONENT_ID', payload: null });
                }, {
                    signal: abortController.signal,
                });
            });
        }

        return () => abortController.abort();
    }, [editedComponentId,]);
}