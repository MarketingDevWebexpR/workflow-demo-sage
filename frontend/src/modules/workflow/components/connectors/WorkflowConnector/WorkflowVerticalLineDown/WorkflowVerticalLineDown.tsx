// @@ react
import * as React from 'react';

// @@ styles
import styles from './WorkflowVerticalLineDown.module.scss';
import connectorStyles from '../WorkflowConnector.module.scss';


export default function WorkflowVerticalLineDown(): React.ReactElement {

    return <div
        className={ [
            connectorStyles.connector,
            connectorStyles.line,
            connectorStyles.verticalLine,
            styles.verticalLineDown
        ].join(' ') }
    />;
}