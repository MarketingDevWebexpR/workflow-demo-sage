import React from 'react';
import { ChevronRight } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { cn } from '../../../../../lib/utils';
import styles from './polygon-sidebar-landing-view.module.scss';
import { useWorkflowAutomationStore } from '../../../../../modules/workflow-automation/store/workflow-automation.store';

type TPolygonSidebarLandingViewProps = {
    onNavigate: (viewIndex: number) => void;
}

const PolygonSidebarLandingView = ({}: TPolygonSidebarLandingViewProps): React.ReactElement => {

    const location = useLocation();
    const navigate = useNavigate();
    
    // Récupérer les workflows depuis le store
    const allWorkflows = useWorkflowAutomationStore(s => s.workflowItem.processedData);
    const isLoading = false; // TODO: Ajouter un vrai état de chargement dans le store

    return <div className={styles.polygonSidebarLandingView}>
        
        

        {/* Section Workflows */}
        <div className={styles.polygonSidebarLandingViewContent}>

            {/* Liste des workflows */}
            <div className={styles.polygonSidebarLandingViewSection}>
                <div className={styles.polygonSidebarLandingViewSectionHeader}>
                    Workflows
                </div>

                {isLoading ? (
                    // Loading state
                    <div className={styles.polygonSidebarLandingViewLoading}>
                        {Array.from({ length: 3 }).map((_, index) => (
                            <div
                                key={`loading-${index}`}
                                className={styles.polygonSidebarLandingViewWorkflowItem}
                                data-loading="true"
                            >
                                <span className={styles.polygonSidebarLandingViewWorkflowItemTitle}>
                                    Loading...
                                </span>
                                <ChevronRight size={16} />
                            </div>
                        ))}
                    </div>
                ) : allWorkflows.length === 0 ? (
                    // Empty state
                    <div className={styles.polygonSidebarLandingViewEmpty}>
                        <p>No workflows yet</p>
                        <p className={styles.polygonSidebarLandingViewEmptyDescription}>
                            Create your first workflow to get started
                        </p>
                    </div>
                ) : (
                    // Liste des workflows
                    <div className={styles.polygonSidebarLandingViewWorkflowsList}>
                        {allWorkflows.map((workflow) => (
                            <div
                                key={workflow.Id}
                                className={cn(
                                    styles.polygonSidebarLandingViewWorkflowItem,
                                    location.pathname === `/workflow/${workflow.Id}` && 
                                    styles.polygonSidebarLandingViewWorkflowItemActive
                                )}
                                onClick={() => navigate(`/workflow/${workflow.Id}`)}
                            >
                                <span className={styles.polygonSidebarLandingViewWorkflowItemTitle}>
                                    {workflow.Title}
                                </span>
                                <ChevronRight size={16} />
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    </div>;
};


export {
    PolygonSidebarLandingView,
};

