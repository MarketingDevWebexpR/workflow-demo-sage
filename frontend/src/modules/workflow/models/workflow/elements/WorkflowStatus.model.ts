
// @@ models
import WorkflowItem, { type IWorkflowItemData } from '../WorkflowItem.model';


export interface IWorkflowStatusData {
    set?: ( ...args: unknown[] ) => Promise<unknown>,
    unset?: ( ...args: unknown[] ) => Promise<unknown>,
}

export type TWorkflowStatusData = IWorkflowItemData & IWorkflowStatusData;

export default class WorkflowStatus extends WorkflowItem {

    static __name = 'WorkflowStatus';

    constructor( props: TWorkflowStatusData ) {

        super( props );
    }
}

Object.defineProperty( window, 'WorkflowStatus', { value: WorkflowStatus });
