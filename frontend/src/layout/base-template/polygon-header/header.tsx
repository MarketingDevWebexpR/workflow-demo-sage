import React, { useEffect, useRef, useState } from "react";
import { Menu } from "./menu";
import styles from "./header.module.scss";
import { useNavigate } from "react-router-dom";
import webexprLogo from "../../../assets/img/webexpr-logo.png";
import { usePrefersColorThemeStore } from "../../../providers/prefers-color-theme/store";
import { HeaderMenuDropdown } from "./header-menu-dropdown/header-menu-dropdown";


const PolygonHeader = (): React.ReactElement => {

    const [isMobile, setIsMobile] = useState(false);

    const headerContainerRef = useRef<HTMLDivElement>(null);
    const headerStartRef = useRef<HTMLDivElement>(null);
    const headerEndRef = useRef<HTMLDivElement>(null);

    const navigate = useNavigate();

    const theme = usePrefersColorThemeStore((state) => state.value);
    const colorSchemeInSystemSettingsIsDark = usePrefersColorThemeStore((state) => state.colorSchemeInSystemSettingsIsDark);
    
    const isDark = theme === 'prefers-color-scheme-dark' || (
        theme === 'prefers-color-scheme-system' && colorSchemeInSystemSettingsIsDark
    );

    useEffect(() => {

        if (!headerContainerRef.current)
            return;

        const onResize = () => {

            if (!headerContainerRef.current || !headerStartRef.current || !headerEndRef.current)
                return;

            const headerContainerWidth = headerContainerRef.current.clientWidth;
            const headerStartScrollWidth = headerStartRef.current.scrollWidth;
            const headerEndScrollWidth = Array.from(headerEndRef.current.children)
                .filter(child => child.getAttribute('data-menu') === 'desktop')
                .reduce((acc, child) => acc + (child as HTMLElement).scrollWidth, 0);

            const usedWidth = headerContainerWidth - headerStartScrollWidth - headerEndScrollWidth;
            const isMobile = usedWidth < 0;

            setIsMobile(isMobile);
        };
        const resizeObserver = new ResizeObserver(onResize);
        resizeObserver.observe(headerContainerRef.current);

        return () => {
            resizeObserver.disconnect();
        };
    }, [isMobile]);

    return <header className={styles.header}>
        <div className={styles.polygonHeaderContainer}>
            <div
                className={styles.polygonLogoContainer}
                onClick={(e) => {
                    
                    if( e.target && (e.target as HTMLElement).closest(`[class*="Trigger"]`)) {
                        return;
                    }

                    console.log('clicked', e.target);
                    navigate('/');
                }}
                role="button"
                tabIndex={0}
                onKeyDown={e => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        navigate('/');
                    }
                }}
                title="Go to home"
            >
                <div className={styles.headerLogoFocusFix}>Focus fix</div>
                <div className={styles.headerLogoImgWrapper}>
                <img
                    src={webexprLogo}
                    onClick={() => navigate('/')}
                    className={`${styles.headerLogoImg} ${isDark ? styles.filterInvert : ''}`}
                    alt="WebExpr Logo"
                />
                </div>
                <HeaderMenuDropdown />
            </div>
        </div>
        <div className={styles.headerContainer}>
            <div
                ref={headerContainerRef}
                className={styles.headerContent}
            >
                <div
                    ref={headerStartRef}
                    className={styles.headerStart}
                >
                    {/* <div className={styles.polygonLogo}>
                        <div className={styles.polygonLogoP}>
                            <div className={styles.polygonLeftBar} />
                            <div className={styles.polygonRightBar} />
                            <div className={styles.polygonTopRightBar} />
                            <div className={styles.polygonTopLeftBar} />
                            <div className={styles.polygonBottomLeftBar} />
                            <div className={styles.polygonBottomRightBar} />
                            <div className={styles.polygonLeftBarLowerHalf} />
                        </div>

                        <div className={styles.polygonLogoO1}>
                            <div className={styles.polygonLeftBar} />
                            <div className={styles.polygonRightBar} />
                            <div className={styles.polygonTopRightBar} />
                            <div className={styles.polygonTopLeftBar} />
                            <div className={styles.polygonBottomLeftBar} />
                            <div className={styles.polygonBottomRightBar} />
                        </div>

                        <div className={styles.polygonLogoL}>
                            <div className={styles.polygonLLeftBar} />
                            <div className={styles.polygonBottomLeftBar} />
                        </div>

                        <div className={styles.polygonLogoY}>
                            <div className={styles.polygonYTopLeftBar} />
                            <div className={styles.polygonYTopRightBar} />
                            <div className={styles.polygonYCenterBar} />
                        </div>

                        <div className={styles.polygonLogoG}>
                            <div className={styles.polygonLeftBar} />
                            <div className={styles.polygonGRightBar} />
                            <div className={styles.polygonTopRightBar} />
                            <div className={styles.polygonTopLeftBar} />
                            <div className={styles.polygonBottomLeftBar} />
                            <div className={styles.polygonBottomRightBar} />
                        </div>

                        <div className={styles.polygonLogoO2}>
                            <div className={styles.polygonLeftBar} />
                            <div className={styles.polygonRightBar} />
                            <div className={styles.polygonTopRightBar} />
                            <div className={styles.polygonTopLeftBar} />
                            <div className={styles.polygonBottomLeftBar} />
                            <div className={styles.polygonBottomRightBar} />
                        </div>

                        <div className={styles.polygonLogoN}>
                            <div className={styles.polygonNLeftBar} />
                            <div className={styles.polygonNRightBar} />
                            <div className={styles.polygonFullDiagonalBar} />
                        </div>
                    </div> */}
                </div>

                <nav
                    ref={headerEndRef}
                    className={styles.headerEnd}
                    aria-label="Navigation principale"
                >
                    <Menu
                        isMobile={isMobile}
                    />
                </nav>
            </div>
        </div>
    </header>;
};


export {
    PolygonHeader,
};
