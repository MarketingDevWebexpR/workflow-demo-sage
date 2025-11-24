import styles from './automation-workflows-sidebar.module.scss';
import { useWorkflowAutomationStore } from "../../store/workflow-automation.store";
import { cn } from "../../../../lib/utils";
import { Button } from "../../../../components/ui/button/button";


type TAutomationWorkflowsSidebarProps = {
    className?: string;
}

const AutomationWorkflowsSidebar = ({
    className
}: TAutomationWorkflowsSidebarProps) => {

    const allWorkflows = useWorkflowAutomationStore(s => s.workflowItem.processedData);
    const allWorkflows2 = useWorkflowAutomationStore(s => s.workflowItem.data);

    console.log({ allWorkflows, allWorkflows2 });

    return <div className={cn(styles.automationWorkflowsSidebar, className)}>

        {/* Contenu */}
        <div className={styles.automationWorkflowsSidebarContent}>
            <div className={styles.aiPanel}>
                <div className={styles.aiPanelContent}>
                    {/* Zone de conversation */}
                    <div className={styles.aiPanelMessages}>
                        <div className={styles.aiPanelEmptyState}>
                            <p>Commencez une conversation avec l'assistant IA</p>
                        </div>
                    </div>
                </div>
                <div className={styles.aiPanelFooter}>
                    <textarea
                        className={styles.aiPanelTextarea}
                        placeholder="Décrivez le workflow que vous souhaitez créer..."
                        rows={3}
                    />
                    <Button variant="default" size="sm" className={styles.aiPanelSendButton}>
                        Envoyer
                    </Button>
                </div>
            </div>
        </div>

    </div>;
};


export {
    AutomationWorkflowsSidebar,
};

