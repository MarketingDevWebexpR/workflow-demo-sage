// @@ react
import * as React from 'react';

// @@ styles
import connectorStyles from '../WorkflowConnector.module.scss';
import styles from './WorkflowBottomToLeft.module.scss';


export default function WorkflowBottomToLeft(): React.ReactElement {

    return <div
        className={ [
            connectorStyles.connector,
            connectorStyles.halfBorderedSquare,
            styles.bottomToLeft,
        ].join(' ' ) }
    />;
}