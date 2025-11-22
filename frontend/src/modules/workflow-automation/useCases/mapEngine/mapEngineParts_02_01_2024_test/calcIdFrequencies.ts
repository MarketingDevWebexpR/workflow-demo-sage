// @@ models
import { createWorkflowFromText } from '../../../engine/create-workflow-from-text';
import WorkflowItem from '../../../models/workflow/WorkflowItem.model';

// @@ map engine parts
import { type TUniqueSwitchSequences } from './calcUniqueSwitchSequences';


export interface IIdFrequency {
    occurrences: number,
    item: WorkflowItem,
}

export interface IWorkflowItemType {
    id: string,
    title: string,
}

export default function calcIdFrequencies(
    uniqueSwitchSequences: TUniqueSwitchSequences,
    generatorFn: ReturnType<typeof createWorkflowFromText>['generatorFn'],
) {

    const uniqueWorkflowPaths: WorkflowItem[][] = uniqueSwitchSequences.map( uniqueSwitchSequence => {

        const definedWorkflow = generatorFn( undefined, uniqueSwitchSequence );
        const uniqueWorkflowPath = [ ...definedWorkflow ];
        return uniqueWorkflowPath;
    });

    const flatPaths = uniqueWorkflowPaths.flat();

    const workflowItemIds = flatPaths.map( ({ id }) => id );

    const uniqueIds = [ ...new Set( workflowItemIds ) ];

    const idFrequencies = uniqueIds.map( id => {

        const item = flatPaths.find( path => path.id === id );
        const occurrences = uniqueWorkflowPaths.reduce( ( acc, uniqueWorkflowPath ) => {

            const { length } = uniqueWorkflowPath.filter( workflowItem => {

                return workflowItem.id === id && (
                    workflowItem.currentLoopTurn === undefined
                    || workflowItem.currentLoopTurn === null
                    || workflowItem.currentLoopTurn === 0
                );
            });

            acc += length;
            return acc;
        }, 0);

        return {
            occurrences,
            item,
        };
    });

    console.log('new id frequencies', {idFrequencies});

    return {
        idFrequencies: idFrequencies as IIdFrequency[],
        uniqueWorkflowPaths,
        flatPaths,
    };
}
