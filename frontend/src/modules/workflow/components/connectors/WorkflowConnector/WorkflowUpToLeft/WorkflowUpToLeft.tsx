// @@ react
import * as React from 'react';

// @@ styles
import connectorStyles from '../WorkflowConnector.module.scss';
import styles from './WorkflowUpToLeft.module.scss';


export default function WorkflowUpToLeft(): React.ReactElement {

    return <div
        className={ [
            connectorStyles.connector,
            connectorStyles.halfBorderedSquare,
            styles.upToLeft,
        ].join(' ' ) }
    />;
}