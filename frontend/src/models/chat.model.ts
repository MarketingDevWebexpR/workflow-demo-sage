// ========================================
// 💬 Modèles de Données - Chat AI
// ========================================

/**
 * Rôle du message dans la conversation
 */
export type TMessageRole = 'user' | 'assistant' | 'system';

/**
 * Statut du message (pour le streaming)
 */
export type TMessageStatus = 'pending' | 'streaming' | 'completed' | 'error';

/**
 * Message individuel dans la conversation
 */
export interface IMessage {
    /** ID unique du message (timestamp-based) */
    id: string;
    
    /** Rôle de l'auteur du message */
    role: TMessageRole;
    
    /** Contenu du message (texte ou markdown) */
    content: string;
    
    /** Timestamp de création du message */
    timestamp: number;
    
    /** Statut du message */
    status: TMessageStatus;
    
    /** Métadonnées optionnelles */
    metadata?: {
        /** Workflow JSON généré (si applicable) */
        workflowData?: {
            title: string;
            workflowText: string;
            preferences: string;
        };
        
        /** Tokens utilisés (si applicable) */
        usage?: {
            prompt_tokens: number;
            completion_tokens: number;
            total_tokens: number;
        };
        
        /** Erreur (si status = 'error') */
        error?: string;
    };
}

/**
 * Contexte du workflow pour l'IA
 */
export interface IWorkflowContext {
    /** ID du workflow */
    workflowId: number;
    
    /** Titre du workflow */
    title: string;
    
    /** XML du workflow actuel */
    workflowXml: string;
    
    /** Préférences d'affichage (JSON stringifié) */
    preferences: string;
    
    /** Description du workflow */
    description?: string;
    
    /** Statut d'activation */
    isEnabled: boolean;
}

/**
 * Conversation complète avec historique
 */
export interface IConversation {
    /** ID unique de la conversation */
    id: string;
    
    /** ID du workflow associé */
    workflowId: number;
    
    /** Historique des messages */
    messages: IMessage[];
    
    /** Date de création de la conversation */
    createdAt: number;
    
    /** Date de dernière mise à jour */
    updatedAt: number;
    
    /** Contexte du workflow */
    workflowContext?: IWorkflowContext;
}

/**
 * Payload pour l'API de chat
 */
export interface IChatApiRequest {
    /** Message de l'utilisateur */
    message: string;
    
    /** Historique des messages (pour le contexte) */
    history: Array<{
        role: 'user' | 'assistant';
        content: string;
    }>;
    
    /** Contexte du workflow actuel */
    workflowContext?: IWorkflowContext;
}

/**
 * Réponse de l'API de chat (streaming)
 */
export interface IChatStreamChunk {
    type: 'chunk' | 'done' | 'error';
    content?: string;
    data?: string; // JSON du workflow
    error?: string;
}

// ========================================
// 🛠️ Helpers
// ========================================

/**
 * Créer un nouveau message
 */
export const createMessage = (
    role: TMessageRole,
    content: string,
    status: TMessageStatus = 'completed'
): IMessage => ({
    id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    role,
    content,
    timestamp: Date.now(),
    status,
});

/**
 * Créer une nouvelle conversation
 */
export const createConversation = (
    workflowId: number,
    workflowContext?: IWorkflowContext
): IConversation => ({
    id: `conv-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    workflowId,
    messages: [],
    createdAt: Date.now(),
    updatedAt: Date.now(),
    workflowContext,
});

/**
 * Formater l'historique pour l'API OpenAI
 */
export const formatHistoryForApi = (messages: IMessage[]): Array<{ role: 'user' | 'assistant'; content: string }> => {
    return messages
        .filter(msg => msg.role !== 'system' && msg.status === 'completed')
        .map(msg => ({
            role: msg.role as 'user' | 'assistant',
            content: msg.content,
        }));
};

