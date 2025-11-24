// @@ map engine parts
import type { TBaseMapPoint } from './calcBaseMapPoints';
import type { TUniqueSwitchSequences } from './calcUniqueSwitchSequences';

// @@ models
import WorkflowSwitch from '../../../models/workflow/elements/WorkflowSwitch.model';
import WorkflowItem from '../../../models/workflow/WorkflowItem.model';
import { cloneDeep } from 'lodash';

export enum EWorkflowSwitchTypeIds {
    BOTH_OUTPUTS_TARGETS_NEXT_DIRECT_COL ='BOTH_OUTPUTS_TARGETS_NEXT_DIRECT_COL',
    ONE_OUTPUT_TARGETS_SAME_COL_AND_ONE_OUTPUT_TARGETS_NEXT_DIRECT_COL = 'ONE_OUTPUT_TARGETS_SAME_COL_AND_ONE_OUTPUT_TARGETS_NEXT_DIRECT_COL',
    ONE_OUTPUT_TARGETS_NEXT_DIRECT_COL_AND_ONE_OUTPUT_TARGETS_ANY_PREVIOUS_COL = 'ONE_OUTPUT_TARGETS_NEXT_DIRECT_COL_AND_ONE_OUTPUT_TARGETS_ANY_PREVIOUS_COL',
    ONE_OUTPUT_TARGETS_SAME_COL_BELOW_AND_ONE_OUTPUT_TARGETS_SAME_COL_ABOVE = 'ONE_OUTPUT_TARGETS_SAME_COL_BELOW_AND_ONE_OUTPUT_TARGETS_SAME_COL_ABOVE',
    ONE_OUTPUT_TARGETS_PREVIOUS_COL_AND_ONE_OUTPUT_TARGETS_SAME_COL_ABOVE = 'ONE_OUTPUT_TARGETS_PREVIOUS_COL_AND_ONE_OUTPUT_TARGETS_SAME_COL_ABOVE',
}

export type TMapPoint = TBaseMapPoint & {
    nextItemId: WorkflowItem['id'],
    nextYesItemId: WorkflowItem['id'],
    nextNoItemId: WorkflowItem['id'],
    isPointedAtTop: boolean,
    isPointedAtRight: boolean,
    isPointedAtLeft: boolean,
    workflowSwitchTypeId?: EWorkflowSwitchTypeIds,
};

