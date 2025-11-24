import React, { useState, useRef, useEffect } from 'react';
import { ArrowLeft, ArrowRight, Bot, User } from 'lucide-react';
import { Button } from '../../../../../components/ui/button/button';
import styles from './polygon-sidebar-designer-view.module.scss';
import { Textarea } from '../../../../../components/ui/form/base-fields/textarea/textarea';
import { Empty } from '../../../../../components/ui/empty/empty';
import { useWorkflowAutomationStore } from '../../../../../modules/workflow/store/workflow-automation.store';
import workflowItemServices from '../../../../../modules/workflow/services/workflow-item.services';


type TPolygonSidebarDesignerViewProps = {
    onNavigate: (viewIndex: number) => void;
}


type Message = {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    isStreaming?: boolean;
};

const PolygonSidebarDesignerView = ({ onNavigate }: TPolygonSidebarDesignerViewProps): React.ReactElement => {
    const [message, setMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const dispatch = useWorkflowAutomationStore(state => state.dispatch);
    const selectedWorkflow = useWorkflowAutomationStore(state => state.workflowItem.selected.item);

    // Auto-scroll vers le bas quand les messages changent
    useEffect(() => {
        // messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSendMessage = async () => {
        if (!message.trim() || isLoading) return;

        const userMessage = message.trim();
        setMessage(''); // Réinitialiser l'input immédiatement
        setIsLoading(true);

        // Ajouter le message de l'utilisateur
        const userMessageObj: Message = {
            id: Date.now().toString(),
            role: 'user',
            content: userMessage,
        };
        setMessages(prev => [...prev, userMessageObj]);

        // Créer un message assistant vide pour le streaming
        const assistantMessageId = (Date.now() + 1).toString();
        const assistantMessage: Message = {
            id: assistantMessageId,
            role: 'assistant',
            content: '',
            isStreaming: true,
        };
        setMessages(prev => [...prev, assistantMessage]);

        try {
            // 🌊 Appel fetch en mode streaming
            const response = await fetch('http://localhost:3000/api/ai/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ message: userMessage }),
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
                                setMessages(prev => 
                                    prev.map(msg => 
                                        msg.id === assistantMessageId 
                                            ? { ...msg, content: accumulatedContent }
                                            : msg
                                    )
                                );
                            } else if (parsed.type === 'done') {
                                // ✅ Stream terminé - on a le JSON complet
                                fullJsonResponse = parsed.data;
                                setMessages(prev => 
                                    prev.map(msg => 
                                        msg.id === assistantMessageId 
                                            ? { ...msg, isStreaming: false }
                                            : msg
                                    )
                                );
                            } else if (parsed.type === 'error') {
                                throw new Error(parsed.error);
                            }
                        } catch (e) {
                            console.error('Erreur parsing SSE:', e);
                        }
                    }
                }
            }

            // 🎯 Une fois le stream terminé, mettre à jour le workflow
            if (fullJsonResponse && selectedWorkflow?.Id) {
                console.log('📦 JSON complet reçu, mise à jour du workflow...');
                
                const parsedData = JSON.parse(fullJsonResponse);
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
                }
            }

        } catch (error) {
            console.error('Erreur:', error);
            setMessages(prev => 
                prev.map(msg => 
                    msg.id === assistantMessageId 
                        ? { ...msg, content: `❌ Erreur: ${error instanceof Error ? error.message : 'Erreur inconnue'}`, isStreaming: false }
                        : msg
                )
            );
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        // Envoyer avec Enter (sans Shift)
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
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
                                    {msg.content}
                                    {msg.isStreaming && <span className={styles.cursor}>▊</span>}
                                </div>
                            </div>
                        </div>
                    ))}
                    <div ref={messagesEndRef} />
                </div>
            </div>

            {/* Input pour envoyer des messages */}
            <div className={styles.polygonSidebarDesignerViewInputContainer}>
                <div className={styles.polygonSidebarDesignerViewInputWrapper}>
                <Textarea
                        placeholder="Ask AI (Press Enter to send)"
                        className={styles.polygonSidebarDesignerViewInput}
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
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
                        onClick={handleSendMessage}
                        disabled={isLoading || !message.trim()}
                    >
                        {isLoading ? '...' : <ArrowRight size={18} className={styles.buttonIconRight} />}
                    </Button>
                </div>
            </div>
        </div>
    </div>
};


export {
    PolygonSidebarDesignerView,
};
