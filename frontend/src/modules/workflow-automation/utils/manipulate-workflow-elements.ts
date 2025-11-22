import { v4 as uuidv4 } from 'uuid';

/**
 * Format XML with proper indentation
 */
function formatXML(xml: string): string {
    // Remove XML declaration if present
    xml = xml.replace(/<\?xml[^?]*\?>\s*/g, '');

    // Basic formatting (this could be improved)
    let formatted = '';
    let indent = 0;
    const lines = xml.split('>').map(line => line.trim()).filter(line => line);

    lines.forEach((line, index) => {
        if (line.startsWith('</')) {
            indent--;
        }

        formatted += '    '.repeat(Math.max(0, indent)) + line + (index < lines.length - 1 ? '>\n' : '>');

        if (line.startsWith('<') && !line.startsWith('</') && !line.endsWith('/')) {
            indent++;
        }
    });

    return formatted;
}

/**
 * Find an element by ID in the XML document
 * Handles all element types: action, if, placeholder, status, boundary
 */
function findElementById(doc: Document, elementId: string): Element | null {
    // Try all possible element types
    const elementTypes = ['action', 'if', 'placeholder', 'status', 'boundary'];

    for (const type of elementTypes) {
        const element = doc.querySelector(`${type}[id="${elementId}"]`);
        if (element) {
            return element;
        }
    }

    return null;
}

/**
 * Insert a new placeholder before any workflow element by ID
 * @param workflowText - The complete workflow XML text
 * @param targetElementId - The ID of the element to insert before
 * @returns Updated workflow text with the new placeholder inserted
 */
export function insertPlaceholderBeforeElement(
    workflowText: string,
    targetElementId: string,
    newStepText: string = 'New step here'
): string {
    console.log('[insertPlaceholderBeforeElement] Inserting placeholder before element:', {
        targetElementId,
    });

    try {
        const parser = new DOMParser();
        const doc = parser.parseFromString(workflowText, 'text/xml');

        // Check for parsing errors
        const parserError = doc.querySelector('parsererror');
        if (parserError) {
            console.error('[insertPlaceholderBeforeElement] XML parsing error:', parserError.textContent);
            return workflowText;
        }

        // Find the target element by ID
        const targetElement = findElementById(doc, targetElementId);
        if (!targetElement) {
            console.error('[insertPlaceholderBeforeElement] Target element not found:', targetElementId);
            return workflowText;
        }

        // Create a new placeholder element
        const placeholderId = `PLACEHOLDER_${uuidv4()}`;
        const newPlaceholder = doc.createElement('placeholder');
        newPlaceholder.setAttribute('id', placeholderId);
        newPlaceholder.setAttribute('title', newStepText);

        // Insert the placeholder before the target element
        targetElement.parentNode?.insertBefore(newPlaceholder, targetElement);

        // Also add a text node for formatting (newline + indentation)
        const indentText = doc.createTextNode('\n    ');
        targetElement.parentNode?.insertBefore(indentText, newPlaceholder);

        // Serialize back to string with proper formatting
        const serializer = new XMLSerializer();
        const serialized = serializer.serializeToString(doc);

        // Clean up the XML formatting
        return formatXML(serialized);
    } catch (error) {
        console.error('[insertPlaceholderBeforeElement] Error:', error);
        return workflowText;
    }
}

/**
 * Delete a workflow element by ID
 * @param workflowText - The complete workflow XML text
 * @param elementId - The ID of the element to delete
 * @returns Updated workflow text with the element removed
 */
export function deleteElementById(
    workflowText: string,
    elementId: string
): string {
    console.log('[deleteElementById] Deleting element:', {
        elementId,
    });

    try {
        const parser = new DOMParser();
        const doc = parser.parseFromString(workflowText, 'text/xml');

        // Check for parsing errors
        const parserError = doc.querySelector('parsererror');
        if (parserError) {
            console.error('[deleteElementById] XML parsing error:', parserError.textContent);
            return workflowText;
        }

        // Find the element by ID
        const element = findElementById(doc, elementId);
        if (!element) {
            console.error('[deleteElementById] Element not found:', elementId);
            return workflowText;
        }

        // Check if the element is a boundary (start or end)
        if (element.tagName.toLowerCase() === 'boundary') {
            console.warn('[deleteElementById] Cannot delete boundary elements (start/end)');
            return workflowText;
        }

        // Remove the element from its parent
        const parent = element.parentNode;
        if (parent) {
            // Also try to remove the preceding text node if it's just whitespace/newline
            const previousSibling = element.previousSibling;
            if (previousSibling && previousSibling.nodeType === Node.TEXT_NODE) {
                const textContent = previousSibling.textContent || '';
                if (textContent.trim() === '') {
                    parent.removeChild(previousSibling);
                }
            }

            parent.removeChild(element);
        }

        // Serialize back to string with proper formatting
        const serializer = new XMLSerializer();
        const serialized = serializer.serializeToString(doc);

        // Clean up the XML formatting
        return formatXML(serialized);
    } catch (error) {
        console.error('[deleteElementById] Error:', error);
        return workflowText;
    }
}

/**
 * Duplicate a workflow element by ID
 * @param workflowText - The complete workflow XML text
 * @param elementId - The ID of the element to duplicate
 * @returns Updated workflow text with the element duplicated
 */
export function duplicateElementById(
    workflowText: string,
    elementId: string
): string {
    console.log('[duplicateElementById] Duplicating element:', {
        elementId,
    });

    try {
        const parser = new DOMParser();
        const doc = parser.parseFromString(workflowText, 'text/xml');

        // Check for parsing errors
        const parserError = doc.querySelector('parsererror');
        if (parserError) {
            console.error('[duplicateElementById] XML parsing error:', parserError.textContent);
            return workflowText;
        }

        // Find the element by ID
        const element = findElementById(doc, elementId);
        if (!element) {
            console.error('[duplicateElementById] Element not found:', elementId);
            return workflowText;
        }

        // Clone the element
        const clonedElement = element.cloneNode(true) as Element;

        // Generate a new unique ID for the cloned element
        const newId = clonedElement.tagName.toLowerCase() === 'if'
            ? `SWITCH_${uuidv4()}`
            : clonedElement.tagName.toLowerCase() === 'placeholder'
                ? `PLACEHOLDER_${uuidv4()}`
                : clonedElement.tagName.toLowerCase() === 'status'
                    ? `STATUS_${uuidv4()}`
                    : uuidv4(); // For actions, just a UUID

        clonedElement.setAttribute('id', newId);

        // If it's an if/switch element, we need to update IDs of nested placeholders
        if (clonedElement.tagName.toLowerCase() === 'if') {
            const nestedPlaceholders = clonedElement.querySelectorAll('placeholder');
            nestedPlaceholders.forEach(placeholder => {
                placeholder.setAttribute('id', `PLACEHOLDER_${uuidv4()}`);
            });
        }

        // Insert the cloned element after the original
        const nextSibling = element.nextSibling;
        const parent = element.parentNode;

        if (parent) {
            // Add formatting newline before the clone
            const indentText = doc.createTextNode('\n    ');
            if (nextSibling) {
                parent.insertBefore(indentText, nextSibling);
                parent.insertBefore(clonedElement, nextSibling);
            } else {
                parent.appendChild(indentText);
                parent.appendChild(clonedElement);
            }
        }

        // Serialize back to string with proper formatting
        const serializer = new XMLSerializer();
        const serialized = serializer.serializeToString(doc);

        // Clean up the XML formatting
        return formatXML(serialized);
    } catch (error) {
        console.error('[duplicateElementById] Error:', error);
        return workflowText;
    }
}

