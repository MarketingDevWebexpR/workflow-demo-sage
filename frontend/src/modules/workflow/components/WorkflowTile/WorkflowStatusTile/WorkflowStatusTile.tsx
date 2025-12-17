import styles from './WorkflowStatusTile.module.scss';
import workflowTileStyles from '../WorkflowTile.module.scss';


export default function WorkflowStatusTile( props: any) {

    return <div
        className={ [
            workflowTileStyles.commonItem,
            styles.workflowStatusTile,
        ].join(' ') }
        data-id={ props.id }
    >
        <div>{ props.title }</div>
    </div>;
}