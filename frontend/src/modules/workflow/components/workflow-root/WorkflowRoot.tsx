// @@ components
import WorkflowSwitchTile from '../WorkflowTile/WorkflowSwitchTile/WorkflowSwitchTile';
import WorkflowActionTile from '../WorkflowTile/WorkflowActionTile/WorkflowActionTile';
import WorkflowStatusTile from '../WorkflowTile/WorkflowStatusTile/WorkflowStatusTile';
import WorkflowBoundaryTile from '../WorkflowTile/WorkflowBoundaryTile/WorkflowBoundaryTile';
import WorkflowPlaceholderTile from '../WorkflowTile/WorkflowPlaceholderTile/WorkflowPlaceholderTile';
import WorkflowYesTile from '../WorkflowTile/WorkflowYesTile/WorkflowYesTile';
import WorkflowNoTile from '../WorkflowTile/WorkflowNoTile/WorkflowNoTile';
import WorkflowTile from '../WorkflowTile/WorkflowTile';
import WorkflowUpToRight from '../connectors/WorkflowConnector/WorkflowUpToRight/WorkflowUpToRight';
import WorkflowVerticalLineDown from '../connectors/WorkflowConnector/WorkflowVerticalLineDown/WorkflowVerticalLineDown';
import WorkflowVerticalLineUp from '../connectors/WorkflowConnector/WorkflowVerticalLineUp/WorkflowVerticalLineUp';
import WorkflowHorizontalLineLeft from '../connectors/WorkflowConnector/WorkflowHorizontalLineLeft/WorkflowHorizontalLineLeft';
import WorkflowHorizontalLineRight from '../connectors/WorkflowConnector/WorkflowHorizontalLineRight/WorkflowHorizontalLineRight';
import WorkflowBottomToLeft from '../connectors/WorkflowConnector/WorkflowBottomToLeft/WorkflowBottomToLeft';
import WorkflowUpToLeft from '../connectors/WorkflowConnector/WorkflowUpToLeft/WorkflowUpToLeft';
import FancyTabs, { FancyTabsContent } from '../../../../components/ui/fancy-tabs/fancy-tabs';
import { Input } from '../../../../components/ui/form/base-fields/input/input';
import { WorkflowOptionsRenderer } from './workflow-forms/WorkflowOptionsRenderer';

// @@ models
import WorkflowSwitch from '../../models/workflow/elements/WorkflowSwitch.model';
import WorkflowAction from '../../models/workflow/elements/WorkflowAction.model';
import WorkflowStatus from '../../models/workflow/elements/WorkflowStatus.model';
import WorkflowBoundary from '../../models/workflow/elements/WorkflowBoundary.model';
import WorkflowPlaceholder from '../../models/workflow/elements/WorkflowPlaceholder.model';
import WorkflowConnectors from '../../models/workflow/connectors';
import WorkflowPseudoElements from '../../models/workflow/pseudoElements';

// @@ react
import * as React from 'react';
import { useEffect, useRef, useState } from 'react';

// @@ styles
import styles from './WorkflowRoot.module.scss';
import workflowTileStyles from '../WorkflowTile/WorkflowTile.module.scss';

// @@ workflow
import useWorkflow from '../../useCases/useWorkflow';

// @@ utils
import { type TMapPoint } from '../../useCases/mapEngine/mapEngineParts_02_01_2024_test/calcMapPoints';
import { createWorkflowFromText } from '../../engine/create-workflow-from-text';
import { type TWorkflowPreferences, DEFAULT_WORKFLOW_PREFERENCES } from '../../models/workflow-item.model';
import { placeholderOptions, getCategoryColor } from '../../data/workflow-placeholder-options';
import { complexCSSPositioning } from './tooltip-positioning.css';
import { useVanillaCSSInjection } from '../../../../hooks/use-vanilla-css-injection';
import { throttle } from 'lodash';






type TWorkflowRootProps = {
    showSettings: boolean;
    showIndexes: boolean;
    workflowInfos: ReturnType<typeof createWorkflowFromText>;
    preferences?: TWorkflowPreferences;
};

enum ETooltipPosition {
    LEFT = 'LEFT',
    RIGHT = 'RIGHT',
}

type TWorkflowSelectionContext = {
    selectedElement: WorkflowAction<any, any, any> | WorkflowSwitch | null;
    setSelectedElement: (element: WorkflowAction<any, any, any> | WorkflowSwitch | null) => void;
};

