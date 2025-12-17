/**
 * Types TypeScript pour les tables Supabase
 * Ces types definissent la structure de la base de donnees
 */

export interface Database {
  public: {
    Tables: {
      workflows: {
        Row: WorkflowRow
        Insert: WorkflowInsert
        Update: WorkflowUpdate
      }
      executions: {
        Row: ExecutionRow
        Insert: ExecutionInsert
        Update: ExecutionUpdate
      }
      steps: {
        Row: StepRow
        Insert: StepInsert
        Update: StepUpdate
      }
      views: {
        Row: ViewRow
        Insert: ViewInsert
        Update: ViewUpdate
      }
      messages: {
        Row: MessageRow
        Insert: MessageInsert
        Update: MessageUpdate
      }
    }
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: Record<string, never>
  }
}

// ============================================================================
// WORKFLOWS
// ============================================================================

export interface WorkflowRow {
  id: string
  title: string
  description: string | null
  fragment_id: string | null
  is_enabled: number
  workflow_text: string
  preferences: string | null
  created_at: string
  updated_at: string
}

export interface WorkflowInsert {
  id?: string
  title: string
  description?: string | null
  fragment_id?: string | null
  is_enabled?: number
  workflow_text: string
  preferences?: string | null
  created_at?: string
  updated_at?: string
}

export interface WorkflowUpdate {
  id?: string
  title?: string
  description?: string | null
  fragment_id?: string | null
  is_enabled?: number
  workflow_text?: string
  preferences?: string | null
  updated_at?: string
}

/**
 * Type de workflow formate pour l'API (compatible avec l'ancien format SharePoint/MongoDB)
 */
export interface WorkflowApiResponse {
  Id: string
  Title: string
  Description: string | null
  FragmentId: string | null
  IsEnabled: number
  WorkflowText: string
  Preferences: string | null
  Created: string
  Modified: string
}

// ============================================================================
// EXECUTIONS
// ============================================================================

export interface ExecutionRow {
  id: string
  workflow_id: string
  current_workflow_item_id: string
  current_loop_turn: number | null
  workflow_resume: string
  workflow_switch_values: string
  created_at: string
  updated_at: string
}

export interface ExecutionInsert {
  id?: string
  workflow_id: string
  current_workflow_item_id: string
  current_loop_turn?: number | null
  workflow_resume?: string
  workflow_switch_values?: string
  created_at?: string
  updated_at?: string
}

export interface ExecutionUpdate {
  workflow_id?: string
  current_workflow_item_id?: string
  current_loop_turn?: number | null
  workflow_resume?: string
  workflow_switch_values?: string
  updated_at?: string
}

// ============================================================================
// STEPS
// ============================================================================

export interface StepRow {
  id: string
  execution_id: string
  workflow_item_id: string
  key_datas: string
  loop_turn: number | null
  created_at: string
  updated_at: string
}

export interface StepInsert {
  id?: string
  execution_id: string
  workflow_item_id: string
  key_datas?: string
  loop_turn?: number | null
  created_at?: string
  updated_at?: string
}

export interface StepUpdate {
  execution_id?: string
  workflow_item_id?: string
  key_datas?: string
  loop_turn?: number | null
  updated_at?: string
}

// ============================================================================
// VIEWS
// ============================================================================

export interface ViewRow {
  id: string
  workflow_id: string
  step_id: string
  components: string
  created_at: string
  updated_at: string
}

export interface ViewInsert {
  id?: string
  workflow_id: string
  step_id: string
  components: string
  created_at?: string
  updated_at?: string
}

export interface ViewUpdate {
  workflow_id?: string
  step_id?: string
  components?: string
  updated_at?: string
}

/**
 * Type de vue formate pour l'API
 */
export interface ViewApiResponse {
  Id: string
  workflowId: string
  stepId: string
  components: string
  createdAt: string
  updatedAt: string
}

// ============================================================================
// MESSAGES
// ============================================================================

export type MessageRole = 'user' | 'assistant' | 'system'
export type MessageStatus = 'pending' | 'streaming' | 'completed' | 'error'

export interface MessageRow {
  id: string
  workflow_id: string
  role: MessageRole
  content: string
  status: MessageStatus
  workflow_data: string | null
  error_message: string | null
  tokens_used: number | null
  created_at: string
  updated_at: string
}

export interface MessageInsert {
  id?: string
  workflow_id: string
  role: MessageRole
  content: string
  status?: MessageStatus
  workflow_data?: string | null
  error_message?: string | null
  tokens_used?: number | null
  created_at?: string
  updated_at?: string
}

export interface MessageUpdate {
  workflow_id?: string
  role?: MessageRole
  content?: string
  status?: MessageStatus
  workflow_data?: string | null
  error_message?: string | null
  tokens_used?: number | null
  updated_at?: string
}

/**
 * Type de message formate pour l'API (compatible avec l'ancien format)
 */
export interface MessageApiResponse {
  Id: string
  WorkflowId: string
  Role: MessageRole
  Content: string
  Status: MessageStatus
  WorkflowData: string | null
  ErrorMessage: string | null
  TokensUsed: number | null
  createdAt: string
  updatedAt: string
}

// ============================================================================
// HELPERS - Fonctions de transformation
// ============================================================================

/**
 * Transforme une ligne workflow Supabase en format API
 */
export function toWorkflowApi(row: WorkflowRow): WorkflowApiResponse {
  return {
    Id: row.id,
    Title: row.title,
    Description: row.description,
    FragmentId: row.fragment_id,
    IsEnabled: row.is_enabled,
    WorkflowText: row.workflow_text,
    Preferences: row.preferences,
    Created: row.created_at,
    Modified: row.updated_at,
  }
}

/**
 * Transforme une ligne view Supabase en format API
 */
export function toViewApi(row: ViewRow): ViewApiResponse {
  return {
    Id: row.id,
    workflowId: row.workflow_id,
    stepId: row.step_id,
    components: row.components,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }
}

/**
 * Transforme une ligne message Supabase en format API
 */
export function toMessageApi(row: MessageRow): MessageApiResponse {
  return {
    Id: row.id,
    WorkflowId: row.workflow_id,
    Role: row.role,
    Content: row.content,
    Status: row.status,
    WorkflowData: row.workflow_data,
    ErrorMessage: row.error_message,
    TokensUsed: row.tokens_used,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }
}
