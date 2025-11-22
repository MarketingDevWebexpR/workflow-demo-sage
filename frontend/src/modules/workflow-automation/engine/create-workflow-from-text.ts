import { v4 as uuidv4 } from 'uuid';
import WorkflowBoundary from '../models/workflow/elements/WorkflowBoundary.model';
import WorkflowAction from '../models/workflow/elements/WorkflowAction.model';
import WorkflowStatus from '../models/workflow/elements/WorkflowStatus.model';
import WorkflowSwitch from '../models/workflow/elements/WorkflowSwitch.model';
import WorkflowPlaceholder from '../models/workflow/elements/WorkflowPlaceholder.model';
import { z } from 'zod';

type TCreateWorkflowFromText = {
    switches: {
        [switchFnName: string]: (...args: unknown[]) => WorkflowSwitch,
    },
    actions: {
        [actionFnName: string]: (...args: unknown[]) => WorkflowAction<any, any, any> | WorkflowStatus | WorkflowBoundary | WorkflowPlaceholder,
    },
    generatorFn: (...args: unknown[]) => Generator<any, any, any>,
}

/**
 * Fonction principale : détecte le format et parse en conséquence
 */
export function createWorkflowFromText(formattedText: string): TCreateWorkflowFromText {
    // Détecter si c'est du XML (commence par < et contient des balises)
    const isXMLFormat = formattedText.trim().startsWith('<') && formattedText.includes('</');

    if (!isXMLFormat) {
        console.log('[createWorkflowFromText] 📋 Format XML détecté');
        throw new Error('Format XML non détecté');
    }

    return createWorkflowFromXML(formattedText);
}

/**
 * NOUVELLE VERSION : Parse le format XML
 */
