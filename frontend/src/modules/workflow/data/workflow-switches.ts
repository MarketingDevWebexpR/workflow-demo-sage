// // @@ models
// import WorkflowSwitch from '../models/workflow/elements/WorkflowSwitch.model';

// /**
//  * Test workflow switches
//  * Simplified switches following PSR pattern
//  */

// export const requiresApproval = (folder?: any) => new WorkflowSwitch({
//     id: 'REQUIRES_APPROVAL',
//     title: 'Requires Management Approval?',
//     defineSwitchValue() {
//         this.value = folder?.needsApproval ?? false;
//     },
// });

// export const requiresBudget = (folder?: any) => new WorkflowSwitch({
//     id: 'REQUIRES_BUDGET',
//     title: 'Requires Budget Approval?',
//     defineSwitchValue() {
//         this.value = folder?.requiresBudget ?? false;
//     },
// });

// export const needsSecurityAudit = (folder?: any) => new WorkflowSwitch({
//     id: 'NEEDS_SECURITY_AUDIT',
//     title: 'Needs Security Audit?',
//     defineSwitchValue() {
//         this.value = folder?.needsSecurityAudit ?? false;
//     },
// });

// export const requiresTraining = (folder?: any) => new WorkflowSwitch({
//     id: 'REQUIRES_TRAINING',
//     title: 'Requires User Training?',
//     defineSwitchValue() {
//         this.value = folder?.requiresTraining ?? false;
//     },
// });

// export const isHighPriority = (folder?: any) => new WorkflowSwitch({
//     id: 'IS_HIGH_PRIORITY',
//     title: 'Is High Priority?',
//     defineSwitchValue() {
//         this.value = folder?.isHighPriority ?? false;
//     },
// });

// export const isComplexProject = (folder?: any) => new WorkflowSwitch({
//     id: 'IS_COMPLEX_PROJECT',
//     title: 'Is Complex Project?',
//     defineSwitchValue() {
//         this.value = folder?.isComplexProject ?? false;
//     },
// });

// export const needsExternalValidation = (folder?: any) => new WorkflowSwitch({
//     id: 'NEEDS_EXTERNAL_VALIDATION',
//     title: 'Needs External Validation?',
//     defineSwitchValue() {
//         this.value = folder?.needsExternalValidation ?? false;
//     },
// });

// export const requiresPerformanceTest = (folder?: any) => new WorkflowSwitch({
//     id: 'REQUIRES_PERFORMANCE_TEST',
//     title: 'Requires Performance Test?',
//     defineSwitchValue() {
//         this.value = folder?.requiresPerformanceTest ?? false;
//     },
// });

// export const needsCustomerApproval = (folder?: any) => new WorkflowSwitch({
//     id: 'NEEDS_CUSTOMER_APPROVAL',
//     title: 'Needs Customer Approval?',
//     defineSwitchValue() {
//         this.value = folder?.needsCustomerApproval ?? false;
//     },
// });

// export const requiresLegalReview = (folder?: any) => new WorkflowSwitch({
//     id: 'REQUIRES_LEGAL_REVIEW',
//     title: 'Requires Legal Review?',
//     defineSwitchValue() {
//         this.value = folder?.requiresLegalReview ?? false;
//     },
// });

// export const hasDataPrivacyConcerns = (folder?: any) => new WorkflowSwitch({
//     id: 'HAS_DATA_PRIVACY_CONCERNS',
//     title: 'Has Data Privacy Concerns?',
//     defineSwitchValue() {
//         this.value = folder?.hasDataPrivacyConcerns ?? false;
//     },
// });

// export const needsBackupStrategy = (folder?: any) => new WorkflowSwitch({
//     id: 'NEEDS_BACKUP_STRATEGY',
//     title: 'Needs Backup Strategy?',
//     defineSwitchValue() {
//         this.value = folder?.needsBackupStrategy ?? false;
//     },
// });


