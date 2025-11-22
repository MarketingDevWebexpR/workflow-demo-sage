import React from "react";


interface IUseDragAndDrop {
    containerSelector: string,
    containerChildsSelector: string,
    dragStartAction: ({ event, draggedElementRef }: { event: React.DragEvent, draggedElementRef: React.MutableRefObject<HTMLElement | null> }) => void,
    dragEndAction: ({
        afterElementRef,
        draggedElementRef,
    }: {
        afterElementRef: React.MutableRefObject<HTMLElement | null>,
        draggedElementRef: React.MutableRefObject<HTMLElement | null>,
    }) => void,
    dropPlaceholder: HTMLElement,
}

export default function useDragAndDrop({
    containerSelector,
    containerChildsSelector,
    dragStartAction,
    dragEndAction,
    dropPlaceholder,
}: IUseDragAndDrop) {

    const draggedElementRef = React.useRef<HTMLElement | null>(null);
    const afterElementRef = React.useRef<HTMLElement | null>(null);
    const dropPlaceholderRef = React.useRef<HTMLElement | null>(dropPlaceholder);

    function onDragStart(event: React.DragEvent) {

        draggedElementRef.current = event.currentTarget as HTMLElement;
        dropPlaceholderRef.current = dropPlaceholder;
        dragStartAction?.({ event, draggedElementRef });
        document.addEventListener('dragover', onDragOver);
    }

    function onDragEnd() {

        document.removeEventListener('dragover', onDragOver);
        dragEndAction({ afterElementRef, draggedElementRef });
        dropPlaceholderRef.current?.remove();
    }

    function onDragOver(e: any): void {

        e.preventDefault()

        const draggable = dropPlaceholderRef.current as HTMLElement;
        const container = document.querySelector(containerSelector) as HTMLElement;
        const afterElement = getDragAfterElement(container, e.clientY);

        if (afterElement === null) {
            container.appendChild(draggable);
        }
        else {
            container.insertBefore(draggable, afterElement);
        }

        afterElementRef.current = afterElement;

        function getDragAfterElement(container: any, y: any) {

            const draggableElements = [...container.querySelectorAll(containerChildsSelector)];

            return draggableElements.reduce((closest, child) => {

                const box = child.getBoundingClientRect();
                const offset = y - box.top - box.height / 2;

                if (offset < 0 && offset > closest.offset)
                    return {
                        offset,
                        element: child,
                    };
                else
                    return closest;
            }, { offset: Number.NEGATIVE_INFINITY }).element
        }
    }

    return {
        onDragStart,
        onDragEnd,
    };
}
