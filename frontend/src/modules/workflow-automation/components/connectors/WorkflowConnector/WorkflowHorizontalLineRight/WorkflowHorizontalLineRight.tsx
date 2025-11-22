// @@ react
import * as React from 'react';

// @@ styles
import connectorStyles from '../WorkflowConnector.module.scss';
import styles from './WorkflowHorizontalLineRight.module.scss';


export default function WorkflowHorizontalLineRight(): React.ReactElement {

    return <div
        className={ [
            connectorStyles.connector,
            connectorStyles.line,
            connectorStyles.horizontalLine,
            styles.horizontalLineRight,
        ].join(' ' ) }
    />;
}