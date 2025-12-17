/**
 * Workflow Item Services - Supabase Direct Connection
 *
 * Replaces the old REST API calls with direct Supabase client operations
 */

import Service from '../../../models/service.model';
import { type TWorkflowItem, type TCreateWorkflowItemProps, type TUpdateWorkflowItemProps } from '../models/workflow-item.model';
import { type IServiceFns, type TServices } from '../../../utils/context.utils';
import {
    supabase,
    mapDbWorkflowToFrontend,
    mapFrontendWorkflowToDb,
    type DbWorkflow
} from '../../../lib/supabase';

/**
 * Service functions for workflow CRUD operations using Supabase
 */
const serviceFns: IServiceFns<TWorkflowItem, TCreateWorkflowItemProps, TUpdateWorkflowItemProps> = {

    /**
     * Fetch a limited number of workflows with optional filters
     */
    async fetchLimited({
        filterQuery,
        orderBy,
        top,
    }) {
        let query = supabase
            .from('workflows')
            .select('*');

        // Apply ordering
        if (orderBy) {
            const [column, descending] = orderBy;
            // Map frontend column names to database column names
            const dbColumn = mapColumnName(column);
            query = query.order(dbColumn, { ascending: !descending });
        } else {
            query = query.order('updated_at', { ascending: false });
        }

        // Apply limit
        if (top) {
            query = query.limit(top);
        }

        // Apply filter (basic text search on title)
        if (filterQuery) {
            query = query.ilike('title', `%${filterQuery}%`);
        }

        const { data, error } = await query;

        if (error) {
            throw new Error(`Failed to fetch workflows: ${error.message}`);
        }

        return (data || []).map((item: DbWorkflow) => mapDbWorkflowToFrontend(item));
    },

    /**
     * Fetch all workflows
     */
    async fetchAll({
        filterQuery,
        orderBy,
        top,
    }) {
        // Same as fetchLimited for now
        return await serviceFns.fetchLimited({ sp: null, filterQuery, orderBy, top });
    },

    /**
     * Fetch a workflow by ID
     */
    async fetchById({ id }) {
        const { data, error } = await supabase
            .from('workflows')
            .select('*')
            .eq('id', id)
            .single();

        if (error) {
            if (error.code === 'PGRST116') {
                throw new Error(`Workflow with ID ${id} not found`);
            }
            throw new Error(`Failed to fetch workflow: ${error.message}`);
        }

        return mapDbWorkflowToFrontend(data as DbWorkflow);
    },

    /**
     * Create a new workflow
     */
    async create({ props }) {
        const dbData = mapFrontendWorkflowToDb(props);

        const { data, error } = await supabase
            .from('workflows')
            .insert(dbData)
            .select()
            .single();

        if (error) {
            throw new Error(`Failed to create workflow: ${error.message}`);
        }

        return mapDbWorkflowToFrontend(data as DbWorkflow);
    },

    /**
     * Update an existing workflow
     */
    async update({ id, props }) {
        console.log('Updating workflow', id, props);
        const dbData = mapFrontendWorkflowToDb(props);
        console.log('Converted to DB format', dbData);

        const { data, error } = await supabase
            .from('workflows')
            .update(dbData)
            .eq('id', id)
            .select()
            .single();

        console.log('Supabase response', { data, error });

        if (error) {
            if (error.code === 'PGRST116') {
                throw new Error(`Workflow with ID ${id} not found`);
            }
            throw new Error(`Failed to update workflow: ${error.message}`);
        }

        return mapDbWorkflowToFrontend(data as DbWorkflow);
    },

    /**
     * Delete a workflow
     */
    async delete({ id }) {
        const { error } = await supabase
            .from('workflows')
            .delete()
            .eq('id', id);

        if (error) {
            if (error.code === 'PGRST116') {
                throw new Error(`Workflow with ID ${id} not found`);
            }
            throw new Error(`Failed to delete workflow: ${error.message}`);
        }

        return id;
    },

    /**
     * Delete multiple workflows in bulk
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
 * Map frontend column names to database column names (snake_case)
 */
function mapColumnName(frontendColumn: string): string {
    const columnMap: Record<string, string> = {
        'Title': 'title',
        'Description': 'description',
        'WorkflowText': 'workflow_text',
        'Preferences': 'preferences',
        'IsEnabled': 'is_enabled',
        'FragmentId': 'fragment_id',
        'Created': 'created_at',
        'Modified': 'updated_at',
        'Id': 'id',
    };
    return columnMap[frontendColumn] || frontendColumn.toLowerCase();
}

/**
 * Services wrapped with the Service class for typing and events
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
