// @@ react
import * as React from 'react';

// @@ styles
import styles from './WorkflowVerticalLineUp.module.scss';
import connectorStyles from '../WorkflowConnector.module.scss';


export default function WorkflowVerticalLineUp(): React.ReactElement {

    return <div
        className={ [
            connectorStyles.connector,
            connectorStyles.line,
            connectorStyles.verticalLine,
            styles.verticalLineUp,
        ].join(' ') }
    />;
}