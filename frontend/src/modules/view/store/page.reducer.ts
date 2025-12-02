import { type TPage } from "../models/page.model";
import { type TPageModuleAction } from "./page.actions";


type TPageStoreState = {
    selected: {
        item: TPage | null,
        hasUnsavedChanges: boolean,
        isUpdating: boolean,
        isDeleting: boolean,
        saveStatus: 'idle' | 'saving' | 'success' | 'error',
        saveError: string | null,
    },
    isFetching: boolean,
    fetchError: Error | undefined,
    isCreating: boolean,
    isDeletingBulk: boolean,
    idsBeingDeletedInBulk: number[],
    data: TPage[],
    isFormModified: boolean,
    editedId: number | null,
    editedComponentId: string | null,
    hoveredComponentId: string | null,
    dragOverInfos: {
        context: string,
        layerTitle: string,
        afterComponentId: string | null,
    } | null,
    editorScrollTop: number | null,
    treeViewScrollTop: number | null,
    isEditMode: boolean,
}

const initialState: TPageStoreState = {
    selected: {
        item: null,
        hasUnsavedChanges: false,
        isUpdating: false,
        isDeleting: false,
        saveStatus: 'idle',
        saveError: null,
    },
    isFetching: false,
    fetchError: undefined,
    isCreating: false,
    isDeletingBulk: false,
    idsBeingDeletedInBulk: [],
    data: [],
    isFormModified: false,
    editedId: null,
    editedComponentId: null,
    hoveredComponentId: null,
    dragOverInfos: null,
    editorScrollTop: null,
    treeViewScrollTop: null,
    isEditMode: true,
};

const reducer = (
    state: TPageStoreState,
    action: TPageModuleAction
): TPageStoreState => {
    switch (action.type) {
        case 'SELECT_PAGE':
            return {
                ...state,
                selected: {
                    ...state.selected,
                    item: action.payload,
                },
            };
        case 'SET_EDITED_PAGE_ID':
            return {
                ...state,
                editedId: action.payload,
            };
        case 'SET_EDITED_PAGE_COMPONENTS':
            return {
                ...state,
                selected: {
                    ...state.selected,
                    item: state.selected.item ? {
                        ...state.selected.item,
                        Components: action.payload,
                    } : null,
                },
            };
        case 'SET_EDITED_COMPONENT_ID':
            return {
                ...state,
                editedComponentId: action.payload,
            };
        case 'SET_HOVERED_COMPONENT_ID':
            return {
                ...state,
                hoveredComponentId: action.payload,
            };
        case 'SET_DRAG_OVER_INFOS':
            return {
                ...state,
                dragOverInfos: action.payload,
            };
        case 'SET_EDITOR_SCROLL_TOP':
            return {
                ...state,
                editorScrollTop: action.payload,
            };
        case 'SET_TREE_VIEW_SCROLL_TOP':
            return {
                ...state,
                treeViewScrollTop: action.payload,
            };
        case 'SET_HAS_UNSAVED_CHANGES':
            return {
                ...state,
                selected: {
                    ...state.selected,
                    hasUnsavedChanges: action.payload,
                },
            };
        case 'SET_VIEW_SAVE_STATUS':
            return {
                ...state,
                selected: {
                    ...state.selected,
                    saveStatus: action.payload.status,
                    saveError: action.payload.error || null,
                },
            };
        case 'SET_EDIT_MODE':
            return {
                ...state,
                isEditMode: action.payload,
            };
        default:
            return state;
    }
};


export {
    initialState,
    reducer,
    type TPageStoreState,
}