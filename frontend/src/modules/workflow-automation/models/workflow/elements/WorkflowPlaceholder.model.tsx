
// @@ models
import WorkflowItem, { type IWorkflowItemData } from '../WorkflowItem.model';


export interface IWorkflowPlaceholderData {}

export type TWorkflowPlaceholderData = IWorkflowItemData & IWorkflowPlaceholderData;

export default class WorkflowPlaceholder extends WorkflowItem {

    static __name = 'WorkflowPlaceholder';

    constructor( props: TWorkflowPlaceholderData ) {

        super( props );
    }
}

Object.defineProperty( window, 'WorkflowPlaceholder', { value: WorkflowPlaceholder });

