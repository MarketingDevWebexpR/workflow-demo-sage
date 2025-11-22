/**
 * Génère un entier aléatoire compris entre `min` et `max` (inclus).
 *
 * @param {number} min - La borne inférieure (incluse).
 * @param {number} max - La borne supérieure (incluse).
 * @return {number} Un nombre entier aléatoire entre `min` et `max`.
 *
 * @example
 * getRandomInt(1, 10); // Peut retourner un entier entre 1 et 10
 * getRandomInt(50, 100); // Peut retourner un entier entre 50 et 100
 */
export function getRandomInt( min: number, max: number ): number {

    min = Math.ceil(min); 
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}


/**
 * Génère un identifiant unique incrémental à chaque appel.
 *
 * @generator
 * @yield {number} Un identifiant unique incrémenté à partir de 0.
 *
 * @example
 * const idGen = idMaker();
 * console.log(idGen.next().value); // 0
 * console.log(idGen.next().value); // 1
 * console.log(idGen.next().value); // 2
 */
export function* idMaker(): Generator<number> {

    let id = 0;
    while( true )
        yield id++;
}


/**
 * Générateur global d'identifiants uniques incrémentaux.
 *
 * @type {Generator<number>}
 * @example
 * console.log(appUniqueId.next().value); // 0
 * console.log(appUniqueId.next().value); // 1
 */
export const appUniqueId: Generator<number> = idMaker();


/**
 * Timestamp de lancement de l'application en millisecondes.
 *
 * @constant {number}
 * @example
 * console.log(appLaunchTimestamp); // 1700000000000 (exemple)
 */
export const appLaunchTimestamp = Date.now();