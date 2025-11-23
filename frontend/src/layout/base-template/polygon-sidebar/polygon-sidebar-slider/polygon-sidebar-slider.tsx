import React, { useEffect, useRef, useState } from 'react';
import { PolygonSidebarLandingView } from '../sidebars/polygon-sidebar-landing-view/polygon-sidebar-landing-view';
import { PolygonSidebarDesignerView } from '../sidebars/polygon-sidebar-designer-view/polygon-sidebar-designer-view';
import { PolygonSidebarIhmView } from '../sidebars/polygon-sidebar-ihm-view/polygon-sidebar-ihm-view';
import { paths } from '../../../router.constants';
import styles from './polygon-sidebar-slider.module.scss';


export type TISidebarView = {
    key: string;
    path: string;
}

export const sidebarViews: TISidebarView[] = [
    {
        key: 'landing',
        path: '/',
    },
    {
        key: 'designer',
        path: paths.workflowDesigner,
    },
    {
        key: 'ihm',
        path: paths.workflowIhm,
    },
];


type TPolygonSidebarSliderProps = {
    currentViewIndex: number;
    prevViewIndex: number;
    onNavigate: (viewIndex: number) => void;
}


const PolygonSidebarSlider = ({
    currentViewIndex,
    prevViewIndex,
    onNavigate,
}: TPolygonSidebarSliderProps): React.ReactElement => {

    const sliderRef = useRef<HTMLDivElement>(null);
    const extraRightShift = useRef(0);
    const extraLeftShift = useRef(0);
    const [offsetIndex, setOffsetIndex] = useState(0);

    useEffect(() => {
        if (!sliderRef.current) return;

        const viewsCount = sliderRef.current.children.length;
        const currentView: HTMLDivElement | null = sliderRef.current.querySelector(
            `[data-view-key="${sidebarViews[prevViewIndex]?.key}"]`
        );
        const desiredView: HTMLDivElement | null = sliderRef.current.querySelector(
            `[data-view-key="${sidebarViews[currentViewIndex]?.key}"]`
        );
        const otherViews: HTMLDivElement[] = Array.from(sliderRef.current.children).filter(view => {
            return view !== currentView && view !== desiredView;
        }) as HTMLDivElement[];

        if (currentViewIndex > prevViewIndex) {
            const updatedOffsetIndex = offsetIndex + 1;
            const shift = currentViewIndex - prevViewIndex;
            extraRightShift.current = extraRightShift.current + (shift - 1);
            extraLeftShift.current = extraLeftShift.current - (shift - 1);

            otherViews.forEach(view => {
                view.style.setProperty('left', `calc(1000% * ${viewsCount})`);
            });

            if (desiredView) {
                desiredView.style.setProperty('left', `calc(100% * -1 * ${extraRightShift.current})`);
            }

            setOffsetIndex(updatedOffsetIndex);
        } else if (currentViewIndex < prevViewIndex) {
            const updatedOffsetIndex = offsetIndex - 1;
            const shift = prevViewIndex - currentViewIndex;
            extraLeftShift.current = extraLeftShift.current + (shift - 1);
            extraRightShift.current = extraRightShift.current - (shift - 1);

            otherViews.forEach(view => {
                view.style.setProperty('left', `calc(1000% * ${viewsCount})`);
            });

            if (desiredView) {
                desiredView.style.setProperty('left', `calc(100% * ${extraLeftShift.current})`);
            }

            setOffsetIndex(updatedOffsetIndex);
        }
    }, [currentViewIndex, prevViewIndex]);

    const renderSidebar = (key: string) => {
        switch (key) {
            case 'landing':
                return <PolygonSidebarLandingView onNavigate={onNavigate} />;
            case 'designer':
                return <PolygonSidebarDesignerView onNavigate={onNavigate} />;
            case 'ihm':
                return <PolygonSidebarIhmView onNavigate={onNavigate} />;
            default:
                return null;
        }
    };

    return <div
        className={styles.polygonSidebarSlider}
        ref={sliderRef}
        style={{
            '--offset-index': offsetIndex,
        } as React.CSSProperties}
    >
        {sidebarViews.map(({ key }) => (
            <div
                key={`polygon-sidebar-view-${key}`}
                className={styles.polygonSidebarSliderView}
                data-view-key={key}
            >
                {renderSidebar(key)}
            </div>
        ))}
    </div>;
};


export {
    PolygonSidebarSlider,
};

