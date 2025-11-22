/**
 * Calcule le nombre d'années écoulées depuis une date donnée.
 *
 * @param {Date} careerStartDate - La date de début de carrière.
 * @return {number} Le nombre d'années écoulées depuis `careerStartDate`.
 *
 * @example
 * getYearsSince(new Date(2000, 0, 1)); // Retourne 24 si on est en 2024
 */
export function getYearsSince(careerStartDate: Date): number {
    const currentDate = new Date();
    const diffInMilliseconds = currentDate.getTime() - careerStartDate.getTime();
    const diffInYears = diffInMilliseconds / (1000 * 60 * 60 * 24 * 365.25); // 365.25 pour prendre en compte les années bissextiles
    return Math.floor(diffInYears);
}

/**
 * Formate une date en format `JJ/MM/AAAA` ou avec un séparateur personnalisé.
 *
 * @param {Date} date - La date à formater.
 * @param {Object} [options] - Options pour personnaliser le format.
 * @param {string} [options.separator='/'] - Le séparateur à utiliser entre les parties de la date (par défaut `/`).
 * @return {string} La date formatée sous la forme `JJ/MM/AAAA`.
 *
 * @example
 * formatDate(new Date(2024, 0, 1)); // "01/01/2024"
 * formatDate(new Date(2024, 0, 1), { separator: '-' }); // "01-01-2024"
 */
export function formatDate(date: Date, options: { separator?: string } = { separator: '/' }): string {
    
    const separator = options.separator ?? '/'; // Assure que separator est toujours défini

    return new Intl.DateTimeFormat('fr-FR', {
        month: '2-digit',
        day: '2-digit',
        year: 'numeric',
    })
    .format(date)
    .replace(/\//g, separator); // Remplace tous les `/` par le séparateur personnalisé
}

/**
 * Ajoute un zéro devant un nombre si celui-ci est inférieur à 10.
 *
 * @param {number} num - Le nombre à formater.
 * @return {string} Le nombre formaté avec deux chiffres.
 *
 * @example
 * twoDigits(5); // "05"
 * twoDigits(12); // "12"
 */
export function twoDigits(num: number): string {
    return num < 10 ? `0${num}` : num.toString();
}
