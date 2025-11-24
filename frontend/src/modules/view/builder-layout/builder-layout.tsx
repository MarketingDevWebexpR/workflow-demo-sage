import React, { useRef } from "react";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "../../../components/ui/resizable-panel/resizable-panel";
import builderPageStyles from "../builder.page.module.scss";
import pageEditorStyles from "../page-editor/page-editor.module.scss";
import useScaleToFitParent from "../../../hooks/use-scale-to-fit-parent" ;
import { cn } from "../../../lib/utils";
import styles from "./builder-layout.module.scss";
import { SiteTree } from "../site-tree/site-tree";
import ContextContainer from "../context-container/context-container";


type TBuilderLayoutProps = {
    Page: React.FunctionComponent<React.HTMLAttributes<HTMLDivElement>>
    className?: string;
}

export function BuilderLayout({
    Page,
}: TBuilderLayoutProps): React.ReactElement {

    const pageRendererRef = useRef<HTMLDivElement>(null);

    useScaleToFitParent(pageRendererRef);


    return <div className={cn(builderPageStyles.builderPage, styles.builderLayoutPage ) } data-builder-layout-page>

        {/* Conteneur principal */}
        <div className={builderPageStyles.builderMainContainer}>

            {/* Contenu principal */}
            <div className={builderPageStyles.builderMainContent}>

                {/* Zone de l'éditeur et de l'encart dynamique de droite */}
                <div className={builderPageStyles.builderMainContentInner}>
                    <div className={builderPageStyles.builderPanelGroups}>

                        <ResizablePanelGroup direction="horizontal">
                            <ResizablePanel
                                className={builderPageStyles.builderPanelLeft}
                                data-builder-layout-panel-left
                                style={{
                                    transform: "translateX(-100%)",
                                    transition: "transform 600ms ease-in-out",
                                }}
                                minSize={20}
                                defaultSize={20}
                            >
                                <SiteTree />
                            </ResizablePanel>
                            <ResizableHandle />
                            <ResizablePanel
                                className={builderPageStyles.builderPanelMiddle}
                                minSize={20}
                                defaultSize={55}
                                data-builder-layout-panel-middle
                            >
                                <div
                                    className={pageEditorStyles.pageEditor}
                                    data-page-editor
                                >
                                    <div
                                    style={{
                                        // width: '100vw',
                                        // transform: 'scale( var(--scale-value) )',
                                        // transformOrigin: 'left',
                                    }}
                                    ref={pageRendererRef}
                                    data-page-renderer
                                    >
                                    <Page style={{
                                        // width: 'calc( 100vw - var(--scale-value-border-offset, 0px))',
                                        // transform: 'scale( var(--scale-value) )'
                                    }} />
                                    </div>
                                </div>
                            </ResizablePanel>
                            <ResizableHandle className={builderPageStyles.builderPanelResizableHandle} />
                            <ResizablePanel
                                className={builderPageStyles.builderPanelRight}
                                style={{
                                    transform: "translateX(100%)",
                                    transition: "transform 600ms ease-in-out",
                                }}
                                minSize={20}
                                defaultSize={25}
                                data-builder-layout-panel-right
                            >
                                <ContextContainer />

                            </ResizablePanel>
                        </ResizablePanelGroup>

                    </div>
                </div>
            </div>
        </div>
    </div>;
}