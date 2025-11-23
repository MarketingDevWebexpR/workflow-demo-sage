import React from 'react';
import styles from './polygon-sidebar-ihm-view.module.scss';


type TPolygonSidebarIhmViewProps = {
    onNavigate: (viewIndex: number) => void;
}

const PolygonSidebarIhmView = ({}: TPolygonSidebarIhmViewProps): React.ReactElement => {

    return <div className={styles.polygonSidebarIhmView}>
        <div className={styles.polygonSidebarIhmViewContent}>
            <h2>Hello World</h2>
            <p>Vue IHM - Sidebar</p>
        </div>
    </div>;
};


export {
    PolygonSidebarIhmView,
};

