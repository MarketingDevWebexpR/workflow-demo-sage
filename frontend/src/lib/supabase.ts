/**
 * Supabase Client Configuration
 * Direct connection to Supabase for CRUD operations
 */

import { createClient } from '@supabase/supabase-js';

// Environment variables for Supabase connection
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    console.error('Missing Supabase environment variables. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY');
}

// Create and export the Supabase client
export const supabase = createClient(supabaseUrl || '', supabaseAnonKey || '');

// Edge Function base URL for AI endpoints
export const SUPABASE_FUNCTIONS_URL = `${supabaseUrl}/functions/v1`;

// =============================================================================
// Database Types (matching Supabase tables - snake_case)
// =============================================================================

export interface DbWorkflow {
    id: number;
    title: string;
    description: string | null;
    workflow_text: string | null;
    preferences: string | null;
    is_enabled: number;
    fragment_id: string | null;
    created_at: string;
    updated_at: string;
}

export interface DbView {
    id: string;
    workflow_id: string;
    step_id: string;
    components: string;
    created_at: string;
    updated_at: string;
}

export interface DbMessage {
    id: string;
    workflow_id: string;
    role: string;
    content: string;
    status: string;
    workflow_data: string | null;
    error_message: string | null;
    tokens_used: number | null;
    created_at: string;
    updated_at: string;
}

// =============================================================================
// Frontend Types (camelCase for app usage)
// =============================================================================

export interface FrontendWorkflow {
    Id: number;
    Title: string;
    Description: string | null;
    WorkflowText: string | null;
    Preferences: string;
    IsEnabled: 0 | 1;
    FragmentId: string;
    Created: string;
    Modified: string;
}

export interface FrontendView {
    Id: string;
    workflowId: string;
    stepId: string;
    components: string;
    createdAt: string;
    updatedAt: string;
}

// Re-export the IMessage type from chat.model for consistency
import type { IMessage } from '../models/chat.model';
export type FrontendMessage = IMessage;

// =============================================================================
// Mapping Functions: Database <-> Frontend
// =============================================================================

/**
 * Convert database workflow to frontend format (snake_case -> camelCase)
 */
export function mapDbWorkflowToFrontend(db: DbWorkflow): FrontendWorkflow {
    return {
        Id: db.id,
        Title: db.title,
        Description: db.description,
        WorkflowText: db.workflow_text,
        Preferences: db.preferences || '{}',
        IsEnabled: (db.is_enabled || 0) as 0 | 1,
        FragmentId: db.fragment_id || 'DEFAULT',
        Created: db.created_at,
        Modified: db.updated_at,
    };
}

/**
 * Convert frontend workflow to database format (camelCase -> snake_case)
 */
export function mapFrontendWorkflowToDb(
    frontend: Partial<{
        Title: string;
        Description: string | null;
        WorkflowText: string | null;
        Preferences: string;
        IsEnabled: 0 | 1;
        FragmentId: string;
    }>
): Partial<Omit<DbWorkflow, 'id' | 'created_at' | 'updated_at'>> {
    const result: Partial<Omit<DbWorkflow, 'id' | 'created_at' | 'updated_at'>> = {};

    if (frontend.Title !== undefined) result.title = frontend.Title;
    if (frontend.Description !== undefined) result.description = frontend.Description;
    if (frontend.WorkflowText !== undefined) result.workflow_text = frontend.WorkflowText;
    if (frontend.Preferences !== undefined) result.preferences = frontend.Preferences;
    if (frontend.IsEnabled !== undefined) result.is_enabled = frontend.IsEnabled;
    if (frontend.FragmentId !== undefined) result.fragment_id = frontend.FragmentId;

    return result;
}

/**
 * Convert database view to frontend format
 */
export function mapDbViewToFrontend(db: DbView): FrontendView {
    return {
        Id: db.id,
        workflowId: db.workflow_id,
        stepId: db.step_id,
        components: db.components,
        createdAt: db.created_at,
        updatedAt: db.updated_at,
    };
}

/**
 * Convert database message to frontend format
 */
export function mapDbMessageToFrontend(db: DbMessage): FrontendMessage {
    const metadata: FrontendMessage['metadata'] = {};

    if (db.workflow_data) {
        metadata.workflowData = JSON.parse(db.workflow_data);
    }
    if (db.error_message) {
        metadata.error = db.error_message;
    }
    if (db.tokens_used) {
        metadata.usage = {
            prompt_tokens: 0,
            completion_tokens: db.tokens_used,
            total_tokens: db.tokens_used,
        };
    }

    return {
        id: db.id,
        role: db.role as 'user' | 'assistant' | 'system',
        content: db.content,
        timestamp: new Date(db.created_at).getTime(),
        status: db.status as 'pending' | 'streaming' | 'completed' | 'error',
        metadata: Object.keys(metadata).length > 0 ? metadata : undefined,
    };
}

/**
 * Convert frontend message to database format
 */
export function mapFrontendMessageToDb(
    frontend: Partial<FrontendMessage>,
    workflowId: string
): Partial<Omit<DbMessage, 'created_at' | 'updated_at'>> {
    const result: Partial<Omit<DbMessage, 'created_at' | 'updated_at'>> = {
        workflow_id: workflowId,
    };

    if (frontend.id !== undefined) result.id = frontend.id;
    if (frontend.role !== undefined) result.role = frontend.role;
    if (frontend.content !== undefined) result.content = frontend.content;
    if (frontend.status !== undefined) result.status = frontend.status;
    if (frontend.metadata?.workflowData !== undefined) {
        result.workflow_data = JSON.stringify(frontend.metadata.workflowData);
    }
    if (frontend.metadata?.error !== undefined) {
        result.error_message = frontend.metadata.error;
    }
    if (frontend.metadata?.usage?.total_tokens !== undefined) {
        result.tokens_used = frontend.metadata.usage.total_tokens;
    }

    return result;
}
