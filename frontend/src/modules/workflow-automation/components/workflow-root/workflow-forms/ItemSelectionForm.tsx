import React from 'react';
import { Label } from '../../../../../components/ui/form/label/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../../../components/ui/form/base-fields/select/select';
import { Input } from '../../../../../components/ui/form/base-fields/input/input';
import styles from './ItemSelectionForm.module.scss';


export const ItemSelectionForm: React.FC = () => {

    return (
        <div className={styles.itemSelectionForm}>
            <div className={styles.field}>
                <Label>List</Label>
                <Select defaultValue="">
                    <SelectTrigger>
                        <SelectValue placeholder="Choose list" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="documents">Documents</SelectItem>
                        <SelectItem value="tasks">Tasks</SelectItem>
                        <SelectItem value="issues">Issues</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <div className={styles.field}>
                <Label>Item ID</Label>
                <Input type="number" placeholder="Enter item ID" defaultValue="1" />
            </div>
        </div>
    );
};

