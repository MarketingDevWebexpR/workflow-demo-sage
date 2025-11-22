import { type TPlaceholderOption } from '../data/workflow-placeholder-options';
import { v4 as uuidv4 } from 'uuid';

/**
 * Generate workflow XML element for different element types
 */
export function generateWorkflowElementText(
    option: TPlaceholderOption,
): string {
    // Handle Split (if/else)
    if (option.id === 'SWITCH_SPLIT') {
        const uniqueId = `SWITCH_${uuidv4()}`;
        const placeholderId1 = `PLACEHOLDER_${uuidv4()}`;
        const placeholderId2 = `PLACEHOLDER_${uuidv4()}`;
        const translatedTitle = option.title;
        const newStepText = 'New step here';
        return `    <if id="${uniqueId}" optionId="${option.id}" title="${translatedTitle}">
        <then>
            <placeholder
                id="${placeholderId1}"
                title="${newStepText}"
            />
        </then>
        <else>
            <placeholder
                id="${placeholderId2}"
                title="${newStepText}"
            />
        </else>
    </if>`;
    }

    // Handle If (without else)
    if (option.id === 'SWITCH_IF') {
        const uniqueId = `SWITCH_${uuidv4()}`;
        const placeholderId = `PLACEHOLDER_${uuidv4()}`;
        const translatedTitle = option.title;
        const newStepText = 'New step here';
        return `    <if id="${uniqueId}" optionId="${option.id}" title="${translatedTitle}">
        <then>
            <placeholder
                id="${placeholderId}"
                title="${newStepText}"
            />
        </then>
    </if>`;
    }

    // Handle regular actions
    if (option.type === 'action') {
        const uniqueId = uuidv4(); // UUID pur
        const optionId = option.id; // L'ID de l'option (ex: ACTION_BREAK_PERMISSION_INHERITANCE)
        const translatedTitle = option.title;
        const camelCaseType = option.id
            .split('_')
            .slice(1) // Remove ACTION_ prefix
            .map((word, index) => {
                if (index === 0) {
                    return word.toLowerCase();
                }
                return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
            })
            .join('');

        return `    <action
        id="${uniqueId}"
        optionId="${optionId}"
        type="${camelCaseType}"
        title="${translatedTitle}"
    />`;
    }

    return '';
}

/**
 * Insert workflow element before a placeholder by ID (XML format)
 * This is much simpler and more robust than the legacy regex approach!
 */
export function insertBeforePlaceholderById(
    workflowText: string,
    newElementText: string,
    placeholderId: string
): string {
    console.log('[insertBeforePlaceholderById] Inserting element before placeholder:', {
        placeholderId,
        newElementText,
    });

    // Detect format
    const isXMLFormat = workflowText.trim().startsWith('<') && workflowText.includes('</');

    if (isXMLFormat) {
        return insertBeforePlaceholderXML(workflowText, newElementText, placeholderId);
    } else {
        // Fallback to legacy format
        return insertBeforePlaceholderLegacy(workflowText, newElementText, placeholderId);
    }
}

/**
 * XML format: Use DOMParser for precise manipulation
 */
function insertBeforePlaceholderXML(
    workflowText: string,
    newElementText: string,
    placeholderId: string
): string {
    try {
        const parser = new DOMParser();
        const doc = parser.parseFromString(workflowText, 'text/xml');

        // Check for parsing errors
        const parserError = doc.querySelector('parsererror');
        if (parserError) {
            console.error('[insertBeforePlaceholderXML] XML parsing error:', parserError.textContent);
            return workflowText;
        }

        // Find the placeholder by ID
        const placeholder = doc.querySelector(`placeholder[id="${placeholderId}"]`);
        if (!placeholder) {
            console.error('[insertBeforePlaceholderXML] Placeholder not found:', placeholderId);
            return workflowText;
        }

        // Parse the new element text as XML
        const newElementDoc = parser.parseFromString(`<root>${newElementText}</root>`, 'text/xml');
        const newElementsRoot = newElementDoc.querySelector('root');

        if (!newElementsRoot) {
            console.error('[insertBeforePlaceholderXML] Failed to parse new element');
            return workflowText;
        }

        // Insert all children of the new element before the placeholder
        Array.from(newElementsRoot.children).forEach(child => {
            const importedNode = doc.importNode(child, true);
            placeholder.parentNode?.insertBefore(importedNode, placeholder);
        });

        // Serialize back to string with proper formatting
        const serializer = new XMLSerializer();
        const serialized = serializer.serializeToString(doc);

        // Clean up the XML formatting
        return formatXML(serialized);
    } catch (error) {
        console.error('[insertBeforePlaceholderXML] Error:', error);
        return workflowText;
    }
}

/**
 * Legacy format: Fallback for {{}} syntax
 */
function insertBeforePlaceholderLegacy(
    workflowText: string,
    newElementText: string,
    placeholderId: string
): string {
    // Find the placeholder with this specific ID
    const placeholderRegex = new RegExp(
        `\\{\\{placeholder:\\s*\\{[^}]*id:\\s*"${placeholderId.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}"[^}]*\\}\\}\\}`,
        'g'
    );

    const match = placeholderRegex.exec(workflowText);

    if (!match) {
        console.error('[insertBeforePlaceholderLegacy] Placeholder not found:', placeholderId);
        return workflowText;
    }

    const insertPosition = match.index;
    const before = workflowText.slice(0, insertPosition);
    const after = workflowText.slice(insertPosition);

    return `${before}${newElementText}\n\n${after}`;
}

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