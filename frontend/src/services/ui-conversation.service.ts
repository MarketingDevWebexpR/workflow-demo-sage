// ========================================
// Service de Gestion des Conversations UI Builder (Supabase Direct)
// ========================================

import { type IMessage } from '../models/chat.model';
import {
    supabase,
    mapDbMessageToFrontend,
    type DbMessage
} from '../lib/supabase';

/**
 * Service for managing UI Builder conversations via Supabase
 * Reuses the messages system but with a stepId-based key
 */
class UiConversationService {
    /**
     * Generate a conversation ID from a stepId
     */
    private getConversationId(stepId: string): string {
        return `ui-${stepId}`;
    }

    /**
     * Get all messages for a view (stepId)
     */
    async getMessagesByStepId(_workflowId: number, stepId: string): Promise<IMessage[]> {
        try {
            const conversationId = this.getConversationId(stepId);

            const { data, error } = await supabase
                .from('messages')
                .select('*')
                .eq('workflow_id', conversationId)
                .order('created_at', { ascending: true });

            if (error) {
                console.error('Error fetching UI messages:', error);
                return [];
            }

            return (data || []).map((msg: DbMessage) => mapDbMessageToFrontend(msg));
        } catch (error) {
            console.error('Error fetch UI messages:', error);
            return [];
        }
    }

    /**
     * Create a new message
     */
    async addMessage(stepId: string, message: Omit<IMessage, 'Id' | 'createdAt' | 'updatedAt'>): Promise<IMessage | null> {
        try {
            const conversationId = this.getConversationId(stepId);

            const dbData = {
                id: message.id,
                workflow_id: conversationId,
                role: message.role,
                content: message.content,
                status: message.status,
                workflow_data: message.metadata?.workflowData ? JSON.stringify(message.metadata.workflowData) : null,
                error_message: message.metadata?.error || null,
                tokens_used: message.metadata?.usage?.total_tokens || null,
            };

            const { data, error } = await supabase
                .from('messages')
                .insert(dbData)
                .select()
                .single();

            if (error) {
                console.error('Error creating UI message:', error);
                throw new Error(error.message || 'Unable to create message');
            }

            return mapDbMessageToFrontend(data as DbMessage);
        } catch (error) {
            console.error('Error add UI message:', error);
            throw error;
        }
    }

    /**
     * Update an existing message
     */
    async updateMessage(stepId: string, messageId: string, updates: Partial<IMessage>): Promise<IMessage | null> {
        try {
            const conversationId = this.getConversationId(stepId);

            const updateData: Partial<DbMessage> = {};

            if (updates.content !== undefined) updateData.content = updates.content;
            if (updates.status !== undefined) updateData.status = updates.status;
            if (updates.metadata?.workflowData) updateData.workflow_data = JSON.stringify(updates.metadata.workflowData);
            if (updates.metadata?.error) updateData.error_message = updates.metadata.error;
            if (updates.metadata?.usage?.total_tokens) updateData.tokens_used = updates.metadata.usage.total_tokens;

            const { data, error } = await supabase
                .from('messages')
                .update(updateData)
                .eq('id', messageId)
                .eq('workflow_id', conversationId)
                .select()
                .single();

            if (error) {
                console.error('Error updating UI message:', error);
                throw new Error(error.message || 'Unable to update message');
            }

            return mapDbMessageToFrontend(data as DbMessage);
        } catch (error) {
            console.error('Error update UI message:', error);
            throw error;
        }
    }

    /**
     * Delete all messages for a view
     */
    async deleteAllMessages(stepId: string): Promise<boolean> {
        try {
            const conversationId = this.getConversationId(stepId);

            const { error } = await supabase
                .from('messages')
                .delete()
                .eq('workflow_id', conversationId);

            if (error) {
                console.error('Error deleting UI messages:', error);
                return false;
            }

            console.log(`Deleted UI messages for step ${stepId}`);
            return true;
        } catch (error) {
            console.error('Error delete UI messages:', error);
            return false;
        }
    }

    /**
     * Delete a specific message
     */
    async deleteMessage(stepId: string, messageId: string): Promise<boolean> {
        try {
            const conversationId = this.getConversationId(stepId);

            const { error } = await supabase
                .from('messages')
                .delete()
                .eq('id', messageId)
                .eq('workflow_id', conversationId);

            if (error) {
                console.error('Error deleting UI message:', error);
                return false;
            }

            return true;
        } catch (error) {
            console.error('Error delete UI message:', error);
            return false;
        }
    }
}

// Export singleton
export const uiConversationService = new UiConversationService();
