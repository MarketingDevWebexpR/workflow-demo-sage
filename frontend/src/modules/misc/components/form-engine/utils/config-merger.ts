import { type FieldValues, type Path } from "react-hook-form";
import { type TConfigOverrides } from "../types/config-overrides.types";
import { type TFormEngineItem, type TStructuredRow, type TFormLayout } from "../types";
import { evaluate, type LogicRule } from "../logic";


/**
 * Type pour la config de base (JSON-serializable)
 * Utilise des types génériques car la config vient de JSON
 */
type TBaseConfig<TFormValues extends FieldValues> = {
    fields: Record<string, Partial<TFormEngineItem<TFormValues[keyof TFormValues]>>>;
    layout: {
        structure: Array<{
            rowLayoutType: string;
            items: string[];
            itemsPerRow?: number;
        }>;
    };
    behavior: {
        initiallyHiddenFields?: string[];
        visibilityRules?: Array<{
            field: string;
            condition: Record<string, unknown>; // JSON object générique
            dependencies: string[];
        }>;
        computedFields?: Array<{
            field: string;
            compute: (values: TFormValues) => unknown;
            dependencies: string[];
        }>;
        onSubmit?: ((values: TFormValues) => void) | string;
        defaultValues?: Record<string, unknown>;
    };
};

/**
 * Type pour la config fusionnée (effective)
 */
type TMergedConfig<TFormValues extends FieldValues> = {
    fields: Record<string, TFormEngineItem<TFormValues[keyof TFormValues]>>;
    layout: TFormLayout<TFormValues>;
    behavior: {
        initiallyHiddenFields: (keyof TFormValues)[];
        visibilityRules: Array<{
            field: keyof TFormValues;
            condition: (values: TFormValues) => boolean;
            dependencies: Path<TFormValues>[];
        }>;
        computedFields: Array<{
            field: keyof TFormValues;
            compute: (values: TFormValues) => unknown;
            dependencies: Path<TFormValues>[];
        }>;
        onSubmit: (values: TFormValues) => void | string;
        defaultValues: Partial<TFormValues>;
    };
    onSubmit: (values: TFormValues) => void | string;
};


/**
 * Fusionne une config de base (JSON) avec des overrides (TypeScript custom)
 *
 * @param baseConfig - Configuration de base (JSON-friendly)
 * @param overrides - Overrides avec code custom (render, validators, etc.)
 * @returns Configuration effective fusionnée
 */
const mergeFormConfig = <TFormValues extends FieldValues>(
    baseConfig: TBaseConfig<TFormValues>,
    overrides: TConfigOverrides<TFormValues> = {}
): TMergedConfig<TFormValues> => {

    // 1. Merge des fields
    const mergedFields: Record<string, TFormEngineItem<TFormValues[keyof TFormValues]>> = {
        ...baseConfig.fields,
    } as Record<string, TFormEngineItem<TFormValues[keyof TFormValues]>>;

    if (overrides.fields) {
        Object.entries(overrides.fields).forEach(([fieldKey, fieldOverride]) => {
            const baseField = (mergedFields[fieldKey] || {}) as Partial<TFormEngineItem<TFormValues[keyof TFormValues]>>;

            if (fieldOverride) {
                mergedFields[fieldKey] = {
                    ...baseField,
                    ...fieldOverride,

                    // Merge spécial pour validationRules : concat au lieu de replace
                    validationRules: [
                        ...(baseField.validationRules || []),
                        ...(fieldOverride.validationRules || []),
                    ],

                    // Merge spécial pour props : deep merge
                    props: {
                        ...(baseField.props || {}),
                        ...(fieldOverride.props || {}),
                    },
                } as TFormEngineItem<TFormValues[keyof TFormValues]>;
            }
        });
    }

    // 2. Merge du layout
    const baseStructure = (baseConfig.layout?.structure || []) as TStructuredRow<TFormValues>[];
    const overrideStructure = (overrides.layout?.structure || []) as TStructuredRow<TFormValues>[];

    const mergedLayout: TFormLayout<TFormValues> = {
        structure: overrideStructure.length > 0 ? overrideStructure : baseStructure,
    };

    // 3. Merge du behavior avec conversion des LogicRules
    const baseVisibilityRules = (baseConfig.behavior?.visibilityRules || []).map(rule => ({
        field: rule.field as keyof TFormValues,
        condition: rule.condition,
        dependencies: rule.dependencies as Path<TFormValues>[],
    }));

    const overrideVisibilityRules = (overrides.behavior?.visibilityRules || []).map(rule => ({
        ...rule,
        condition: typeof rule.condition === 'function'
            ? rule.condition
            : rule.condition,
    }));

    // Conversion des LogicRules JSON en fonctions évaluables
    const mergedVisibilityRules = [...baseVisibilityRules, ...overrideVisibilityRules].map(rule => ({
        field: rule.field,
        dependencies: rule.dependencies,
        condition: typeof rule.condition === 'function'
            ? rule.condition
            : (values: TFormValues) => evaluate(rule.condition as LogicRule<TFormValues>, values) as boolean,
    }));

    const mergedBehavior = {
        initiallyHiddenFields: [
            ...((baseConfig.behavior?.initiallyHiddenFields || []) as (keyof TFormValues)[]),
            ...(overrides.behavior?.initiallyHiddenFields || []),
        ],

        visibilityRules: mergedVisibilityRules,

        computedFields: [
            ...((baseConfig.behavior?.computedFields || []) as Array<{
                field: keyof TFormValues;
                compute: (values: TFormValues) => unknown;
                dependencies: Path<TFormValues>[];
            }>),
            ...(overrides.behavior?.computedFields || []),
        ],

        onSubmit: (typeof overrides.behavior?.onSubmit === 'function'
            ? overrides.behavior.onSubmit
            : typeof baseConfig.behavior?.onSubmit === 'function'
                ? baseConfig.behavior.onSubmit
                : () => {}) as (values: TFormValues) => void | string,

        defaultValues: {
            ...(baseConfig.behavior?.defaultValues || {}),
            ...(overrides.behavior?.defaultValues || {}),
        } as Partial<TFormValues>,
    };

    // 4. Retourner la config fusionnée
    return {
        fields: mergedFields,
        layout: mergedLayout,
        behavior: mergedBehavior,
        onSubmit: mergedBehavior.onSubmit,
    };
};


export {
    mergeFormConfig,
    type TBaseConfig,
    type TMergedConfig,
};

