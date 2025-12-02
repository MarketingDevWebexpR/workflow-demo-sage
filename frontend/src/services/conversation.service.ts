// ========================================
// 💾 Service de Gestion des Conversations (API Backend)
// ========================================

import { type IMessage } from '../models/chat.model';

const API_BASE_URL = 'http://localhost:3000/api/workflows';

/**
 * Service pour gérer les conversations via API backend
 */
class ConversationService {
    /**
     * Récupérer tous les messages d'un workflow
     */
    async getMessagesByWorkflowId(workflowId: number): Promise<IMessage[]> {
        try {
            const response = await fetch(`${API_BASE_URL}/${workflowId}/messages`);
            const data = await response.json();
            
            if (data.success) {
                // Convertir le format API (majuscules) vers IMessage (minuscules)
                return (data.data || []).map((apiMessage: any) => ({
                    id: apiMessage.Id,
                    role: apiMessage.Role,
                    content: apiMessage.Content,
                    timestamp: new Date(apiMessage.createdAt).getTime(),
                    status: apiMessage.Status,
                    metadata: {
                        workflowData: apiMessage.WorkflowData ? JSON.parse(apiMessage.WorkflowData) : undefined,
                        error: apiMessage.ErrorMessage,
                        usage: apiMessage.TokensUsed ? { total_tokens: apiMessage.TokensUsed } : undefined,
                    },
                } as IMessage));
            }
            
            console.error('Erreur récupération messages:', data.error);
            return [];
        } catch (error) {
            console.error('Erreur fetch messages:', error);
            return [];
        }
    }

    /**
     * Créer un nouveau message
     */
    async addMessage(workflowId: number, message: Omit<IMessage, 'Id' | 'createdAt' | 'updatedAt'>): Promise<IMessage | null> {
        try {
            const response = await fetch(`${API_BASE_URL}/${workflowId}/messages`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    Role: message.role,
                    Content: message.content,
                    Status: message.status,
                    WorkflowData: message.metadata?.workflowData ? JSON.stringify(message.metadata.workflowData) : undefined,
                    ErrorMessage: message.metadata?.error,
                    TokensUsed: message.metadata?.usage?.total_tokens,
                }),
            });
            
            const data = await response.json();
            
            if (data.success) {
                // Convertir le format API vers IMessage
                const apiMessage = data.data;
                return {
                    id: apiMessage.Id,
                    role: apiMessage.Role,
                    content: apiMessage.Content,
                    timestamp: new Date(apiMessage.createdAt).getTime(),
                    status: apiMessage.Status,
                    metadata: {
                        workflowData: apiMessage.WorkflowData ? JSON.parse(apiMessage.WorkflowData) : undefined,
                        error: apiMessage.ErrorMessage,
                        usage: apiMessage.TokensUsed ? { total_tokens: apiMessage.TokensUsed } : undefined,
                    },
                } as IMessage;
            }
            
            console.error('❌ Erreur création message:', data.error);
            throw new Error(data.error || 'Impossible de créer le message');
        } catch (error) {
            console.error('❌ Erreur add message:', error);
            throw error;
        }
    }

    /**
     * Mettre à jour un message existant
     */
    async updateMessage(workflowId: number, messageId: string, updates: Partial<IMessage>): Promise<IMessage | null> {
        try {
            const updateData: any = {};
            
            if (updates.content !== undefined) updateData.Content = updates.content;
            if (updates.status !== undefined) updateData.Status = updates.status;
            if (updates.metadata?.workflowData) updateData.WorkflowData = JSON.stringify(updates.metadata.workflowData);
            if (updates.metadata?.error) updateData.ErrorMessage = updates.metadata.error;
            if (updates.metadata?.usage?.total_tokens) updateData.TokensUsed = updates.metadata.usage.total_tokens;
            
            const response = await fetch(`${API_BASE_URL}/${workflowId}/messages/${messageId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updateData),
            });
            
            const data = await response.json();
            
            if (data.success) {
                const apiMessage = data.data;
                return {
                    id: apiMessage.Id,
                    role: apiMessage.Role,
                    content: apiMessage.Content,
                    timestamp: new Date(apiMessage.createdAt).getTime(),
                    status: apiMessage.Status,
                    metadata: {
                        workflowData: apiMessage.WorkflowData ? JSON.parse(apiMessage.WorkflowData) : undefined,
                        error: apiMessage.ErrorMessage,
                        usage: apiMessage.TokensUsed ? { total_tokens: apiMessage.TokensUsed } : undefined,
                    },
                } as IMessage;
            }
            
            console.error('❌ Erreur mise à jour message:', data.error);
            throw new Error(data.error || 'Impossible de mettre à jour le message');
        } catch (error) {
            console.error('❌ Erreur update message:', error);
            throw error;
        }
    }

    /**
     * Supprimer tous les messages d'un workflow
     */
    async deleteAllMessages(workflowId: number): Promise<boolean> {
        try {
            const response = await fetch(`${API_BASE_URL}/${workflowId}/messages`, {
                method: 'DELETE',
            });
            
            const data = await response.json();
            
            if (data.success) {
                console.log(`🗑️ ${data.deletedCount} message(s) supprimé(s)`);
                return true;
            }
            
            console.error('Erreur suppression messages:', data.error);
            return false;
        } catch (error) {
            console.error('Erreur delete messages:', error);
            return false;
        }
    }

    /**
     * Supprimer un message spécifique
     */
    async deleteMessage(workflowId: number, messageId: string): Promise<boolean> {
        try {
            const response = await fetch(`${API_BASE_URL}/${workflowId}/messages/${messageId}`, {
                method: 'DELETE',
            });
            
            const data = await response.json();
            return data.success;
        } catch (error) {
            console.error('Erreur delete message:', error);
            return false;
        }
    }
}

// Export singleton
export const conversationService = new ConversationService();

