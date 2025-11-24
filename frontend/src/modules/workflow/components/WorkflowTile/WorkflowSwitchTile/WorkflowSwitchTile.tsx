import * as React from 'react';

import styles from './WorkflowSwitchTile.module.scss';
import workflowTileStyles from '../WorkflowTile.module.scss';
import { placeholderOptions, getCategoryColor, getCategoryBorderColor } from '../../../data/workflow-placeholder-options';
import { type TMapPoint } from '../../../useCases/mapEngine/mapEngineParts_02_01_2024_test/calcMapPoints';
import WorkflowSwitch from '../../../models/workflow/elements/WorkflowSwitch.model';
import WorkflowElementContextMenu from '../WorkflowElementContextMenu/WorkflowElementContextMenu';
import { useWorkflowElementActions } from '../../../hooks/use-workflow-element-actions';
import { WorkflowSelectionContext } from '../../workflow-root/WorkflowRoot';


export default function WorkflowSwitchTile( props: TMapPoint) {
    const switchItem = props.item as WorkflowSwitch;
    const { setSelectedElement } = React.useContext(WorkflowSelectionContext);

    // Hook personnalisé pour toutes les actions contextuelles
    const { handleInsertBefore, handleDelete } = useWorkflowElementActions(switchItem.id, 'condition');

    // Trouver l'option correspondante pour récupérer l'icône et la catégorie via optionId
    const switchOption = placeholderOptions.find(opt => opt.id === switchItem.optionId);
    const Icon = switchOption?.Icon;
    const categoryColor = switchOption?.category ? getCategoryColor(switchOption.category) : 'var(--primary-color-500)';
    const categoryBorderColor = switchOption?.category ? getCategoryBorderColor(switchOption.category) : 'var(--primary-color-500)';

    const handleClick = () => {
        setSelectedElement(switchItem);
    };

    return (
        <WorkflowElementContextMenu
            onInsertBefore={handleInsertBefore}
            onDelete={handleDelete}
        >
            <div
                className={ [
                    workflowTileStyles.commonItem,
                    styles.workflowSwitchTile,
                ].join(' ') }
                data-id={ switchItem.id }
                style={{
                    '--workflow-category-color': categoryColor,
                    '--workflow-category-border-color': categoryBorderColor,
                } as React.CSSProperties}
                onClick={handleClick}
            >
                {Icon && <Icon size={16} className={styles.switchIcon} />}
                {switchItem?.title}
            </div>
        </WorkflowElementContextMenu>
    );
}
