/**
 * App Full Screen Context stub
 * This is a stub file to satisfy TypeScript imports.
 * Replace with actual context implementation when available.
 */
import { createContext, useState, type ReactNode, type Dispatch, type SetStateAction } from 'react';

export type AppFullScreenContextType = [boolean, Dispatch<SetStateAction<boolean>>];

/**
 * Context for managing full-screen state across the application
 */
export const AppFullScreenContext = createContext<AppFullScreenContextType>([
    false,
    () => {
        // Default setter stub
    },
]);

interface AppFullScreenProviderProps {
    children: ReactNode;
}

/**
 * Provider component for the full-screen context
 */
export const AppFullScreenProvider = ({ children }: AppFullScreenProviderProps): ReactNode => {
    const [isFullScreen, setIsFullScreen] = useState(false);

    return (
        <AppFullScreenContext.Provider value={[isFullScreen, setIsFullScreen]}>
            {children}
        </AppFullScreenContext.Provider>
    );
};
