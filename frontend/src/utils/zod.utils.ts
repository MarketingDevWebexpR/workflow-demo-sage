import { z } from "zod";


/**
 * Génère un objet avec des valeurs initiales vides en fonction du schéma Zod.
 *
 * @param {z.ZodObject<any>} schema - Le schéma Zod à partir duquel générer les valeurs vides.
 * @return {Record<string, any>} Un objet contenant les clés du schéma avec des valeurs par défaut :
 * - `[]` pour les tableaux (`ZodArray`).
 * - `""` pour les chaînes de caractères (`ZodString`).
 * - `NaN` pour les nombres (`ZodNumber`).
 * - `{}` pour les objets (`ZodObject`).
 * - `null` pour les autres types.
 */
export function generateEmptyValues(schema: z.ZodObject<any>): Record<string, any> {
    return Object.fromEntries(
        Object.entries(schema.shape).map(([key, value]) => {

            if (value instanceof z.ZodArray) return [key, []]; // Si c'est un tableau, retourne []
            if (value instanceof z.ZodString) return [key, ""]; // Si c'est une string, retourne ""
            if (value instanceof z.ZodNumber) return [key, NaN]; // Si c'est un nombre, retourne NaN
            if (value instanceof z.ZodObject) return [key, {}]; // Si c'est un objet, retourne {}
            return [key, null]; // Par défaut, retourne null
        })
    );
}


/**
 * Génère un objet contenant les clés d'un schéma Zod sous une forme typée.
 * 
 * @param schema - Un schéma Zod de type `z.ZodObject<any>`
 * @returns Un objet où chaque clé est mappée à elle-même
 */
export function extractSchemaKeys<T extends z.ZodObject<any>>(schema: T) {
    return Object.keys(schema.shape).reduce((acc, key) => {
        return {
            ...acc,
            [key]: key as keyof T["shape"],
        };
    }, {} as Record<keyof T["shape"], keyof T["shape"]>);
}