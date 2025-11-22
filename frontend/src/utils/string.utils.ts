export function capitalize(str: string) {
    return str
        .toLowerCase()  // Met tout en minuscule d'abord pour uniformité
        .replace(/(?:^|\s|-)\S/g, (match) => match.toUpperCase()); // Capitalise la première lettre après un espace ou un tiret
}