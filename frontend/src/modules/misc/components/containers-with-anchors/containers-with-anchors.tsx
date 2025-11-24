import React, { useRef, useEffect, useImperativeHandle, useState } from "react";
import { z } from "zod";
import { PageRenderer } from "../../../view/page-editor/page-renderer/page-renderer";
import { cn } from "../../../../lib/utils";
import { type TPageComponent } from "../../../view/models/page.model";
import { getObjectFromStringifiedJson } from "../../../../utils/json.utils";
import { appLaunchTimestamp } from "../../../../utils/number.utils";
import { v4 as uuidv4 } from 'uuid';
import { ArrowRight } from "lucide-react";
import styles from './containers-with-anchors.module.scss';


const ContainersWithAnchorsPropsSchema = z.object({
    titles: z.array(
        z.object({
            id: z.string(),
            title: z.string(),
        })
    ),
});

type TContainersWithAnchorsProps = z.infer<typeof ContainersWithAnchorsPropsSchema>

function getLayerIds(pageComponent: TPageComponent): { [key: string]: { id: string, title: string } } {

    const props = pageComponent.props as TContainersWithAnchorsProps;

    return {
        ...props?.titles?.reduce((acc, title) => {
            acc[`${pageComponent.id}.props.titles.${title.id}.components`] = {
                id: `${pageComponent.id}.props.titles.${title.id}.components`,
                title: title.title
            };
            return acc;
        }, {} as { [key: string]: { id: string, title: string } }) ?? {},
        belowAnchorsContainer: {
            id: `${pageComponent.id}.props.belowAnchorsContainer`,
            title: 'Sous les ancres',
        },
    };
}

function getDefaultProps(): TContainersWithAnchorsProps {
    return {
        titles: [
            {
                id: `${appLaunchTimestamp}-${uuidv4()}`,
                title: 'Titre 1',
            },
            {
                id: `${appLaunchTimestamp}-${uuidv4()}`,
                title: 'Titre 2',
            },
            {
                id: `${appLaunchTimestamp}-${uuidv4()}`,
                title: 'Titre 3',
            },
        ],
    };
}

