import React from 'react';
import WorkflowAction from '../../../models/workflow/elements/WorkflowAction.model';
import WorkflowSwitch from '../../../models/workflow/elements/WorkflowSwitch.model';
import { IfConditionForm } from './IfConditionForm';
import { ListSelectionForm } from './ListSelectionForm';
import { ItemSelectionForm } from './ItemSelectionForm';
import { BreakPermissionForm } from './BreakPermissionForm';
import styles from './WorkflowOptionsRenderer.module.scss';


interface IWorkflowOptionsRendererProps {
    element: WorkflowAction<any, any, any> | WorkflowSwitch;
}

export const WorkflowOptionsRenderer: React.FC<IWorkflowOptionsRendererProps> = ({ element }) => {
    const optionId = (element as any).optionId;

    // Switch statements (conditions)
    if (optionId === 'SWITCH_IF' || optionId === 'SWITCH_SPLIT') {
        return <IfConditionForm />;
    }

    // Actions
    switch (optionId) {
        case 'ACTION_BREAK_PERMISSION_INHERITANCE':
            return <BreakPermissionForm />;

        case 'ACTION_GET_LIST':
        case 'ACTION_GET_LIST_ITEMS':
            return <ListSelectionForm />;

        case 'ACTION_GET_ITEM':
        case 'ACTION_UPDATE_ITEM':
        case 'ACTION_DELETE_ITEM':
            return <ItemSelectionForm />;

        default:
            return (
                <div className={styles.defaultMessage}>
                    Default message not implemented yet.
                </div>
            );
    }
};