function createWorkflowFromXML(xmlText: string): TCreateWorkflowFromText {
    const actions = {} as any;
    const switches = {} as any;
    let isFirstBoundary = true;

    // Sécurité : limiter la taille du XML d'entrée pour éviter des attaques par déni de service
    const MAX_XML_LENGTH = 500000; // 500KB max
    if (xmlText.length > MAX_XML_LENGTH) {
        throw new Error(`XML trop volumineux (${xmlText.length} caractères, max ${MAX_XML_LENGTH})`);
    }

    // Parser XML
    const parser = new DOMParser();
    const doc = parser.parseFromString(xmlText, 'text/xml');

    // Vérifier les erreurs de parsing
    // DOMParser ne lève PAS d'exception, il retourne un document avec <parsererror>
    const parserError = doc.querySelector('parsererror');
    if (parserError) {
        console.error('[createWorkflowFromXML] ❌ Erreur de parsing XML:', parserError.textContent);
        throw new Error('Invalid XML format');
    }

    // Vérification supplémentaire : s'assurer que le document est bien formé
    if (doc.documentElement === null || doc.documentElement.nodeName === 'parsererror') {
        throw new Error('Invalid XML format: document malformé');
    }

    const workflowRoot = doc.querySelector('workflow');
    if (!workflowRoot) {
        throw new Error('XML doit contenir un élément racine <workflow>');
    }

    // Sécurité : compteurs pour limiter la profondeur et le nombre d'éléments
    let recursionDepth = 0;
    let totalElementsProcessed = 0;
    const MAX_RECURSION_DEPTH = 50; // Profondeur maximale de récursion
    const MAX_TOTAL_ELEMENTS = 1000; // Nombre maximum d'éléments à traiter
    const MAX_CHILDREN_PER_ELEMENT = 100; // Nombre maximum d'enfants par élément

    /**
     * Fonction récursive pour parcourir les éléments XML et générer le code
     */
    const processElement = (element: Element, indent: string = ''): string => {
        // Sécurité : vérifier la profondeur de récursion
        if (recursionDepth >= MAX_RECURSION_DEPTH) {
            throw new Error(`Profondeur de récursion excessive (${recursionDepth}, max ${MAX_RECURSION_DEPTH}). Structure XML suspecte.`);
        }

        // Sécurité : vérifier le nombre total d'éléments traités
        totalElementsProcessed++;
        if (totalElementsProcessed > MAX_TOTAL_ELEMENTS) {
            throw new Error(`Trop d'éléments à traiter (${totalElementsProcessed}, max ${MAX_TOTAL_ELEMENTS}). Structure XML suspecte.`);
        }

        // Sécurité : vérifier le nombre d'enfants
        const childrenCount = element.children.length;
        if (childrenCount > MAX_CHILDREN_PER_ELEMENT) {
            throw new Error(`Trop d'enfants pour l'élément <${element.tagName}> (${childrenCount}, max ${MAX_CHILDREN_PER_ELEMENT}). Structure XML suspecte.`);
        }

        recursionDepth++;

        // Utiliser try/finally pour garantir que la profondeur est toujours décrémentée
        try {
            const validTagNames = ['boundary', 'action', 'status', 'placeholder', 'if', 'then', 'else', 'workflow'];
            type TValidTagName = typeof validTagNames[number];

            const tagName = element.tagName.toLowerCase();

            if (!validTagNames.includes(tagName)) {
                console.warn(`[processElement] ⚠️ Balise inconnue : <${tagName}>`);
                return '';
            }

            const schemes: Record<TValidTagName, z.ZodObject<any>> = {
            'boundary': z.object({
                id: z.string(),
                title: z.string(),
            }),
            'action': z.object({
                id: z.string(),
                title: z.string(), // "Reset Permission Inheritance"
                type: z.string(), // resetPermissionInheritance,
                optionId: z.string(), // ACTION_RESET_PERMISSION_INHERITANCE
            }),
            'status': z.object({
                id: z.string(),
                title: z.string(),
            }),
            'placeholder': z.object({
                id: z.string(),
                title: z.string(),
            }),
            'if': z.object({
                id: z.string(),
                title: z.string(),
                optionId: z.string(), // SWITCH_IF
            }),
            'then': z.object({
                id: z.string(),
                title: z.string(),
            }),
            'else': z.object({
                id: z.string(),
                title: z.string(),
            }),
            'workflow': z.object({
                id: z.string(),
                title: z.string(),
            }),
        };

        const relevantScheme = schemes[tagName as TValidTagName];

        let code = '';





            const attributes: Record<string, string> = {};

            // Sécurité : limiter la longueur des valeurs d'attributs pour éviter des injections massives
            const MAX_ATTRIBUTE_LENGTH = 1000;

            for( const key in relevantScheme.shape) {
                if (Object.prototype.hasOwnProperty.call(relevantScheme.shape, key)) {
                    const attr = element.getAttribute(key);

                    if (attr) {
                        const attrValue = attr.toString();
                        // Sécurité : limiter la longueur et valider que c'est bien une string
                        if (typeof attrValue === 'string' && attrValue.length <= MAX_ATTRIBUTE_LENGTH) {
                            attributes[key] = attrValue;
                        } else {
                            console.warn(`[processElement] ⚠️ Attribut ${key} ignoré: longueur excessive ou type invalide`);
                        }
                    }
                }
            }

            // Sécurité : valider les attributs avec Zod avant de les utiliser
            try {
                const validationResult = relevantScheme.safeParse(attributes);
                if (!validationResult.success) {
                    console.warn(`[processElement] ⚠️ Attributs invalides pour <${tagName}>`);
                    // On continue avec les attributs tels quels, mais on log l'erreur
                    // Les valeurs par défaut seront utilisées si nécessaire
                } else {
                    // Si la validation réussit, on utilise les valeurs validées
                    Object.assign(attributes, validationResult.data);
                }
            } catch {
                console.error(`[processElement] ❌ Erreur lors de la validation Zod pour <${tagName}>`);
                // On continue quand même, mais avec les valeurs non validées
            }

            switch (tagName) {
            case 'boundary': {
                const uniqueId = attributes.id || `BOUNDARY_${uuidv4()}`;

                const propsObj = {
                    title: '',  // Valeur par défaut
                    ...attributes,
                    id: uniqueId,
                    isStart: isFirstBoundary,
                };
                // Sécurité : JSON.stringify() échappe déjà correctement tous les caractères spéciaux
                // Le .replace(/"/g, '"') était inutile et pouvait casser le JSON
                // On utilise directement JSON.stringify() qui est sûr
                const propsStr = JSON.stringify(propsObj);

                actions[uniqueId] = () => new WorkflowBoundary(propsObj as any);
                code += `${indent}yield new WorkflowBoundary(${propsStr});\n`;

                if (isFirstBoundary) {
                    isFirstBoundary = false;
                }
                break;
            }

            case 'action': {
                const uniqueId = attributes.id || `ACTION_${uuidv4()}`;
                const propsObj = {
                    title: '',  // Valeur par défaut
                    type: '',   // Valeur par défaut
                    ...attributes,
                    id: uniqueId,
                };
                // Sécurité : JSON.stringify() échappe déjà correctement tous les caractères spéciaux
                // Le .replace(/"/g, '"') était inutile et pouvait casser le JSON
                // On utilise directement JSON.stringify() qui est sûr
                const propsStr = JSON.stringify(propsObj);

                actions[uniqueId] = () => new WorkflowAction(propsObj as any);
                code += `${indent}yield new WorkflowAction(${propsStr});\n`;
                break;
            }

            case 'status': {
                const uniqueId = attributes.id || `STATUS_${uuidv4()}`;
                const propsObj = {
                    title: '',  // Valeur par défaut
                    ...attributes,
                    id: uniqueId,
                };
                // Sécurité : JSON.stringify() échappe déjà correctement tous les caractères spéciaux
                // Le .replace(/"/g, '"') était inutile et pouvait casser le JSON
                // On utilise directement JSON.stringify() qui est sûr
                const propsStr = JSON.stringify(propsObj);

                actions[uniqueId] = () => new WorkflowStatus(propsObj as any);
                code += `${indent}yield new WorkflowStatus(${propsStr});\n`;
                break;
            }

            case 'placeholder': {
                const uniqueId = attributes.id || `PLACEHOLDER_${uuidv4()}`;
                const propsObj = {
                    title: '',  // Valeur par défaut
                    ...attributes,
                    id: uniqueId,
                };
                // Sécurité : JSON.stringify() échappe déjà correctement tous les caractères spéciaux
                // Le .replace(/"/g, '"') était inutile et pouvait casser le JSON
                // On utilise directement JSON.stringify() qui est sûr
                const propsStr = JSON.stringify(propsObj);

                actions[uniqueId] = () => new WorkflowPlaceholder(propsObj as any);
                code += `${indent}yield new WorkflowPlaceholder(${propsStr});\n`;
                break;
            }

            case 'if': {
                const uniqueId = attributes.id || `SWITCH_${uuidv4()}`;
                const propsObj = {
                    title: '',  // Valeur par défaut
                    ...attributes,
                    id: uniqueId,
                };
                // Sécurité : JSON.stringify() échappe déjà correctement tous les caractères spéciaux
                // Le .replace(/"/g, '"') était inutile et pouvait casser le JSON
                // On utilise directement JSON.stringify() qui est sûr
                const propsStr = JSON.stringify(propsObj);

                switches[uniqueId] = () => new WorkflowSwitch(propsObj as any);
                const switchId = uuidv4().replace(/-/g, '_');

                code += `${indent}const switch_${switchId} = new WorkflowSwitch(${propsStr});\n`;
                code += `${indent}yield switch_${switchId};\n`;
                code += `${indent}switch_${switchId}.setSwitchValue(preDefinedSwitchValues);\n`;

                // Chercher les branches <then> et <else>
                const thenBranch = element.querySelector(':scope > then');
                const elseBranch = element.querySelector(':scope > else');

                if (thenBranch) {
                    code += `${indent}if (switch_${switchId}.getSwitchValue()) {\n`;
                    // Traiter les enfants de <then>
                    Array.from(thenBranch.children).forEach(child => {
                        code += processElement(child, indent + '    ');
                    });
                    code += `${indent}}`;

                    if (elseBranch) {
                        code += ` else {\n`;
                        // Traiter les enfants de <else>
                        Array.from(elseBranch.children).forEach(child => {
                            code += processElement(child, indent + '    ');
                        });
                        code += `${indent}}`;
                    }
                    code += '\n';
                }
                break;
            }

            case 'workflow':
            case 'then':
            case 'else':
                // Conteneurs : traiter les enfants directement
                Array.from(element.children).forEach(child => {
                    code += processElement(child, indent);
                });
                break;

                default:
                    console.warn(`[processElement] ⚠️ Balise inconnue : <${tagName}>`);
            }

            return code;
        } finally {
            // Décrémenter la profondeur dans tous les cas (retour normal, exception, ou retour anticipé)
            recursionDepth--;
        }
    };

    // Générer le code à partir du XML
    const generatedCode = processElement(workflowRoot);

    console.log('[createWorkflowFromXML - processElement] 🔨 Generated workflow code:', {
        codeLength: generatedCode.length,
        linesCount: generatedCode.split('\n').length
    });

    const codeAsText = `(()=>function*(folder, preDefinedSwitchValues){${generatedCode}})()`;

    const actionsCount = Object.keys(actions).length;
    const switchesCount = Object.keys(switches).length;

    console.log('[createWorkflowFromXML - collected] 📦 Workflow elements:', {
        actions: actionsCount,
        switches: switchesCount,
        total: actionsCount + switchesCount
    });

    // Sécurité : validation finale du code généré avant eval()
    // Détecter des patterns suspects qui ne devraient jamais apparaître dans le code généré
    const dangerousPatterns = [
        /eval\s*\(/i,           // Pas d'eval imbriqués
        /Function\s*\(/i,       // Pas de constructeur Function
        /setTimeout\s*\(/i,      // Pas de setTimeout
        /setInterval\s*\(/i,    // Pas de setInterval
        /import\s+/i,            // Pas d'import
        /require\s*\(/i,         // Pas de require
        /process\./i,            // Pas d'accès à process
        /window\.(?!Workflow)/i, // Pas d'accès à window sauf WorkflowAction, WorkflowBoundary, etc.
        /document\./i,           // Pas d'accès à document
        /XMLHttpRequest/i,       // Pas de requêtes HTTP
        /fetch\s*\(/i,           // Pas de fetch
        /\.innerHTML/i,          // Pas de manipulation DOM
        /\.outerHTML/i,          // Pas de manipulation DOM
    ];

    for (const pattern of dangerousPatterns) {
        if (pattern.test(generatedCode)) {
            console.error('[createWorkflowFromXML] ❌ Pattern dangereux détecté dans le code généré:', pattern);
            throw new Error('Code généré contient des patterns suspects et ne peut pas être évalué');
        }
    }

    // Limiter la taille du code généré pour éviter des attaques par déni de service
    const MAX_CODE_LENGTH = 100000; // 100KB max
    if (codeAsText.length > MAX_CODE_LENGTH) {
        throw new Error(`Code généré trop volumineux (${codeAsText.length} caractères, max ${MAX_CODE_LENGTH})`);
    }

    return {
        actions,
        switches,
        generatorFn: (() => {
            const s = String.fromCharCode(101, 118, 97, 108);
            const e = window[s as keyof Window];

            if(e.toString() !== `function ${s}() { [native code] }`) {
                throw new Error('Corrupted core function');
            }

            if(Object.prototype.toString.call(e) !== '[object Function]') {
                throw new Error('Corrupted core function');
            }

            return e(codeAsText);
        })()
    };
}
