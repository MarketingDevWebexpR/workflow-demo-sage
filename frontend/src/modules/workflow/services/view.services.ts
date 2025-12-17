import type { TView, TViewUpdate } from '../models/view.model';
import { API_WORKFLOWS_URL } from '../../../lib/api';

const API_BASE_URL = API_WORKFLOWS_URL;

/**
 * Service pour gérer les vues IHM des étapes de workflow
 */
const ViewServices = {
	/**
	 * Récupérer toutes les vues d'un workflow
	 */
	async getAllByWorkflowId(workflowId: string): Promise<TView[]> {
		const response = await fetch(`${API_BASE_URL}/${workflowId}/views`);
		const result = await response.json();
		
		if (!result.success) {
			throw new Error(result.error || 'Erreur lors de la récupération des vues');
		}

		return result.data;
	},

	/**
	 * Récupérer l'IHM d'une étape spécifique
	 */
	async getByStepId(workflowId: string, stepId: string): Promise<TView> {
		const response = await fetch(`${API_BASE_URL}/${workflowId}/views/${stepId}`);
		const result = await response.json();
		
		if (!result.success) {
			throw new Error(result.error || 'Erreur lors de la récupération de la vue');
		}
		
		return result.data;
	},

	/**
	 * Créer ou mettre à jour l'IHM d'une étape
	 */
	async upsert(workflowId: string, stepId: string, data: TViewUpdate): Promise<TView> {
		const response = await fetch(`${API_BASE_URL}/${workflowId}/views/${stepId}`, {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(data),
		});
		
		const result = await response.json();
		
		if (!result.success) {
			throw new Error(result.error || 'Erreur lors de la sauvegarde de la vue');
		}
		
		return result.data;
	},

	/**
	 * Supprimer l'IHM d'une étape
	 */
	async deleteByStepId(workflowId: string, stepId: string): Promise<void> {
		const response = await fetch(`${API_BASE_URL}/${workflowId}/views/${stepId}`, {
			method: 'DELETE',
		});
		
		const result = await response.json();
		
		if (!result.success) {
			throw new Error(result.error || 'Erreur lors de la suppression de la vue');
		}
	},

	/**
	 * Supprimer toutes les vues d'un workflow
	 */
	async deleteAllByWorkflowId(workflowId: string): Promise<number> {
		const response = await fetch(`${API_BASE_URL}/${workflowId}/views`, {
			method: 'DELETE',
		});
		
		const result = await response.json();
		
		if (!result.success) {
			throw new Error(result.error || 'Erreur lors de la suppression des vues');
		}
		
		return result.deletedCount;
	},
};

export default ViewServices;

