const buttonOnClickBehaviors = {
    openExternalLink: {
        label: "Ouvrir un lien externe",
    },
    openModal: {
        label: "Ouvrir une fenêtre modale",
    },
    openInternalLink: {
        label: "Naviguer vers une page du site",
    },
} as const;

type TButtonOnClickBehavior = keyof typeof buttonOnClickBehaviors;

export {
    buttonOnClickBehaviors,
    type TButtonOnClickBehavior,
};