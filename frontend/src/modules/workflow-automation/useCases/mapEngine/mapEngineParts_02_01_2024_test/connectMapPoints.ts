// @@ map engine parts
import { EWorkflowSwitchTypeIds, type TMapPoint } from './calcMapPoints';

// @@ models
import WorkflowItem from '../../../models/workflow/WorkflowItem.model';
import WorkflowAction from '../../../models/workflow/elements/WorkflowAction.model';
import WorkflowStatus from '../../../models/workflow/elements/WorkflowStatus.model';
import WorkflowSwitch from '../../../models/workflow/elements/WorkflowSwitch.model';
import WorkflowBoundary from '../../../models/workflow/elements/WorkflowBoundary.model';
import WorkflowPlaceholder from '../../../models/workflow/elements/WorkflowPlaceholder.model';
import WorkflowConnectors,  { type TWorkflowConnectorData } from '../../../models/workflow/connectors';
import WorkflowPseudoElements from '../../../models/workflow/pseudoElements';

// @@ utils
import { appUniqueId as id } from '../../../../../utils/number.utils';


export default function connectMapPoints( mapPoints: TMapPoint[] ) {

    const connectedMapPoints = [ ...mapPoints, ];

    const connectors: any[] = [];

    function connectTileToNextTile( mapPoint: TMapPoint ) {

        const { nextItemId } = mapPoint;

        const nextMapPoint = mapPoints.find( ({ item: { id } }) => id === nextItemId );
        const from = mapPoint.item.id;
        const to = nextMapPoint?.item?.id ?? null;

        if( nextMapPoint ) {

            if( nextMapPoint.item.id === "AWAITING_CONCERTED_OPINION_OF_GI_AND_RRH_STATUS") {
                console.log('%ccidessous', 'color: red; font-size: 20px;', { from, to, nextMapPoint, mapPoint });
            }
            nextMapPoint.isPointedAtTop ||= nextMapPoint.x === mapPoint.x;
            console.log({ from,to},nextMapPoint.isPointedAtTop, nextMapPoint.x === mapPoint.x, nextMapPoint, mapPoint );
            nextMapPoint.isPointedAtRight ||= nextMapPoint.x < mapPoint.x || ( nextMapPoint.x === mapPoint.x && nextMapPoint.y < mapPoint.y );

            // On peut aller à droite potentiellement
            let xReference = mapPoint.x;
            if( mapPoint.x > nextMapPoint.x && nextMapPoint.y - mapPoint.y > 1 ) {

                const currentX = mapPoint.x;
                const mostRightShiftedMapPointX = Math.max(
                    ...mapPoints.filter( ({ y }) => {
                        return y > mapPoint.y && y < nextMapPoint!.y;
                    })
                    .map( ({ x }) => x )
                );

                // Si effectivement, il y a nécessité de contourner
                if( mostRightShiftedMapPointX >= mapPoint.x ) {

                    xReference = mostRightShiftedMapPointX + 2;

                    // On ne peut pas aller directement en bas, il faut contourner d'autant
                    // que le point ayant le plus grand X entre le current point et le point d'arrivée
                    for( let x = currentX; x<xReference; x++) {

                        connectors.push( createConnectorMapPoint({
                            x,//: mapPoint.x,
                            y: mapPoint.y,
                            from,
                            to: to!,
                            ConnectorModel: WorkflowConnectors.WorkflowHorizontalLineRight,
                        }) );

                        if( x + 1 === xReference ) {

                            // On est au point de virage
                        connectors.push( createConnectorMapPoint({
                            x: x + 1,
                            y: mapPoint.y,
                            from,
                            to: to!,
                            ConnectorModel: WorkflowConnectors.WorkflowBottomToLeft,
                        }) );
                        } else {

                            // On poursuit à droite
                            connectors.push( createConnectorMapPoint({
                                x: x + 1,
                                y: mapPoint.y,
                                from,
                                to: to!,
                                ConnectorModel: WorkflowConnectors.WorkflowHorizontalLineLeft,
                            }) );
                        }
                    }
                }
            }

            // On descend
            for( let y = mapPoint.y; y<nextMapPoint!.y; y++) {

                // Il n'y a pas eu de contournement, ou alors il y en a eu un mais on est dans la descente: on descend droit
                if( y > mapPoint.y || ( y === mapPoint.y && xReference === mapPoint.x ) ) {

                    connectors.push( createConnectorMapPoint({
                        x: xReference,
                        y,
                        from,
                        to: to!,
                        ConnectorModel: WorkflowConnectors.WorkflowVerticalLineDown,
                    }) );
                }

                connectors.push( createConnectorMapPoint({
                    x: xReference,
                    y: y + 1,
                    from,
                    to: to!,
                    ConnectorModel: y + 1 === nextMapPoint!.y && mapPoint.x !== nextMapPoint!.x ? WorkflowConnectors.WorkflowUpToLeft : WorkflowConnectors.WorkflowVerticalLineUp,
                }) );
            }

            // Puis on retourne à gauche
            for( let x = xReference; x>nextMapPoint!.x; x--) {

                if( x !== xReference )
                    connectors.push( createConnectorMapPoint({
                        x,
                        y: nextMapPoint!.y,
                        from,
                        to: to!,
                        ConnectorModel: WorkflowConnectors.WorkflowHorizontalLineLeft,
                    }) );

                connectors.push( createConnectorMapPoint({
                    x: x - 1,
                    y: nextMapPoint!.y,
                    from,
                    to: to!,
                    ConnectorModel: WorkflowConnectors.WorkflowHorizontalLineRight,
                }) );
            }
        }
    }

    function connectTileToNextTiles( mapPoint: TMapPoint ) {

        const { nextYesItemId, nextNoItemId, workflowSwitchTypeId, } = mapPoint;

        const nextYesMapPoint = mapPoints.find( ({ item: { id } }) => id === nextYesItemId );
        const nextNoMapPoint = mapPoints.find( ({ item: { id } }) => id === nextNoItemId );
        console.log( mapPoint.item.id, workflowSwitchTypeId, { nextYesItemId, nextNoItemId, nextNoMapPoint, nextYesMapPoint });

        switch( workflowSwitchTypeId ) {

            case EWorkflowSwitchTypeIds.ONE_OUTPUT_TARGETS_SAME_COL_AND_ONE_OUTPUT_TARGETS_NEXT_DIRECT_COL: {

                // tracer vers le bas jusqu'à la prochaine case de la même colonne
                const tileBelow = [ nextYesMapPoint!, nextNoMapPoint! ].find( (mapPoint, _index, self) => {

                    return mapPoint!.y === Math.max( ...self.map( ({ y }) => y ) );
                })!;

                for( let y = mapPoint.y, i = 0; y<tileBelow.y; y++, i++) {

                    connectors.push( createConnectorMapPoint({
                        x: mapPoint.x,
                        y,
                        origin: mapPoint.item,
                        from: mapPoint.item.id,
                        to: i === 0 ? 'BOTH' : tileBelow === nextNoMapPoint ? 'NO' : 'YES',
                        ConnectorModel: WorkflowConnectors.WorkflowVerticalLineDown,
                    }) );

                    connectors.push( createConnectorMapPoint({
                        x: mapPoint.x,
                        y: y + 1,
                        origin: mapPoint.item,
                        from: mapPoint.item.id,
                        to: i === 0 ? 'BOTH' : tileBelow === nextNoMapPoint ? 'NO' : 'YES',
                        ConnectorModel: WorkflowConnectors.WorkflowVerticalLineUp,
                    }) );
                }

                connectors.push( createConnectorMapPoint({
                    x: mapPoint.x,
                    y: mapPoint.y + 2,
                    origin: mapPoint.item,
                    from: mapPoint.item.id,
                    to: 'NO',
                    ConnectorModel: WorkflowPseudoElements[
                        tileBelow === nextNoMapPoint ? 'WorkflowNo' : 'WorkflowYes'
                    ],
                }) );

                // tracer d'un cran à droite
                connectors.push( createConnectorMapPoint({
                    x: mapPoint.x,
                    y: mapPoint.y + 1,
                    origin: mapPoint.item,
                    from: mapPoint.item.id,
                    to: tileBelow === nextNoMapPoint ? 'YES' : 'NO',
                    ConnectorModel: WorkflowConnectors.WorkflowUpToRight,
                }) );

                connectors.push( createConnectorMapPoint({
                    x: mapPoint.x + 1,
                    y: mapPoint.y + 1,
                    origin: mapPoint.item,
                    from: mapPoint.item.id,
                    to: tileBelow === nextNoMapPoint ? 'YES' : 'NO',
                    ConnectorModel: WorkflowConnectors.WorkflowHorizontalLineLeft,
                }) );

                connectors.push( createConnectorMapPoint({
                    x: mapPoint.x + 1,
                    y: mapPoint.y + 1,
                    origin: mapPoint.item,
                    from: mapPoint.item.id,
                    to: tileBelow === nextNoMapPoint ? 'YES' : 'NO',
                    ConnectorModel: WorkflowPseudoElements[
                        tileBelow === nextNoMapPoint ? 'WorkflowYes' : 'WorkflowNo'
                    ],
                }) );

                connectors.push( createConnectorMapPoint({
                    x: mapPoint.x + 1,
                    y: mapPoint.y + 1,
                    origin: mapPoint.item,
                    from: mapPoint.item.id,
                    to: tileBelow === nextNoMapPoint ? 'YES' : 'NO',
                    ConnectorModel: WorkflowConnectors.WorkflowHorizontalLineRight,
                }) );

                connectors.push( createConnectorMapPoint({
                    x: mapPoint.x + 2,
                    y: mapPoint.y + 1,
                    origin: mapPoint.item,
                    from: mapPoint.item.id,
                    to: tileBelow === nextNoMapPoint ? 'YES' : 'NO',
                    ConnectorModel: WorkflowConnectors.WorkflowHorizontalLineLeft,
                }) );

                break;
            }

            case EWorkflowSwitchTypeIds.BOTH_OUTPUTS_TARGETS_NEXT_DIRECT_COL: {

                // tracer une ligne en bas jusqu'à la prochaine mapPoint la + basse
                const tileBelow = [ nextYesMapPoint!, nextNoMapPoint! ].find( (mapPoint, _index, self) => {

                    return mapPoint!.y === Math.max( ...self.map( ({ y }) => y ) );
                })!;

                for( let y = mapPoint.y, i = 0; y < tileBelow.y; y++, i++) {

                    connectors.push( createConnectorMapPoint({
                        x: mapPoint.x,
                        y,
                        origin: mapPoint.item,
                        from: mapPoint.item.id,
                        to: i === 0 ? 'BOTH' : tileBelow === nextNoMapPoint ? 'NO' : 'YES',
                        ConnectorModel: WorkflowConnectors.WorkflowVerticalLineDown,
                    }) );

                    if( y + 1 < tileBelow.y)
                        connectors.push( createConnectorMapPoint({
                            x: mapPoint.x,
                            y: y + 1,
                            origin: mapPoint.item,
                            from: mapPoint.item.id,
                            to: i === 0 ? 'BOTH' : tileBelow === nextNoMapPoint ? 'NO' : 'YES',
                            ConnectorModel: WorkflowConnectors.WorkflowVerticalLineUp,
                        }) );
                }

                // tracer d'un cran à droite pour le premier pointage
                connectors.push( createConnectorMapPoint({
                    x: mapPoint.x,
                    y: mapPoint.y + 1,
                    origin: mapPoint.item,
                    from: mapPoint.item.id,
                    to: tileBelow === nextNoMapPoint ? 'YES' : 'NO',
                    ConnectorModel: WorkflowConnectors.WorkflowUpToRight,
                }) );

                connectors.push( createConnectorMapPoint({
                    x: mapPoint.x + 1,
                    y: mapPoint.y + 1,
                    origin: mapPoint.item,
                    from: mapPoint.item.id,
                    to: tileBelow === nextNoMapPoint ? 'YES' : 'NO',
                    ConnectorModel: WorkflowConnectors.WorkflowHorizontalLineLeft,
                }) );

                connectors.push( createConnectorMapPoint({
                    x: mapPoint.x + 1,
                    y: mapPoint.y + 1,
                    origin: mapPoint.item,
                    from: mapPoint.item.id,
                    to: tileBelow === nextNoMapPoint ? 'YES' : 'NO',
                    ConnectorModel: WorkflowPseudoElements[
                        tileBelow === nextNoMapPoint ? 'WorkflowYes' : 'WorkflowNo'
                    ],
                }) );

                connectors.push( createConnectorMapPoint({
                    x: mapPoint.x + 1,
                    y: mapPoint.y + 1,
                    origin: mapPoint.item,
                    from: mapPoint.item.id,
                    to: tileBelow === nextNoMapPoint ? 'YES' : 'NO',
                    ConnectorModel: WorkflowConnectors.WorkflowHorizontalLineRight,
                }) );

                connectors.push( createConnectorMapPoint({
                    x: mapPoint.x + 2,
                    y: mapPoint.y + 1,
                    origin: mapPoint.item,
                    from: mapPoint.item.id,
                    to: tileBelow === nextNoMapPoint ? 'YES' : 'NO',
                    ConnectorModel: WorkflowConnectors.WorkflowHorizontalLineLeft,
                }) );

                // tracer d'un cran à droite pour le second pointage
                connectors.push( createConnectorMapPoint({
                    x: mapPoint.x,
                    y: tileBelow.y,
                    origin: mapPoint.item,
                    from: mapPoint.item.id,
                    to: tileBelow === nextNoMapPoint ? 'NO' : 'YES',
                    ConnectorModel: WorkflowConnectors.WorkflowUpToRight,
                }) );

                connectors.push( createConnectorMapPoint({
                    x: mapPoint.x + 1,
                    y: tileBelow.y,
                    origin: mapPoint.item,
                    from: mapPoint.item.id,
                    to: tileBelow === nextNoMapPoint ? 'NO' : 'YES',
                    ConnectorModel: WorkflowConnectors.WorkflowHorizontalLineLeft,
                }) );

                connectors.push( createConnectorMapPoint({
                    x: mapPoint.x + 1,
                    y: tileBelow.y,
                    origin: mapPoint.item,
                    from: mapPoint.item.id,
                    to: tileBelow === nextNoMapPoint ? 'NO' : 'YES',
                    ConnectorModel: WorkflowPseudoElements[
                        tileBelow === nextNoMapPoint ? 'WorkflowNo' : 'WorkflowYes'
                    ],
                }) );

                connectors.push( createConnectorMapPoint({
                    x: mapPoint.x + 1,
                    y: tileBelow.y,
                    origin: mapPoint.item,
                    from: mapPoint.item.id,
                    to: tileBelow === nextNoMapPoint ? 'NO' : 'YES',
                    ConnectorModel: WorkflowConnectors.WorkflowHorizontalLineRight,
                }) );

                connectors.push( createConnectorMapPoint({
                    x: mapPoint.x + 2,
                    y: tileBelow.y,
                    origin: mapPoint.item,
                    from: mapPoint.item.id,
                    to: tileBelow === nextNoMapPoint ? 'NO' : 'YES',
                    ConnectorModel: WorkflowConnectors.WorkflowHorizontalLineLeft,
                }) );

                break;
            }

            case EWorkflowSwitchTypeIds.ONE_OUTPUT_TARGETS_SAME_COL_BELOW_AND_ONE_OUTPUT_TARGETS_SAME_COL_ABOVE: {

                // tracer une ligne en bas jusqu'à la prochaine mapPoint la + basse
                const tileBelow = [ nextYesMapPoint!, nextNoMapPoint! ].find( (mapPoint, _index, self) => {

                    return mapPoint!.y === Math.max( ...self.map( ({ y }) => y ) );
                })!;

                for( let y = mapPoint.y, i = 0; y<tileBelow.y; y++, i++) {

                    connectors.push( createConnectorMapPoint({
                        x: mapPoint.x,
                        y,
                        origin: mapPoint.item,
                        from: mapPoint.item.id,
                        to: i === 0 ? 'BOTH' : tileBelow === nextNoMapPoint ? 'NO' : 'YES',
                        ConnectorModel: WorkflowConnectors.WorkflowVerticalLineDown,
                    }) );

                    connectors.push( createConnectorMapPoint({
                        x: mapPoint.x,
                        y: y + 1,
                        origin: mapPoint.item,
                        from: mapPoint.item.id,
                        to: i === 0 ? 'BOTH' : tileBelow === nextNoMapPoint ? 'NO' : 'YES',
                        ConnectorModel: WorkflowConnectors.WorkflowVerticalLineUp,
                    }) );
                }

                connectors.push( createConnectorMapPoint({
                    x: mapPoint.x,
                    y: tileBelow.y - 1,
                    origin: mapPoint.item,
                    from: mapPoint.item.id,
                    to: tileBelow === nextNoMapPoint ? 'NO' : 'YES',
                    ConnectorModel: WorkflowPseudoElements[
                        tileBelow === nextNoMapPoint ? 'WorkflowNo' : 'WorkflowYes'
                    ],
                }) );

                // tracer une ligne d'un cran vers la droite, puis qui retourne jusqu'à la mapPoint plus haute, puis d'un cran jusqu'à la gauche
                const tileAbove = [ nextYesMapPoint!, nextNoMapPoint! ].find( (mapPoint, _index, self) => {

                    return mapPoint!.y === Math.min( ...self.map( ({ y }) => y ) );
                })!;

                connectors.push( createConnectorMapPoint({
                    x: mapPoint.x,
                    y: mapPoint.y + 1,
                    origin: mapPoint.item,
                    from: mapPoint.item.id,
                    to: tileAbove === nextNoMapPoint ? 'NO' : 'YES',
                    ConnectorModel: WorkflowConnectors.WorkflowUpToRight,
                }) );

                connectors.push( createConnectorMapPoint({
                    x: mapPoint.x + 1,
                    y: mapPoint.y + 1,
                    origin: mapPoint.item,
                    from: mapPoint.item.id,
                    to: tileAbove === nextNoMapPoint ? 'NO' : 'YES',
                    ConnectorModel: WorkflowConnectors.WorkflowHorizontalLineLeft,
                }) );

                connectors.push( createConnectorMapPoint({
                    x: mapPoint.x + 1,
                    y: mapPoint.y + 1,
                    origin: mapPoint.item,
                    from: mapPoint.item.id,
                    to: tileAbove === nextNoMapPoint ? 'NO' : 'YES',
                    ConnectorModel: WorkflowPseudoElements[
                        tileBelow === nextNoMapPoint ? 'WorkflowYes' : 'WorkflowNo'
                    ],
                }) );

                connectors.push( createConnectorMapPoint({
                    x: mapPoint.x + 1,
                    y: mapPoint.y + 1,
                    origin: mapPoint.item,
                    from: mapPoint.item.id,
                    to: tileAbove === nextNoMapPoint ? 'NO' : 'YES',
                    ConnectorModel: WorkflowConnectors.WorkflowHorizontalLineRight,
                }) );

                connectors.push( createConnectorMapPoint({
                    x: mapPoint.x + 2,
                    y: mapPoint.y + 1,
                    origin: mapPoint.item,
                    from: mapPoint.item.id,
                    to: tileAbove === nextNoMapPoint ? 'NO' : 'YES',
                    ConnectorModel: WorkflowConnectors.WorkflowUpToLeft,
                }) );

                for( let y = mapPoint.y; y>=tileAbove.y; y--) {

                    if( y - 1 >= tileAbove.y )
                        connectors.push( createConnectorMapPoint({
                            x: mapPoint.x + 2,
                            y,
                            origin: mapPoint.item,
                            from: mapPoint.item.id,
                            to: tileAbove === nextNoMapPoint ? 'NO' : 'YES',
                            ConnectorModel: WorkflowConnectors.WorkflowVerticalLineDown,
                        }) );

                    if( y !== mapPoint.y )
                        connectors.push( createConnectorMapPoint({
                            x: mapPoint.x + 2,
                            y: y + 1,
                            origin: mapPoint.item,
                            from: mapPoint.item.id,
                            to: tileAbove === nextNoMapPoint ? 'NO' : 'YES',
                            ConnectorModel: WorkflowConnectors.WorkflowVerticalLineUp,
                        }) );
                }

                connectors.push( createConnectorMapPoint({
                    x: mapPoint.x + 2,
                    y: tileAbove.y,
                    origin: mapPoint.item,
                    from: mapPoint.item.id,
                    to: tileAbove === nextNoMapPoint ? 'NO' : 'YES',
                    ConnectorModel: WorkflowConnectors.WorkflowBottomToLeft,
                }) );

                connectors.push( createConnectorMapPoint({
                    x: mapPoint.x + 1,
                    y: tileAbove.y,
                    origin: mapPoint.item,
                    from: mapPoint.item.id,
                    to: tileAbove === nextNoMapPoint ? 'NO' : 'YES',
                    ConnectorModel: WorkflowConnectors.WorkflowHorizontalLineRight,
                }) );

                connectors.push( createConnectorMapPoint({
                    x: mapPoint.x + 1,
                    y: tileAbove.y,
                    origin: mapPoint.item,
                    from: mapPoint.item.id,
                    to: tileAbove === nextNoMapPoint ? 'NO' : 'YES',
                    ConnectorModel: WorkflowConnectors.WorkflowHorizontalLineLeft,
                }) );

                connectors.push( createConnectorMapPoint({
                    x: mapPoint.x,
                    y: tileAbove.y,
                    origin: mapPoint.item,
                    from: mapPoint.item.id,
                    to: tileAbove === nextNoMapPoint ? 'NO' : 'YES',
                    ConnectorModel: WorkflowConnectors.WorkflowHorizontalLineRight,
                }) );

                break;
            }

            case EWorkflowSwitchTypeIds.ONE_OUTPUT_TARGETS_NEXT_DIRECT_COL_AND_ONE_OUTPUT_TARGETS_ANY_PREVIOUS_COL: {

                const tileWithHighestFrequency = [ nextYesMapPoint!, nextNoMapPoint! ].find( (mapPoint, _index, self) => {

                    return mapPoint!.x === Math.min( ...self.map( ({ x }) => x ) );
                })!;

                const farthestTile =  [ nextYesMapPoint!, nextNoMapPoint! ].find( (mapPoint, _index, self) => {

                    return mapPoint!.y === Math.max( ...self.map( ({ y }) => y ) );
                })!;

                const tilesInBetween = mapPoints.filter( (coord: any) => {

                    return coord.y <= farthestTile.y && coord.y >= mapPoint.y;
                });

                const tileWithLowestFrequency = tilesInBetween.find( (coord: any, _index: number, self: any) => {

                    return coord.x === Math.max( ...self.map( ({ x }: any) => x ) );
                })!;

                // tracer une ligne d'un cran en bas
                connectors.push( createConnectorMapPoint({
                    x: mapPoint.x,
                    y: mapPoint.y,
                    origin: mapPoint.item,
                    from: mapPoint.item.id,
                    to: 'BOTH',
                    ConnectorModel: WorkflowConnectors.WorkflowVerticalLineDown,
                }) );

                connectors.push( createConnectorMapPoint({
                    x: mapPoint.x,
                    y: mapPoint.y + 1,
                    origin: mapPoint.item,
                    from: mapPoint.item.id,
                    to: 'BOTH',
                    ConnectorModel: WorkflowConnectors.WorkflowVerticalLineUp,
                }) );

                // tracer d'un cran vers la droite
                console.log({ farthestTile, nextNoMapPoint, tileWithLowestFrequency, }, farthestTile === nextNoMapPoint );
                connectors.push( createConnectorMapPoint({
                    x: mapPoint.x,
                    y: mapPoint.y + 1,
                    origin: mapPoint.item,
                    from: mapPoint.item.id,
                    to: farthestTile === nextNoMapPoint  ? 'NO' : 'YES',
                    ConnectorModel: WorkflowConnectors.WorkflowUpToRight,
                }) );

                connectors.push( createConnectorMapPoint({
                    x: mapPoint.x + 1,
                    y: mapPoint.y + 1,
                    origin: mapPoint.item,
                    from: mapPoint.item.id,
                    to: farthestTile === nextNoMapPoint  ? 'NO' : 'YES',
                    ConnectorModel: WorkflowConnectors.WorkflowHorizontalLineLeft,
                }) );

                // ECRIT PLUS BAS EN RAISON DE LA COMPLEXITE DE LA LOGIQUE
                // connectors.push( createConnectorMapPoint({
                //     x: mapPoint.x + 1,
                //     y: mapPoint.y + 1,
                //     origin: mapPoint.item,
                //     from: mapPoint.item.id,
                //     to: farthestTile === nextNoMapPoint  ? 'NO' : 'YES',
                //     ConnectorModel: WorkflowPseudoElements[
                //         tileWithLowestFrequency === nextNoMapPoint ? 'WorkflowYes' : 'WorkflowNo'
                //     ],
                // }) );

                connectors.push( createConnectorMapPoint({
                    x: mapPoint.x + 1,
                    y: mapPoint.y + 1,
                    origin: mapPoint.item,
                    from: mapPoint.item.id,
                    to: farthestTile === nextNoMapPoint  ? 'NO' : 'YES',
                    ConnectorModel: WorkflowConnectors.WorkflowHorizontalLineRight,
                }) );

                connectors.push( createConnectorMapPoint({
                    x: mapPoint.x + 2,
                    y: mapPoint.y + 1,
                    origin: mapPoint.item,
                    from: mapPoint.item.id,
                    to: farthestTile === nextNoMapPoint  ? 'NO' : 'YES',
                    ConnectorModel: WorkflowConnectors.WorkflowHorizontalLineLeft,
                }) );

                // tracer vers la droite jusqu'au x suivant de 2 colonnes le x le plus haut qu'il y a entre mapPoint.y et farthestToReach
                for( let x = mapPoint.x + 1; x<tileWithLowestFrequency.x + 2; x++) {

                    connectors.push( createConnectorMapPoint({
                        x,
                        y: mapPoint.y + 1,
                        origin: mapPoint.item,
                        from: mapPoint.item.id,
                        to: farthestTile === nextNoMapPoint  ? 'NO' : 'YES',
                        ConnectorModel: WorkflowConnectors.WorkflowHorizontalLineRight,
                    }) );

                    if( x + 1 < tileWithLowestFrequency.x + 2 )
                        connectors.push( createConnectorMapPoint({
                            x: x + 1,
                            y: mapPoint.y + 1,
                            origin: mapPoint.item,
                            from: mapPoint.item.id,
                            to: farthestTile === nextNoMapPoint  ? 'NO' : 'YES',
                            ConnectorModel: WorkflowConnectors.WorkflowHorizontalLineLeft,
                        }) );
                }

                connectors.push( createConnectorMapPoint({
                    x: tileWithLowestFrequency.x + 2,
                    y: mapPoint.y + 1,
                    origin: mapPoint.item,
                    from: mapPoint.item.id,
                    to: farthestTile === nextNoMapPoint  ? 'NO' : 'YES',
                    ConnectorModel: WorkflowConnectors.WorkflowBottomToLeft,
                }) );

                // tracer vers le bas jusqu'au y de la mapPoint la plus éloignée
                for( let y = mapPoint.y + 1; y<farthestTile.y; y++) {

                    if( y !== mapPoint.y + 1 )
                        connectors.push( createConnectorMapPoint({
                            x: tileWithLowestFrequency.x + 2,
                            y,
                            origin: mapPoint.item,
                            from: mapPoint.item.id,
                            to: farthestTile === nextNoMapPoint  ? 'NO' : 'YES',
                            ConnectorModel: WorkflowConnectors.WorkflowVerticalLineDown,
                        }) );

                    if( y + 1 < farthestTile.y )
                        connectors.push( createConnectorMapPoint({
                            x: tileWithLowestFrequency.x + 2,
                            y: y + 1,
                            origin: mapPoint.item,
                            from: mapPoint.item.id,
                            to: farthestTile === nextNoMapPoint  ? 'NO' : 'YES',
                            ConnectorModel: WorkflowConnectors.WorkflowVerticalLineUp,
                        }) );
                }

                connectors.push( createConnectorMapPoint({
                    x: tileWithLowestFrequency.x + 2,
                    y: farthestTile.y,
                    origin: mapPoint.item,
                    from: mapPoint.item.id,
                    to: farthestTile === nextNoMapPoint  ? 'NO' : 'YES',
                    ConnectorModel: WorkflowConnectors.WorkflowUpToLeft,
                }) );

                // tracer vers la gauche jusqu'au x de la mapPoint la plus éloignée
                // 6 sept 2023 : x>mapPoint.x; ----> x>tileWithHighestFrequency.x;
                for( let x = tileWithLowestFrequency.x + 1; x>tileWithHighestFrequency.x; x-- ) {

                    connectors.push( createConnectorMapPoint({
                        x,
                        y: farthestTile.y,
                        origin: mapPoint.item,
                        from: mapPoint.item.id,
                        to: farthestTile === nextNoMapPoint  ? 'NO' : 'YES',
                        ConnectorModel: WorkflowConnectors.WorkflowHorizontalLineRight,
                    }) );

                    if( x !== tileWithLowestFrequency.x + 1 )
                        connectors.push( createConnectorMapPoint({
                            x: x + 1,
                            y: farthestTile.y,
                            origin: mapPoint.item,
                            from: mapPoint.item.id,
                            to: farthestTile === nextNoMapPoint  ? 'NO' : 'YES',
                            ConnectorModel: WorkflowConnectors.WorkflowHorizontalLineLeft,
                        }) );
                }

                // puis pour le second pointage,
                // tracer jusqu'à deux crans en bas du switch
                connectors.push( createConnectorMapPoint({
                    x: mapPoint.x,
                    y: mapPoint.y + 1,
                    origin: mapPoint.item,
                    from: mapPoint.item.id,
                    to: farthestTile === nextNoMapPoint  ? 'YES' : 'NO',
                    ConnectorModel: WorkflowConnectors.WorkflowVerticalLineDown,
                }) );

                connectors.push( createConnectorMapPoint({
                    x: mapPoint.x,
                    y: mapPoint.y + 2,
                    origin: mapPoint.item,
                    from: mapPoint.item.id,
                    to: farthestTile === nextNoMapPoint  ? 'YES' : 'NO',
                    ConnectorModel: WorkflowConnectors.WorkflowUpToRight,
                }) );

                // puis deux crans à droite
                connectors.push( createConnectorMapPoint({
                    x: mapPoint.x + 1,
                    y: mapPoint.y + 2,
                    origin: mapPoint.item,
                    from: mapPoint.item.id,
                    to: farthestTile === nextNoMapPoint  ? 'YES' : 'NO',
                    ConnectorModel: WorkflowConnectors.WorkflowHorizontalLineLeft,
                }) );

                const nextImmediateMapPointToTheRight = mapPoints.find( ({ x, y }) => {

                    return x === mapPoint.x + 2 && y === mapPoint.y + 2;
                })!;
                let connectorModelName;

                switch( true ) {

                    case nextImmediateMapPointToTheRight.item.id === nextNoMapPoint!.item.id:
                        connectorModelName = 'WorkflowNo';
                        break;

                    case nextImmediateMapPointToTheRight.item.id === nextYesMapPoint!.item.id:
                        connectorModelName = 'WorkflowYes';
                        break;

                    default:
                        alert('???');
                }

                connectors.push( createConnectorMapPoint({
                    x: mapPoint.x + 1,
                    y: mapPoint.y + 2,
                    origin: mapPoint.item,
                    from: mapPoint.item.id,
                    to: farthestTile === nextNoMapPoint  ? 'YES' : 'NO',
                    ConnectorModel: WorkflowPseudoElements[ connectorModelName as keyof typeof WorkflowPseudoElements ],
                }) );

                // Maintenant qu'on a déterminé le premier, on peut déterminer le second
                //
                connectors.push( createConnectorMapPoint({
                    x: mapPoint.x + 1,
                    y: mapPoint.y + 1,
                    origin: mapPoint.item,
                    from: mapPoint.item.id,
                    to: farthestTile === nextNoMapPoint  ? 'NO' : 'YES',
                    ConnectorModel: WorkflowPseudoElements[
                        connectorModelName === 'WorkflowNo' ? 'WorkflowYes' : 'WorkflowNo'
                    ],
                }) );
                //
                //

                connectors.push( createConnectorMapPoint({
                    x: mapPoint.x + 1,
                    y: mapPoint.y + 2,
                    origin: mapPoint.item,
                    from: mapPoint.item.id,
                    to: farthestTile === nextNoMapPoint  ? 'YES' : 'NO',
                    ConnectorModel: WorkflowConnectors.WorkflowHorizontalLineRight,
                }) );

                connectors.push( createConnectorMapPoint({
                    x: mapPoint.x + 2,
                    y: mapPoint.y + 2,
                    origin: mapPoint.item,
                    from: mapPoint.item.id,
                    to: farthestTile === nextNoMapPoint  ? 'YES' : 'NO',
                    ConnectorModel: WorkflowConnectors.WorkflowHorizontalLineLeft,
                }) );
                break;
            }

            // 🆕 5ÈME RÈGLE : Une sortie revient vers une colonne précédente, l'autre reste dans la même colonne au-dessus
            case EWorkflowSwitchTypeIds.ONE_OUTPUT_TARGETS_PREVIOUS_COL_AND_ONE_OUTPUT_TARGETS_SAME_COL_ABOVE: {

                // alert('dessiner le tracé du nouveau type de switch');

                const tileOfPreviousCol = [ nextYesMapPoint!, nextNoMapPoint! ].find( (mapPoint, _index, self) => {

                    return mapPoint.x === Math.min( ...self.map( ({ x }) => x ) );
                })!;

                const tileOfSameColAbove = [ nextYesMapPoint!, nextNoMapPoint! ].find( (mapPoint, _index, self) => {

                    return mapPoint.x === Math.max( ...self.map( ({ x }) => x ) );
                })!;

                // On descend d'un cran
                connectors.push( createConnectorMapPoint({
                    x: mapPoint.x,
                    y: mapPoint.y,
                    origin: mapPoint.item,
                    from: mapPoint.item.id,
                    to: 'BOTH',
                    ConnectorModel: WorkflowConnectors.WorkflowVerticalLineDown,
                }) );

                // On tourne à gauche
                connectors.push( createConnectorMapPoint({
                    x: mapPoint.x,
                    y: mapPoint.y + 1,
                    origin: mapPoint.item,
                    from: mapPoint.item.id,
                    to: tileOfPreviousCol === nextNoMapPoint  ? 'NO' : 'YES',
                    ConnectorModel: WorkflowConnectors.WorkflowUpToLeft,
                }) );

                connectors.push( createConnectorMapPoint({
                    x: mapPoint.x -1,
                    y: mapPoint.y + 1,
                    origin: mapPoint.item,
                    from: mapPoint.item.id,
                    to: tileOfPreviousCol === nextNoMapPoint  ? 'NO' : 'YES',
                    ConnectorModel: WorkflowConnectors.WorkflowHorizontalLineRight,
                }) );

                connectors.push( createConnectorMapPoint({
                    x: mapPoint.x - 1,
                    y: mapPoint.y + 1,
                    origin: mapPoint.item,
                    from: mapPoint.item.id,
                    to: tileOfPreviousCol === nextNoMapPoint  ? 'NO' : 'YES',
                    ConnectorModel: WorkflowConnectors.WorkflowHorizontalLineLeft,
                }) );

                connectors.push( createConnectorMapPoint({
                    x: mapPoint.x - 2,
                    y: mapPoint.y + 1,
                    origin: mapPoint.item,
                    from: mapPoint.item.id,
                    to: tileOfPreviousCol === nextNoMapPoint  ? 'NO' : 'YES',
                    ConnectorModel: WorkflowConnectors.WorkflowHorizontalLineRight,
                }) );

                // On positionne le oui/non
                connectors.push( createConnectorMapPoint({
                    x: mapPoint.x - 1,
                    y: mapPoint.y + 1,
                    origin: mapPoint.item,
                    from: mapPoint.item.id,
                    to: tileOfPreviousCol === nextNoMapPoint ? 'NO' : 'YES',
                    ConnectorModel: WorkflowPseudoElements[
                        tileOfPreviousCol === nextNoMapPoint ? 'WorkflowNo' : 'WorkflowYes'
                    ],
                }) );

                // On tourne à droite
                connectors.push( createConnectorMapPoint({
                    x: mapPoint.x,
                    y: mapPoint.y + 1,
                    origin: mapPoint.item,
                    from: mapPoint.item.id,
                    to: tileOfSameColAbove === nextYesMapPoint ? 'YES' : 'NO',
                    ConnectorModel: WorkflowConnectors.WorkflowUpToRight,
                }) );

                connectors.push( createConnectorMapPoint({
                    x: mapPoint.x + 1,
                    y: mapPoint.y + 1,
                    origin: mapPoint.item,
                    from: mapPoint.item.id,
                    to: tileOfSameColAbove === nextYesMapPoint ? 'YES' : 'NO',
                    ConnectorModel: WorkflowConnectors.WorkflowHorizontalLineLeft,
                }) );

                connectors.push( createConnectorMapPoint({
                    x: mapPoint.x + 1,
                    y: mapPoint.y + 1,
                    origin: mapPoint.item,
                    from: mapPoint.item.id,
                    to: tileOfSameColAbove === nextYesMapPoint ? 'YES' : 'NO',
                    ConnectorModel: WorkflowConnectors.WorkflowHorizontalLineRight,
                }) );

                // On positionne le oui/non
                connectors.push( createConnectorMapPoint({
                    x: mapPoint.x + 1,
                    y: mapPoint.y + 1,
                    origin: mapPoint.item,
                    from: mapPoint.item.id,
                    to: tileOfSameColAbove === nextYesMapPoint ? 'YES' : 'NO',
                    ConnectorModel: WorkflowPseudoElements[
                        tileOfSameColAbove === nextYesMapPoint ? 'WorkflowYes' : 'WorkflowNo'
                    ],
                }) );

                // On remonte
                connectors.push( createConnectorMapPoint({
                    x: mapPoint.x + 2,
                    y: mapPoint.y + 1,
                    origin: mapPoint.item,
                    from: mapPoint.item.id,
                    to: tileOfSameColAbove === nextYesMapPoint ? 'YES' : 'NO',
                    ConnectorModel: WorkflowConnectors.WorkflowUpToLeft,
                }) );

                for( let y = mapPoint.y + 1; y>tileOfSameColAbove.y; y--) {

                    if( y !== mapPoint.y + 1 )
                        connectors.push( createConnectorMapPoint({
                            x: mapPoint.x + 2,
                            y,
                            origin: mapPoint.item,
                            from: mapPoint.item.id,
                            to: tileOfSameColAbove === nextYesMapPoint ? 'YES' : 'NO',
                            ConnectorModel: WorkflowConnectors.WorkflowVerticalLineDown,
                        }) );

                    if( y - 1 > tileOfSameColAbove.y )
                        connectors.push( createConnectorMapPoint({
                            x: mapPoint.x + 2,
                            y: y - 1,
                            origin: mapPoint.item,
                            from: mapPoint.item.id,
                            to: tileOfSameColAbove === nextYesMapPoint ? 'YES' : 'NO',
                            ConnectorModel: WorkflowConnectors.WorkflowVerticalLineUp,
                        }) );
                }

                // On tourne à gauche
                connectors.push( createConnectorMapPoint({
                    x: mapPoint.x + 2,
                    y: tileOfSameColAbove.y,
                    origin: mapPoint.item,
                    from: mapPoint.item.id,
                    to: tileOfSameColAbove === nextYesMapPoint ? 'YES' : 'NO',
                    ConnectorModel: WorkflowConnectors.WorkflowBottomToLeft,
                }) );

                connectors.push( createConnectorMapPoint({
                    x: mapPoint.x + 1,
                    y: tileOfSameColAbove.y,
                    origin: mapPoint.item,
                    from: mapPoint.item.id,
                    to: tileOfSameColAbove === nextYesMapPoint ? 'YES' : 'NO',
                    ConnectorModel: WorkflowConnectors.WorkflowHorizontalLineRight,
                }) );

                connectors.push( createConnectorMapPoint({
                    x: mapPoint.x + 1,
                    y: tileOfSameColAbove.y,
                    origin: mapPoint.item,
                    from: mapPoint.item.id,
                    to: tileOfSameColAbove === nextYesMapPoint ? 'YES' : 'NO',
                    ConnectorModel: WorkflowConnectors.WorkflowHorizontalLineLeft,
                }) );

                connectors.push( createConnectorMapPoint({
                    x: mapPoint.x,
                    y: tileOfSameColAbove.y,
                    origin: mapPoint.item,
                    from: mapPoint.item.id,
                    to: tileOfSameColAbove === nextYesMapPoint ? 'YES' : 'NO',
                    ConnectorModel: WorkflowConnectors.WorkflowHorizontalLineRight,
                }) );
                break;
            }

            default:
                console.error( 'Type de workflow switch inconnu.', mapPoint.workflowSwitchTypeId );
        }

        // console.log( mapPoint.item.id, nextYesMapPoint.x, mapPoint.x, { nextYesMapPoint, nextNoMapPoint })
        if( nextNoMapPoint!.item.id === "AWAITING_CONCERTED_OPINION_OF_GI_AND_RRH_STATUS") {
            console.log('%cbezd', 'color: red; font-size: 20px;', nextNoMapPoint!.isPointedAtTop, { workflowSwitchTypeId });
        }
        // if( nextYesMapPoint.item.id === "AWAITING_CONCERTED_OPINION_OF_GI_AND_RRH_STATUS") {
        //     console.log('%cvre', 'color: red; font-size: 20px;',);
        // }
        // console.log({mapPoint, nextNoMapPoint, nextYesMapPoint})
        nextYesMapPoint!.isPointedAtRight ||= nextYesMapPoint!.x < mapPoint.x || ( nextYesMapPoint!.x === mapPoint.x && nextYesMapPoint!.y < mapPoint.y );
        nextYesMapPoint!.isPointedAtTop ||= (
            workflowSwitchTypeId === EWorkflowSwitchTypeIds.ONE_OUTPUT_TARGETS_SAME_COL_BELOW_AND_ONE_OUTPUT_TARGETS_SAME_COL_ABOVE
            ||
            workflowSwitchTypeId === EWorkflowSwitchTypeIds.ONE_OUTPUT_TARGETS_PREVIOUS_COL_AND_ONE_OUTPUT_TARGETS_SAME_COL_ABOVE
        )
        ? ! nextYesMapPoint!.isPointedAtRight
        : nextYesMapPoint!.x === mapPoint.x;
        nextYesMapPoint!.isPointedAtLeft ||= nextYesMapPoint!.x > mapPoint.x;

        nextNoMapPoint!.isPointedAtRight ||= nextNoMapPoint!.x < mapPoint.x || ( nextNoMapPoint!.x === mapPoint.x && nextNoMapPoint!.y < mapPoint.y );
        nextNoMapPoint!.isPointedAtTop ||= (
            workflowSwitchTypeId === EWorkflowSwitchTypeIds.ONE_OUTPUT_TARGETS_SAME_COL_BELOW_AND_ONE_OUTPUT_TARGETS_SAME_COL_ABOVE
            ||
            workflowSwitchTypeId === EWorkflowSwitchTypeIds.ONE_OUTPUT_TARGETS_PREVIOUS_COL_AND_ONE_OUTPUT_TARGETS_SAME_COL_ABOVE
        )
        ? ! nextNoMapPoint!.isPointedAtRight
        : nextNoMapPoint!.x === mapPoint.x;
        nextNoMapPoint!.isPointedAtLeft ||= nextNoMapPoint!.x > mapPoint.x;
    }

    function createConnectorMapPoint({
        origin,
        x,
        y,
        from,
        to,
        ConnectorModel,
    }: {
        origin?: WorkflowItem,
        x: TMapPoint['x'],
        y: TMapPoint['y'],
        from: TWorkflowConnectorData['from'],
        to: TWorkflowConnectorData['to'],
        ConnectorModel: new(...args: [TWorkflowConnectorData]) => WorkflowItem,
    }): Pick<TMapPoint, 'x' | 'y' | 'item'> {

        return {
            x,
            y,
            item: new ConnectorModel({
                id: ''+ id.next().value,
                title: 'Connecteur',
                from,
                to,
                origin,
            }),
        };
    }

    for( const mapPoint of mapPoints ) {

        console.log('zénith', mapPoint.item.type );
        switch( mapPoint.item.type.id ) {

            case (WorkflowAction.prototype.constructor as any).__name:
            case (WorkflowStatus.prototype.constructor as any).__name:
            case (WorkflowBoundary.prototype.constructor as any).__name:
            case (WorkflowPlaceholder.prototype.constructor as any).__name:
                connectTileToNextTile( mapPoint );
                break;

            case (WorkflowSwitch.prototype.constructor as any).__name:
                connectTileToNextTiles( mapPoint );
                break;

            default:
                console.error(`Type de point inconnu, impossible d'effectuer la connexion.`, { mapPoint });
        }
    }

    connectedMapPoints.push( ...connectors );

    return connectedMapPoints;
}
