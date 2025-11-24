
// @@ models
import WorkflowItem, { type IWorkflowItemData } from '../WorkflowItem.model';


export interface IWorkflowBoundaryData {
    triggerType?: string; // ID du trigger (ex: 'TRIGGER_ITEM_CREATED')
    isStart?: boolean; // true = boundary de début, false/undefined = boundary de fin
}

export type TWorkflowBoundaryData = IWorkflowItemData & IWorkflowBoundaryData;

export default class WorkflowBoundary extends WorkflowItem {
    static __name = 'WorkflowBoundary';

    public triggerType?: string;
    public isStart?: boolean;

    constructor( props: TWorkflowBoundaryData ) {

        super( props );
        this.triggerType = props.triggerType;
        this.isStart = props.isStart;
    }
}

Object.defineProperty( window, 'WorkflowBoundary', { value: WorkflowBoundary });

