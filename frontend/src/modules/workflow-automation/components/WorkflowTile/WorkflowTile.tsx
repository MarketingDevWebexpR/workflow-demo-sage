// map engine parts
import { type TMapPoint } from '../../useCases/mapEngine/mapEngineParts_02_01_2024_test/calcMapPoints';

// @@ react
import * as React from 'react';

// @@ styles
import styles from './WorkflowTile.module.scss';


export type TWorkflowTile = TMapPoint & {
    children: React.ReactNode,
    isIncludedInFolderPath?: boolean,
}

export default function WorkflowTile({
    children,
    isIncludedInFolderPath,
    ...coord
}: TWorkflowTile ): React.ReactElement {

    const {
        x,
        y,
        item,
        isPointedAtTop,
        isPointedAtLeft,
        isPointedAtRight,
    } = coord;

    return <div
        className={ styles.workflowTile }
        data-id={ item?.id || (coord as any)?.id }
        data-type={ item?.type?.id || (coord as any)?.type }
        {
            ...isIncludedInFolderPath !== undefined ? {
                'data-included-in-folder-path': isIncludedInFolderPath,
            } : {}
        }
        style={{
            '--y': y,
            '--x': x,
        } as React.CSSProperties }
    >
        { isPointedAtTop ? <div className={ styles.isPointedAtTop } /> : '' }
        { isPointedAtLeft ? <div className={ styles.isPointedAtLeft } /> : '' }
        { isPointedAtRight ? <div className={ styles.isPointedAtRight } /> : '' }
        { children }
    </div>;
}
