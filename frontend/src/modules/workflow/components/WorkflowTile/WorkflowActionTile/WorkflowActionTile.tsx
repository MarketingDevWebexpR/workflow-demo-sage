import * as React from 'react';

import styles from './WorkflowActionTile.module.scss';
import workflowTileStyles from '../WorkflowTile.module.scss';
import { placeholderOptions, getCategoryColor, getCategoryBorderColor } from '../../../data/workflow-placeholder-options';
import { type TMapPoint } from '../../../useCases/mapEngine/mapEngineParts_02_01_2024_test/calcMapPoints';
import WorkflowAction from '../../../models/workflow/elements/WorkflowAction.model';
import WorkflowElementContextMenu from '../WorkflowElementContextMenu/WorkflowElementContextMenu';
import { useWorkflowElementActions } from '../../../hooks/use-workflow-element-actions';
import { WorkflowSelectionContext } from '../../workflow-root/WorkflowRoot';
import { useNavigate, useParams } from 'react-router-dom';
import { paths } from '../../../../../layout/router.constants';


export default function WorkflowActionTile(props: TMapPoint) {
    const action = props.item as WorkflowAction<any, any, any>;
    const { setSelectedElement } = React.useContext(WorkflowSelectionContext);

    // Hook personnalisé pour toutes les actions contextuelles
    const { handleInsertBefore, handleDelete } = useWorkflowElementActions(action.id, 'action');

    // Trouver l'option correspondante pour récupérer l'icône et la catégorie via optionId
    const actionOption = placeholderOptions.find(opt => opt.id === action.optionId);
    const Icon = actionOption?.Icon;
    const categoryColor = actionOption?.category ? getCategoryColor(actionOption.category) : 'var(--primary-color-500)';
    const categoryBorderColor = actionOption?.category ? getCategoryBorderColor(actionOption.category) : 'var(--primary-color-500)';

    const {workflowId} = useParams();

    const navigate = useNavigate();

    const handleClick = () => {

        if( action.optionId === 'ACTION_UI_CUSTOM_AI') {

            navigate(paths.workflowIhm.replace(':workflowId', workflowId || '').replace(':stepId', action.id)  ) ;
            return;
        }
        setSelectedElement(action);
    };

    return (
        <WorkflowElementContextMenu
            onInsertBefore={handleInsertBefore}
            onDelete={handleDelete}
        >
            <div
                className={ [
                    workflowTileStyles.commonItem,
                    styles.workflowActionTile,
                ].join(' ') }
                data-id={ props.item.id }
                style={{
                    '--workflow-category-color': categoryColor,
                    '--workflow-category-border-color': categoryBorderColor,
                } as React.CSSProperties}
                onClick={handleClick}
            >
                {Icon && <Icon size={16} className={styles.actionIcon} />}
                {action.title}
            </div>
        </WorkflowElementContextMenu>
    );
}
