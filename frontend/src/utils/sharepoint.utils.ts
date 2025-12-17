/**
 * SharePoint utility types and functions.
 * Provides type definitions for SharePoint permissions and common operations.
 */

/**
 * SharePoint permission map interface.
 * Represents the various permission levels available in SharePoint.
 */
export interface TSPPermissionMap {
    /** Permission to view list items */
    readonly viewListItems: boolean;
    /** Permission to add list items */
    readonly addListItems: boolean;
    /** Permission to edit list items */
    readonly editListItems: boolean;
    /** Permission to delete list items */
    readonly deleteListItems: boolean;
    /** Permission to approve items */
    readonly approveItems: boolean;
    /** Permission to open items */
    readonly openItems: boolean;
    /** Permission to view versions */
    readonly viewVersions: boolean;
    /** Permission to delete versions */
    readonly deleteVersions: boolean;
    /** Permission to create alerts */
    readonly createAlerts: boolean;
    /** Permission to view form pages */
    readonly viewFormPages: boolean;
    /** Permission to manage lists */
    readonly manageLists: boolean;
    /** Permission to manage personal views */
    readonly managePersonalViews: boolean;
    /** Full control permission */
    readonly fullMask: boolean;
}

/**
 * Creates a default permission map with all permissions set to false.
 *
 * @returns A TSPPermissionMap with all permissions denied
 */
export function createEmptyPermissionMap(): TSPPermissionMap {
    return {
        viewListItems: false,
        addListItems: false,
        editListItems: false,
        deleteListItems: false,
        approveItems: false,
        openItems: false,
        viewVersions: false,
        deleteVersions: false,
        createAlerts: false,
        viewFormPages: false,
        manageLists: false,
        managePersonalViews: false,
        fullMask: false,
    };
}

/**
 * Creates a permission map with read-only access.
 *
 * @returns A TSPPermissionMap with view permissions enabled
 */
export function createReadOnlyPermissionMap(): TSPPermissionMap {
    return {
        ...createEmptyPermissionMap(),
        viewListItems: true,
        openItems: true,
        viewVersions: true,
        viewFormPages: true,
    };
}

/**
 * Creates a permission map with full access.
 *
 * @returns A TSPPermissionMap with all permissions enabled
 */
export function createFullPermissionMap(): TSPPermissionMap {
    return {
        viewListItems: true,
        addListItems: true,
        editListItems: true,
        deleteListItems: true,
        approveItems: true,
        openItems: true,
        viewVersions: true,
        deleteVersions: true,
        createAlerts: true,
        viewFormPages: true,
        manageLists: true,
        managePersonalViews: true,
        fullMask: true,
    };
}

/**
 * Checks if a user has write permissions.
 *
 * @param permissions - The permission map to check
 * @returns True if the user can add or edit items
 */
export function hasWritePermission(permissions: TSPPermissionMap): boolean {
    return permissions.addListItems || permissions.editListItems;
}

/**
 * Checks if a user has delete permissions.
 *
 * @param permissions - The permission map to check
 * @returns True if the user can delete items
 */
export function hasDeletePermission(permissions: TSPPermissionMap): boolean {
    return permissions.deleteListItems;
}

/**
 * Checks if a user has admin permissions.
 *
 * @param permissions - The permission map to check
 * @returns True if the user has full control or manage lists permission
 */
export function hasAdminPermission(permissions: TSPPermissionMap): boolean {
    return permissions.fullMask || permissions.manageLists;
}