export default function calcMapPoints(
    baseMapPoints: TBaseMapPoint[],
    uniqueSwitchSequences: TUniqueSwitchSequences,
    uniqueWorkflowPaths: WorkflowItem[][],
    flatPaths: WorkflowItem[],
): TMapPoint[] {

    const coordsToUpdate: {
        elems: () => TBaseMapPoint[],
        add: number,
        addFn?: () => number,
    }[][] = [];

    const coordsToUpdateBecauseOfNoTileInsertion: {
        elems: () => TBaseMapPoint[],
        add: number,
        addFn?: () => number,
    }[] = [];

    let mapPoints = baseMapPoints.map( (baseMapPoint, _index, self) => {

        console.log('____________________________________________________');
        console.log('zénith', baseMapPoint.item.title);
        console.log('____________________________________________________');
        let nextPathTile: TBaseMapPoint = undefined!,
            nextItemId: string = undefined!,
            nextPathATile: TBaseMapPoint = undefined!,
            nextPathATileId: string = undefined!,
            nextYesItemId: string = undefined!,
            nextPathBTile: TBaseMapPoint = undefined!,
            nextPathBTileId: string = undefined!,
            nextNoItemId: string = undefined!,
            workflowSwitchTypeId: string = undefined!;

        // La tile est un switch
        if( baseMapPoint.item.type.id === WorkflowSwitch.__name ) {

            const indexA = flatPaths.findIndex( (path) => {

                return path.id === baseMapPoint.item.id;
            });
            const nextPathA = flatPaths[ indexA + 1 ];

            const indexB = flatPaths.findIndex( (path, index, self) => {

                return path.id === baseMapPoint.item.id && self[ index + 1 ].id !== nextPathA.id;
            });
            const nextPathB = flatPaths[ indexB + 1 ];

            nextPathATile = self.find( ({ item: { id } }) => {

                return id === nextPathA.id;
            })!;
            nextPathATileId = nextPathATile.item.id;

            nextPathBTile = self.find( ({ item: { id } }) => {

                return id === nextPathB.id;
            })!;
            nextPathBTileId = nextPathBTile.item.id;

            // Détection du YES
            const indexOfPathWithCurrentWorkflowSwitchAsYes = uniqueSwitchSequences.findIndex( switchSequence => {

                return switchSequence.find( switchValue => {

                    return switchValue.id === baseMapPoint.item.id && switchValue.value === true && switchValue.hasBeenUsed === true;
                })
            });
            const pathWithCurrentWorkflowSwitchAsYes = uniqueWorkflowPaths[ indexOfPathWithCurrentWorkflowSwitchAsYes ];
            const indexOfCurrentSwitchWithinYesPath = pathWithCurrentWorkflowSwitchAsYes.findIndex( workflowItem => {

                return workflowItem.id === baseMapPoint.item.id;
            });
            nextYesItemId = pathWithCurrentWorkflowSwitchAsYes[ indexOfCurrentSwitchWithinYesPath + 1 ].id;

            // Détection du NO
            const indexOfPathWithCurrentWorkflowSwitchAsNo = uniqueSwitchSequences.findIndex( switchSequence => {

                return switchSequence.find( switchValue => {

                    return switchValue.id === baseMapPoint.item.id && switchValue.value === false && switchValue.hasBeenUsed === true;
                })
            });
            const pathWithCurrentWorkflowSwitchAsNo = uniqueWorkflowPaths[ indexOfPathWithCurrentWorkflowSwitchAsNo ];
            const indexOfCurrentSwitchWithinNoPath = pathWithCurrentWorkflowSwitchAsNo.findIndex( workflowItem => {

                return workflowItem.id === baseMapPoint.item.id;
            });
            console.log('sam25oct', { pathWithCurrentWorkflowSwitchAsNo, indexOfCurrentSwitchWithinNoPath, baseMapPoint });
            nextNoItemId = pathWithCurrentWorkflowSwitchAsNo[ indexOfCurrentSwitchWithinNoPath + 1 ].id;

            console.log( baseMapPoint.item.title, { nextNoItemId, nextYesItemId});

            const a = uniqueWorkflowPaths.filter( path => {

                const switchIndex = path.findIndex( tile => {

                    return tile.id === baseMapPoint.item.id;
                });
                const next = nextPathA.id;

                return path[ switchIndex + 1 ].id === next;
            });

            const b = uniqueWorkflowPaths.filter( path => {

                const switchIndex = path.findIndex( tile => {

                    return tile.id === baseMapPoint.item.id;
                });
                const next = nextPathB.id;

                return path[ switchIndex + 1 ].id === next;
            });

            const a2 = a.map( z => {

                return z.filter( (_x,index) => index > z.map( b => b.id ).indexOf( baseMapPoint.item.id ) );
            });

            const b2 = b.map( z => {

                return z.filter( (_x,index) => index > z.map( b => b.id ).indexOf( baseMapPoint.item.id ) );
            });

            const a3 = a2.map( x => {

                const occurrencesEqualsToSwitchOccurrences = x.map( tile => {

                    return self.find( ({ item }) => item.id === tile.id )!;
                }).find( ({ occurrences }) => {

                    return occurrences === baseMapPoint.occurrences;
                });

                const occurrencesSuperiorToSwitchOccurrences = x.map( tile => {

                    return self.find( ({ item }) => item.id === tile.id )!;
                }).find( ({ occurrences }) => {

                    return occurrences > baseMapPoint.occurrences;
                });

                // console.log('%c a3 '+ baseMapPoint.item.title, 'color: firebrick;',{occurrencesEqualsToSwitchOccurrences, occurrencesSuperiorToSwitchOccurrences});

                if( occurrencesEqualsToSwitchOccurrences && occurrencesSuperiorToSwitchOccurrences ) {
                    // console.log('hello');
                    return [ occurrencesEqualsToSwitchOccurrences, occurrencesSuperiorToSwitchOccurrences ].find( ({ y }, _, self) => {

                        return y === Math.min( ...self.map( ({ y }) => y ) );
                    })
                }
                else if( occurrencesEqualsToSwitchOccurrences )
                    return occurrencesEqualsToSwitchOccurrences;
                else if( occurrencesSuperiorToSwitchOccurrences )
                    return occurrencesSuperiorToSwitchOccurrences;
                else
                    alert('?');
            });

            // console.log('%c a3 '+ baseMapPoint.item.title, 'color: firebrick; font-weight: bold;', a3 );
            // console.log('%c new set a3 '+ baseMapPoint.item.title, 'color: firebrick; font-weight: bold;', [ ...new Set(a3) ] );
            const [ nextCommonTile ] = [ ...new Set(a3) ];

            interface IWorkflowSwitchTypes {
                id: string,
                rule: () => boolean,
            }

            const workflowSwitchTypes: IWorkflowSwitchTypes[] = [
                {
                    id: EWorkflowSwitchTypeIds.BOTH_OUTPUTS_TARGETS_NEXT_DIRECT_COL,
                    rule: () => nextPathATile.occurrences === baseMapPoint.occurrences / 2
                    && nextPathBTile.occurrences === baseMapPoint.occurrences / 2,
                },
                {
                    id: EWorkflowSwitchTypeIds.ONE_OUTPUT_TARGETS_SAME_COL_AND_ONE_OUTPUT_TARGETS_NEXT_DIRECT_COL,
                    rule: () => ( nextPathATile.occurrences === baseMapPoint.occurrences
                    && nextPathBTile.occurrences < baseMapPoint.occurrences )
                    ||
                    ( nextPathATile.occurrences < baseMapPoint.occurrences
                    && nextPathBTile.occurrences === baseMapPoint.occurrences ),
                },
                {
                    id: EWorkflowSwitchTypeIds.ONE_OUTPUT_TARGETS_NEXT_DIRECT_COL_AND_ONE_OUTPUT_TARGETS_ANY_PREVIOUS_COL,
                    rule: () => ( nextPathATile.occurrences > baseMapPoint.occurrences
                    && nextPathBTile.occurrences < baseMapPoint.occurrences )
                    ||
                    ( nextPathATile.occurrences < baseMapPoint.occurrences
                    && nextPathBTile.occurrences > baseMapPoint.occurrences ),
                },
                {
                    id: EWorkflowSwitchTypeIds.ONE_OUTPUT_TARGETS_SAME_COL_BELOW_AND_ONE_OUTPUT_TARGETS_SAME_COL_ABOVE,
                    rule: () => nextPathATile.occurrences === baseMapPoint.occurrences
                    && nextPathBTile.occurrences === baseMapPoint.occurrences,
                },
                {
                    // 🆕 5ÈME RÈGLE : Une sortie revient vers une colonne précédente,
                    // l'autre reste dans la même colonne au-dessus
                    id: EWorkflowSwitchTypeIds.ONE_OUTPUT_TARGETS_PREVIOUS_COL_AND_ONE_OUTPUT_TARGETS_SAME_COL_ABOVE,
                    rule: () => nextPathBTile.occurrences === baseMapPoint.occurrences
                    && nextPathATile.occurrences > baseMapPoint.occurrences,
                },
            ];

            console.log('sam25oct', {
                // mets les infos importantes dans le console.log
                flatPaths,
                uniqueWorkflowPaths,
                uniqueSwitchSequences,
                baseMapPoint,
            })
            try {
            workflowSwitchTypeId = workflowSwitchTypes.find( ({ rule }) => rule() )!.id;
            } catch( error ) {
                throw new Error(
                    `La façon dont le switch "${baseMapPoint.item.title}" (id: ${baseMapPoint.item.id}) pointe est invalide.\n\n${
                        JSON.stringify({
                            workflowSwitchTypes,
                            baseMapPoint,
                            nextPathATile,
                            nextPathBTile,
                            nextCommonTile,
                            // a2,
                            // b2,
                            // a3,
                        }, null, 2)
                    }`,
                    {
                        cause: error,
                    });
            }

            // 🔍 DEBUG pour les switches problématiques du 2.ts do not work
            const problematicSwitches = [
                'SWITCH_PAYMENT_VALID',
                'SWITCH_EXPRESS_REQUESTED',
                'SWITCH_HIGH_RISK_ORDER',
                'SWITCH_FRAUD_CONFIRMED'
            ];

            if (problematicSwitches.includes(baseMapPoint.item.id)) {
                console.log(`\n🚨 DEBUG SWITCH PROBLÉMATIQUE: ${baseMapPoint.item.title}`);
                console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
                console.log('📊 BaseMapPoint:', {
                    id: baseMapPoint.item.id,
                    title: baseMapPoint.item.title,
                    occurrences: baseMapPoint.occurrences,
                    x: baseMapPoint.x,
                    y: baseMapPoint.y
                });
                console.log('\n📍 Next Path A Tile (branche 1):', {
                    id: nextPathATile.item.id,
                    title: nextPathATile.item.title,
                    occurrences: nextPathATile.occurrences,
                    x: nextPathATile.x,
                    y: nextPathATile.y
                });
                console.log('\n📍 Next Path B Tile (branche 2):', {
                    id: nextPathBTile.item.id,
                    title: nextPathBTile.item.title,
                    occurrences: nextPathBTile.occurrences,
                    x: nextPathBTile.x,
                    y: nextPathBTile.y
                });
                console.log('\n🎯 Type de switch détecté:', workflowSwitchTypeId);
                console.log('\n📋 Résultats des règles:');
                workflowSwitchTypes.forEach(({ id, rule }) => {
                    const result = rule();
                    console.log(`  ${result ? '✅' : '❌'} ${id}: ${result}`);
                });
                console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
            }

            switch( workflowSwitchTypeId ) {

                // Le switch pointe sur deux éléments de la colonne suivante
                case EWorkflowSwitchTypeIds.BOTH_OUTPUTS_TARGETS_NEXT_DIRECT_COL: {

                    console.log('basemappoint payment valid', baseMapPoint?.item?.id);
                    const slicedA = a2.map( x => {

                        return x.map( tile => {

                            return self.find( ({ item }) => item.id === tile.id )!;
                        }).filter( y => {

                            return y.y < nextCommonTile!.y;
                        });
                    });

                    const slicedB = b2.map( x => {

                        return x.map( tile => {

                            return self.find( ({ item }) => item.id === tile.id )!;
                        }).filter( y => {

                            return y.y < nextCommonTile!.y;
                        });
                    });
                    console.log({ slicedA });
                    console.log({ slicedB });
                    const deltaY = nextCommonTile!.y - baseMapPoint.y - 1;
                    console.log('premier deltaY', deltaY);

                    const noDuplicateSlicedAIds = [ ...new Set( slicedA.map( x => [ ...new Set( x.map( ({ item: { id } }) => id ) ) ] ) ) ];
                    const noDuplicateSlicedBIds = [ ...new Set( slicedB.map( x => [ ...new Set( x.map( ({ item: { id } }) => id ) ) ] ) ) ];
                    const maxA = Math.max(...[ ...new Set( noDuplicateSlicedAIds.map( x => x.length ) ) ]);
                    const maxB = Math.max(...[ ...new Set( noDuplicateSlicedBIds.map( x => x.length ) ) ]);
                    const smallest = Math.min( maxB, maxA );
                    const longest = Math.max( maxB, maxA );
                    console.log({ noDuplicateSlicedAIds, noDuplicateSlicedBIds, maxA, maxB, slicedA, slicedB });

                    console.log({ longest, smallest })
                    // test avec supérieur ou égal en cas de size égales?
                    const slicedSmallest = maxB > maxA ? slicedA : slicedB;
                    console.log({ slicedSmallest});
                    coordsToUpdate.push([]);


                    const requiresCalcMethod2 = () => {

                        return ( window as any ).i === 1 || ( window as any ).i === 3;
                    }

                    // Pour un même switch pointant sur deux éléments de la colonne suivante,
                    // on a besoin de "faire descendre" la portion la moins longue...
                    coordsToUpdate[ coordsToUpdate.length - 1 ].push({
                        elems: () => {

                            console.log( baseMapPoint.item?.id, 'xyzhaha')
                            const result = [ ...new Set(slicedSmallest.flat())];

                            console.log('add deltaY', cloneDeep({ result, deltaY }) );

                            return result;
                        },
                        add: deltaY,
                        addFn: () => {

                            const coordNow = mapPoints.find( ({ item }) => item.id === baseMapPoint.item.id )!;
                            const nextCommonTileNow = mapPoints.find( ({ item }) => item.id === nextCommonTile!.item.id )!;
                            const deltaYAfterBranchShiftedBelow = nextCommonTileNow.y - coordNow.y - 1;
                            // console.log('elems calc delta to add', coordNow.y, nextCommonTileNow.y, smallest, longest, {deltaYAfterBranchShiftedBelow} );
                            // console.log('elems 17 + 1 + 4', coordNow.y + 1 + longest );


                            // console.log('%c elems '+ ( window as any ).i, 'color: #00ff00; font-weight: bold;');
                            // console.log('elems', { requiresCalcMethod2: requiresCalcMethod2(), deltaY,longest, deltaYAfterBranchShiftedBelow});
                            // console.log('elems used result', requiresCalcMethod2()
                            // ? (
                            //     ( window as any ).i === 3 ? 4 : deltaYAfterBranchShiftedBelow
                            // ): deltaY);
                            // console.log({ longest, deltaY, deltaYAfterBranchShiftedBelow });
                            // Nouvelle formule
                            console.log(`%cOn ajoute ${ longest }`, 'color: purple; font-weight: bold;');
                            return longest;
                            return requiresCalcMethod2()
                            ? (
                                ( window as any ).i === 3 ? 4 : deltaYAfterBranchShiftedBelow
                            ): deltaY;
                        },
                    });

                    // ... et une fois cette portion descendue, on doit faire redescendre
                    // les éléments en-dessous d'autant que la taille de ladite portion
                    coordsToUpdate[ coordsToUpdate.length - 1 ].push({
                        elems: () => {

                            const coordNow = mapPoints.find( ({ item }) => item.id === baseMapPoint.item.id )!;

                            const result = mapPoints
                            .filter( (baseMapPoint) => {

                                const isWithinFlattenedSlicedSmallest = [ ...new Set(slicedSmallest.flat())]
                                .map( ({ item: { id } }) => id )
                                .includes( baseMapPoint.item.id );

                                // Ancienne formule
                                let baseMapPointYGreaterThanDeltaY = baseMapPoint.y >= deltaY + [ ...new Set(slicedSmallest.flat())][0]!.y;

                                // if( requiresCalcMethod2() ) {
                                // Nouvelle formule (dépendante d'un requirecalcmethod2 ? a priori non ?)
                                baseMapPointYGreaterThanDeltaY = baseMapPoint.y >= coordNow.y + 1 + longest;
                                //}
                                console.log(! isWithinFlattenedSlicedSmallest && baseMapPointYGreaterThanDeltaY, '%c elems '+ baseMapPoint.item.title, 'color: royalblue;',  baseMapPoint.y, coordNow.y, { slicedA,slicedB,nextCommonTile,longest, isWithinFlattenedSlicedSmallest, baseMapPointYGreaterThanDeltaY });
                                return ! isWithinFlattenedSlicedSmallest && baseMapPointYGreaterThanDeltaY;
                            });

                            return result;
                        },
                        add: smallest,
                        addFn: () => smallest,
                    });

                    console.log('sapé',{ id: baseMapPoint.item.id, coordsToUpdate: cloneDeep(coordsToUpdate) })
                    // console.log('%c coordsToUpdate '+ baseMapPoint.item.title, 'color: #00ff00; font-weight: bold;', _.cloneDeep(coordsToUpdate));
                    break;
                }

                // Le switch pointe sur un élément de la même colonne que lui et un autre de la colonne suivante
                case EWorkflowSwitchTypeIds.ONE_OUTPUT_TARGETS_SAME_COL_AND_ONE_OUTPUT_TARGETS_NEXT_DIRECT_COL: {

                    if( nextCommonTile!.y - baseMapPoint.y < 3 ) {

                        coordsToUpdateBecauseOfNoTileInsertion.push({
                            elems: () => {

                                return mapPoints.filter( mapPoint => {

                                    const coordNow = mapPoints.find( ({ item }) => item.id === baseMapPoint.item.id )!;
                                    return mapPoint.y > coordNow.y + 1;
                                });
                            },
                            add: 1,
                        });
                    }

                    if( nextCommonTile!.y - baseMapPoint.y === 3 ) {

                        // console.log( baseMapPoint.item.id, 'on ne fait rien, tout est nickel');
                    }

                    if( nextCommonTile!.y - baseMapPoint.y > 3 ) {


                    }

                    break;
                }

                // Le switch pointe sur un élément d'une colonne suivante et d'une colonne précédente
                case EWorkflowSwitchTypeIds.ONE_OUTPUT_TARGETS_NEXT_DIRECT_COL_AND_ONE_OUTPUT_TARGETS_ANY_PREVIOUS_COL: {

                    coordsToUpdateBecauseOfNoTileInsertion.push({
                        elems: () => {

                            console.log( baseMapPoint.item.id,EWorkflowSwitchTypeIds.ONE_OUTPUT_TARGETS_NEXT_DIRECT_COL_AND_ONE_OUTPUT_TARGETS_ANY_PREVIOUS_COL);
                            return mapPoints.filter( (mapPoint) => {

                                const coordNow = mapPoints.find( ({ item }) => item.id === baseMapPoint.item.id )!;
                                return mapPoint.y > coordNow.y// + 1;
                            });
                        },
                        add: 1,
                    });
                    break;
                }

                // Le switch pointe sur un élément de la même colonne que lui en-dessous mais aussi sur un élément de la même colonne au-dessus
                case EWorkflowSwitchTypeIds.ONE_OUTPUT_TARGETS_SAME_COL_BELOW_AND_ONE_OUTPUT_TARGETS_SAME_COL_ABOVE: {

                    coordsToUpdateBecauseOfNoTileInsertion.push({
                        elems: () => {

                            return mapPoints.filter( mapPoint => {

                                const coordNow = mapPoints.find( ({ item }) => item.id === baseMapPoint.item.id )!;

                                return mapPoint.y > coordNow.y;
                            });
                        },
                        add: 2, // un UpToRight + un Yes/No
                    });
                    break;
                }

                // 🆕 5ÈME RÈGLE : Une sortie revient vers une colonne précédente, l'autre reste dans la même colonne au-dessus
                case EWorkflowSwitchTypeIds.ONE_OUTPUT_TARGETS_PREVIOUS_COL_AND_ONE_OUTPUT_TARGETS_SAME_COL_ABOVE: {
                    coordsToUpdateBecauseOfNoTileInsertion.push({
                        elems: () => {

                            return mapPoints.filter( mapPoint => {

                                const coordNow = mapPoints.find( ({ item }) => item.id === baseMapPoint.item.id )!;
                                return mapPoint.y > coordNow.y;
                            });
                        },
                        add: 0, // ⚠️ IMPORTANT : add = 0 (contrairement aux autres qui ont 1 ou 2)
                    });
                    break;
                }

                default:
                    console.error('Type de switch non géré ?');
            }
        }

        // La tile n'est pas un switch
        else {

            console.log('zénith non switch', baseMapPoint.item.title, {
                baseMapPointItemTypeId: baseMapPoint.item.type.id,
                flatPaths,
            });
            const indexA = flatPaths.findIndex( path => {

                return path.id === baseMapPoint.item.id;
            });
            const nextPath = flatPaths[ indexA + 1 ];
            nextItemId = ! nextPath || nextPath.id === self[0].item.id ? null as any : nextPath.id;

            if( nextPath && nextPath.id !== flatPaths[0].id ) {

                nextPathTile = self.find( ({ item: { id } }) => {

                    return id === nextPath.id;
                })!;
            }
            else
                nextPathTile = null as any;
        }

        const mapPoint = {
            ...baseMapPoint,
            nextPathTile,
            nextItemId,
            nextPathATile,
            nextPathATileId,
            nextPathBTile,
            nextPathBTileId,
            nextYesItemId,
            nextNoItemId,
            workflowSwitchTypeId,
        };

        return mapPoint;
    });

    // Il y a autant d'items dans coordsToUpdate que de switch
    // pointant sur deux éléments de la prochaine colonne

    console.log('coordsToUpdate', cloneDeep(coordsToUpdate) );
    (window as any).i = 0;
    for( const toUpdate of coordsToUpdate ) {

        console.log('tour i', (window as any).i );
        // if( (window as any).i >= 2 )
        //     break;
        const [ m, n, ] = toUpdate;

        // Portion la moins longue du yes/no
        const mElems = m.elems();
        console.log('mElems', mElems, mElems.map( ({ item }) => item.title ) );
        mElems.forEach( ({ item: { id } }) => {

            const baseMapPoint = mapPoints.find( mapPoint => mapPoint.item.id === id )!;

            baseMapPoint.y += m.addFn!();
        });

        // Portion en-dessous de la portion la moins longue du yes/no
        const nElems = n.elems();
        console.log('nElems', nElems, nElems.map( ({ item }) => item.title ) );
        nElems.forEach( ({ item: { id } }) => {

            const baseMapPoint = mapPoints.find( mapPoint => mapPoint.item.id === id )!;

            baseMapPoint.y += n.add;
        });

        (window as any).i++;
    }

    for( const toUpdate of coordsToUpdateBecauseOfNoTileInsertion ) {

        const elems = toUpdate.elems();
        console.log('tour');
        console.log({ elems });
        elems.forEach( ({ item: { id } }) => {

            const baseMapPoint = mapPoints.find( mapPoint => mapPoint.item.id === id )!;

            baseMapPoint.y += toUpdate.add;
        });
    }

    return mapPoints as any;
}
