/**
 * Workflow Item Services - Version API REST pour automation-poc
 * 
 * Remplace l'ancien système SharePoint/PnP par des appels à notre API backend Hono
 */

import Service from '../../../models/service.model';
import { type TWorkflowItem, type TCreateWorkflowItemProps, type TUpdateWorkflowItemProps } from '../models/workflow-item.model';
import { type IServiceFns, type TServices } from '../../../utils/context.utils';

// URL de base de l'API (via le proxy Vite)
const API_BASE_URL = '/api/workflows';

/**
 * Convertit les données de l'API backend vers le format frontend
 * Le backend utilise maintenant les mêmes noms de champs que le frontend (format compatible SharePoint)
 */
function mapBackendToFrontend(backendData: any): TWorkflowItem {
    // Le backend renvoie déjà: Id, Title, Description, WorkflowText, Preferences, IsEnabled, FragmentId, Created, Modified
    return {
        Id: backendData.Id,
        Title: backendData.Title,
        Description: backendData.Description || null,
        WorkflowText: backendData.WorkflowText || null,
        Preferences: backendData.Preferences || '{}',
        IsEnabled: backendData.IsEnabled || 0,
        FragmentId: backendData.FragmentId || 'DEFAULT',
        Created: backendData.Created || backendData.createdAt || new Date().toISOString(),
        Modified: backendData.Modified || backendData.updatedAt || new Date().toISOString(),
    };
}

/**
 * Convertit les données du frontend vers le format API backend
 * Le backend accepte maintenant les mêmes noms de champs que le frontend
 */
function mapFrontendToBackend(frontendData: TCreateWorkflowItemProps | TUpdateWorkflowItemProps) {
    // Pas de conversion nécessaire, le backend utilise les mêmes noms
    return {
        Title: frontendData.Title,
        Description: frontendData.Description || undefined,
        WorkflowText: frontendData.WorkflowText,
        Preferences: frontendData.Preferences || undefined,
        IsEnabled: frontendData.IsEnabled,
        FragmentId: frontendData.FragmentId || undefined,
    };
}

/**
 * Fonctions de service CRUD pour les workflow items
 */
const serviceFns: IServiceFns<TWorkflowItem, TCreateWorkflowItemProps, TUpdateWorkflowItemProps> = {

    /**
     * Récupère un nombre limité de workflows avec filtres optionnels
     */
    async fetchLimited({
        filterQuery,
        orderBy,
        top,
    }) {
        const params = new URLSearchParams();
        if (top) params.append('limit', top.toString());
        if (orderBy) params.append('sortBy', orderBy[0]);
        if (orderBy) params.append('sortOrder', orderBy[1] ? 'desc' : 'asc');
        if (filterQuery) params.append('filter', filterQuery);

        const url = `${API_BASE_URL}?${params.toString()}`;
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`Failed to fetch workflows: ${response.statusText}`);
        }

        const result = await response.json();
        
        if (!result.success) {
            throw new Error(result.message || 'Failed to fetch workflows');
        }

        return (result.data || []).map(mapBackendToFrontend);
    },

    /**
     * Récupère tous les workflows
     */
    async fetchAll({
        filterQuery,
        orderBy,
        top,
    }) {
        // Pour l'instant, identique à fetchLimited
        // À améliorer plus tard avec pagination côté backend si nécessaire
        return await serviceFns.fetchLimited({ sp: null, filterQuery, orderBy, top });
    },

    /**
     * Récupère un workflow par son ID
     */
    async fetchById({ id }) {
        const response = await fetch(`${API_BASE_URL}/${id}`);

        if (!response.ok) {
            if (response.status === 404) {
                throw new Error(`Workflow with ID ${id} not found`);
            }
            throw new Error(`Failed to fetch workflow: ${response.statusText}`);
        }

        const result = await response.json();

        if (!result.success) {
            throw new Error(result.message || 'Failed to fetch workflow');
        }

        return mapBackendToFrontend(result.data);
    },

    /**
     * Crée un nouveau workflow
     */
    async create({ props }) {
        const backendData = mapFrontendToBackend(props);

        const response = await fetch(API_BASE_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(backendData),
        });

        if (!response.ok) {
            throw new Error(`Failed to create workflow: ${response.statusText}`);
        }

        const result = await response.json();

        if (!result.success) {
            throw new Error(result.message || 'Failed to create workflow');
        }

        return mapBackendToFrontend(result.data);
    },

    /**
     * Met à jour un workflow existant
     */
    async update({ id, props }) {

        console.log('Réception des données du front end', id, props );
        const backendData = mapFrontendToBackend(props);
        console.log('Conversion des données du front end vers le format API backend', { backendData });

        const response = await fetch(`${API_BASE_URL}/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(backendData),
        });

        console.log('Réponse de l\'API backend', response );

        if (!response.ok) {
            if (response.status === 404) {
                throw new Error(`Workflow with ID ${id} not found`);
            }
            throw new Error(`Failed to update workflow: ${response.statusText}`);
        }

        const result = await response.json();

        if (!result.success) {
            throw new Error(result.message || 'Failed to update workflow');
        }

        return mapBackendToFrontend(result.data);
    },

    /**
     * Supprime un workflow
     */
    async delete({ id }) {
        const response = await fetch(`${API_BASE_URL}/${id}`, {
            method: 'DELETE',
        });

        if (!response.ok) {
            if (response.status === 404) {
                throw new Error(`Workflow with ID ${id} not found`);
            }
            throw new Error(`Failed to delete workflow: ${response.statusText}`);
        }

        const result = await response.json();

        if (!result.success) {
            throw new Error(result.message || 'Failed to delete workflow');
        }

        return id;
    },

    /**
     * Supprime plusieurs workflows en bulk
     */
    async deleteBulk({ ids }) {
        const results = await Promise.allSettled(
            ids.map(id => serviceFns.delete({ sp: null, id }))
        );

        const successes: number[] = [];
        const failures: { id: number; error: Error }[] = [];

        results.forEach((result, index) => {
            const id = ids[index];
            if (result.status === 'fulfilled') {
                successes.push(id);
            } else {
                failures.push({
                    id,
                    error: result.reason instanceof Error ? result.reason : new Error(String(result.reason)),
                });
            }
        });

        return { successes, failures };
    },
};

/**
 * Services wrappés avec la classe Service pour le typage et les événements
 */
const WorkflowItemServices: TServices<TWorkflowItem, TCreateWorkflowItemProps, TUpdateWorkflowItemProps> = {
    fetchLimited: new Service(serviceFns.fetchLimited),
    fetchAll: new Service(serviceFns.fetchAll),
    fetchById: new Service(serviceFns.fetchById),
    create: new Service(serviceFns.create),
    update: new Service(serviceFns.update),
    delete: new Service(serviceFns.delete),
    deleteBulk: new Service(serviceFns.deleteBulk),
};

export default WorkflowItemServices;

