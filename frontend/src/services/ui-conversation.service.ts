// ========================================
// Service de Gestion des Conversations UI Builder (API Backend)
// ========================================

import { type IMessage } from '../models/chat.model';
import { API_WORKFLOWS_URL } from '../lib/api';

const API_BASE_URL = API_WORKFLOWS_URL;

/**
 * Service pour gérer les conversations de l'UI Builder via API backend
 * Réutilise le système de messages mais avec une clé basée sur stepId
 */
class UiConversationService {
    /**
     * Récupérer tous les messages d'une view (stepId)
     */
    async getMessagesByStepId(workflowId: number, stepId: string): Promise<IMessage[]> {
        try {
            // On utilise le stepId comme identifiant de conversation
            const conversationId = `ui-${stepId}`;
            const response = await fetch(`${API_BASE_URL}/${conversationId}/messages`);
            const data = await response.json();
            
            if (data.success) {
                // Convertir le format API vers IMessage
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
            
            console.error('Erreur récupération messages UI:', data.error);
            return [];
        } catch (error) {
            console.error('Erreur fetch messages UI:', error);
            return [];
        }
    }

    /**
     * Créer un nouveau message
     */
    async addMessage(stepId: string, message: Omit<IMessage, 'Id' | 'createdAt' | 'updatedAt'>): Promise<IMessage | null> {
        try {
            const conversationId = `ui-${stepId}`;
            const response = await fetch(`${API_BASE_URL}/${conversationId}/messages`, {
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
            
            console.error('❌ Erreur création message UI:', data.error);
            throw new Error(data.error || 'Impossible de créer le message');
        } catch (error) {
            console.error('❌ Erreur add message UI:', error);
            throw error;
        }
    }

    /**
     * Mettre à jour un message existant
     */
    async updateMessage(stepId: string, messageId: string, updates: Partial<IMessage>): Promise<IMessage | null> {
        try {
            const conversationId = `ui-${stepId}`;
            const updateData: any = {};
            
            if (updates.content !== undefined) updateData.Content = updates.content;
            if (updates.status !== undefined) updateData.Status = updates.status;
            if (updates.metadata?.workflowData) updateData.WorkflowData = JSON.stringify(updates.metadata.workflowData);
            if (updates.metadata?.error) updateData.ErrorMessage = updates.metadata.error;
            if (updates.metadata?.usage?.total_tokens) updateData.TokensUsed = updates.metadata.usage.total_tokens;
            
            const response = await fetch(`${API_BASE_URL}/${conversationId}/messages/${messageId}`, {
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
            
            console.error('❌ Erreur mise à jour message UI:', data.error);
            throw new Error(data.error || 'Impossible de mettre à jour le message');
        } catch (error) {
            console.error('❌ Erreur update message UI:', error);
            throw error;
        }
    }

    /**
     * Supprimer tous les messages d'une view
     */
    async deleteAllMessages(stepId: string): Promise<boolean> {
        try {
            const conversationId = `ui-${stepId}`;
            const response = await fetch(`${API_BASE_URL}/${conversationId}/messages`, {
                method: 'DELETE',
            });
            
            const data = await response.json();
            
            if (data.success) {
                console.log(`🗑️ ${data.deletedCount} message(s) UI supprimé(s)`);
                return true;
            }
            
            console.error('Erreur suppression messages UI:', data.error);
            return false;
        } catch (error) {
            console.error('Erreur delete messages UI:', error);
            return false;
        }
    }

    /**
     * Supprimer un message spécifique
     */
    async deleteMessage(stepId: string, messageId: string): Promise<boolean> {
        try {
            const conversationId = `ui-${stepId}`;
            const response = await fetch(`${API_BASE_URL}/${conversationId}/messages/${messageId}`, {
                method: 'DELETE',
            });
            
            const data = await response.json();
            return data.success;
        } catch (error) {
            console.error('Erreur delete message UI:', error);
            return false;
        }
    }
}

// Export singleton
export const uiConversationService = new UiConversationService();


