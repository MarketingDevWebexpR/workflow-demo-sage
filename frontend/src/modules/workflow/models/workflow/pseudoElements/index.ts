// @@ models
import WorkflowItem, { type IWorkflowItemData } from '../WorkflowItem.model';


export enum EWorkflowPseudoElementNames {
    WORKFLOW_YES = 'WorkflowYes',
    WORKFLOW_NO = 'WorkflowNo',
}

export type TWorkflowConnectorData = IWorkflowItemData;

export function generatePseudoElementModel(name: EWorkflowPseudoElementNames) {

    const pseudoElementModel = {
        [name]: class extends WorkflowItem {

            static __name = name;

            constructor( props: TWorkflowConnectorData ) {

                super( props );
            }
        },
    };

    return pseudoElementModel[ name ];
}

export default Object.values( EWorkflowPseudoElementNames )
    .filter( v => isNaN( Number( v ) ) )
    .reduce( (pseudoElements, pseudoElementName) => {

        return {
            ...pseudoElements,
            [ pseudoElementName ]: generatePseudoElementModel( pseudoElementName ),
        };
    }, {} as {
        [ key in EWorkflowPseudoElementNames ]: typeof WorkflowItem
    });
