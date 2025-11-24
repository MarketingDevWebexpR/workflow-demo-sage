// @@ models
import WorkflowItem, { type IWorkflowItemData } from '../WorkflowItem.model';


export enum EWorkflowConnectorNames {
    WORKFLOW_VERTICAL_LINE_UP = 'WorkflowVerticalLineUp',
    WORKFLOW_VERTICAL_LINE_DOWN = 'WorkflowVerticalLineDown',
    WORKFLOW_HORIZONTAL_LINE_LEFT = 'WorkflowHorizontalLineLeft',
    WORKFLOW_HORIZONTAL_LINE_RIGHT = 'WorkflowHorizontalLineRight',
    WORKFLOW_UP_TO_LEFT = 'WorkflowUpToLeft',
    WORKFLOW_UP_TO_RIGHT = 'WorkflowUpToRight',
    WORKFLOW_BOTTOM_TO_LEFT = 'WorkflowBottomToLeft',
}

export interface IWorkflowConnectorData {
    from: string,
    to: string,
    origin?: WorkflowItem,
}

export type TWorkflowConnectorData = IWorkflowItemData & IWorkflowConnectorData;

export function generateConnectorModel(name: EWorkflowConnectorNames): typeof WorkflowItem {

    const Connector = {
        [name]: class extends WorkflowItem {

            static __name = name;

            public from: WorkflowItem['id'];
            public to: WorkflowItem['id'];
            public origin?: WorkflowItem;

            constructor( props: TWorkflowConnectorData ) {

                super( props );

                this.origin = props.origin;
                this.from = props.from;
                this.to = props.to;
            }
        },
    };

    return Connector[ name ];
}

export default Object.values( EWorkflowConnectorNames )
    .filter( v => isNaN( Number( v ) ) )
    .reduce( (connectors, connectorName) => {

        return {
            ...connectors,
            [ connectorName ]: generateConnectorModel( connectorName ),
        };
    }, {} as {
        [ key in EWorkflowConnectorNames ]: typeof WorkflowItem
    });
