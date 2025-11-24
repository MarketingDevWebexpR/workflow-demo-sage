// @@ models
import WorkflowItem from '../../../models/workflow/WorkflowItem.model';

// @@ map engine parts
import { type IIdFrequency } from './calcIdFrequencies';

// @@ switches
import WorkflowSwitch from '../../../models/workflow/elements/WorkflowSwitch.model';


export type TBaseMapPoint = IIdFrequency & {
    x: number,
    y: number,
};

export default function calcBaseMapPoints(
    idFrequencies: IIdFrequency[],
    uniqueWorkflowPaths: WorkflowItem[][],
    switches: {
        [switchFnName: string]: (...args: unknown[]) => WorkflowSwitch,
    },
): TBaseMapPoint[] {

    const baseMapPoints = idFrequencies.map( idFrequency => {

        const potentialOccurrences: number[] = [];
        const switchesCount = Object.keys( switches ).length;
// console.log({ switchesCount });
        for( let i = 0; i<switchesCount; i++)
            potentialOccurrences[ i ] = Math.pow( 2, i + 1 );

        potentialOccurrences.reverse();

        const index = potentialOccurrences.indexOf( idFrequency.occurrences );
        const x = index > -1
        ? (
            index * 2
        )
        : potentialOccurrences.length * 2;
        // console.log({ x, potentialOccurrences, occurrences: idFrequency.occurrences, item: idFrequency.item.title });
        const y = Math.max( ...uniqueWorkflowPaths.map( workflowPath => {

            const highestPositionInPathExcludingLoopTurns = workflowPath
                .filter( ({ currentLoopTurn }) => ! currentLoopTurn )
                .findIndex( ({ id }) => id === idFrequency.item.id );

            return highestPositionInPathExcludingLoopTurns;
        }) );

        return {
            ...idFrequency,
            x,
            y,
        };
    });

    baseMapPoints.sort( (a,b) => a.y - b.y );

    return baseMapPoints;
}
