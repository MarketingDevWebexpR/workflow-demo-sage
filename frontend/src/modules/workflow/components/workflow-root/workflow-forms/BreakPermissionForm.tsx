import React from 'react';
import { Label } from '../../../../../components/ui/form/label/label';
import { Switch } from '../../../../../components/ui/form/base-fields/switch/switch';
import styles from './BreakPermissionForm.module.scss';

export const BreakPermissionForm: React.FC = () => {
    return (
        <div className={styles.breakPermissionForm}>
            <div className={styles.toggle}>
                <div className={styles.toggleInfo}>
                    <Label>Copy role assignments</Label>
                    <span className={styles.toggleDescription}>
                        Copy role assignments to the new item
                    </span>
                </div>
                <Switch defaultChecked />
            </div>

            <div className={styles.toggle}>
                <div className={styles.toggleInfo}>
                    <Label>Clear subscopes</Label>
                    <span className={styles.toggleDescription}>
                        Clear subscopes from the new item
                    </span>
                </div>
                <Switch />
            </div>
        </div>
    );
};

