export const modulePickerCSS = `
[data-module-picker-group] {

    container-type: inline-size;
}

[data-module-picker-items] {
    display: grid;
    gap: var(--spacing-2);
}

@container (min-width: 400px) {

    [data-module-picker-items] {
        grid-template-columns: repeat(2, minmax(0, 1fr));
    }
}

@container (min-width: 640px) {

    [data-module-picker-items] {
        grid-template-columns: repeat(3, minmax(0, 1fr));
    }
}

@container (min-width: 920px) {

    [data-module-picker-items] {
        grid-template-columns: repeat(4, minmax(0, 1fr));
    }
}

@container (min-width: 1200px) {

    [data-module-picker-items] {
        grid-template-columns: repeat(5, minmax(0, 1fr));
    }
}

@container (min-width: 1480px) {

    [data-module-picker-items] {
        grid-template-columns: repeat(6, minmax(0, 1fr));
    }
}
`;

