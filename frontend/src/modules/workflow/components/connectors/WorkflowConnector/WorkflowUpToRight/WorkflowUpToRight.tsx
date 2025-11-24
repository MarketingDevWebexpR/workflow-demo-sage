// @@ react
import * as React from 'react';

// @@ styles
import connectorStyles from '../WorkflowConnector.module.scss'; 
import styles from './WorkflowUpToRight.module.scss';


export default function WorkflowUpToRight(): React.ReactElement {

    return <div
        className={ [
            connectorStyles.connector,
            connectorStyles.halfBorderedSquare,
            styles.upToRight,
        ].join(' ' ) }
    />;
}