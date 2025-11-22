import { Zap, Plus, ChevronRight } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import styles from './automation-workflows-sidebar.module.scss';
import { useWorkflowAutomationStore } from "../../store/workflow-automation.store";
import { getRandomInt } from "../../../../utils/number.utils";
import { fallbackProps } from "../../models/workflow-item.model";
import { cn } from "../../../../lib/utils";


type TAutomationWorkflowsSidebarProps = {
    className?: string;
}

const AutomationWorkflowsSidebar = ({
    className
}: TAutomationWorkflowsSidebarProps) => {

    const navigate = useNavigate();
    const location = useLocation();
    const isFetching = useWorkflowAutomationStore(s => s.workflowItem.isFetching);
    const allWorkflows = useWorkflowAutomationStore(s => s.workflowItem.processedData);
    const allWorkflows2 = useWorkflowAutomationStore(s => s.workflowItem.data);

    console.log({ allWorkflows, allWorkflows2 });
    // Déterminer quel élément est actif
    const pathParts = location.pathname.split('/');
    const isHomePage = pathParts[pathParts.length - 1] === 'automation';
    const activeWorkflowId = !isHomePage && pathParts[pathParts.length - 1] !== 'new'
        ? pathParts[pathParts.length - 1]
        : null;

    return <div className={cn(styles.automationWorkflowsSidebar, className)}>

        {/* En-tête */}
        <div className={styles.automationWorkflowsSidebarHeader}>
            <h1 className={styles.automationWorkflowsSidebarHeaderTitleWrapper}>
                <Zap className={styles.automationWorkflowsSidebarHeaderIcon} size={18} />
                <span className={styles.automationWorkflowsSidebarHeaderTitle}>Workflow Automation</span>
            </h1>
        </div>


        {/* Contenu */}
        <div className={styles.automationWorkflowsSidebarContent}>

            {/* Section "Create workflow" */}
            <div className={styles.automationWorkflowsSidebarSection}>
                <ul className={styles.automationWorkflowsSidebarSectionItems}>
                    <li className={styles.automationWorkflowsSidebarItem}>
                        <a
                            className={styles.automationWorkflowsSidebarItemButton}
                            onClick={() => navigate('/admin/automation')}
                            data-active={isHomePage}
                        >
                            <div className={styles.automationWorkflowsSidebarItemContent}>
                                <Plus className={styles.automationWorkflowsSidebarItemIcon} />
                                <span className={styles.automationWorkflowsSidebarItemTitle}>
                                    Create workflow
                                </span>
                            </div>
                        </a>
                    </li>
                </ul>
            </div>

            {/* Séparateur */}
            <div className={styles.automationWorkflowsSidebarDivider} />

            {/* Section "Workflows" */}
            <div className={styles.automationWorkflowsSidebarSection}>
                {/* Titre de la section */}
                <div className={styles.automationWorkflowsSidebarSectionHeader}>
                    Workflows
                </div>

                {/* Liste des workflows */}
                <ul className={styles.automationWorkflowsSidebarSectionItems}>
                    {
                        isFetching ? (
                            // Loading state
                            Array(getRandomInt(3, 8)).fill(0).map(fallbackProps).map((workflow, index) => (
                                <li
                                    key={`loading-workflow-${index}`}
                                    className={styles.automationWorkflowsSidebarItem}
                                    data-is-loading={true}
                                >
                                    <a className={styles.automationWorkflowsSidebarItemButton}>
                                        <span className={styles.automationWorkflowsSidebarItemTitle}>
                                            {workflow.Title}
                                        </span>
                                        <ChevronRight className={styles.automationWorkflowsSidebarItemChevron} size={16} />
                                    </a>
                                </li>
                            ))
                        ) : allWorkflows.length === 0 ? (
                            // Empty state
                            <li className={styles.automationWorkflowsSidebarEmptyState}>
                                <p className={styles.automationWorkflowsSidebarEmptyStateText}>
                                    No workflows yet.
                                </p>
                                <p className={styles.automationWorkflowsSidebarEmptyStateDescription}>
                                    Create your first workflow
                                </p>
                            </li>
                        ) : (
                            // Workflows list
                            allWorkflows.map((workflow) => (
                                <li
                                    key={workflow.Id}
                                    className={styles.automationWorkflowsSidebarItem}
                                >
                                    <a
                                        className={styles.automationWorkflowsSidebarItemButton}
                                        onClick={() => navigate(`/admin/automation/workflow/${workflow.Id}`)}
                                        data-active={activeWorkflowId === workflow.Id.toString()}
                                    >
                                        <span className={styles.automationWorkflowsSidebarItemTitle}>
                                            {workflow.Title}
                                        </span>
                                        <ChevronRight className={styles.automationWorkflowsSidebarItemChevron} size={16} />
                                    </a>
                                </li>
                            ))
                        )
                    }
                </ul>
            </div>
        </div>

    </div>;
};


export {
    AutomationWorkflowsSidebar,
};

