import React from 'react';
import styles from './components-picker.module.scss';
import { ModulePicker } from '../../../../../../modules/view/context-container/module-picker/module-picker';

const ComponentsPicker = (): React.ReactElement => {
    return (
        <div className={styles.componentsPicker}>
            <ModulePicker />
        </div>
    );
};

export { ComponentsPicker };

