import React, { useState } from 'react';
import { ArrowRight, Brush } from 'lucide-react';
import { Button } from '../../../../../../components/ui/button/button';
import { Textarea } from '../../../../../../components/ui/form/base-fields/textarea/textarea';
import { Empty } from '../../../../../../components/ui/empty/empty';
import styles from './ai-ui-builder.module.scss';


const AiUiBuilder = (): React.ReactElement => {
    const [message, setMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSendMessage = async () => {
        if (!message.trim() || isLoading) return;

        setIsLoading(true);

        try {
            const response = await fetch('http://localhost:3000/api/ai/ui-builder', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ message: message.trim() }),
            });

            const data = await response.json();

            if (data.success) {
                setMessage(''); // Réinitialiser l'input
                
                // Parser les composants générés
                const parsedResponse = JSON.parse(data.message);
                const components = parsedResponse.components;
                
                console.log('✅ Composants UI générés par l\'IA:', {
                    count: components.length,
                    components: components
                });

                // TODO: Intégrer les composants dans le page editor
                // usePageStore dispatch({ type: 'SET_EDITED_PAGE_COMPONENTS', payload: JSON.stringify(components) })
                
                alert(`✅ ${components.length} composant(s) généré(s) avec succès !`);
            } else {
                alert(`❌ Erreur: ${data.error || 'Erreur inconnue'}`);
            }
        } catch (error) {
            alert(`❌ Erreur de connexion: ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
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

    return (
        <div className={styles.aiUiBuilder}>
            {/* Zone de conversation */}
            <div className={styles.aiUiBuilderContent}>

                <div className={styles.aiUiBuilderConversation}>
                    <Empty
                        Icon={Brush}
                        title="Décrivez votre interface"
                        description="Expliquez quelle UI vous souhaitez créer. L'IA générera les composants, le layout et les styles pour vous."
                    />

                    {/* Messages vont apparaître ici */}
                    <div className={styles.aiUiBuilderMessages}>
                        {/* TODO: Ajouter les messages de conversation */}
                    </div>
                </div>

                {/* Input pour envoyer des messages */}
                <div className={styles.aiUiBuilderInputContainer}>
                    <div className={styles.aiUiBuilderInputWrapper}>
                        <Textarea
                            placeholder="Ex: Créer un formulaire de contact avec nom, email et message..."
                            className={styles.aiUiBuilderInput}
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
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
                            onClick={handleSendMessage}
                            disabled={isLoading || !message.trim()}
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

