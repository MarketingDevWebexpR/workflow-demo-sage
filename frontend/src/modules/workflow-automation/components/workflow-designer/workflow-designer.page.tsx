// import React from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import { ArrowLeft } from "lucide-react";
// import { WorkflowRoot } from "../../../components/ui/workflow";
// import styles from "./workflow-designer.page.module.scss";
// import { createWorkflowFromText } from "../../../components/ui/workflow/engine/create-workflow-from-text";
// import { useWorkflowAutomationStore } from "../../../modules/workflow-automation/store/workflow-automation.store";
// import { Button } from "../../../components/ui/button/button";
// import { AutomationWorkflowsSidebar } from "../automation-workflows-sidebar/automation-workflows-sidebar";
// import { isPolygon } from "../../../../../utils/sharepoint.utils";


// const WorkflowDesignerPage = (): React.ReactElement => {
//     const { workflowId } = useParams<{ workflowId: string }>();
//     const navigate = useNavigate();

//     // Récupérer les workflows depuis le store
//     const allWorkflows = useWorkflowAutomationStore(s => s.workflowItem.processedData);

//     // Pour un nouveau workflow, on crée des workflowInfos vides/par défaut
//     const isNewWorkflow = workflowId === 'new';

//     // Récupérer le workflow par ID si ce n'est pas un nouveau workflow
//     const selectedWorkflow = isNewWorkflow
//         ? null
//         : allWorkflows.find(w => w.Id.toString() === workflowId);

//     // Get the workflow infos based on selection
//     const getWorkflowInfos = () => {
//         if (isNewWorkflow) {
//             // Pour un nouveau workflow, retourner null ou un workflow vide
//             // Le WorkflowRoot doit gérer ce cas
//             return createWorkflowFromText(`
//                 {{boundary: {
//     id: "BOUNDARY_START_RECRUITMENT",
//     title: "Position opened",
// }}}

// {{placeholder: {
//     title: "Hello world",
// }}}

// {{boundary: {
//     id: "BOUNDARY_END_RECRUITMENT",
//     title: "Recruitment completed",
// }}}
//                 `);
//         }

//         if (selectedWorkflow?.WorkflowText) {
//             return createWorkflowFromText(selectedWorkflow.WorkflowText);
//         }

//         return null;
//     };

//     const workflowInfos = getWorkflowInfos();

//     // Titre du workflow
//     const workflowTitle = isNewWorkflow ? 'New workflow' : (selectedWorkflow?.Title || 'Workflow');

//     return <div className={styles.workflowDesignerPageWrapper}>
//         <div className={styles.workflowDesignerPageContent}>
//             <AutomationWorkflowsSidebar
//                 className={isPolygon() ? styles.workflowDesignerPageSidebarPolygon : undefined}
//             />
//             <div className={styles.workflowDesignerPageContainer}>
//                 {/* Header avec bouton back et titre */}
//                 <div className={styles.workflowDesignerPageHeader} data-state="open">
//                     <div className={styles.workflowDesignerPageHeaderInner}>
//                         <Button
//                             variant="link"
//                             className={styles.workflowDesignerPageBackButton}
//                             onClick={() => navigate('/admin/automation')}
//                         >
//                             <ArrowLeft size={16} style={{ marginRight: 'var(--spacing-1)' }} />
//                             Back
//                         </Button>
//                         <div className={styles.workflowDesignerPageTitleRow}>
//                             <h3>{workflowTitle}</h3>
//                         </div>
//                     </div>
//                 </div>

//                 {/* Workflow viewer avec background dot */}
//                 {!isNewWorkflow && !selectedWorkflow ? (
//                     <div className={styles.workflowDesignerPageError}>
//                         <p>Workflow not found</p>
//                     </div>
//                 ) : workflowInfos ? (
//                     <div className={styles.workflowDesignerPage} data-state="open">
//                         <div className={styles.workflowDesignerPageViewer}>
//                             <WorkflowRoot
//                                 showSettings={true}
//                                 showIndexes={false}
//                                 workflowInfos={workflowInfos as any}
//                             />
//                         </div>
//                     </div>
//                 ) : null}
//             </div>
//         </div>
//     </div>;
// };


// export {
//     WorkflowDesignerPage,
// };

