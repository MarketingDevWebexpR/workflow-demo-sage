/**
 * Échappe les caractères spéciaux d'une chaîne pour une utilisation sécurisée dans une expression régulière.
 *
 * @param {string} [string=""] - La chaîne à échapper. Par défaut, une chaîne vide est utilisée.
 * @return {string} La chaîne avec tous les caractères spéciaux de regex échappés.
 *
 * @example
 * escapeRegExp("Hello. How are you?"); // "Hello\\. How are you\\?"
 * escapeRegExp("price(100$)"); // "price\\(100\\$\\)"
 */
export function escapeRegExp(string: string = ''): string {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}