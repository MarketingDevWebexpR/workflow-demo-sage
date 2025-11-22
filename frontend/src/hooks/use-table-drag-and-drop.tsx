import React, { useRef, useCallback } from 'react';

const emptyImg = new Image();
emptyImg.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAUEBAAAACwAAAAAAQABAAACAkQBADs=';

interface IUseTableDragAndDrop {
    onOrderChange: (items: Array<{ id: number; newOrder: number }>) => void;
    containerSelector: string;
    rowSelector: string;
}

export default function useTableDragAndDrop({
    onOrderChange,
    containerSelector,
    rowSelector,
}: IUseTableDragAndDrop) {
    const draggedElementRef = useRef<HTMLElement | null>(null);
    const dropPlaceholderRef = useRef<HTMLElement | null>(null);
    const dragGhostRef = useRef<HTMLElement | null>(null);
    const isAnimatingRef = useRef<boolean>(false);
    const rowHeightsCache = useRef<Map<HTMLElement, number>>(new Map());
    const lastAnimationFrame = useRef<number | null>(null);

    const createDropPlaceholder = () => {
        const placeholder = document.createElement('div');
        placeholder.className = 'drop-placeholder';
        placeholder.style.cssText = `
            height: 2px;
    background: var(--surface-primary);
    border-radius: 100vw;
    position: absolute;
    left: 0;
    right: 0;
    transform: scaleX(1) translateY(-50%) !important;
        `;

        // Ajouter l'animation CSS si elle n'existe pas déjà
        if (!document.querySelector('#drag-drop-animations')) {
            const style = document.createElement('style');
            style.id = 'drag-drop-animations';
            style.textContent = `
                @keyframes placeholderPulse {
                    0% { box-shadow: 0 0 8px rgba(59, 130, 246, 0.4); }
                    100% { box-shadow: 0 0 12px rgba(59, 130, 246, 0.8); }
                }
                
                @keyframes dragGhostFloat {
                    0%, 100% { transform: translateY(-2px) rotate(-1deg) scale(1.02); }
                    50% { transform: translateY(-4px) rotate(1deg) scale(1.03); }
                }
                
                @keyframes dragGhostAppear {
                    from {
                        opacity: 0;
                        transform: scale(0.95);
                    }
                    to {
                        opacity: 0.95;
                        transform: scale(1);
                    }
                }
                
                @keyframes dragGhostDisappear {
                    from {
                        opacity: 0.95;
                        transform: scale(1);
                    }
                    to {
                        opacity: 0;
                        transform: scale(0.95);
                    }
                }
                
                .drag-ghost {
                    position: fixed;
                    z-index: 9999;
                    pointer-events: none;
                    background: var(--surface);
                    color: var(--text);
                    font-family: var(--font-standard);
                    font-size: var(--text-sm);
                    border-radius: var(--radius-lg);
                    box-shadow: var(--box-shadow-medium);
                    opacity: 0;
                    transform: scale(0.95);
                    animation: dragGhostAppear 0.2s cubic-bezier(0.16, 1, 0.3, 1) forwards;
                }

                .drag-ghost > td {
                min-height: unset !important;
    height: inherit;
    box-sizing: border-box;
    }

    .drag-ghost > td:nth-child(2) > div {
        height: inherit;
    max-height: 100%;
    box-sizing: border-box;
    }
                
                .drag-row-original {
                    opacity: 0.3 !important;
                    transition: all 0.2s ease !important;
                    background-color: rgba(59, 130, 246, 0.05) !important;
                    border: 1px dashed rgba(59, 130, 246, 0.3) !important;
                }
                
                .drag-row-shifting {
                    transition: transform 0.25s cubic-bezier(0.25, 0.46, 0.45, 0.94) !important;
                }
                
                .drag-row-resetting {
                    transition: transform 0.2s ease-out !important;
                }
                
                .drop-placeholder-visible {
                    opacity: 1 !important;
                    transform: scaleX(1) !important;
                }
            `;
            document.head.appendChild(style);
        }

        return placeholder;
    };

    const createDragGhost = (originalRow: HTMLElement) => {
        const ghost = originalRow.cloneNode(true) as HTMLElement;
        ghost.className = 'drag-ghost';

        // Nettoyer le ghost des éléments interactifs
        const interactiveElements = ghost.querySelectorAll('input, button, [role="button"]');
        interactiveElements.forEach(el => el.remove());

        // Ajuster la largeur pour correspondre à l'original
        const originalRect = originalRow.getBoundingClientRect();
        ghost.style.width = `${originalRect.width}px`;
        ghost.style.height = `${originalRect.height}px`;
        
        // Positionner immédiatement à la position de l'élément source
        ghost.style.left = `${originalRect.left}px`;
        ghost.style.top = `${originalRect.top}px`;

        document.body.appendChild(ghost);
        return ghost;
    };

    const updateDragGhostPosition = (e: DragEvent) => {
        if (dragGhostRef.current) {
            const ghost = dragGhostRef.current;
            ghost.style.left = `${e.clientX + 10}px`;
            ghost.style.top = `${e.clientY - 20}px`;
        }
    };

    const cacheRowHeights = (allRows: HTMLElement[]) => {
        // Nettoyer le cache précédent
        rowHeightsCache.current.clear();
        
        // Calculer toutes les hauteurs en une seule fois pour éviter les reflows multiples
        allRows.forEach(row => {
            const height = row.getBoundingClientRect().height;
            rowHeightsCache.current.set(row, height);
        });
    };

    const animateRowsReordering = (container: HTMLElement, afterElement: HTMLElement | null) => {
        if (isAnimatingRef.current || !draggedElementRef.current) return;

        // Annuler l'animation frame précédente si elle existe
        if (lastAnimationFrame.current) {
            cancelAnimationFrame(lastAnimationFrame.current);
        }

        lastAnimationFrame.current = requestAnimationFrame(() => {
            const allRows = Array.from(container.querySelectorAll(rowSelector)) as HTMLElement[];
            const draggedElement = draggedElementRef.current;
            
            if (!draggedElement) return;

            // Mettre en cache les hauteurs si ce n'est pas déjà fait
            if (rowHeightsCache.current.size === 0) {
                cacheRowHeights(allRows);
            }

            // Ajouter la classe de transition à tous les éléments
            allRows.forEach(row => {
                if (row !== draggedElement) {
                    row.classList.remove('drag-row-resetting');
                    row.classList.add('drag-row-shifting');
                }
            });

            // Calculer les nouvelles positions
            const draggedIndex = allRows.indexOf(draggedElement);
            const targetIndex = afterElement ? allRows.indexOf(afterElement) : allRows.length;

            if (draggedIndex !== -1 && targetIndex !== -1 && draggedIndex !== targetIndex) {
                // Réorganiser visuellement les éléments
                allRows.forEach((row, index) => {
                    if (row === draggedElement) return;

                    let translateY = 0;
                    const rowHeight = rowHeightsCache.current.get(row) || 0;

                    if (draggedIndex < targetIndex) {
                        // Déplacement vers le bas
                        if (index > draggedIndex && index < targetIndex) {
                            translateY = -rowHeight;
                        }
                    } else {
                        // Déplacement vers le haut
                        if (index >= targetIndex && index < draggedIndex) {
                            translateY = rowHeight;
                        }
                    }

                    row.style.transform = translateY !== 0 ? `translateY(${translateY}px)` : '';
                });
            }
            
            lastAnimationFrame.current = null;
        });
    };

    const resetRowAnimations = () => {
        const container = document.querySelector(containerSelector);
        if (container) {
            const allRows = Array.from(container.querySelectorAll(rowSelector)) as HTMLElement[];
            
            // Ajouter la classe de transition de reset pour une animation fluide
            allRows.forEach(row => {
                row.classList.add('drag-row-resetting');
                row.classList.remove('drag-row-shifting', 'drag-row-original');
                row.style.transform = '';
                row.style.opacity = '';
                row.style.backgroundColor = '';
                row.style.border = '';
            });

            // Nettoyer les classes après l'animation
            setTimeout(() => {
                allRows.forEach(row => {
                    row.classList.remove('drag-row-resetting');
                });
            }, 200);
        }
        
        // Nettoyer le cache des hauteurs
        rowHeightsCache.current.clear();
    };

    const getDragAfterElement = useCallback((container: HTMLElement, y: number) => {
        const draggableElements = Array.from(container.querySelectorAll(rowSelector))
            .filter(el => el !== draggedElementRef.current);

        return draggableElements.reduce((closest: any, child) => {
            const box = child.getBoundingClientRect();
            const offset = y - box.top - box.height / 2;

            if (offset < 0 && offset > closest.offset) {
                return { offset, element: child };
            } else {
                return closest;
            }
        }, { offset: Number.NEGATIVE_INFINITY }).element;
    }, [rowSelector]);

    const onDragOver = useCallback((e: DragEvent) => {
        e.preventDefault();

        const container = document.querySelector(containerSelector);
        if (!container || !dropPlaceholderRef.current) return;

        const afterElement = getDragAfterElement(container as HTMLElement, e.clientY);

        // Mettre à jour la position du ghost
        updateDragGhostPosition(e);

        // Positionner le placeholder
        if (afterElement === null) {
            container.appendChild(dropPlaceholderRef.current);
        } else {
            container.insertBefore(dropPlaceholderRef.current, afterElement);
        }

        // Rendre le placeholder visible avec animation
        if (!dropPlaceholderRef.current.classList.contains('drop-placeholder-visible')) {
            dropPlaceholderRef.current.classList.add('drop-placeholder-visible');
        }

        // Animer le réarrangement des lignes
        animateRowsReordering(container as HTMLElement, afterElement);

    }, [containerSelector, getDragAfterElement]);

    const onDragEnd = useCallback(() => {
        document.removeEventListener('dragover', onDragOver);
        document.removeEventListener('dragend', onDragEnd);
        document.removeEventListener('dragover', updateDragGhostPosition);

        if (draggedElementRef.current) {
            // Calculate the new order
            const container = document.querySelector(containerSelector);
            if (container && dropPlaceholderRef.current) {
                const allRows = Array.from(container.querySelectorAll(rowSelector));
                const placeholderIndex = Array.from(container.children).indexOf(dropPlaceholderRef.current);

                // Create an array with new orders based on final DOM order
                const finalRows = [...allRows];
                const draggedElement = draggedElementRef.current;
                const draggedIndex = finalRows.indexOf(draggedElement!);

                // Remove element from its current position
                if (draggedIndex > -1) {
                    finalRows.splice(draggedIndex, 1);
                }

                // Insert it at the new position (where the placeholder is)
                finalRows.splice(placeholderIndex, 0, draggedElement!);

                const reorderedItems: Array<{ id: number; newOrder: number }> = [];
                finalRows.forEach((row, index) => {
                    const dataId = (row as HTMLElement).getAttribute('data-row-id');
                    if (dataId) {
                        reorderedItems.push({
                            id: parseInt(dataId),
                            newOrder: index,
                        });
                    }
                });

                onOrderChange(reorderedItems);
            }
        }

        // Ne pas réinitialiser les animations immédiatement
        // Les éléments doivent garder leur position visuelle jusqu'au refresh des données

        // Nettoyer les éléments
        dropPlaceholderRef.current?.remove();
        dropPlaceholderRef.current = null;

        if (dragGhostRef.current) {
            // Appliquer l'animation de disparition
            dragGhostRef.current.style.animation = 'dragGhostDisappear 0.2s cubic-bezier(0.16, 1, 0.3, 1) forwards';
            setTimeout(() => {
                dragGhostRef.current?.remove();
                dragGhostRef.current = null;
            }, 200);
        }

        draggedElementRef.current = null;
        isAnimatingRef.current = false;
        
        // Nettoyer les animation frames en cours
        if (lastAnimationFrame.current) {
            cancelAnimationFrame(lastAnimationFrame.current);
            lastAnimationFrame.current = null;
        }

    }, [onOrderChange, containerSelector, rowSelector, onDragOver]);

    const onDragStart = useCallback((event: React.DragEvent, rowElement: HTMLElement) => {
        draggedElementRef.current = rowElement;
        dropPlaceholderRef.current = createDropPlaceholder();

        // Créer le ghost visuel
        dragGhostRef.current = createDragGhost(rowElement);

        // Styler l'élément original
        rowElement.classList.add('drag-row-original');

        // Événements globaux
        document.addEventListener('dragover', onDragOver);
        document.addEventListener('dragend', onDragEnd);
        document.addEventListener('dragover', updateDragGhostPosition);

        // Empêcher l'image de drag par défaut
        event.dataTransfer.setDragImage(emptyImg, 0, 0);

    }, [onDragOver, onDragEnd]);

    return {
        onDragStart,
        draggedElementRef,
        resetAnimations: resetRowAnimations,
    };
}