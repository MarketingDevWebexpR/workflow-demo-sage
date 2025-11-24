import { type TStaticDataCrudActionInterfaces } from "../../../utils/context.utils";
import { type TPage } from "../models/page.model";


const SET_EDITED_PAGE_ID = 'SET_EDITED_PAGE_ID' as const;
const SET_EDITED_PAGE_COMPONENTS = 'SET_EDITED_PAGE_COMPONENTS' as const;
const SET_EDITED_COMPONENT_ID = 'SET_EDITED_COMPONENT_ID' as const;
const SET_HOVERED_COMPONENT_ID = 'SET_HOVERED_COMPONENT_ID' as const;
const SET_DRAG_OVER_INFOS = 'SET_DRAG_OVER_INFOS' as const;
const SET_EDITOR_SCROLL_TOP = 'SET_EDITOR_SCROLL_TOP' as const;
const SET_TREE_VIEW_SCROLL_TOP = 'SET_TREE_VIEW_SCROLL_TOP' as const;
const SET_HAS_UNSAVED_CHANGES = 'SET_HAS_UNSAVED_CHANGES' as const;
const SET_VIEW_SAVE_STATUS = 'SET_VIEW_SAVE_STATUS' as const;


type TPageAction = TStaticDataCrudActionInterfaces<"page", TPage, any>
| { type: typeof SET_EDITED_PAGE_ID, payload: number }
| { type: typeof SET_EDITED_PAGE_COMPONENTS, payload: string }
| { type: typeof SET_EDITED_COMPONENT_ID, payload: string | null }
| { type: typeof SET_HOVERED_COMPONENT_ID, payload: string | null }
| { type: typeof SET_DRAG_OVER_INFOS, payload: {
    context: string,
    layerTitle: string,
    afterComponentId: string | null,
} | null }
| { type: typeof SET_EDITOR_SCROLL_TOP, payload: number | null }
| { type: typeof SET_TREE_VIEW_SCROLL_TOP, payload: number | null }
| { type: typeof SET_HAS_UNSAVED_CHANGES, payload: boolean }
| { type: typeof SET_VIEW_SAVE_STATUS, payload: { status: 'idle' | 'saving' | 'success' | 'error', error?: string | null } };


export type TPageModuleAction = TPageAction;
