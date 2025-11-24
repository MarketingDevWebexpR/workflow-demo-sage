/**
 * Available trigger options for Workflow Boundaries
 * Each trigger defines a start event and its corresponding automatic end event
 */

export type TTriggerOption = {
    id: string;
    title: string;
    description: string;
    icon: string;
    category: string;
    endTitle: string; // Titre automatique de la boundary de fin
    endIcon: string; // Icône automatique de la boundary de fin
}

export const triggerOptions: TTriggerOption[] = [
    // ========== SHAREPOINT LIST EVENTS ==========
    {
        id: 'TRIGGER_ITEM_CREATED',
        title: 'When item is created',
        description: 'Triggered immediately after SharePoint confirms the item creation',
        icon: 'FilePlus',
        category: 'List Events',
        endTitle: 'Item created successfully',
        endIcon: 'Check',
    },
    {
        id: 'TRIGGER_ITEM_UPDATED',
        title: 'When item is updated',
        description: 'Executes after any field modification is saved to the list',
        icon: 'FileEdit',
        category: 'List Events',
        endTitle: 'Item updated successfully',
        endIcon: 'Check',
    },
    {
        id: 'TRIGGER_ITEM_DELETED',
        title: 'When item is deleted',
        description: 'Runs after deletion but before permanent removal from recycle bin',
        icon: 'FileX',
        category: 'List Events',
        endTitle: 'Item deleted successfully',
        endIcon: 'Check',
    },

    // ========== USER INTERACTIONS ==========
    {
        id: 'TRIGGER_BUTTON_CLICKED',
        title: 'When button is clicked',
        description: 'Responds instantly to user interaction before UI refresh',
        icon: 'MousePointerClick',
        category: 'User Actions',
        endTitle: 'Action completed',
        endIcon: 'Check',
    },
    {
        id: 'TRIGGER_FORM_SUBMITTED',
        title: 'When form is submitted',
        description: 'Activates after validation passes and before data persistence',
        icon: 'FileInput',
        category: 'User Actions',
        endTitle: 'Form processed',
        endIcon: 'Check',
    },

    // ========== DOCUMENT EVENTS ==========
    {
        id: 'TRIGGER_FILE_UPLOADED',
        title: 'When file is uploaded',
        description: 'Starts after upload completes but before metadata indexing',
        icon: 'Upload',
        category: 'Documents',
        endTitle: 'File processed',
        endIcon: 'Check',
    },
    {
        id: 'TRIGGER_FILE_DOWNLOADED',
        title: 'When file is downloaded',
        description: 'Logs activity for audit trail and analytics purposes',
        icon: 'Download',
        category: 'Documents',
        endTitle: 'Download logged',
        endIcon: 'Check',
    },

    // ========== USER & PERMISSIONS ==========
    {
        id: 'TRIGGER_USER_ADDED',
        title: 'When user is added',
        description: 'Perfect for automated onboarding and welcome notifications',
        icon: 'UserPlus',
        category: 'Users',
        endTitle: 'User onboarding completed',
        endIcon: 'Check',
    },
    {
        id: 'TRIGGER_USER_REMOVED',
        title: 'When user is removed',
        description: 'Handles access revocation and cleanup procedures',
        icon: 'UserMinus',
        category: 'Users',
        endTitle: 'User offboarding completed',
        endIcon: 'Check',
    },
    {
        id: 'TRIGGER_PERMISSION_CHANGED',
        title: 'When permission changes',
        description: 'Monitors security modifications for compliance tracking',
        icon: 'Shield',
        category: 'Permissions',
        endTitle: 'Permission change finalized',
        endIcon: 'Check',
    },

    // ========== APPLICATION EVENTS ==========
    {
        id: 'TRIGGER_PAGE_LOADED',
        title: 'When page loads',
        description: 'Ideal for analytics, user tracking, and initial data fetch',
        icon: 'Globe',
        category: 'App Events',
        endTitle: 'Page initialization completed',
        endIcon: 'Check',
    },

    // ========== ERROR HANDLING ==========
    {
        id: 'TRIGGER_ERROR_OCCURRED',
        title: 'When error occurs',
        description: 'Catches exceptions for logging, alerting, and recovery workflows',
        icon: 'AlertTriangle',
        category: 'Error Handling',
        endTitle: 'Error handled',
        endIcon: 'Check',
    },
];

