import React from 'react';
import { Label } from '../../../../../components/ui/form/label/label';
import { Input } from '../../../../../components/ui/form/base-fields/input/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../../../components/ui/form/base-fields/select/select';
import styles from './IfConditionForm.module.scss';


export const IfConditionForm: React.FC = () => {

    return (
        <div className={styles.ifConditionForm}>
            <div className={styles.field}>
                <Label>Field to compare</Label>
                <Select defaultValue="title">
                    <SelectTrigger>
                        <SelectValue placeholder="Select field" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="title">Title</SelectItem>
                        <SelectItem value="status">Status</SelectItem>
                        <SelectItem value="created">Created</SelectItem>
                        <SelectItem value="modified">Modified</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <div className={styles.field}>
                <Label>Operator</Label>
                <Select defaultValue="equals">
                    <SelectTrigger>
                        <SelectValue placeholder="Select operator" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="equals">Equals</SelectItem>
                        <SelectItem value="not-equals">Not equals</SelectItem>
                        <SelectItem value="contains">Contains</SelectItem>
                        <SelectItem value="starts-with">Starts with</SelectItem>
                        <SelectItem value="ends-with">Ends with</SelectItem>
                        <SelectItem value="greater-than">Greater than</SelectItem>
                        <SelectItem value="less-than">Less than</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <div className={styles.field}>
                <Label>Value to compare</Label>
                <Input placeholder="Enter value" />
            </div>
        </div>
    );
};

