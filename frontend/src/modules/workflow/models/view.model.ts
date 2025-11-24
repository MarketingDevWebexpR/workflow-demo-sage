// Modèle pour une vue IHM d'étape de workflow
export type TView = {
	Id: string;
	workflowId: string;
	stepId: string;
	components: string; // JSON stringified
	createdAt: string;
	updatedAt: string;
};

// DTO pour créer/mettre à jour une vue
export type TViewUpdate = {
	components: string;
};

