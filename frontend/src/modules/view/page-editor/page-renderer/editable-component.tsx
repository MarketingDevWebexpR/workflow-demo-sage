import React, { useRef } from "react";
import { Trash } from "lucide-react";
import { type TPageComponent } from "../../models/page.model";
import { throttle } from "lodash";
import { usePageStore } from "../../store/page.store";
import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuTrigger } from "../../../misc/components/context-menu/context-menu";


interface IEditableComponent {
    children: React.ReactElement,
    component: TPageComponent,
}
export const EMPTY_IMAGE = new Image(1, 1);
EMPTY_IMAGE.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==';

export default function EditableComponent({
    children,
    component,
}: IEditableComponent): React.ReactElement {

    // Sélection ciblée des propriétés pour minimiser les re-renders
    const hoveredComponentId = usePageStore(state => state.hoveredComponentId);
    const editedComponentId = usePageStore(state => state.editedComponentId);
    const selectedView = usePageStore(state => state.selected.item);
    const dispatch = usePageStore(state => state.dispatch);
    const containerChildsSelector = `span:has(>[data-page-component-id]:not([data-page-component-id="${component.id}"])) > *`;

    // Helper : Récupérer les composants depuis selected.item
    const getCurrentComponents = (): TPageComponent[] => {
        if (!selectedView?.Components) {
            return [];
        }

        try {
            return JSON.parse(selectedView.Components) as TPageComponent[];
        } catch (error) {
            console.error('❌ [EditableComponent] Erreur parsing components:', error);
            return [];
        }
    };

    function deleteComponentById(id: string) {

        return () => {
            const currentComponents = getCurrentComponents();
            const indexOfEditedComponent = currentComponents.findIndex(component => component.id === id);
            currentComponents.splice(indexOfEditedComponent, 1);

            const updatedComponentsJson = JSON.stringify(currentComponents);
            dispatch({ type: 'SET_EDITED_PAGE_COMPONENTS', payload: updatedComponentsJson });
        };
    }

    const draggedElementRef = React.useRef<HTMLElement | null>(null);
    const draggedElementCloneRef = React.useRef<HTMLElement | null>(null);
    const afterElementRef = React.useRef<HTMLElement | null>(null);
    const contextRef = React.useRef<string | null>(null);
    const isDraggingOverItselfRef = React.useRef(false);
    const abortController = useRef<AbortController>(new AbortController());

    const onDragOverThrottled = throttle(onDragOver, 0);

    function onDragStart(event: React.DragEvent) {

        document.body.style.cursor = 'grabbing';

        // On stoppe la propagation si on est sur le composant en cours de hover,
        // afin que les onDragStart des composants parents ne soient pas invoqués
        if (hoveredComponentId === component.id) {
            event.stopPropagation();
        }

        // On ne permet pas de déplacer un composant autre que celui sélectionné,
        // lorsqu'un composant est sélectionné.
        if (editedComponentId && editedComponentId !== component.id) {
            event.preventDefault();
            console.log('tentative de déplacement d\'un composant autre que celui sélectionné. Il faudrait permettre le déplacement du composant sélectionné si jamais on essaye de déplacer un composant enfant de celui-ci.');
            return;
        }

        draggedElementRef.current = document.querySelector(`[data-page-component-id="${hoveredComponentId}"]`) as HTMLElement;

        const rect = draggedElementRef.current.getBoundingClientRect();
        const el = draggedElementRef.current.cloneNode(true) as HTMLElement;
        document.getElementById('app')?.appendChild(el);
        const scaleValue = parseFloat(window.getComputedStyle(draggedElementRef.current).getPropertyValue('--scale-value')) || 1;

        console.log({ scaleValue, rect, draggedElementRef: draggedElementRef.current });
        // draggedElementRef.current.parentElement?.prepend(el);
        console.log({ rect, });
        el.style.position = 'absolute';
        el.style.top = '0';
        el.style.left = '0';
        el.style.zIndex = '222222222';
        // el.style.background = 'red';
        el.style.minWidth = `calc(${rect.width}px / ${scaleValue})`;
        el.style.height = `calc(${rect.height}px / ${scaleValue})`;
        el.style.pointerEvents = 'none';
        el.style.transform = `scale(${scaleValue})`;
        el.style.transformOrigin = 'top left';
        el.style.visibility = 'hidden';
        el.style.opacity = '0.33';
        // el.style.transition = 'all 0.150s ease-in-out';
        draggedElementCloneRef.current = el;
        event.dataTransfer.setDragImage(EMPTY_IMAGE, 0, 0);
        event.dataTransfer.effectAllowed = 'none';
        event.dataTransfer.dropEffect = 'none';

        document.addEventListener('dragover', onDragOverThrottled, { signal: abortController.current.signal });
    }

    function onDragEnd(event: React.DragEvent) {

        document.body.style.removeProperty('cursor');
        draggedElementCloneRef.current?.remove();
        draggedElementCloneRef.current = null;

        // On stoppe la propagation si on est sur le composant en cours de hover,
        // afin que les onDragEnd des composants parents ne soient pas invoqués
        if (hoveredComponentId === component.id) {
            event.stopPropagation();
        }

        abortController.current.abort();
        abortController.current = new AbortController();

        // On ne peut pas déplacer un composant au sein de lui-même.
        if (isDraggingOverItselfRef.current) {
            // console.log('%cOn ne peut pas déplacer un composant au sein de lui-même.', 'background-color: royalblue; color: white; border-radius: 4px;');
            dispatch({ type: 'SET_DRAG_OVER_INFOS', payload: null });
            return;
        }

        // La souris est en dehors de la zone d'édition.
        if (!contextRef.current) {
            // console.log(`%cLa souris est en dehors de la zone d'édition.`, 'background-color: royalblue; color: white; border-radius: 4px;');
            dispatch({ type: 'SET_DRAG_OVER_INFOS', payload: null });
            return;
        }

        // Wtf ?
        if (!draggedElementRef.current) {
            alert('draggedElementRef.current is null ?');
            dispatch({ type: 'SET_DRAG_OVER_INFOS', payload: null });
            return;
        }

        const draggedComponentElement = draggedElementRef.current as HTMLElement | null;

        if (!draggedComponentElement) {
            dispatch({ type: 'SET_DRAG_OVER_INFOS', payload: null });
            throw new Error('draggedComponentElement is null');
        }

        const draggedComponentId = draggedComponentElement.dataset.pageComponentId!;
        const editedPageComponents = getCurrentComponents();
        const draggedComponent = editedPageComponents.find(component => component.id === draggedComponentId)!;
        const updatedDraggedComponent: TPageComponent = {
            ...draggedComponent,
            context: contextRef.current,
        };

        let updatedComponentsJson: string;

        if (!afterElementRef.current) {

            const componentsCopy = [...editedPageComponents];
            const indexOfComponent = componentsCopy.findIndex(({ id }) => id === component.id);
            componentsCopy.splice(indexOfComponent, 1);
            componentsCopy.push(updatedDraggedComponent!);

            updatedComponentsJson = JSON.stringify(componentsCopy);
            dispatch({ type: 'SET_EDITED_PAGE_COMPONENTS', payload: updatedComponentsJson });
            console.log('✅ [EditableComponent] Composant déplacé à la fin');
        } else {

            const componentsCopy = [...editedPageComponents];
            const afterComponent = afterElementRef.current as HTMLElement | null;

            if (!afterComponent) {
                throw new Error('Le composant après lequel on veut insérer le composant déplacé n\'a pas de data-page-component-id');
            }

            const afterComponentId = afterComponent.dataset.pageComponentId!;
            const indexOfComponent = componentsCopy.findIndex(({ id }) => id === component.id);
            componentsCopy.splice(indexOfComponent, 1);
            const indexOfAfterComponent = componentsCopy.findIndex(({ id }) => id === afterComponentId);
            componentsCopy.splice(indexOfAfterComponent, 0, updatedDraggedComponent!);

            updatedComponentsJson = JSON.stringify(componentsCopy);
            dispatch({ type: 'SET_EDITED_PAGE_COMPONENTS', payload: updatedComponentsJson });
        }

        dispatch({ type: 'SET_DRAG_OVER_INFOS', payload: null });

        dispatch({ type: 'SET_HOVERED_COMPONENT_ID', payload: null });
    }

    function onDragOver(e: DragEvent): void {

        console.log({e, movementX: e.movementX, movementY: e.movementY, clientX: e.clientX, clientY: e.clientY });

        if (draggedElementCloneRef.current  ) {
            draggedElementCloneRef.current.style.top = `${e.clientY}px`;
            draggedElementCloneRef.current.style.left = `${e.clientX}px`;

            if(!(e.clientX === 0 && e.clientY === 0)) {
                draggedElementCloneRef.current.style.removeProperty('visibility');
            }
        }

        e.preventDefault()
        if (hoveredComponentId === component.id) {
            e.stopPropagation();
        }

        const target = e.target as HTMLElement;
        let closestLayerElement = target.closest('[data-layer-id]');
        const pageEditor = target.closest('[data-page-editor]');

        if (pageEditor) {
            // Si on est bel et bien sur le bloc d'édition, mais que le data-layer-id n'a pas été trouvé,
            // c'est qu'on est sur la page.
            closestLayerElement ??= pageEditor.querySelector('[data-layer-id="page"]');
        }
        const closestComponentElementWithComponentId = closestLayerElement?.closest(`[data-page-component-id="${component.id}"]`);

        const closestLayerId = closestLayerElement?.getAttribute('data-layer-id') || null;
        const closestLayerTitle = closestLayerElement?.getAttribute('data-layer-title') || null;
        contextRef.current = closestLayerId;

        // La souris est en dehors de la zone d'édition.
        if (!contextRef.current) {
            // console.log(`%cLa souris est en dehors de la zone d'édition.`, 'background-color: royalblue; color: white; border-radius: 4px;');
            dispatch({ type: 'SET_DRAG_OVER_INFOS', payload: null });
            return;
        }

        const afterElement = getDragAfterElement(closestLayerElement, e.clientY);

        // On ne peut pas déplacer un composant au sein de lui-même.
        if (draggedElementRef.current?.contains(afterElement)) {
            // Dans ce cas de figure, on est sur un composant enfant du composant en cours de déplacement.
            // console.log('%cOn est sur un composant enfant du composant en cours de déplacement.', 'background-color: royalblue; color: white; border-radius: 4px;');
            dispatch({ type: 'SET_DRAG_OVER_INFOS', payload: null });
            isDraggingOverItselfRef.current = true;
            return;

        } else if (!afterElement && closestComponentElementWithComponentId) {
            // Dans ce cas de figure, on souhaite rajouter le composant en cours de déplacement
            // au sein de lui-même.
            // console.log('%cOn souhaite rajouter le composant en cours de déplacement au sein de lui-même.', 'background-color: royalblue; color: white; border-radius: 4px;');
            dispatch({ type: 'SET_DRAG_OVER_INFOS', payload: null });
            isDraggingOverItselfRef.current = true;
            return;

        } else {
            // Sinon, on est sur une autre couche, on peut donc déplacer le composant.
            isDraggingOverItselfRef.current = false;
        }


        const afterComponentId = afterElement?.dataset.pageComponentId || null;

        dispatch({
            type: 'SET_DRAG_OVER_INFOS',
            payload: {
                context: closestLayerId || 'page',
                layerTitle: closestLayerTitle || 'Page',
                afterComponentId: afterComponentId,
            }
        });

        afterElementRef.current = afterElement;

        function getDragAfterElement(container: any, y: any) {

            // On ne doit pas détecter le composant comme hovered si on déplace un composant,
            // et que le composant hovered est un composant enfant du composant en cours de déplacement.
            // console.log(
            //     `// On ne doit pas détecter le composant comme hovered si on déplace un composant,
            // // et que le composant hovered est un composant enfant du composant en cours de déplacement.`,
            //     {
            //     draggedElementRef,
            //     target,
            // });

            const draggableElements = [
                ...container
                    .parentElement
                    .querySelectorAll(
                        `[data-layer-id="${closestLayerId}"] > ${containerChildsSelector}`
                        + `,[data-layer-id="${closestLayerId}"] > [data-builder-empty-component]`
                    )
            ]
            // .filter( element => {

            //     const isElementChildOfDraggedElement = draggedElementRef.current?.contains(element);
            //     console.log({
            //         isElementChildOfDraggedElement,
            //         element,
            //         draggedElementRefCurrent: draggedElementRef.current,
            //     });
            //     return !isElementChildOfDraggedElement;
            // })

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
            }, { offset: Number.NEGATIVE_INFINITY }).element;
        }
    }

    // Cloner l’enfant en lui ajoutant les props drag
    const draggableChild = React.cloneElement(children, {
        ...true ? {
            draggable: true,
            onDragStart: (e: React.DragEvent) => {
                if ((children.props as any).onDragStart) ((children.props as any).onDragStart)(e);
                if (onDragStart) onDragStart(e);
            },
            onDragEnd: (e: React.DragEvent) => {
                if ((children.props as any).onDragEnd) ((children.props as any).onDragEnd)(e);
                if (onDragEnd) onDragEnd(e);
            },
            ['data-cursor-grab']: !editedComponentId,
        } : {},
    });

    return <ContextMenu>
        <ContextMenuTrigger
            onDoubleClick={e => {

                if (hoveredComponentId === component.id) {
                    e.stopPropagation();
                }

                if (editedComponentId) {

                    if (editedComponentId === component.id) {
                        return;
                    }

                    dispatch({ type: 'SET_EDITED_COMPONENT_ID', payload: null });
                } else {
                    dispatch({ type: 'SET_EDITED_COMPONENT_ID', payload: component.id });
                }
            }}
        >
            {draggableChild}
        </ContextMenuTrigger>
        <ContextMenuContent>
            <ContextMenuItem onClick={deleteComponentById(component.id)}>
                <Trash size={18} /> Delete
            </ContextMenuItem>
        </ContextMenuContent>
    </ContextMenu>;
}