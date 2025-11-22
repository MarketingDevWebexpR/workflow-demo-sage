import { useEffect } from 'react';

interface UseVanillaCSSInjectionProps {
    css: string;
    id: string;
}

/**
 * Hook pour injecter du CSS vanilla dans le document head
 * @param css - Le contenu CSS à injecter
 * @param id - L'ID unique pour l'élément style
 */
export const useVanillaCSSInjection = ({ css, id }: UseVanillaCSSInjectionProps): void => {
    useEffect(() => {
        const existingStyle = document.getElementById(id);

        if (existingStyle) {
            return;
        }

        const styleElement = document.createElement('style');
        styleElement.id = id;
        styleElement.textContent = css;
        document.head.appendChild(styleElement);

        // Cleanup function pour retirer le style quand le composant est démonté
        return () => {
            const elementToRemove = document.getElementById(id);
            if (elementToRemove) {
                document.head.removeChild(elementToRemove);
            }
        };
    }, [css, id]);
};
