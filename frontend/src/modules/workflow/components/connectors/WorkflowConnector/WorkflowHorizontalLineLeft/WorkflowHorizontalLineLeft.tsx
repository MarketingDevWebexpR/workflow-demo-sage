// @@ react
import * as React from 'react';

// @@ styles
import connectorStyles from '../WorkflowConnector.module.scss';
import styles from './WorkflowHorizontalLineLeft.module.scss';


export default function WorkflowHorizontalLineLeft(): React.ReactElement {

    return <div
        className={ [
            connectorStyles.connector,
            connectorStyles.line,
            connectorStyles.horizontalLine,
            styles.horizontalLineLeft,
        ].join(' ' ) }
    />;
}