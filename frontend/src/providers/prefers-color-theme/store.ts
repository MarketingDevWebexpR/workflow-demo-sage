import { create } from "zustand";
import { redux } from "zustand/middleware";
import { reducer, initialState, type TPrefersColorThemeStoreState } from "./reducer";
import { type TPrefersColorThemeAction } from "./actions";


const usePrefersColorThemeStore = create(redux<TPrefersColorThemeStoreState, TPrefersColorThemeAction>(reducer, initialState));


export {
    usePrefersColorThemeStore,
};