const ContainersWithAnchors = React.forwardRef<HTMLDivElement, TContainersWithAnchorsProps & React.HTMLAttributes<HTMLDivElement>>(
    ({ titles = [], className, ...props }, ref) => {

        const component = {
            id: props['data-page-component-id' as keyof typeof props],
            props: getObjectFromStringifiedJson<TContainersWithAnchorsProps | undefined>(props['data-page-component-props' as keyof typeof props])
        } as TPageComponent;

        const [isMobile, setIsMobile] = useState(false);
        const savedParentWidthAtBreakpointRef = useRef(0);
        const [isAnchorsFixed, setIsAnchorsFixed] = useState(false);
        const [areContainersVisible, setAreContainersVisible] = useState(true);

        const layerIds = getLayerIds(component);

        const localRef = useRef<HTMLDivElement>(null);
        const anchorRefs = useRef<HTMLDivElement>(null);
        const containersRef = useRef<HTMLDivElement>(null);

        console.log({ isAnchorsFixed });

        useImperativeHandle(ref, () => localRef.current as HTMLDivElement);

        useEffect(() => {

            if (!localRef.current)
                return;

            const onResize = () => {

                if (!anchorRefs.current || !containersRef.current || !localRef.current)
                    return;

                const localClientWidth = localRef.current.clientWidth;

                const delta = localClientWidth - containersRef.current.scrollWidth - anchorRefs.current.scrollWidth - parseInt(window.getComputedStyle(localRef.current).gap);

                const shouldGoMobile = !isMobile && delta < 0;

                const shouldGoDesktop = isMobile && savedParentWidthAtBreakpointRef.current && localClientWidth >= savedParentWidthAtBreakpointRef.current;

                if (shouldGoDesktop) {
                    savedParentWidthAtBreakpointRef.current = 0;
                    setIsMobile(false);
                    disconnect();
                } else if (shouldGoMobile) {
                    savedParentWidthAtBreakpointRef.current = localClientWidth - delta;
                    setIsMobile(true);
                    disconnect();
                }
            };
            const resizeObserver = new ResizeObserver(onResize);
            resizeObserver.observe(localRef.current);

            function disconnect() {
                resizeObserver.disconnect();
            }

            return () => {
                resizeObserver.disconnect();
            };
        }, [isMobile,]);

        useEffect(() => {
            if (!localRef.current || !anchorRefs.current || !containersRef.current)
                return;

            const anchorsObserver = new IntersectionObserver(
                ([entry]) => {
                    if (!entry.isIntersecting && areContainersVisible) {
                        setIsAnchorsFixed(true);
                    } else {
                        setIsAnchorsFixed(false);
                    }
                },
                {
                    threshold: 0,
                    rootMargin: '-100px 0px 0px 0px'
                }
            );

            const containersObserver = new IntersectionObserver(
                ([entry]) => {
                    setAreContainersVisible(entry.isIntersecting);
                },
                {
                    threshold: 0
                }
            );

            anchorsObserver.observe(anchorRefs.current);
            containersObserver.observe(containersRef.current);

            return () => {
                anchorsObserver.disconnect();
                containersObserver.disconnect();
            };
        }, [areContainersVisible]);

        return <div
            ref={localRef}
            className={cn(
                styles.containersWithAnchors,
                className,
                isMobile && styles.containersWithAnchorsMobile,
            )}
            {...props}
        >
            <div
                ref={anchorRefs}
            >
                {/* Partie desktop (sticky) */}
                <div
                    className={cn(
                        styles.leftContentDesktop,
                        isMobile && styles.masked,
                    )}
                    data-desktop
                >
                    <div
                        className={styles.leftContentDesktopInner}
                    >
                        {
                            titles.map(title => {

                                return <div
                                    key={`anchor-${title.id}`}
                                    className={styles.anchor}
                                    onClick={() => {
                                        const anchor = document.querySelector(`[data-anchor-id="${title.id}"]`);

                                        if (anchor) {
                                            anchor.scrollIntoView({
                                                behavior: 'smooth',
                                                block: 'start',
                                            });
                                        }
                                    }}
                                >
                                    {title.title}
                                    <ArrowRight size={16} className={styles.anchorArrow} />
                                </div>
                            })
                        }
                    </div>
                    <PageRenderer
                        layerId={layerIds.belowAnchorsContainer.id}
                        layerTitle={layerIds.belowAnchorsContainer.title}
                    />
                </div>

                {/* Partie mobile (fixée au-dessus des conteneurs) */}
                <div
                    className={cn(
                        styles.leftContentMobile,
                        !isMobile && styles.masked,
                    )}
                    data-mobile
                >
                    {
                        titles.map(title => {

                            return <div
                                key={`anchor-${title.id}`}
                                className={styles.anchorMobile}
                                onClick={() => {
                                    const anchor = document.querySelector(`[data-anchor-id="${title.id}"]`);

                                    if (anchor) {
                                        anchor.scrollIntoView({
                                            behavior: 'smooth',
                                            block: 'start',
                                        });
                                    }
                                }}
                            >
                                {title.title}
                            </div>
                        })
                    }
                </div>

                {/* Partie mobile (fixée en bas de l'écran, quand on scrolle et que la partie du dessus devient invisible) */}
                <div
                    className={cn(
                        styles.leftContentMobileFixedAtBottom,
                        !isMobile && styles.masked,
                        isAnchorsFixed && styles.leftContentMobileFixedAtBottomRevealed,
                    )}
                    data-mobile
                >
                    {
                        titles.map(title => {

                            return <div
                                key={`anchor-${title.id}`}
                                className={styles.anchorMobileFixedAtBottom}
                                onClick={() => {
                                    const anchor = document.querySelector(`[data-anchor-id="${title.id}"]`);

                                    if (anchor) {
                                        anchor.scrollIntoView({
                                            behavior: 'smooth',
                                            block: 'start',
                                        });
                                    }
                                }}
                            >
                                {title.title}
                            </div>
                        })
                    }
                </div>
            </div>

            <div
                ref={containersRef}
                className={cn(
                    styles.rightContainer,
                    !isMobile && styles.rightContainerDesktop,
                )}
            >
                {
                    titles.map(title => {

                        return <div
                            key={`page-renderer-${title.id}`}
                            className={styles.rightContainerElement}
                            data-anchor-id={title.id}
                        >
                            <PageRenderer
                                layerId={layerIds[`${component.id}.props.titles.${title.id}.components`]?.id}
                                layerTitle={layerIds[`${component.id}.props.titles.${title.id}.components`]?.title}
                            />
                        </div>;
                    })
                }
            </div>
        </div>
    }
);

ContainersWithAnchors.displayName = 'ContainersWithAnchors';


export {
    ContainersWithAnchors,
    getDefaultProps,
    ContainersWithAnchorsPropsSchema,
    type TContainersWithAnchorsProps,
    getLayerIds,
};