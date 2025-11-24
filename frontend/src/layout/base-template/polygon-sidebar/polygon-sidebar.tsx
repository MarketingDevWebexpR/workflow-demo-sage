import React, { useEffect, useState, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { PolygonSidebarSlider, sidebarViews } from './polygon-sidebar-slider/polygon-sidebar-slider';
import styles from './polygon-sidebar.module.scss';


export const PolygonSidebar = (): React.ReactElement => {

    const navigate = useNavigate();
    const location = useLocation();
    const [currentViewIndex, setCurrentViewIndex] = useState(0);
    const [prevViewIndex, setPrevViewIndex] = useState(0);
    const previousViewIndexRef = useRef(0);
    const view0PathRef = useRef('');

    useEffect(() => {
        // Déterminer l'index de la vue en fonction du pathname
        const pathname = location.pathname;
        let newViewIndex = 0;

        // Si on est sur une page IHM (/workflow/:workflowId/:stepId/ihm)
        if (pathname.match(/^\/workflow\/[^/]+\/[^/]+\/ihm$/)) {
            newViewIndex = 2; // Vue IHM
        }
        // Si on est sur une page de workflow designer (/workflow/:id)
        else if (pathname.match(/^\/workflow\/[^/]+$/)) {
            newViewIndex = 1; // Vue designer avec AI panel
        } 
        // Sinon page d'accueil
        else {
            newViewIndex = 0; // Vue landing avec Home + Workflows
        }

        if (newViewIndex !== previousViewIndexRef.current) {
            setPrevViewIndex(previousViewIndexRef.current);
            setCurrentViewIndex(newViewIndex);
            previousViewIndexRef.current = newViewIndex;
        }
    }, [location.pathname]);

    const handleNavigate = (viewIndex: number) => {

        if (currentViewIndex === 0) {
            view0PathRef.current = location.pathname;
        }

        if (viewIndex === 0) {
            navigate(view0PathRef.current || '/');
        } else {
            const targetView = sidebarViews[viewIndex];
            if (targetView) {
                navigate(targetView.path);
            }
        }
    };

    return (
        <div className={styles.polygonSidebar}>
            <PolygonSidebarSlider
                currentViewIndex={currentViewIndex}
                prevViewIndex={prevViewIndex}
                onNavigate={handleNavigate}
            />
        </div>
    );
};

