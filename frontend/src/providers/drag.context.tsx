import { createContext, useState, type ReactNode } from "react";

interface IDragContext {
    isDraggingFile: boolean;
    setIsDraggingFile: (value: boolean) => void;
}

export const DragContext = createContext<IDragContext>({} as IDragContext);

export function DragProvider({ children }: { children: ReactNode }) {
    const [isDraggingFile, setIsDraggingFile] = useState(false);

    return (
        <DragContext.Provider value={{ isDraggingFile, setIsDraggingFile }}>
            {children}
        </DragContext.Provider>
    );
}