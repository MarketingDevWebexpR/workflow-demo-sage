/**
 * Convertit une chaîne JSON en un tableau d'objets typé.
 * Si la conversion échoue ou si la valeur n'est pas un tableau, retourne un tableau vide.
 *
 * @template TObject - Type des objets contenus dans le tableau.
 * @param {string | null | undefined} json - La chaîne JSON à parser.
 * @return {TObject[]} Le tableau d'objets parsé ou un tableau vide en cas d'échec.
 *
 * @example
 * const jsonString = '[{"id": 1, "name": "Alice"}, {"id": 2, "name": "Bob"}]';
 * const users = getArrayFromStringifiedJson<{ id: number, name: string }>(jsonString);
 * console.log(users); // [{ id: 1, name: "Alice" }, { id: 2, name: "Bob" }]
 *
 * const invalidJson = '{"id": 1, "name": "Alice"}';
 * console.log(getArrayFromStringifiedJson(invalidJson)); // []
 */
export function getArrayFromStringifiedJson<TObject>( json: string | null | undefined ): TObject[] {

    try {

        const parsed = JSON.parse( json! );

        if( Array.isArray( parsed ) )
            return parsed;

        return [];
    } catch {

        return [];
    }
}


/**
 * Convertit une chaîne JSON en un objet typé.
 * Si la conversion échoue ou si la valeur n'est pas un objet, retourne un objet vide (`fallback`).
 *
 * @template TObject - Type de l'objet à retourner.
 * @param {string | null | undefined} json - La chaîne JSON à parser.
 * @return {TObject} L'objet parsé ou un objet vide (`{}`) en cas d'échec.
 *
 * @example
 * const jsonString = '{"id": 1, "name": "Alice"}';
 * const user = getObjectFromStringifiedJson<{ id: number, name: string }>(jsonString);
 * console.log(user); // { id: 1, name: "Alice" }
 *
 * const invalidJson = 'invalid';
 * console.log(getObjectFromStringifiedJson(invalidJson)); // {}
 */
export function getObjectFromStringifiedJson<TObject>( json: string | null | undefined ): TObject {

    const fallback = {} as TObject;

    try {

        const parsed = JSON.parse( json! );

        if( typeof parsed === 'object' && parsed !== null ) {

            return parsed;
        }

        return fallback;
    } catch {

        return fallback;
    }
}
