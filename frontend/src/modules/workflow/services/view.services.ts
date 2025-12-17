/**
 * View Services - Supabase Direct Connection
 *
 * Manages IHM views for workflow steps using Supabase
 */

import type { TView, TViewUpdate } from '../models/view.model';
import { supabase, type DbView } from '../../../lib/supabase';

/**
 * Service for managing workflow step IHM views
 */
const ViewServices = {
    /**
     * Get all views for a workflow
     */
    async getAllByWorkflowId(workflowId: string): Promise<TView[]> {
        const { data, error } = await supabase
            .from('views')
            .select('*')
            .eq('workflow_id', workflowId)
            .order('created_at', { ascending: true });

        if (error) {
            throw new Error(error.message || 'Error fetching views');
        }

        return (data || []).map((item: DbView) => ({
            Id: item.id,
            workflowId: item.workflow_id,
            stepId: item.step_id,
            components: item.components,
            createdAt: item.created_at,
            updatedAt: item.updated_at,
        }));
    },

    /**
     * Get the IHM view for a specific step
     */
    async getByStepId(workflowId: string, stepId: string): Promise<TView | null> {
        const { data, error } = await supabase
            .from('views')
            .select('*')
            .eq('workflow_id', workflowId)
            .eq('step_id', stepId)
            .maybeSingle();

        if (error) {
            throw new Error(error.message || 'Error fetching view');
        }

        if (!data) {
            return null;
        }

        return {
            Id: data.id,
            workflowId: data.workflow_id,
            stepId: data.step_id,
            components: data.components,
            createdAt: data.created_at,
            updatedAt: data.updated_at,
        };
    },

    /**
     * Create or update the IHM view for a step (upsert)
     */
    async upsert(workflowId: string, stepId: string, viewData: TViewUpdate): Promise<TView> {
        // First check if view exists
        const { data: existing } = await supabase
            .from('views')
            .select('id')
            .eq('workflow_id', workflowId)
            .eq('step_id', stepId)
            .maybeSingle();

        let result;

        if (existing) {
            // Update existing view
            const { data, error } = await supabase
                .from('views')
                .update({ components: viewData.components })
                .eq('workflow_id', workflowId)
                .eq('step_id', stepId)
                .select()
                .single();

            if (error) {
                throw new Error(error.message || 'Error updating view');
            }
            result = data;
        } else {
            // Insert new view
            const { data, error } = await supabase
                .from('views')
                .insert({
                    workflow_id: workflowId,
                    step_id: stepId,
                    components: viewData.components,
                })
                .select()
                .single();

            if (error) {
                throw new Error(error.message || 'Error creating view');
            }
            result = data;
        }

        return {
            Id: result.id,
            workflowId: result.workflow_id,
            stepId: result.step_id,
            components: result.components,
            createdAt: result.created_at,
            updatedAt: result.updated_at,
        };
    },

    /**
     * Delete the IHM view for a step
     */
    async deleteByStepId(workflowId: string, stepId: string): Promise<void> {
        const { error } = await supabase
            .from('views')
            .delete()
            .eq('workflow_id', workflowId)
            .eq('step_id', stepId);

        if (error) {
            throw new Error(error.message || 'Error deleting view');
        }
    },

    /**
     * Delete all views for a workflow
     */
    async deleteAllByWorkflowId(workflowId: string): Promise<number> {
        // First count the views to delete
        const { count } = await supabase
            .from('views')
            .select('*', { count: 'exact', head: true })
            .eq('workflow_id', workflowId);

        const { error } = await supabase
            .from('views')
            .delete()
            .eq('workflow_id', workflowId);

        if (error) {
            throw new Error(error.message || 'Error deleting views');
        }

        return count || 0;
    },
};

export default ViewServices;
