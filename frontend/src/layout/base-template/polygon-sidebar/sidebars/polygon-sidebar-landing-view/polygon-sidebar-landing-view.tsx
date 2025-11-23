import React from 'react';
import { Home, ChevronRight } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { cn } from '../../../../../lib/utils';
import styles from './polygon-sidebar-landing-view.module.scss';

// TODO: Remplacer par le vrai store quand il sera connecté
// import { useWorkflowStore } from '../../../../../modules/workflow-automation/store/workflow.store';

type TPolygonSidebarLandingViewProps = {
    onNavigate: (viewIndex: number) => void;
}

// Mock data - à remplacer par les vraies données du store
const mockWorkflows = [
    { id: '1', title: 'Onboarding Process' },
    { id: '2', title: 'Leave Request Automation' },
    { id: '3', title: 'Document Approval' },
];

const PolygonSidebarLandingView = ({}: TPolygonSidebarLandingViewProps): React.ReactElement => {

    const location = useLocation();
    const navigate = useNavigate();
    
    // TODO: Récupérer les workflows depuis le store
    // const workflows = useWorkflowStore(s => s.workflows);
    // const isLoading = useWorkflowStore(s => s.isLoading);
    const workflows = mockWorkflows;
    const isLoading = false;

    const isHomePage = location.pathname === '/';

    return <div className={styles.polygonSidebarLandingView}>
        
        

        {/* Section Workflows */}
        <div className={styles.polygonSidebarLandingViewContent}>
{/* Navigation principale */}
<div className={styles.polygonSidebarLandingViewNavigation}>
            <div
                className={cn(
                    styles.polygonSidebarLandingViewNavigationItem,
                    isHomePage && styles.polygonSidebarLandingViewNavigationItemActive
                )}
                onClick={() => navigate('/')}
            >
                <Home size={18} />
                <span>Home</span>
            </div>
        </div>
            {/* Divider */}
            <div className={styles.polygonSidebarLandingViewDivider} />

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
                ) : workflows.length === 0 ? (
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
                        {workflows.map((workflow) => (
                            <div
                                key={workflow.id}
                                className={cn(
                                    styles.polygonSidebarLandingViewWorkflowItem,
                                    location.pathname === `/workflow/${workflow.id}` && 
                                    styles.polygonSidebarLandingViewWorkflowItemActive
                                )}
                                onClick={() => navigate(`/workflow/${workflow.id}`)}
                            >
                                <span className={styles.polygonSidebarLandingViewWorkflowItemTitle}>
                                    {workflow.title}
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

