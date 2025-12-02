import { z } from "zod";
import { type FieldValues } from "react-hook-form";
import { type TFormEngineItem } from "../types";
import { DEFAULT_MESSAGES, type TValidationRule } from "../types/validation.types";



// ════════════════════════════════════════════════════════════════════════════════
// 🎯 OBJECTIF DE CE FICHIER
// ════════════════════════════════════════════════════════════════════════════════
//
// Transforme la config déclarative des fields en schéma Zod pour react-hook-form
//
// FLOW:
// 1. Pour chaque field, créer un schéma Zod de base (string, array, etc.)
// 2. Appliquer les validationRules (required, maxItems, custom, etc.)
// 3. Retourner le schéma complet pour le zodResolver
//
// ════════════════════════════════════════════════════════════════════════════════


/**
 * Applique une règle de validation à un schéma Zod existant
 *
 * @param schema - Le schéma Zod à enrichir
 * @param rule - La règle de validation à appliquer (required, maxItems, email, etc.)
 * @returns Le schéma Zod enrichi avec la validation
 */
const applyValidationRule = <TFormValue extends FieldValues[keyof FieldValues]>(schema: z.ZodTypeAny, rule: TValidationRule<TFormValue>): z.ZodTypeAny => {
    switch (rule.type) {
        // ─────────────────────────────────────────────────────────
        // Champ requis (string non vide, array non vide, etc.)
        // ─────────────────────────────────────────────────────────
        case 'required':
            return schema.refine(
                (val) => {
                    if (Array.isArray(val)) return val.length > 0;
                    if (typeof val === 'string') return val.trim().length > 0;
                    return !!val;
                },
                { message: rule.message || DEFAULT_MESSAGES.required }
            );

        // ─────────────────────────────────────────────────────────
        // Nombre max/min d'items (pour multiSelect)
        // ─────────────────────────────────────────────────────────
        case 'maxItems':
            return (schema as z.ZodArray<any>).max(
                rule.max,
                rule.message || DEFAULT_MESSAGES.maxItems(rule.max)
            );

        case 'minItems':
            return (schema as z.ZodArray<any>).min(
                rule.min,
                rule.message || DEFAULT_MESSAGES.minItems(rule.min)
            );

        // ─────────────────────────────────────────────────────────
        // Longueur max/min de texte (pour input/textarea)
        // ─────────────────────────────────────────────────────────
        case 'maxLength':
            return (schema as z.ZodString).max(
                rule.max,
                rule.message || DEFAULT_MESSAGES.maxLength(rule.max)
            );

        case 'minLength':
            return (schema as z.ZodString).min(
                rule.min,
                rule.message || DEFAULT_MESSAGES.minLength(rule.min)
            );

        // ─────────────────────────────────────────────────────────
        // Formats spécifiques (email, url)
        // ─────────────────────────────────────────────────────────
        case 'email':
            return (schema as z.ZodString).email(
                rule.message || DEFAULT_MESSAGES.email
            );

        case 'url':
            return (schema as z.ZodString).url(
                rule.message || DEFAULT_MESSAGES.url
            );

        // ─────────────────────────────────────────────────────────
        // Validation custom (fonction définie par le dev)
        // ─────────────────────────────────────────────────────────
        case 'custom':
            return schema.refine(
                (val: any) => {
                    const result = rule.validator(val);
                    return typeof result === 'boolean' ? result : false;
                },
                (val: any) => {
                    const result = rule.validator(val);
                    const message = typeof result === 'string' ? result : 'Validation échouée';
                    return { message };
                }
            );

        default:
            return schema;
    }
};

/**
 * Construit un schéma Zod complet à partir de la config des fields
 *
 * @param fields - Record de tous les champs du formulaire
 * @returns Schéma Zod utilisable par le zodResolver de react-hook-form
 *
 * @example
 * const schema = buildSchemaFromFields({
 *   email: { type: 'input', validationRules: [{ type: 'required' }, { type: 'email' }] },
 *   skills: { type: 'multiSelect', validationRules: [{ type: 'maxItems', max: 3 }] },
 * });
 */
const buildSchemaFromFields = <TFormValues extends FieldValues>(
    fields: Record<keyof TFormValues, TFormEngineItem<TFormValues[keyof TFormValues]>>
) => {
    const shape: Record<string, z.ZodTypeAny> = {};

    // Parcourir chaque field pour créer son schéma
    for (const key in fields) {
        if (Object.prototype.hasOwnProperty.call(fields, key)) {
            const field = fields[key];

            // ─────────────────────────────────────────────────────────
            // ÉTAPE 1 : Créer le schéma de BASE selon le type de field
            // ⚠️ SANS .optional() pour l'instant
            // ─────────────────────────────────────────────────────────
            let fieldSchema: z.ZodTypeAny;

            switch (field.type) {
                case 'input':
                case 'textarea':
                    fieldSchema = z.string();
                    break;

                case 'multiSelect':
                    fieldSchema = z.array(z.string());
                    break;

                case 'select':
                    fieldSchema = z.string();
                    break;

                case 'file':
                    fieldSchema = z.any();
                    break;

                default:
                    fieldSchema = z.any();
            }

            // ─────────────────────────────────────────────────────────
            // ÉTAPE 2 : Trier les validationRules en 2 groupes
            // ─────────────────────────────────────────────────────────
            const nativeValidations: TValidationRule<TFormValues[keyof TFormValues]>[] = [];
            const refineValidations: TValidationRule<TFormValues[keyof TFormValues]>[] = [];
            let hasRequiredRule = false;

            if (field.validationRules && field.validationRules.length > 0) {
                for (const rule of field.validationRules) {
                    if (rule.type === 'required') {
                        hasRequiredRule = true;
                        refineValidations.push(rule);
                    } else if (rule.type === 'custom') {
                        refineValidations.push(rule);
                    } else {
                        // email, url, minLength, maxLength, minItems, maxItems
                        nativeValidations.push(rule);
                    }
                }
            }

            // ─────────────────────────────────────────────────────────
            // ÉTAPE 3 : Appliquer les validations NATIVES en premier
            // (email, url, min, max) - tant qu'on est sur ZodString/ZodArray
            // ─────────────────────────────────────────────────────────
            for (const rule of nativeValidations) {
                fieldSchema = applyValidationRule(fieldSchema, rule);
            }

            // ─────────────────────────────────────────────────────────
            // ÉTAPE 4 : Rendre optional si pas de required
            // ─────────────────────────────────────────────────────────
            if (!hasRequiredRule) {
                fieldSchema = fieldSchema.optional();
            }

            // ─────────────────────────────────────────────────────────
            // ÉTAPE 5 : Appliquer les validations REFINE en dernier
            // (required, custom) - créent un ZodEffects
            // ─────────────────────────────────────────────────────────
            for (const rule of refineValidations) {
                fieldSchema = applyValidationRule(fieldSchema, rule);
            }

            // ─────────────────────────────────────────────────────────
            // ÉTAPE 6 : Ajouter au schéma global
            // ─────────────────────────────────────────────────────────
            shape[key] = fieldSchema;
        }
    }

    // Retourner le schéma complet typé
    return z.object(shape) as unknown as z.ZodType<TFormValues>;
};


export {
    buildSchemaFromFields,
};

