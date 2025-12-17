/**
 * Admin Sidebar Store stub
 * This is a stub file to satisfy TypeScript imports.
 * Replace with actual Zustand store implementation when available.
 */

type AdminSidebarAction =
    | { type: 'SET_IS_ADMIN_SIDEBAR_OPENED'; payload: boolean }
    | { type: 'TOGGLE_ADMIN_SIDEBAR' };

interface AdminSidebarState {
    isAdminSidebarOpened: boolean;
    dispatch: (action: AdminSidebarAction) => void;
}

type StateSelector<T> = (state: AdminSidebarState) => T;

/**
 * Hook to access the admin sidebar store
 * @param selector - Function to select a portion of the state
 * @returns Selected state value
 */
export function useAdminSidebarStore<T>(selector: StateSelector<T>): T {
    // Stub implementation - returns default values
    const state: AdminSidebarState = {
        isAdminSidebarOpened: false,
        dispatch: (_action: AdminSidebarAction) => {
            // Stub dispatch implementation
        },
    };

    return selector(state);
}

export type { AdminSidebarState, AdminSidebarAction };
