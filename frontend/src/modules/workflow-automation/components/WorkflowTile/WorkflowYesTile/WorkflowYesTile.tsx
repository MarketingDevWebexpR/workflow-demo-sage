import * as React from 'react';

import styles from './WorkflowYesTile.module.scss';
import workflowTileStyles from '../WorkflowTile.module.scss';
import { type TMapPoint } from '../../../useCases/mapEngine/mapEngineParts_02_01_2024_test/calcMapPoints';
import { Check } from 'lucide-react';


export default function WorkflowYesTile( _props: TMapPoint ): React.ReactElement {

    return <div
        className={ [
            workflowTileStyles.commonItem,
            styles.workflowYesTile,
        ].join(' ') }
    >
        <div><Check className={styles.workflowYesTileCheckIcon} />Yes</div>
    </div>;
}
