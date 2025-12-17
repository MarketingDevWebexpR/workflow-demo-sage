import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { ArrowRight, Bot, User, Trash2, Sparkles } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { toast } from 'sonner';
import { Button } from '../../../../../../components/ui/button/button';
import { Textarea } from '../../../../../../components/ui/form/base-fields/textarea/textarea';
import { Empty } from '../../../../../../components/ui/empty/empty';
import { usePageStore } from '../../../../../../modules/view/store/page.store';
import { useWorkflowAutomationStore } from '../../../../../../modules/workflow/store/workflow-automation.store';
import type { IMessage } from '../../../../../../models/chat.model';
import { createMessage, formatHistoryForApi } from '../../../../../../models/chat.model';
import { uiConversationService } from '../../../../../../services/ui-conversation.service';
import { LoadingMessage } from '../../shared/loading-message/loading-message';
import { API_AI_URL } from '../../../../../../lib/api';
import styles from './ai-ui-builder.module.scss';


const AiUiBuilder = (): React.ReactElement => {
    const location = useLocation();
    
    // ========================================
    // 🎚️ FLAG DE SWITCH : JSON vs TSX
    // ========================================
    // ⚠️ Change cette valeur pour switcher entre les 2 modes :
    // - true  : Mode TSX (génère du code pour Sandpack)
    // - false : Mode JSON (génère des composants comme avant)
    const USE_TSX_MODE = true; // 👈 SWITCH ICI
    // ========================================
    
    // Extraire le stepId depuis l'URL via ce hack car useParams ne fonctionne pas car pas imbriqué dans routeur (format: /workflow/:workflowId/:stepId/ihm)
    const stepId = useMemo(() => {
        const pathParts = location.pathname.split('/');
        // Format attendu: ['', 'workflow', workflowId, stepId, 'ihm']
        if (pathParts.length >= 4 && pathParts[pathParts.length - 1] === 'ihm') {
            return pathParts[pathParts.length - 2];
        }
        return undefined;
    }, [location.pathname]);
    
    console.log('🔍 AiUiBuilder - URL:', location.pathname);
    console.log('🔍 AiUiBuilder - StepId extrait:', stepId);
    console.log('🎚️ Mode actif:', USE_TSX_MODE ? 'TSX (Sandpack)' : 'JSON (Composants)');
    
    const [inputMessage, setInputMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [messages, setMessages] = useState<IMessage[]>([]);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const dispatch = usePageStore(state => state.dispatch);
    const selectedView = usePageStore(state => state.selected.item);
    const selectedWorkflow = useWorkflowAutomationStore(state => state.workflowItem.selected.item);

    // 🔄 Charger les messages quand la view change
    useEffect(() => {
        if (selectedWorkflow?.Id && stepId) {
            void (async () => {
                const fetchedMessages = await uiConversationService.getMessagesByStepId(
                    selectedWorkflow.Id, 
                    stepId
                );
                
                // 🧹 Nettoyer les messages "orphelins" en streaming/pending
                const cleanedMessages = fetchedMessages.map(msg => {
                    if (msg.status === 'streaming' || msg.status === 'pending') {
                        console.warn('⚠️ Message UI en état invalide détecté, nettoyage:', msg.id, msg.status);
                        return { ...msg, status: 'completed' as const };
                    }
                    return msg;
                });
                
                setMessages(cleanedMessages);
                console.log('💬 Messages UI chargés:', {
                    count: cleanedMessages.length,
                    stepId,
                    cleaned: cleanedMessages.length - fetchedMessages.filter(m => m.status === 'completed' || m.status === 'error').length,
                });
            })();
        }
    }, [selectedWorkflow?.Id, stepId]);

    // 📜 Auto-scroll vers le bas quand les messages changent
    // useEffect(() => {
    //     messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    // }, [messages]);

    const handleSendMessage = useCallback(async (messageOverride?: string) => {
        const userMessageText = messageOverride || inputMessage.trim();
        if (!userMessageText || isLoading || !stepId) return;

        // 🛡️ Vérifier qu'une vue est sélectionnée
        if (!selectedView) {
            toast.error('Aucune vue sélectionnée', {
                description: 'Veuillez d\'abord sélectionner ou créer une vue',
                duration: 4000,
            });
            return;
        }

        // Réinitialiser l'input seulement si on n'utilise pas un override
        if (!messageOverride) {
            setInputMessage('');
        }
        setIsLoading(true);

        try {
            // 📝 Créer le message utilisateur
            const userMessage = createMessage('user', userMessageText, 'completed');
            const savedUserMessage = await uiConversationService.addMessage(stepId, userMessage);
            
            if (!savedUserMessage) throw new Error('Impossible de sauvegarder le message utilisateur');
            setMessages(prev => [...prev, savedUserMessage]);

            // 🤖 Créer un message assistant vide pour le streaming
            const assistantMessage = createMessage('assistant', '...', 'streaming');
            const savedAssistantMessage = await uiConversationService.addMessage(stepId, assistantMessage);
            
            if (!savedAssistantMessage) throw new Error('Impossible de créer le message assistant');
            setMessages(prev => [...prev, savedAssistantMessage]);
            
            const assistantMessageId = savedAssistantMessage.id;

            // 🧠 Préparer l'historique (sans le message assistant en cours de streaming)
            const historyMessages = messages.filter(
                msg => msg.id !== assistantMessageId && msg.status === 'completed'
            );
            const history = formatHistoryForApi(historyMessages);

            // 📋 Préparer le contexte de la view
            let currentComponents = [];
            try {
                currentComponents = selectedView.Components 
                    ? JSON.parse(selectedView.Components) 
                    : [];
            } catch (e) {
                console.warn('Impossible de parser les composants existants');
            }

            const viewContext = {
                stepId,
                workflowId: selectedWorkflow?.Id,
                workflowTitle: selectedWorkflow?.Title || 'Sans titre',
                currentComponents,
            };

            console.log('📤 Envoi au backend UI chat:', {
                message: userMessageText,
                historyLength: history.length,
                stepId,
                currentComponentsCount: currentComponents.length,
            });

            // Appel fetch en mode streaming
            // Switch entre les 2 endpoints selon le mode
            const endpoint = USE_TSX_MODE
                ? `${API_AI_URL}/ui-code`  // Mode TSX (Sandpack)
                : `${API_AI_URL}/ui-chat`; // Mode JSON (Composants)
            
            const response = await fetch(endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ 
                    message: userMessageText,
                    history,
                    viewContext,
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
                                const delimiter = '---UI_JSON---';
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
                                const delimiter = '---UI_JSON---';
                                let displayContent = accumulatedContent;
                                const delimiterIndex = displayContent.indexOf(delimiter);
                                if (delimiterIndex !== -1) {
                                    displayContent = displayContent.substring(0, delimiterIndex).trim();
                                }
                                
                                // Mettre à jour le message dans l'API
                                const updatedMessage = await uiConversationService.updateMessage(
                                    stepId,
                                    assistantMessageId,
                                    {
                                        content: displayContent,
                                        status: 'completed',
                                        metadata: fullJsonResponse ? {
                                            workflowData: JSON.parse(fullJsonResponse),
                                        } : undefined,
                                    }
                                );
                                
                                // Mettre à jour l'état local
                                if (updatedMessage) {
                                    setMessages(prev => 
                                        prev.map(msg => msg.id === assistantMessageId ? updatedMessage : msg)
                                    );
                                }
                            } else if (parsed.type === 'error') {
                                throw new Error(parsed.error);
                            }
                        } catch (e) {
                            console.error('Erreur parsing SSE:', e);
                        }
                    }
                }
            }

            // 🎯 Une fois le stream terminé, traiter la réponse
            if (fullJsonResponse || accumulatedContent) {
                
                // ========================================
                // MODE TSX : Injecter le code dans Sandpack
                // ========================================
                if (USE_TSX_MODE) {
                    console.log('🎨 Mode TSX - Injection dans Sandpack');
                    
                    // Le code TSX est dans accumulatedContent
                    let tsxCode = accumulatedContent.trim();
                    
                    // 🧹 Nettoyer les balises markdown (```tsx ou ```) si présentes
                    tsxCode = tsxCode.replace(/^```(?:tsx|typescript|ts|jsx|javascript|js)?\s*\n?/i, '').replace(/\n?```\s*$/i, '');
                    tsxCode = tsxCode.trim();
                    
                    console.log('✅ Code TSX généré:', {
                        length: tsxCode.length,
                        preview: tsxCode.substring(0, 200) + '...',
                    });
                    
                    // 🎨 Injecter le code dans Sandpack via le store
                    (dispatch as any)({ 
                        type: 'SET_SANDPACK_CODE', 
                        payload: tsxCode 
                    });
                    
                    toast.success('Code TSX généré !', {
                        description: 'Visible dans le Sandpack à droite',
                        duration: 4000,
                    });
                }
                // ========================================
                // MODE JSON : Logique existante (conservée)
                // ========================================
                else if (fullJsonResponse) {
                    try {
                        console.log('📦 JSON des composants UI reçu, mise à jour...');
                        
                        // 🧹 Nettoyer les éventuels backticks markdown (sécurité supplémentaire)
                        let cleanedJson = fullJsonResponse.trim();
                        cleanedJson = cleanedJson.replace(/^```(?:json)?\s*\n?/i, '').replace(/\n?```\s*$/i, '');
                        cleanedJson = cleanedJson.trim();
                        
                        console.log({cleanedJson, fullJsonResponse});
                        const parsedData = JSON.parse(cleanedJson);
                        const components = parsedData.components;

                        if (!Array.isArray(components)) {
                            throw new Error('Le JSON doit contenir un tableau "components"');
                        }

                        console.log('✅ Composants UI générés:', {
                            count: components.length,
                            components,
                        });

                        // 🎨 Intégrer les composants dans le page editor
                        dispatch({ 
                            type: 'SET_EDITED_PAGE_COMPONENTS', 
                            payload: JSON.stringify(components) 
                        });

                        // Marquer qu'il y a des changements non sauvegardés
                        dispatch({ 
                        type: 'SET_HAS_UNSAVED_CHANGES', 
                        payload: true 
                    });

                    // Toast de succès
                        toast.success('Interface générée avec succès !', {
                            description: `${components.length} composant(s) créé(s) par l'IA`,
                            duration: 4000,
                        });

                    } catch (parseError) {
                        console.error('Erreur parsing UI JSON:', parseError);
                        toast.error('Erreur de parsing', {
                            description: 'Le JSON généré n\'est pas valide',
                            duration: 5000,
                        });
                    }
                } else {
                    console.log('💬 Réponse conversationnelle (pas de composants générés)');
                }
            }

        } catch (error) {
            console.error('❌ Erreur lors du chat UI:', error);
            
            const errorMsg = error instanceof Error ? error.message : 'Erreur inconnue';
            
            // Afficher un toast d'erreur à l'utilisateur
            toast.error('Erreur lors de l\'envoi du message', {
                description: errorMsg,
                duration: 5000,
            });
            
            // Mettre à jour le message avec l'erreur (si on a créé le message assistant)
            try {
                if (stepId) {
                    // Chercher le message assistant dans l'état local
                    const assistantMsg = messages.find(m => m.role === 'assistant' && m.status === 'streaming');
                    
                    if (assistantMsg?.id) {
                        const errorMessage = await uiConversationService.updateMessage(
                            stepId,
                            assistantMsg.id,
                            {
                                content: `❌ ${errorMsg}`,
                                status: 'error',
                                metadata: {
                                    error: errorMsg,
                                },
                            }
                        );
                        
                        // Mettre à jour l'état local
                        if (errorMessage) {
                            setMessages(prev => 
                                prev.map(msg => msg.id === assistantMsg.id ? errorMessage : msg)
                            );
                        }
                    }
                }
            } catch (updateError) {
                console.error('❌ Impossible de mettre à jour le message d\'erreur:', updateError);
            }
        } finally {
            setIsLoading(false);
        }
    }, [inputMessage, isLoading, stepId, selectedView, selectedWorkflow, messages, dispatch]);

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        // Envoyer avec Enter (sans Shift)
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            void handleSendMessage();
        }
    };

    // 🗑️ Fonction pour effacer la conversation
    const handleClearConversation = async () => {
        if (!stepId) return;
        
        if (confirm('Êtes-vous sûr de vouloir effacer toute la conversation ?')) {
            const success = await uiConversationService.deleteAllMessages(stepId);
            
            if (success) {
                setMessages([]);
                toast.success('Conversation effacée', {
                    description: 'Historique supprimé avec succès',
                    duration: 3000,
                });
            }
        }
    };

    return (
        <div className={styles.aiUiBuilder}>
            {/* Header avec icône */}
            <div className={styles.aiUiBuilderHeader}>
                <Sparkles size={20} className={styles.aiUiBuilderHeaderIcon} />
                <h2 className={styles.aiUiBuilderTitle}>AI UI Builder</h2>
            </div>

            {/* Zone de conversation */}
            <div className={styles.aiUiBuilderConversation}>
                {messages.length === 0 && (
                    <Empty
                        Icon={Sparkles}
                        title="Décrivez votre interface"
                        description="Expliquez quelle UI vous souhaitez créer. L'IA générera les composants, le layout et les styles pour vous. Vous pouvez aussi modifier l'UI existante en discutant avec l'IA."
                    />
                )}

                {/* Messages de conversation */}
                <div className={styles.aiUiBuilderMessages}>
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
            <div className={styles.aiUiBuilderFooter}>
                {/* Bouton pour effacer la conversation */}
                {messages.length > 0 && (
                    <div className={styles.aiUiBuilderActions}>
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
                <div className={styles.aiUiBuilderInputContainer}>
                    <div className={styles.aiUiBuilderInputWrapper}>
                        <Textarea
                            placeholder="Ex: Créer une landing page avec un titre accrocheur et une section 2 colonnes..."
                            className={styles.aiUiBuilderInput}
                            value={inputMessage}
                            onChange={(e) => setInputMessage(e.target.value)}
                            onKeyDown={handleKeyDown}
                            disabled={isLoading}
                        />
                    </div>
                    <div className={styles.aiUiBuilderInputFooter}>
                        <Button 
                            variant="default" 
                            size="iconSm" 
                            rounded="full" 
                            className={styles.aiUiBuilderSendButton}
                            onClick={() => void handleSendMessage()}
                            disabled={isLoading || !inputMessage.trim()}
                        >
                            {isLoading ? '...' : <ArrowRight size={18} className={styles.buttonIconRight} />}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};


export {
    AiUiBuilder,
};