const WorkflowSelectionContext = React.createContext<TWorkflowSelectionContext>({
    selectedElement: null,
    setSelectedElement: () => {},
});

function WorkflowRoot({
    showIndexes = false,
    workflowInfos,
    preferences = DEFAULT_WORKFLOW_PREFERENCES,
}: TWorkflowRootProps): React.ReactElement {

    useVanillaCSSInjection({
        css: complexCSSPositioning,
        id: 'tooltip-positioning-css',
    })

    // Utiliser les préférences directement depuis les props
    const {
        xCoefficient,
        yCoefficient,
        xAxisThickness,
        yAxisThickness,
        connectorThickness,
        arrowPointerThickness,
        elementWidth,
        elementHeight,
        connectorRadius,
    } = preferences;

    const [workflowMap, setWorkflowMap] = useState<React.ReactElement[]>([]);
    const [workflowMapPoints, setWorkflowMapPoints] = useState<TMapPoint[]>([]);
    const [workflowConnectedMapPoints, setWorkflowConnectedMapPoints] = useState<TMapPoint[]>([]);
    const [devicePixelRatio, setDevicePixelRatio] = useState<typeof window.devicePixelRatio>();
    const [workflowYLength, setWorkflowYLength] = useState<number>(0);
    const [workflowXLength, setWorkflowXLength] = useState<number>(0);
    // const [ xCoefficient, setXCoefficient ] = useState<number>( initialXCoefficient );
    // const [ yCoefficient, setYCoefficient ] = useState<number>( initialYCoefficient );
    // const [ xAxisThickness, setXAxisThickness ] = useState<number>( initialXAxisThickness );
    // const [ yAxisThickness, setYAxisThickness ] = useState<number>( initialYAxisThickness );
    // const [ connectorThickness, setConnectorThickness ] = useState<number>( initialConnectorThickness );
    // const [ arrowPointerThickness, setArrowPointerThickness ] = useState<number>( initialArrowPointerThickness );
    // const [ elementWidth, setElementWidth ] = useState<number>( initialElementWidth );
    // const [ elementHeight,  setElementHeight ] = useState<number>( initialElementHeight );
    // const [ connectorRadius, setConnectorRadius ] = useState<number>( initialConnectorRadius );
    const [hoveredX, setHoveredX] = useState<number>(0);
    const [hoveredY, setHoveredY] = useState<number>(0);
    const [hoveredMapPoint, setHoveredMapPoint] = useState<TMapPoint>();
    const [tooltipHeightBasedOnGhost, setTooltipHeightBasedOnGhost] = useState<number>();
    const [tooltipWidthBasedOnGhost, setTooltipWidthBasedOnGhost] = useState<number>();
    const [isTooltipVisible, setIsTooltipVisible] = useState<boolean>(false);
    const [distanceBetweenElementAndTooltip,] = useState<number>(0);
    const [tooltipPosition] = useState<ETooltipPosition>(ETooltipPosition.LEFT);
    const [formBoxHeightBasedOnGhost, setFormBoxHeightBasedOnGhost] = useState<number>();
    const [formBoxWidthBasedOnGhost, setFormBoxWidthBasedOnGhost] = useState<number>();
    const [isFormBoxVisible, setIsFormBoxVisible] = useState<boolean>(false);
    const [isFormBoxLocked, setIsFormBoxLocked] = useState<boolean>(false);
    const [distanceBetweenElementAndFormBox,] = useState<number>(0);
    const [formBoxPosition] = useState<ETooltipPosition>(ETooltipPosition.RIGHT);
    const [isIndicatorVisible, setIsIndicatorVisible] = useState<boolean>(false);
    const [isIndicatorUsingMessage] = useState<boolean>(false);
    const [distanceBetweenElementAndIndicator,] = useState<number>(30);
    const [currentItemX, setCurrentItemX] = useState<number>();
    const [currentItemY, setCurrentItemY] = useState<number>();
    const [axisOffset] = useState<number>(showIndexes ? 1 : 0);
    const [selectedElement, setSelectedElement] = useState<WorkflowAction<any, any, any> | WorkflowSwitch | null>(null);

    const workflowMapWrapperRef = useRef<HTMLDivElement | null>(null);
    const workflowTooltipRef = useRef<HTMLDivElement | null>(null);
    const workflowFormBoxRef = useRef<HTMLDivElement | null>(null);
    const formBoxTitleInputRef = useRef<HTMLInputElement | null>(null);
    const previousHoveredMapPoint = useRef<TMapPoint | undefined>(undefined);
    const previousHoveredX = useRef<number | undefined>(undefined);
    const previousHoveredY = useRef<number | undefined>(undefined);
    const workflowHoveredTileRef = useRef<HTMLDivElement | null>(null);

    console.log({
        hoveredX,
        hoveredY,

    })

    const {
        calcWorkflowMapPoints,
        currentWorkflowItem,
        pathTakenByFolder,
    } = useWorkflow({ workflowInfos });

    // Fix bug préprod
    useEffect(() => {

        const style = document.createElement('style');
        const styleText = `

            .${workflowTileStyles.workflowTile}[data-type="${WorkflowStatus.name}"] {
                --item-width: 5;
                --item-height: 5;

                .${workflowTileStyles.commonItem} {

                    background-color: #009da0;
                }
            }

            .${workflowTileStyles.workflowTile}[data-type="${WorkflowSwitch.name}"] {

                // --item-width: 15;
            }

            .${workflowTileStyles.workflowTile}[data-type="${WorkflowPlaceholder.name}"] {

                // --item-width: 15;
            }
        `;

        style.textContent = styleText;
        document.head.append(style);

        return () => {

            style?.remove();
        };
    }, []);

    useEffect(() => {

        const currentItemMapPoint = workflowMapPoints.find(mapPoint => mapPoint.item.id === currentWorkflowItem?.id);

        setIsIndicatorVisible(!!currentItemMapPoint);
        setCurrentItemX(currentItemMapPoint?.x);
        setCurrentItemY(currentItemMapPoint?.y);
    }, [currentWorkflowItem, workflowMapPoints]);

    useEffect(() => {

        const { mapPoints, connectedMapPoints } = calcWorkflowMapPoints();

        const workflowMap = connectedMapPoints.map((mapPoint: TMapPoint) => {

            const WorkflowTileContent = () => {

                switch (mapPoint.item?.type?.id || (mapPoint as any).type?.id) {
                    case WorkflowSwitch.__name:
                        return <WorkflowSwitchTile {...mapPoint} />;

                    case WorkflowAction.__name:
                        return <WorkflowActionTile {...mapPoint} />;

                    case WorkflowStatus.__name:
                        return <WorkflowStatusTile {...mapPoint} />;

                    case WorkflowBoundary.__name:
                        return <WorkflowBoundaryTile {...mapPoint} />;

                    case WorkflowPlaceholder.__name:
                        return <WorkflowPlaceholderTile {...mapPoint} />;

                    case WorkflowPseudoElements.WorkflowYes.__name:
                        return <WorkflowYesTile {...mapPoint} />;

                    case WorkflowPseudoElements.WorkflowNo.__name:
                        return <WorkflowNoTile {...mapPoint} />;

                    case WorkflowConnectors.WorkflowUpToRight.__name:
                        return <WorkflowUpToRight />;

                    case WorkflowConnectors.WorkflowUpToLeft.__name:
                        return <WorkflowUpToLeft />;

                    case WorkflowConnectors.WorkflowBottomToLeft.__name:
                        return <WorkflowBottomToLeft />;

                    case WorkflowConnectors.WorkflowVerticalLineUp.__name:
                        return <WorkflowVerticalLineUp />;

                    case WorkflowConnectors.WorkflowVerticalLineDown.__name:
                        return <WorkflowVerticalLineDown />;

                    case WorkflowConnectors.WorkflowHorizontalLineLeft.__name:
                        return <WorkflowHorizontalLineLeft />;

                    case WorkflowConnectors.WorkflowHorizontalLineRight.__name:
                        return <WorkflowHorizontalLineRight />;

                    default:
                        console.error(`Type de mapPoint inconnu, impossible d'effectuer le render.`, { mapPoint, mapPointItemTypeId: mapPoint.item.type.id, WorkflowConnectors, WorkflowPlaceholder,  WorkflowYes: WorkflowPseudoElements.WorkflowYes, WorkflowNo: WorkflowPseudoElements.WorkflowNo, WorkflowBoundary });
                        return null;
                }
            };

            const isIncludedInFolderPath = pathTakenByFolder.map((workflowItem: any) => workflowItem.id).includes(mapPoint.item.id)
            //|| connectorsIncludedInPath.includes( mapPoint.item.id );
            // || pathTakenByFolder.current.includes( (mapPoint.item as any).from )
            // || pathTakenByFolder.current.includes( (mapPoint.item as any).to );
            return <WorkflowTile
                key={`map-point-${mapPoint.item.id}`}
                isIncludedInFolderPath={isIncludedInFolderPath}
                {...mapPoint}
            >
                <WorkflowTileContent />
            </WorkflowTile>;
        });

        setWorkflowConnectedMapPoints(connectedMapPoints);
        setWorkflowMapPoints(mapPoints);
        setWorkflowMap(workflowMap);
    }, []);

    useEffect(() => {

        // console.log('%cuse effect des surbrillances', 'font-size: 20px; color: gold;', {
        //     folder,
        //     pathTakenByFolder,
        // });

        // if( folder === undefined ) {

        workflowMapWrapperRef.current!.querySelectorAll(`[data-included-in-folder-path]`).forEach(element => {

            element.removeAttribute('data-included-in-folder-path');
        });
        // }

        for (const workflowItem of pathTakenByFolder) {

            const workflowItemElement = workflowMapWrapperRef.current!.querySelector(`[data-id="${workflowItem.id}"]`);

            workflowItemElement!.setAttribute('data-included-in-folder-path', '' + true);

            const connectedMapPoint = workflowConnectedMapPoints.find(mapPoint => {

                return mapPoint.item.id === workflowItem.id;
            });

            const connectorsIncludedInPath = [] as any;

            if (connectedMapPoint!.item instanceof WorkflowSwitch) {

                const switchValue = (workflowItem as WorkflowSwitch).getSwitchValue();

                connectorsIncludedInPath.push(...workflowConnectedMapPoints.filter(mapPoint => {

                    return (
                        ((mapPoint.item as any).origin?.id === connectedMapPoint!.item.id
                            && ((mapPoint.item as any).to === 'BOTH' || (mapPoint.item as any).to === (switchValue ? 'YES' : 'NO')))
                    );
                }));
            } else {

                const nextItem = workflowConnectedMapPoints.find(mapPoint => {

                    return mapPoint.item.id === connectedMapPoint!.nextItemId;
                });

                connectorsIncludedInPath.push(...workflowConnectedMapPoints.filter(mapPoint => {

                    return (
                        (mapPoint.item as any).from === connectedMapPoint!.item.id
                        && (mapPoint.item as any).to === nextItem!.item.id
                    );
                }));
            }

            for (const connector of connectorsIncludedInPath) {

                const isActionTile = workflowMapPoints.find(mapPoint => {

                    return mapPoint.x === connector.x
                        && mapPoint.y === connector.y;
                });

                if (isActionTile)
                    continue;

                const connectorElement = workflowMapWrapperRef.current!.querySelector(`[data-id="${connector.item.id}"]`);
                connectorElement!.setAttribute('data-included-in-folder-path', '' + true);

                // On vérifie qu'il n'y a pas un WorkflowYes ou WorkflowNo avec les mêmes coord
                const connectorElementWithSameCoord = workflowMapWrapperRef.current!.querySelector(
                    `[data-type="WorkflowYes"][style="--y: ${connector.y}; --x: ${connector.x};"],`
                    + `[data-type="WorkflowNo"][style="--y: ${connector.y}; --x: ${connector.x};"]`
                );

                if (connectorElementWithSameCoord) {

                    connectorElementWithSameCoord.setAttribute('data-included-in-folder-path', '' + true);
                }
            }
        }

    }, [pathTakenByFolder, workflowConnectedMapPoints, workflowMapPoints,]);

    useEffect(() => {

        const currentItemElementWithinDOM = workflowMapWrapperRef.current!.querySelector(`[data-is-folder-path-current-item]`);

        if (currentItemElementWithinDOM) {

            currentItemElementWithinDOM.removeAttribute('data-is-folder-path-current-item');
        }

        const newItemElementWithinDOM = workflowMapWrapperRef.current!.querySelector(`[data-id="${currentWorkflowItem?.id}"]`);

        if (newItemElementWithinDOM) {

            newItemElementWithinDOM.setAttribute('data-is-folder-path-current-item', '' + true);
        }
    }, [currentWorkflowItem,]);

    useEffect(() => {

        // Si la formbox est verrouillée, ne pas mettre à jour le hoveredMapPoint
        if (isFormBoxLocked) {
            return;
        }

        if (hoveredMapPoint) {

            previousHoveredMapPoint.current = hoveredMapPoint;
        }

        const newHoveredMapPoint = workflowMapPoints.find(mapPoint => {

            return mapPoint.y === hoveredY && mapPoint.x === hoveredX;
        });
        setHoveredTileVisibility(!!newHoveredMapPoint);

        const hoveredMapPointIncludingConnectors = workflowConnectedMapPoints.find(mapPoint => {

            return mapPoint.y === hoveredY && mapPoint.x === hoveredX;
        });

        console.log({
            workflowConnectedMapPoints,
            hoveredMapPointIncludingConnectors,
        });
        // workflowConnectedMapPoints;
        // hoveredMapPointIncludingConnectors;

        setHoveredMapPoint(newHoveredMapPoint);
    }, [hoveredY, hoveredX, isFormBoxLocked]);

    function setHoveredTileVisibility(isVisible: boolean): void {

        workflowHoveredTileRef.current!.classList.toggle(styles.workflowHoveredTileHoveringItem, isVisible);
    }

    useEffect(() => {

        // Si la formbox est verrouillée, cacher le tooltip
        if (isFormBoxLocked) {
            setIsTooltipVisible(false);
            return;
        }

        setIsTooltipVisible(!!hoveredMapPoint);
        setHoveredTileVisibility(!!hoveredMapPoint);

        if (hoveredMapPoint) {

            const tooltipGhostElement: HTMLElement = workflowTooltipRef.current!.querySelector(`.${styles.workflowTooltipGhost}`)!;

            const tooltipGhostTypeElement = tooltipGhostElement.querySelector(`.${styles.workflowTooltipType}`);
            const tooltipGhostTitleElement = tooltipGhostElement.querySelector(`.${styles.workflowTooltipTitle}`);
            const tooltipGhostUsersInChargeElement = tooltipGhostElement.querySelector(`.${styles.workflowTooltipUsersInCharge}`);

            // console.log({ hoveredMapPoint, tooltipGhostElement, tooltipGhostTypeElement, tooltipGhostTitleElement });
            tooltipGhostElement.style.setProperty('transition', 'unset');
            tooltipGhostElement.style.setProperty('width', 'calc( var(--tooltip-max-width) - var(--interspace, var(--spacing-4)) * 2 )');

            const tooltipGhostTypeElementScrollWidth = tooltipGhostTypeElement!.scrollWidth;
            const tooltipGhostTitleScrollWidth = tooltipGhostTitleElement!.scrollWidth;
            const tooltipGhostUsersInChargeScrollWidth = tooltipGhostUsersInChargeElement?.scrollWidth ?? 0;
            const tooltipGhostElementScrollHeight = tooltipGhostElement.scrollHeight;

            tooltipGhostElement.style.removeProperty('transition');
            tooltipGhostElement.style.removeProperty('width');

            setTooltipHeightBasedOnGhost(tooltipGhostElementScrollHeight);
            setTooltipWidthBasedOnGhost(1 + Math.max(tooltipGhostTypeElementScrollWidth, tooltipGhostTitleScrollWidth, tooltipGhostUsersInChargeScrollWidth));
        }
    }, [hoveredMapPoint, isFormBoxLocked]);

    useEffect(() => {

        setIsFormBoxVisible(!!selectedElement);
        setIsFormBoxLocked(!!selectedElement);

        if (selectedElement && workflowFormBoxRef.current) {

            // Trouver les coordonnées de l'élément sélectionné dans le workflow
            const selectedMapPoint = workflowMapPoints.find(mapPoint => mapPoint.item.id === selectedElement.id);
            if (selectedMapPoint) {
                setHoveredX(selectedMapPoint.x);
                setHoveredY(selectedMapPoint.y);
            }

            const formBoxGhostElement: HTMLElement | null = workflowFormBoxRef.current.querySelector(`.${styles.workflowFormBoxGhost}`);

            if (formBoxGhostElement) {
                formBoxGhostElement.style.setProperty('transition', 'unset');
                formBoxGhostElement.style.setProperty('width', 'calc( var(--tooltip-max-width) - var(--interspace, var(--spacing-4)) * 2 )');

                const formBoxGhostElementScrollHeight = formBoxGhostElement.scrollHeight;
                const formBoxGhostElementScrollWidth = formBoxGhostElement.scrollWidth;

                formBoxGhostElement.style.removeProperty('transition');
                formBoxGhostElement.style.removeProperty('width');

                setFormBoxHeightBasedOnGhost(formBoxGhostElementScrollHeight);
                setFormBoxWidthBasedOnGhost(formBoxGhostElementScrollWidth);
            }
        }
    }, [selectedElement, workflowMapPoints]);

    // Focus et sélectionne le texte de l'input quand un élément est sélectionné
    useEffect(() => {
        if (selectedElement && formBoxTitleInputRef.current) {
            // Petit délai pour laisser le temps au composant de s'afficher
            setTimeout(() => {
                if(! formBoxTitleInputRef.current) return;
                formBoxTitleInputRef.current.focus();
                formBoxTitleInputRef.current.value = selectedElement.title;
                // formBoxTitleInputRef.current?.select();
            }, 50);
        }
    }, [selectedElement]);

    // Gérer le click outside pour fermer la formbox
    useEffect(() => {
        if (!selectedElement || !workflowFormBoxRef.current) {
            return;
        }

        const handleClickOutside = (event: MouseEvent) => {
            // Vérifier si le click est en dehors de la formbox
            if (workflowFormBoxRef.current && !workflowFormBoxRef.current.contains(event.target as Node)) {
                // Déselectionner l'élément
                setSelectedElement(null);
                setIsFormBoxLocked(false);
            }
        };

        // Ajouter le listener avec un délai pour éviter que le click de sélection ne ferme immédiatement
        const timeoutId = setTimeout(() => {
            document.addEventListener('mousedown', handleClickOutside);
        }, 100);

        return () => {
            clearTimeout(timeoutId);
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [selectedElement]);

    useEffect(() => {

        let highestX = Math.max(...workflowMapPoints.map(({ x }) => x));
        let highestY = Math.max(...workflowMapPoints.map(({ y }) => y));

        if (!isFinite(highestX))
            highestX = 0;

        if (!isFinite(highestY))
            highestY = 0;

        const computerScienceStartsCountingAt0Offset = 1;
        const yesNoCol = 1;
        const arrowOfSwitchesReachingAnyPreviousMapPoint = 1;

        const workflowXLength = highestX + computerScienceStartsCountingAt0Offset
            + yesNoCol + arrowOfSwitchesReachingAnyPreviousMapPoint;
        setWorkflowXLength(workflowXLength);

        const workflowYLength = highestY + computerScienceStartsCountingAt0Offset;
        setWorkflowYLength(workflowYLength);
    }, [workflowMapPoints,]);

    useEffect(() => {

        const media = window.matchMedia(`(resolution: ${window.devicePixelRatio}dppx)`);
        const abortController = new AbortController();

        media.addEventListener('change', () => {

            setDevicePixelRatio(window.devicePixelRatio);
        }, {
            signal: abortController.signal,
        });

        return () => {

            abortController.abort();
        };
    }, []);

    console.log('%c DESACTIVATION DU THROTTLE', 'font-size: 40px; color: gold;');
    // const handleMapMouseMoveThrottle = handleMapMouseMove; // throttle( handleMapMouseMove, 50, true, true );
    const handleMapMouseMoveThrottle = throttle( handleMapMouseMove, 50, { leading: true, trailing: true } );

    function handleMapMouseMove(e: React.MouseEvent): void {

        // Si la formbox est verrouillée, ne pas mettre à jour les coordonnées
        if (isFormBoxLocked) {
            return;
        }

        const clientRectangle = workflowMapWrapperRef.current!.getBoundingClientRect();

        const xAsPixels = (e.pageX + workflowMapWrapperRef.current!.scrollLeft) - clientRectangle.left;
        const yAsPixels = (e.pageY + workflowMapWrapperRef.current!.scrollTop) - clientRectangle.top;

        // const axisOffset = showIndexes ? 1 : 0;

        const xAsMapPoint = Math.floor(xAsPixels / (xCoefficient + yAxisThickness)) - axisOffset;
        const yAsMapPoint = Math.floor(yAsPixels / (yCoefficient + xAxisThickness) - axisOffset);

        if (xAsMapPoint !== hoveredX)
            previousHoveredX.current = hoveredX;

        if (yAsMapPoint !== hoveredY)
            previousHoveredY.current = hoveredY;

        setHoveredX(xAsMapPoint);
        setHoveredY(yAsMapPoint);
    }

    // Calculer l'icône et la couleur de l'élément sélectionné
    const selectedElementOption = selectedElement ? placeholderOptions.find(opt => opt.id === (selectedElement as any).optionId) : null;
    const SelectedIcon = selectedElementOption?.Icon;
    const selectedCategoryColor = selectedElementOption?.category ? getCategoryColor(selectedElementOption.category) : 'var(--primary-color-500)';

    console.log({ workflowXLength });
    // console.log( hoveredMapPoint?.item );
    return <WorkflowSelectionContext.Provider value={{ selectedElement, setSelectedElement }}>
        <div
        className={styles.workflowRoot}
        data-show-indexes={showIndexes}
        style={{
            '--device-pixel-ratio': devicePixelRatio,
            '--workflow-y-length': workflowYLength,
            '--workflow-x-length': workflowXLength,
            '--y-coefficient': yCoefficient,
            '--x-coefficient': xCoefficient,
            '--y-axis-thickness': yAxisThickness,
            '--x-axis-thickness': xAxisThickness,
            '--item-height': elementHeight * yCoefficient / 100,
            '--item-width': elementWidth * xCoefficient / 100,
            '--connector-thickness': connectorThickness,
            '--connector-radius': connectorRadius,
            '--arrow-pointer-thickness': arrowPointerThickness,
            '--arrow-pointer-offset': Math.sqrt(Math.pow(arrowPointerThickness / 2, 2) * 2) - arrowPointerThickness / 2,
            '--hovered-x': hoveredX,
            '--hovered-y': hoveredY,
            '--hovered-map-point-x': hoveredMapPoint?.x ?? previousHoveredMapPoint.current?.x ?? 0,
            '--tooltip-height-based-on-ghost': tooltipHeightBasedOnGhost,
            '--tooltip-width-based-on-ghost': tooltipWidthBasedOnGhost,
            '--distance-between-item-and-tooltip': distanceBetweenElementAndTooltip,
            '--form-box-height-based-on-ghost': formBoxHeightBasedOnGhost,
            '--form-box-width-based-on-ghost': formBoxWidthBasedOnGhost,
            '--distance-between-item-and-form-box': distanceBetweenElementAndFormBox,
            '--distance-between-item-and-indicator': distanceBetweenElementAndIndicator,
            '--current-item-x': currentItemX,
            '--current-item-y': currentItemY,
            '--axis-offset': axisOffset,
            '--show-indexes': showIndexes ? 1 : 0,
        } as React.CSSProperties}
        onPointerEnter={() => {

            setHoveredTileVisibility(!!hoveredMapPoint);
        }}
        onPointerLeave={() => {

            setHoveredTileVisibility(false);
            setTimeout(() => setHoveredTileVisibility(false), 100); // Par sécurité
            setIsTooltipVisible(false);
            setTimeout(() => setIsTooltipVisible(false), 100); // Par sécurité
        }}
    >
        <div
            className={styles.workflowWrapper}
            ref={workflowMapWrapperRef}
            onMouseMove={handleMapMouseMoveThrottle}
        >
            <div className={styles.workflowYAxis}>
                {
                    Array(workflowYLength)
                        .fill(undefined)
                        .map((_unused: number, index: number) => {

                            return <div key={`y-axis-${index}`}>{index}</div>;
                        })
                }
            </div>
            <div className={styles.workflowXAxis}>
                {
                    Array(workflowXLength)
                        .fill(undefined)
                        .map((_unused: number, index: number) => {

                            return <div key={`x-axis-${index}`}>{index}</div>;
                        })
                }
            </div>
            <div className={styles.workflow}>
                {workflowMap}
                <div className={styles.workflowMapBgDot} style={{
                    '--max-x-value': workflowXLength + 1,
                    '--max-y-value': workflowYLength + 1,
                } as React.CSSProperties
                } />
            </div>
            <div
                className={styles.workflowTooltip}
                ref={workflowTooltipRef}
                data-type={hoveredMapPoint?.item?.type?.id ?? previousHoveredMapPoint.current?.item.type?.id}
                data-is-visible={isTooltipVisible}
                data-position={tooltipPosition}
            >
                <div className={styles.workflowTooltipReal}>
                    <div className={styles.workflowTooltipType}>
                        {hoveredMapPoint?.item.type?.title ?? previousHoveredMapPoint.current?.item?.type?.title}
                    </div>
                    <div className={styles.workflowTooltipTitle}>
                        {hoveredMapPoint?.item.title ?? previousHoveredMapPoint.current?.item?.title}
                    </div>
                </div>
                <div className={styles.workflowTooltipGhost}>
                    <div className={styles.workflowTooltipType}>
                        {hoveredMapPoint?.item?.type?.title}
                    </div>
                    <div className={styles.workflowTooltipTitle}>
                        {hoveredMapPoint?.item.title ?? previousHoveredMapPoint.current?.item?.title}
                    </div>
                </div>
            </div>
            <div
                className={styles.workflowFormBox}
                ref={workflowFormBoxRef}
                data-type={selectedElement?.type?.id}
                data-is-visible={isFormBoxVisible}
                data-position={formBoxPosition}
                style={{
                    '--tooltip-height-based-on-ghost': formBoxHeightBasedOnGhost,
                    '--tooltip-width-based-on-ghost': formBoxWidthBasedOnGhost,
                    '--distance-between-item-and-tooltip': distanceBetweenElementAndFormBox,
                } as React.CSSProperties}
            >
                <div className={styles.workflowFormBoxReal}>
                    {selectedElement && (
                        <>
                            <div className={styles.workflowFormBoxInputContainer}>
                                {SelectedIcon && (
                                    <SelectedIcon
                                        size={20}
                                        className={styles.workflowFormBoxInputIcon}
                                        style={{ stroke: selectedCategoryColor }}
                                    />
                                )}
                                <Input
                                    ref={formBoxTitleInputRef}
                                    defaultValue={selectedElement.title}
                                    className={styles.workflowFormBoxInput}
                                />
                            </div>
                            <FancyTabs
                                defaultValue="options"
                                values={[
                                    { value: 'options', label: 'Options' },
                                    { value: 'inputs', label: 'Inputs' },
                                    { value: 'outputs', label: 'Outputs' },
                                ]}
                            >
                                <FancyTabsContent value="options">
                                    <WorkflowOptionsRenderer element={selectedElement} />
                                </FancyTabsContent>
                                <FancyTabsContent value="inputs">
                                    Hello World - Inputs
                                </FancyTabsContent>
                                <FancyTabsContent value="outputs">
                                    Hello World - Outputs
                                </FancyTabsContent>
                            </FancyTabs>
                        </>
                    )}
                </div>
                <div className={styles.workflowFormBoxGhost}>
                    {selectedElement && (
                        <>
                            <div className={styles.workflowFormBoxInputContainer}>
                                {SelectedIcon && (
                                    <SelectedIcon
                                        size={20}
                                        className={styles.workflowFormBoxInputIcon}
                                        style={{ stroke: selectedCategoryColor }}
                                    />
                                )}
                                <Input
                                    defaultValue={selectedElement.title}
                                    className={styles.workflowFormBoxInput}
                                />
                            </div>
                            <FancyTabs
                                defaultValue="options"
                                values={[
                                    { value: 'options', label: 'Options' },
                                    { value: 'inputs', label: 'Inputs' },
                                    { value: 'outputs', label: 'Outputs' },
                                ]}
                            >
                                <FancyTabsContent value="options">
                                    <WorkflowOptionsRenderer element={selectedElement} />
                                </FancyTabsContent>
                                <FancyTabsContent value="inputs">
                                    Hello World - Inputs
                                </FancyTabsContent>
                                <FancyTabsContent value="outputs">
                                    Hello World - Outputs
                                </FancyTabsContent>
                            </FancyTabs>
                        </>
                    )}
                </div>
            </div>
            <div
                className={styles.workflowCurrentItemIndicator}
                data-is-visible={isIndicatorVisible}
                data-is-using-message={isIndicatorUsingMessage}
            >
                <span>Vous êtes ici</span>
            </div>
            <div
                className={styles.workflowHoveredTile}
                ref={workflowHoveredTileRef}
            />
        </div>

    </div>
    </WorkflowSelectionContext.Provider>;
}

export default WorkflowRoot;
export { WorkflowRoot, WorkflowSelectionContext };
