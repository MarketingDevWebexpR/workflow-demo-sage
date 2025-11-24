import React from 'react';
import styles from './selected-component.module.scss';
import ComponentDetails from '../../../../../../modules/view/context-container/component-details/component-details';

const SelectedComponent = (): React.ReactElement => {
    return (
        <div className={styles.selectedComponent}>
            <ComponentDetails />
        </div>
    );
};

export { SelectedComponent };

