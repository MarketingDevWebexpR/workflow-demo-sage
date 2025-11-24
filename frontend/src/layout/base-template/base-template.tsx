import { Main } from './main/main';
import React, { useContext, type DragEvent, useEffect, } from 'react';
import { useLocation } from 'react-router-dom';
import { cn } from '../../lib/utils';
import styles from './base-template.module.scss';
import { DragContext } from '../../providers/drag.context';
import { fonts } from '../../style/fonts/fonts';
import { PolygonHeader } from './polygon-header/header';
import { PolygonSidebar } from './polygon-sidebar/polygon-sidebar';



interface IRootComponentProps {
    children: React.ReactNode,
}

const BaseTemplate = ({
    children,
}: IRootComponentProps): React.ReactElement => {

    const { setIsDraggingFile } = useContext(DragContext);

    const location = useLocation();

    useEffect(() => {

        // A chaque changement de route, on remonte en haut de la page
        const main = document.querySelector('main');

        if (main) {
            main.scrollTop = 0;
        }
    }, [location.pathname]);

    function onDragEnter(e: DragEvent) {
        e.preventDefault();
        setIsDraggingFile(true);
    }

    function onDragLeave(e: DragEvent) {
        e.preventDefault();
        if (e.relatedTarget === null) {
            setIsDraggingFile(false);
        }
    }

    function onDrop(e: DragEvent) {
        e.preventDefault();
        setIsDraggingFile(false);
    }

    return <div
        id="app"
        className={cn(
            styles.app,
            fonts.roboto.standard,
            fonts.ubuntu.brand,
        )}
        onDragEnter={onDragEnter}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
    >
        <PolygonHeader />

        <div className={styles.appContent}>
            <PolygonSidebar />
            <Main>{children}</Main>
        </div>
    </div>;
};


export {
    BaseTemplate,
};
