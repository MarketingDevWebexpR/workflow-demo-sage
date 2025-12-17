/**
 * DocumentItemIcon component stub.
 * TODO: Implement actual document icon functionality.
 */

import { FileIcon, FolderIcon, ImageIcon, FileTextIcon, Loader2Icon } from "lucide-react";

export type DocumentType = "file" | "folder" | "image" | "document" | "unknown" | "SP.Folder" | "SP.File";

export interface DocumentItemIconProps {
    /** Type of document to display icon for */
    type?: DocumentType;
    /** File name - used to determine icon from extension */
    name?: string;
    /** File extension (e.g., "pdf", "docx") - used to determine icon */
    extension?: string;
    /** Size of the icon in pixels */
    size?: number;
    /** Optional CSS class name */
    className?: string;
    /** Loading state */
    isLoading?: boolean;
}

/**
 * Returns the appropriate icon component based on document type or extension.
 */
function getIconComponent(type?: DocumentType, extension?: string) {
    // If explicit type is provided, use it
    if (type === "folder" || type === "SP.Folder") return FolderIcon;
    if (type === "image") return ImageIcon;
    if (type === "document") return FileTextIcon;

    // Check extension for image types
    const imageExtensions = ["jpg", "jpeg", "png", "gif", "svg", "webp", "bmp"];
    if (extension && imageExtensions.includes(extension.toLowerCase())) {
        return ImageIcon;
    }

    // Check extension for document types
    const documentExtensions = ["pdf", "doc", "docx", "txt", "rtf", "odt"];
    if (extension && documentExtensions.includes(extension.toLowerCase())) {
        return FileTextIcon;
    }

    // Default to generic file icon
    return FileIcon;
}

/**
 * Displays an icon representing a document type.
 */
export function DocumentItemIcon({
    type,
    name,
    extension,
    size = 24,
    className,
    isLoading = false,
}: DocumentItemIconProps) {
    if (isLoading) {
        return <Loader2Icon size={size} className={className} />;
    }

    // Extract extension from name if not provided
    const ext = extension || (name ? name.split('.').pop() : undefined);
    const IconComponent = getIconComponent(type, ext);

    return <IconComponent size={size} className={className} />;
}

export default DocumentItemIcon;
