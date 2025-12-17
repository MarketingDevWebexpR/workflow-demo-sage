// ========================================
// Service de Gestion des Conversations (Supabase Direct)
// ========================================

import { type IMessage } from '../models/chat.model';
import {
    supabase,
    mapDbMessageToFrontend,
    type DbMessage
} from '../lib/supabase';

/**
 * Service for managing workflow conversations via Supabase
 */
class ConversationService {
    /**
     * Get all messages for a workflow
     */
    async getMessagesByWorkflowId(workflowId: number): Promise<IMessage[]> {
        try {
            const { data, error } = await supabase
                .from('messages')
                .select('*')
                .eq('workflow_id', workflowId.toString())
                .order('created_at', { ascending: true });

            if (error) {
                console.error('Error fetching messages:', error);
                return [];
            }

            return (data || []).map((msg: DbMessage) => mapDbMessageToFrontend(msg));
        } catch (error) {
            console.error('Error fetch messages:', error);
            return [];
        }
    }

    /**
     * Create a new message
     */
    async addMessage(workflowId: number, message: Omit<IMessage, 'Id' | 'createdAt' | 'updatedAt'>): Promise<IMessage | null> {
        try {
            const dbData = {
                id: message.id,
                workflow_id: workflowId.toString(),
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
                console.error('Error creating message:', error);
                throw new Error(error.message || 'Unable to create message');
            }

            return mapDbMessageToFrontend(data as DbMessage);
        } catch (error) {
            console.error('Error add message:', error);
            throw error;
        }
    }

    /**
     * Update an existing message
     */
    async updateMessage(workflowId: number, messageId: string, updates: Partial<IMessage>): Promise<IMessage | null> {
        try {
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
                .eq('workflow_id', workflowId.toString())
                .select()
                .single();

            if (error) {
                console.error('Error updating message:', error);
                throw new Error(error.message || 'Unable to update message');
            }

            return mapDbMessageToFrontend(data as DbMessage);
        } catch (error) {
            console.error('Error update message:', error);
            throw error;
        }
    }

    /**
     * Delete all messages for a workflow
     */
    async deleteAllMessages(workflowId: number): Promise<boolean> {
        try {
            const { error } = await supabase
                .from('messages')
                .delete()
                .eq('workflow_id', workflowId.toString());

            if (error) {
                console.error('Error deleting messages:', error);
                return false;
            }

            console.log(`Deleted messages for workflow ${workflowId}`);
            return true;
        } catch (error) {
            console.error('Error delete messages:', error);
            return false;
        }
    }

    /**
     * Delete a specific message
     */
    async deleteMessage(workflowId: number, messageId: string): Promise<boolean> {
        try {
            const { error } = await supabase
                .from('messages')
                .delete()
                .eq('id', messageId)
                .eq('workflow_id', workflowId.toString());

            if (error) {
                console.error('Error deleting message:', error);
                return false;
            }

            return true;
        } catch (error) {
            console.error('Error delete message:', error);
            return false;
        }
    }
}

// Export singleton
export const conversationService = new ConversationService();
