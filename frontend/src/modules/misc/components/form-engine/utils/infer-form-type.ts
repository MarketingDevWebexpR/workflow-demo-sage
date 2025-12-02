import { TFormEngineItem } from "../types";


/**
 * Utilitaire pour inférer le type d'un champ selon son type de field
 */
type InferFieldType<TField> =
    TField extends { type: 'multiSelect' } ? string[] :
    TField extends { type: 'file' } ? File :
    TField extends { type: 'input'; props: { type: 'date' } } ? string :
    TField extends { type: 'input'; props: { type: 'email' } } ? string :
    TField extends { type: 'input'; props: { type: 'tel' } } ? string :
    TField extends { type: 'input'; props: { type: 'url' } } ? string :
    TField extends { type: 'input' } ? string :
    TField extends { type: 'textarea' } ? string :
    TField extends { type: 'select' } ? string :
    TField extends { type: 'custom' } ? never :
    string;


/**
 * Infère le type de formulaire complet depuis une config de fields
 *
 * @example
 * ```typescript
 * const baseConfig = {
 *   fields: {
 *     name: { type: 'input' },
 *     tags: { type: 'multiSelect' },
 *   }
 * } as const;
 *
 * type FormValues = InferFormTypeFromConfig<typeof baseConfig>;
 * // → { name: string; tags: string[]; }
 * ```
 */
type InferFormTypeFromConfig<TConfig extends { fields: Record<string, Partial<TFormEngineItem<unknown>>> }> = {
    [K in keyof TConfig['fields']]: InferFieldType<TConfig['fields'][K]>
};


export {
    type InferFormTypeFromConfig,
    type InferFieldType,
};

