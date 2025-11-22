/**
 * Mélange un tableau en utilisant l'algorithme de Fisher-Yates (Knuth Shuffle).
 * 
 * @template T - Type des éléments du tableau
 * @param {T[]} array - Le tableau à mélanger
 * @returns {T[]} - Un nouveau tableau mélangé
 * 
 * @example
 * const numbers = [1, 2, 3, 4, 5];
 * const shuffledNumbers = shuffleArray(numbers);
 * console.log(shuffledNumbers);
 */
export function shuffleArray<T>(array: T[]): T[] {
    let shuffledArray = [...array]; // Copier le tableau pour éviter de modifier l'original
    for (let i = shuffledArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1)); // Générer un index aléatoire
        [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]]; // Échanger les éléments
    }
    return shuffledArray;
}