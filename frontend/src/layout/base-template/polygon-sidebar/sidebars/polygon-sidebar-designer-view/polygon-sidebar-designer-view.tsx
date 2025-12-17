import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Bot, User, Trash2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { toast } from 'sonner';
import { Button } from '../../../../../components/ui/button/button';
import styles from './polygon-sidebar-designer-view.module.scss';
import { Textarea } from '../../../../../components/ui/form/base-fields/textarea/textarea';
import { Empty } from '../../../../../components/ui/empty/empty';
import { useWorkflowAutomationStore } from '../../../../../modules/workflow/store/workflow-automation.store';
import workflowItemServices from '../../../../../modules/workflow/services/workflow-item.services';
import type {
    IMessage,
    IWorkflowContext,
} from '../../../../../models/chat.model';
import {
    createMessage,
    formatHistoryForApi
} from '../../../../../models/chat.model';
import { LoadingMessage } from '../shared/loading-message/loading-message';
import { conversationService } from '../../../../../services/conversation.service';
import { AI_CHAT_URL } from '../../../../../lib/api';


type TPolygonSidebarDesignerViewProps = {
    onNavigate: (viewIndex: number) => void;
}

const PolygonSidebarDesignerView = ({ onNavigate }: TPolygonSidebarDesignerViewProps): React.ReactElement => {
    const location = useLocation();
    const [inputMessage, setInputMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [messages, setMessages] = useState<IMessage[]>([]);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const hasTriggeredInitialMessage = useRef(false);

    const dispatch = useWorkflowAutomationStore(state => state.dispatch);
    const selectedWorkflow = useWorkflowAutomationStore(state => state.workflowItem.selected.item);

    // 🔄 Charger les messages quand le workflow change
    useEffect(() => {
        if (selectedWorkflow?.Id) {
            void (async () => {
                const fetchedMessages = await conversationService.getMessagesByWorkflowId(selectedWorkflow.Id);
                
                // 🧹 Nettoyer les messages "orphelins" en streaming/pending
                // Si un message est en DB, c'est qu'il a été traité (même si l'update a échoué)
                const cleanedMessages = fetchedMessages.map(msg => {
                    if (msg.status === 'streaming' || msg.status === 'pending') {
                        console.warn('⚠️ Message en état invalide détecté, nettoyage:', msg.id, msg.status);
                        return { ...msg, status: 'completed' as const };
                    }
                    return msg;
                });
                
                setMessages(cleanedMessages);
                console.log('💬 Messages chargés:', {
                    count: cleanedMessages.length,
                    workflowId: selectedWorkflow.Id,
                    cleaned: cleanedMessages.length - fetchedMessages.filter(m => m.status === 'completed' || m.status === 'error').length,
                });
            })();
        }
        
        // Réinitialiser le flag quand on change de workflow
        hasTriggeredInitialMessage.current = false;
    }, [selectedWorkflow?.Id]);

    const handleSendMessage = useCallback(async (messageOverride?: string) => {
        const userMessageText = messageOverride || inputMessage.trim();
        if (!userMessageText || isLoading || !selectedWorkflow) return;

        // Réinitialiser l'input seulement si on n'utilise pas un override
        if (!messageOverride) {
            setInputMessage('');
        }
        setIsLoading(true);

        try {
            // 📝 Créer le message utilisateur
            const userMessage = createMessage('user', userMessageText, 'completed');
            const savedUserMessage = await conversationService.addMessage(selectedWorkflow.Id, userMessage);
            
            if (!savedUserMessage) throw new Error('Impossible de sauvegarder le message utilisateur');
            setMessages(prev => [...prev, savedUserMessage]);

            // 🤖 Créer un message assistant vide pour le streaming
            const assistantMessage = createMessage('assistant', '...', 'streaming');
            const savedAssistantMessage = await conversationService.addMessage(selectedWorkflow.Id, assistantMessage);
            
            if (!savedAssistantMessage) throw new Error('Impossible de créer le message assistant');
            setMessages(prev => [...prev, savedAssistantMessage]);
            
            const assistantMessageId = savedAssistantMessage.id;
            // 🧠 Préparer l'historique (sans le message assistant en cours de streaming)
            const historyMessages = messages.filter(
                msg => msg.id !== assistantMessageId && msg.status === 'completed'
            );
            const history = formatHistoryForApi(historyMessages);

            // 📋 Préparer le contexte du workflow
            const workflowContext: IWorkflowContext = {
                workflowId: selectedWorkflow.Id,
                title: selectedWorkflow.Title || 'Sans titre',
                workflowXml: selectedWorkflow.WorkflowText || '',
                preferences: selectedWorkflow.Preferences || '{}',
                description: selectedWorkflow.Description || undefined,
                isEnabled: selectedWorkflow.IsEnabled === 1,
            };

            console.log('📤 Envoi au backend:', {
                message: userMessageText,
                historyLength: history.length,
                workflowId: workflowContext.workflowId,
                workflowTitle: workflowContext.title,
            });

            // Appel fetch en mode streaming (Supabase Edge Function)
            const response = await fetch(AI_CHAT_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ 
                    message: userMessageText,
                    history,
                    workflowContext,
                }),
            });

            if (!response.ok || !response.body) {
                throw new Error('Erreur lors de l\'appel à l\'API');
            }

            // 📖 Lire le stream
            const reader = response.body.getReader();
            const decoder = new TextDecoder();
            let accumulatedContent = '';
            let fullJsonResponse = '';

            while (true) {
                const { done, value } = await reader.read();
                
                if (done) break;

                const chunk = decoder.decode(value, { stream: true });
                const lines = chunk.split('\n').filter(line => line.trim() !== '');

                for (const line of lines) {
                    if (line.startsWith('data: ')) {
                        const data = line.substring(6);
                        
                        try {
                            const parsed = JSON.parse(data);

                            if (parsed.type === 'chunk') {
                                // 📝 Ajouter le contenu au message progressivement
                                accumulatedContent += parsed.content;
                                
                                // Nettoyer l'affichage : masquer le délimiteur et le JSON
                                const delimiter = '---WORKFLOW_JSON---';
                                let displayContent = accumulatedContent;
                                
                                const delimiterIndex = displayContent.indexOf(delimiter);
                                if (delimiterIndex !== -1) {
                                    // Afficher uniquement le texte avant le délimiteur
                                    displayContent = displayContent.substring(0, delimiterIndex).trim();
                                }
                                
                                // Mettre à jour le message localement pour le streaming
                                setMessages(prev => 
                                    prev.map(msg => 
                                        msg.id === assistantMessageId 
                                            ? { ...msg, content: displayContent, status: 'streaming' as const }
                                            : msg
                                    )
                                );
                            } else if (parsed.type === 'done') {
                                // ✅ Stream terminé - on a le JSON complet (si présent)
                                fullJsonResponse = parsed.data;
                                
                                // Nettoyer le contenu affiché final
                                const delimiter = '---WORKFLOW_JSON---';
                                let displayContent = accumulatedContent;
                                const delimiterIndex = displayContent.indexOf(delimiter);
                                if (delimiterIndex !== -1) {
                                    displayContent = displayContent.substring(0, delimiterIndex).trim();
                                }
                                
                                // Mettre à jour le message dans l'API
                                const updatedMessage = await conversationService.updateMessage(
                                    selectedWorkflow.Id,
                                    assistantMessageId,
                                    {
                                        content: displayContent,
                                        status: 'completed',
                                        metadata: fullJsonResponse ? {
                                            workflowData: JSON.parse(fullJsonResponse),
                                        } : undefined,
                                    }
                                );
                                
                                // Mettre à jour l'état local (forcer completed même si API échoue)
                                setMessages(prev => 
                                    prev.map(msg => 
                                        msg.id === assistantMessageId 
                                            ? (updatedMessage || { ...msg, status: 'completed' as const, content: displayContent })
                                            : msg
                                    )
                                );
                            } else if (parsed.type === 'error') {
                                console.error('🔴 Erreur SSE:', parsed.error);
                                throw new Error(parsed.error);
                            }
                        } catch (e) {
                            console.error('🔴 Erreur parsing SSE:', e);
                        }
                    }
                }
            }

            // 🎯 Une fois le stream terminé, mettre à jour le workflow (SI un JSON a été généré)
            if (fullJsonResponse && selectedWorkflow?.Id) {
                try {
                    console.log('📦 JSON du workflow reçu, mise à jour...');
                    
                    // 🧹 Nettoyer les éventuels backticks markdown (sécurité supplémentaire)
                    let cleanedJson = fullJsonResponse.trim();
                    cleanedJson = cleanedJson.replace(/^```(?:json)?\s*\n?/i, '').replace(/\n?```\s*$/i, '');
                    cleanedJson = cleanedJson.trim();
                    
                    const parsedData = JSON.parse(cleanedJson);
                    const { title, workflowText, preferences } = parsedData;

                    dispatch({ type: 'UPDATE_WORKFLOW_ITEM' });
                    const result = await workflowItemServices.update.execute({
                        sp: null,
                        id: selectedWorkflow.Id,
                        props: {
                            Title: title,
                            Description: undefined,
                            FragmentId: undefined,
                            IsEnabled: 0,
                            WorkflowText: workflowText,
                            Preferences: JSON.stringify(preferences),
                        },
                    });
                    dispatch({ type: 'UPDATE_WORKFLOW_ITEM_FULFILLED', payload: result });

                    if (result instanceof Error) {
                        console.error('[PolygonSidebarDesignerView] Error updating workflow:', result);
                        dispatch({ type: 'SELECT_WORKFLOW_ITEM', payload: selectedWorkflow });
                    } else {
                        console.log('✅ Workflow mis à jour avec succès !');
                    }
                } catch (parseError) {
                    console.error('Erreur parsing workflow JSON:', parseError);
                }
            } else if (!fullJsonResponse) {
                console.log('💬 Réponse conversationnelle (pas de workflow généré)');
            }

        } catch (error) {
            console.error('❌ Erreur lors du chat:', error);
            
            const errorMsg = error instanceof Error ? error.message : 'Erreur inconnue';
            
            // Afficher un toast d'erreur à l'utilisateur
            toast.error('Erreur lors de l\'envoi du message', {
                description: errorMsg,
                duration: 5000,
            });
            
            // Mettre à jour le message avec l'erreur (si on a créé le message assistant)
            try {
                if (selectedWorkflow?.Id) {
                    // Chercher le message assistant dans l'état local
                    const assistantMsg = messages.find(m => m.role === 'assistant' && m.status === 'streaming');
                    
                    if (assistantMsg?.id) {
                        const errorMessage = await conversationService.updateMessage(
                            selectedWorkflow.Id,
                            assistantMsg.id,
                            {
                                content: `❌ ${errorMsg}`,
                                status: 'error',
                                metadata: {
                                    error: errorMsg,
                                },
                            }
                        );
                        
                        // Mettre à jour l'état local (forcer error même si API échoue)
                        setMessages(prev => 
                            prev.map(msg => 
                                msg.id === assistantMsg.id 
                                    ? (errorMessage || { ...msg, status: 'error' as const, content: `❌ ${errorMsg}` })
                                    : msg
                            )
                        );
                    }
                }
            } catch (updateError) {
                console.error('❌ Impossible de mettre à jour le message d\'erreur:', updateError);
            }
        } finally {
            setIsLoading(false);
        }
    }, [inputMessage, isLoading, selectedWorkflow, messages, dispatch]);

    // 🚀 Auto-submit du message initial depuis la page d'accueil
    useEffect(() => {
        const state = location.state as { initialMessage?: string; triggerAI?: boolean } | null;
        
        if (
            state?.triggerAI && 
            state?.initialMessage && 
            selectedWorkflow &&
            !hasTriggeredInitialMessage.current &&
            !isLoading
        ) {
            console.log('🚀 Auto-submit du message initial:', state.initialMessage);
            hasTriggeredInitialMessage.current = true;
            
            // Petit délai pour laisser le composant se monter
            setTimeout(() => {
                void handleSendMessage(state.initialMessage);
            }, 300);
        }
    }, [selectedWorkflow, isLoading, location.state, handleSendMessage]);

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        // Envoyer avec Enter (sans Shift)
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            void handleSendMessage();
        }
    };

    // 🗑️ Fonction pour effacer la conversation
    const handleClearConversation = async () => {
        if (!selectedWorkflow) return;
        
        if (confirm('Êtes-vous sûr de vouloir effacer toute la conversation ?')) {
            const success = await conversationService.deleteAllMessages(selectedWorkflow.Id);
            
            if (success) {
                setMessages([]);
                console.log('🗑️ Conversation effacée');
            }
        }
    };

    return <div className={styles.polygonSidebarDesignerView}>

        {/* Panneau conversationnel AI */}
        <div className={styles.polygonSidebarDesignerViewContent}>
            <div className={styles.polygonSidebarDesignerViewContentHeader}>
                <div className={styles.polygonSidebarDesignerViewHeader}>
                    <Button
                        variant="link"
                        className={styles.polygonSidebarDesignerViewBackButton}
                        onClick={() => onNavigate(0)}
                    >
                        <ArrowLeft size={16} />
                        <span>Back</span>
                    </Button>
                </div>

                {/* Header du panneau AI */}
                <div className={styles.polygonSidebarDesignerViewAiHeader}>
                    <Bot size={20} />
                    <h2 className={styles.polygonSidebarDesignerViewAiTitle}>AI Assistant</h2>
                </div>
            </div>

            {/* Zone de conversation */}
            <div className={styles.polygonSidebarDesignerViewConversation}>
                {messages.length === 0 && (
                    <Empty
                        Icon={Bot}
                        title="Décrivez, l'IA construit"
                        description="Expliquez ce que vous voulez automatiser. Posez des questions, ajustez, perfectionnez."
                    />
                )}

                {/* Messages de conversation */}
                <div className={styles.polygonSidebarDesignerViewMessages}>
                    {messages.map((msg) => (
                        <div 
                            key={msg.id} 
                            className={`${styles.message} ${styles[msg.role]}`}
                        >
                            <div className={styles.messageIcon}>
                                {msg.role === 'user' ? <User size={16} /> : <Bot size={16} />}
                            </div>
                            <div className={styles.messageContent}>
                                <div className={styles.messageText}>
                                    {msg.role === 'assistant' ? (
                                        <ReactMarkdown 
                                            remarkPlugins={[remarkGfm]}
                                            components={{
                                                // Customiser les composants markdown
                                                h1: ({node, ...props}) => <h1 className={styles.markdownH1} {...props} />,
                                                h2: ({node, ...props}) => <h2 className={styles.markdownH2} {...props} />,
                                                h3: ({node, ...props}) => <h3 className={styles.markdownH3} {...props} />,
                                                p: ({node, ...props}) => <p className={styles.markdownP} {...props} />,
                                                ul: ({node, ...props}) => <ul className={styles.markdownUl} {...props} />,
                                                ol: ({node, ...props}) => <ol className={styles.markdownOl} {...props} />,
                                                li: ({node, ...props}) => <li className={styles.markdownLi} {...props} />,
                                                code: ({node, className, ...props}) => {
                                                    const isInline = !className;
                                                    return isInline ? 
                                                        <code className={styles.markdownInlineCode} {...props} /> : 
                                                        <code className={`${styles.markdownCodeBlock} ${className || ''}`} {...props} />;
                                                },
                                                strong: ({node, ...props}) => <strong className={styles.markdownStrong} {...props} />,
                                                em: ({node, ...props}) => <em className={styles.markdownEm} {...props} />,
                                                blockquote: ({node, ...props}) => <blockquote className={styles.markdownBlockquote} {...props} />,
                                            }}
                                        >
                                            {msg.content}
                                        </ReactMarkdown>
                                    ) : (
                                        msg.content
                                    )}
                                </div>
                                {msg.status === 'streaming' && <LoadingMessage />}
                            </div>
                        </div>
                    ))}
                    <div ref={messagesEndRef} />
                </div>
            </div>

            {/* Actions et input */}
            <div className={styles.polygonSidebarDesignerViewFooter}>
                {/* Bouton pour effacer la conversation */}
                {messages.length > 0 && (
                    <div className={styles.polygonSidebarDesignerViewActions}>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => void handleClearConversation()}
                            className={styles.clearButton}
                        >
                            <Trash2 size={14} />
                            <span>Effacer la conversation ({messages.length})</span>
                        </Button>
                    </div>
                )}

                {/* Input pour envoyer des messages */}
                <div className={styles.polygonSidebarDesignerViewInputContainer}>
                    <div className={styles.polygonSidebarDesignerViewInputWrapper}>
                    <Textarea
                            placeholder="Décrivez votre workflow ou posez une question..."
                            className={styles.polygonSidebarDesignerViewInput}
                            value={inputMessage}
                            onChange={(e) => setInputMessage(e.target.value)}
                            onKeyDown={handleKeyDown}
                            disabled={isLoading}
                        />
                    </div>
                    <div className={styles.polygonSidebarDesignerViewInputFooter}>
                        <Button 
                            variant="default" 
                            size="iconSm" 
                            rounded="full" 
                            className={styles.polygonSidebarDesignerViewSendButton}
                            onClick={() => void handleSendMessage()}
                            disabled={isLoading || !inputMessage.trim()}
                        >
                            {isLoading ? '...' : <ArrowRight size={18} className={styles.buttonIconRight} />}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    </div>
};


export {
    PolygonSidebarDesignerView,
};
