import React, { useRef, useState } from "react";
import { appLaunchTimestamp } from "../../../../utils/number.utils";
// import { PageContext } from "../../../../modules/page/context/page.context";
import { type TPageComponent } from "../../models/page.model";
import useScaleToFitParent from "../../../../hooks/use-scale-to-fit-parent";
import { type IModuleComponent } from "../../../config";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, } from "../../../../components/ui/alert-dialog/alert-dialog";
import { ArrowRight, Loader } from "lucide-react";
// import { PnPContext } from "../../../../contexts/pnp.context";
import { throttle } from "lodash";
import { v4 as uuidv4 } from 'uuid';
import { usePageStore } from "../../store/page.store";
import styles from "./draggable-module-component.module.scss";

interface IDraggableModule {
    moduleComponent: Omit<IModuleComponent, 'PropsForm'>,
}


export default function DraggableModuleComponent({
    moduleComponent,
}: IDraggableModule): React.ReactElement {

    const dispatch = usePageStore(state => state.dispatch);
    const selectedView = usePageStore(state => state.selected.item);
    const [isAlertOpen, setIsAlertOpen] = useState(false);
    const [isExecutingRequirement, setIsExecutingRequirement] = useState(false);
    // const { sp } = useContext(PnPContext);

    // Récupérer les composants depuis selected.item
    let currentComponents: TPageComponent[] = [];
    if (selectedView?.Components) {
        try {
            currentComponents = JSON.parse(selectedView.Components) as TPageComponent[];
        } catch (error) {
            console.error('❌ [DraggableModule] Erreur parsing components:', error);
        }
    }
    const ref = useRef<HTMLDivElement | null>(null);
    const afterElementRef = useRef<HTMLElement | null>(null);
    const contextRef = React.useRef<string | null>(null);
    const abortController = useRef<AbortController>( new AbortController() );
    const moduleComponentDisplayName = moduleComponent.Component.displayName;

    console.log('afterElementRef', afterElementRef.current);
    useScaleToFitParent(ref);

    const onDragOverThrottled = throttle(onDragOver, 200);

    function onDragStart() {
        document.addEventListener('dragover', onDragOverThrottled, { signal: abortController.current.signal });
    }

    async function onDragEnd() {

        abortController.current.abort();
        abortController.current = new AbortController();

        if( ! contextRef.current ) {
            console.log(`%cLe composant n'a pas été inséré, car la souris était en dehors de la zone d'édition.`, 'background-color: #F2F2F2; color: #313131; border-radius: 4px;');
            return;
        }

        if (moduleComponent.requirement) {

            setIsAlertOpen(true);
            await new Promise((resolve) => {

                document.addEventListener('Requirement:Done', () => {
                    resolve(undefined);
                }, { once: true });
            });
        }

        const newComponent: TPageComponent = {
            id: `${appLaunchTimestamp}-${uuidv4()}`,
            displayName: moduleComponent.Component.displayName!,
            context: contextRef.current ?? 'page',
            ...moduleComponent.getDefaultProps ? {
                props: moduleComponent.getDefaultProps(),
            } : {},
        };

        console.log('🆕 [DraggableModule] newComponent', newComponent);

        let updatedComponentsJson: string;

        if (!afterElementRef.current) {

            const updatedComponents: TPageComponent[] = [
                ...currentComponents,
                newComponent,
            ];

            updatedComponentsJson = JSON.stringify(updatedComponents);
            dispatch({ type: 'SET_EDITED_PAGE_COMPONENTS', payload: updatedComponentsJson });

        } else {
            const afterComponent = afterElementRef.current as HTMLElement | null;

            if (!afterComponent) {
                throw new Error('Le composant après lequel on veut insérer le composant déplacé n\'a pas de data-page-component-id');
            }

            const afterComponentId = afterComponent.dataset.pageComponentId!;
            const indexOfComponent = currentComponents.findIndex(component => component.id === afterComponentId);

            const currentComponentsCopy = [...currentComponents];

            currentComponentsCopy.splice(indexOfComponent, 0, newComponent);

            updatedComponentsJson = JSON.stringify(currentComponentsCopy);
            dispatch({ type: 'SET_EDITED_PAGE_COMPONENTS', payload: updatedComponentsJson });
        }

        dispatch({ type: 'SET_DRAG_OVER_INFOS', payload: null });

        dispatch({ type: 'SET_HOVERED_COMPONENT_ID', payload: null });
    }

    function onDragOver(e: any): void {

        e.preventDefault();

        const target = e.target as HTMLElement;
        let closestContextContainer = target.closest('[data-layer-id]');
        const pageEditor = target.closest('[data-page-editor]');

        if( pageEditor ) {
            // Si on est bel et bien sur le bloc d'édition, mais que le data-layer-id n'a pas été trouvé,
            // c'est qu'on est sur la page.
            closestContextContainer ??= pageEditor.querySelector('[data-layer-id="page"]');
        }

        const closestContextContainerId = closestContextContainer?.getAttribute('data-layer-id') || null;
        const closestContextContainerTitle = closestContextContainer?.getAttribute('data-layer-title') || null;
        contextRef.current = closestContextContainerId;

        if( !contextRef.current ) {

            console.log(`%cLa souris est en dehors de la zone d'édition.`, 'background-color: #F2F2F2; color: #313131; border-radius: 4px;');
            dispatch({ type: 'SET_DRAG_OVER_INFOS', payload: null });
            return;
        }

        const afterElement = getDragAfterElement(closestContextContainer, e.clientY);

        console.log('afterelement', {
            closestContextContainer,
            'e.clientY': e.clientY,
        });
        dispatch({
            type: 'SET_DRAG_OVER_INFOS',
            payload: {
                context: closestContextContainerId || 'page',
                layerTitle: closestContextContainerTitle || 'Page',
                afterComponentId: afterElement?.dataset.pageComponentId || null,
        }});

        afterElementRef.current = afterElement;

        function getDragAfterElement(container: any, y: any) {

            const containerChildsSelector = `span:has(>[data-page-component-id]:not([data-pickable-component-display-name="${moduleComponentDisplayName}"])) > *`;

            const draggableElements = [
                ...container
                .parentElement
                .querySelectorAll(
                    `[data-layer-id="${closestContextContainerId}"] > ${containerChildsSelector}`
                    +`,[data-layer-id="${closestContextContainerId}"] > [data-builder-empty-component]`
                )
            ];
            // const draggableElements = [...container.querySelectorAll(`span:has(>[data-page-component-id]:not([data-pickable-component-display-name="${moduleComponentDisplayName}"])`)];

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

    return <div
        key={`picker-${moduleComponent.titleKey}`}
        data-pickable-component-display-name={moduleComponentDisplayName}
        className={styles.draggableModuleComponent}
        draggable
        onDragStart={onDragStart}
        onDragEnd={onDragEnd}
    >
        <div className={styles.draggableModuleComponentContent}>
            <div className={styles.draggableModuleComponentHead}>
                <div className={styles.draggableModuleComponentIconWrapper}>
                    <moduleComponent.Icon
                        className={styles.draggableModuleComponentIcon}
                    />
                </div>
            </div>
            <div className={styles.draggableModuleComponentTitle}>{moduleComponent.titleKey}</div>
            {/* <div className={styles.draggableModuleComponentDescription}>{t(moduleComponent.descriptionKey as any)}</div> */}
        </div>

        {moduleComponent.requirement ? <AlertDialog open={isAlertOpen}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>{moduleComponent.requirement.title}</AlertDialogTitle>
                    <AlertDialogDescription>
                        {moduleComponent.requirement.description}
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel
                        onClick={() => {
                            document.dispatchEvent(new CustomEvent('Requirement:Done', {
                                detail: {
                                    ok: false,
                                    error: new Error('The user has cancelled the execution of the constraint.'),
                                },
                            }));
                            setIsAlertOpen(false);
                        }}
                    >Cancel</AlertDialogCancel>
                    <AlertDialogAction
                        disabled={isExecutingRequirement}
                        onClick={async () => {
                            setIsExecutingRequirement(true);
                            // await moduleComponent.requirement?.execute({
                            //     sp,
                            //     editedPage: editedPage!,
                            //     pageContext,
                            // });
                            setIsExecutingRequirement(false);

                            document.dispatchEvent(new CustomEvent('Requirement:Done'));
                            setIsAlertOpen(false);
                        }}
                    >{
                            isExecutingRequirement
                                ? <>
                                    <Loader className="mr-1 animate-spin" size={16} />
                                    Working...
                                </>
                                : <>
                                    <ArrowRight className="mr-1" size={16} />
                                    Continue
                                </>
                        }</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog> : null}
    </div>;
}
