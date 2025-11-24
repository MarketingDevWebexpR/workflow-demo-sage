import styles from './WorkflowNoTile.module.scss';
import workflowTileStyles from '../WorkflowTile.module.scss';
import {  X } from 'lucide-react';


export default function WorkflowNoTile({
}: any) {

    return <div
        className={ [
            workflowTileStyles.commonItem,
            styles.workflowNoTile,
        ].join(' ') }
    >
        <div><X className={styles.workflowNoTileNoIcon} />No</div>
    </div>;
}
