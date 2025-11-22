import React from 'react';
import { Label } from '../../../../../components/ui/form/label/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../../../components/ui/form/base-fields/select/select';
import styles from './ListSelectionForm.module.scss';


export const ListSelectionForm: React.FC = () => {

    return (
        <div className={styles.listSelectionForm}>
            <div className={styles.field}>
                <Label>List selection</Label>
                <Select defaultValue="">
                    <SelectTrigger>
                        <SelectValue placeholder="Select a list" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="documents">Documents</SelectItem>
                        <SelectItem value="tasks">Tasks</SelectItem>
                        <SelectItem value="issues">Issues</SelectItem>
                        <SelectItem value="announcements">Announcements</SelectItem>
                        <SelectItem value="contacts">Contacts</SelectItem>
                    </SelectContent>
                </Select>
            </div>
        </div>
    );
};

