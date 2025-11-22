/**
 * Convertit une taille en octets en une unité plus lisible (Ko, Mo, Go, etc.).
 *
 * @param {number} bytes - La taille en octets à formater.
 * @param {number} [decimals=0] - Le nombre de décimales à afficher (par défaut `0`).
 * @return {string} La taille formatée avec l'unité appropriée.
 *
 * @example
 * formatBytes(1024); // "1 Ko"
 * formatBytes(1048576); // "1 Mo"
 * formatBytes(123456789, 2); // "117.74 Mo"
 * formatBytes(0); // "0"
 */
export function formatBytes(bytes: number, decimals: number = 0): string {

    if (bytes === 0) return '0';

    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['o', 'Ko', 'Mo', 'Go', 'To', 'Po', 'Eo', 'Zo', 'Yo'];

    const i = Math.floor(Math.log(bytes) / Math.log(k));

    const value = parseFloat((bytes / Math.pow(k, i)).toFixed(dm));
    const unit = sizes[i];

    return `${value} ${unit}`;
}

/**
 * Taille maximale de fichier autorisée (250 Mo en octets)
 */
export const MAX_FILE_SIZE = 250 * 1024 * 1024;