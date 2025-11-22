// @@ models
import { createWorkflowFromText } from '../../../engine/create-workflow-from-text';
import WorkflowSwitch from '../../../models/workflow/elements/WorkflowSwitch.model';


export type TUniqueSwitchSequences = {
    id: WorkflowSwitch['id'],
    value: WorkflowSwitch['value'],
    hasBeenUsed?: boolean,
}[][];


export default function calcUniqueSwitchSequences( workflowInfos: ReturnType<typeof createWorkflowFromText> ): TUniqueSwitchSequences {

    const workflowSwitches = Object.values( workflowInfos.switches ).map( switchFn => switchFn( undefined, undefined ) );

    const workflowSwitchesCount = workflowSwitches.length;
    const uniqueBooleanSequences = [];
    const uniqueBooleanSequence = [];

    for( let i = ( Math.pow( 2, workflowSwitchesCount ) - 1 ); i >= 0; i-- ) {

        for( let j = ( workflowSwitchesCount - 1 ); j >= 0; j-- ) {

            uniqueBooleanSequence[ j ] = ( i & Math.pow( 2, j ) ) ? true : false;
        }

        uniqueBooleanSequences.push([ ...uniqueBooleanSequence ]);
    }

    const uniqueSwitchSequences = uniqueBooleanSequences.map( uniqueBooleanSequence => {

        return uniqueBooleanSequence.map( (boolean, index) => {

            return {
                id: workflowSwitches[ index ].id,
                value: boolean,
            };
        });
    });

    return uniqueSwitchSequences;
}
