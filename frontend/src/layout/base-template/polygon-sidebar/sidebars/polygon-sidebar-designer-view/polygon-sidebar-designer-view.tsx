import React from 'react';
import { ArrowLeft, ArrowRight, Bot } from 'lucide-react';
import { Button } from '../../../../../components/ui/button/button';
import styles from './polygon-sidebar-designer-view.module.scss';
import { Textarea } from '../../../../../components/ui/form/base-fields/textarea/textarea';
import { Empty } from '../../../../../components/ui/empty/empty';


type TPolygonSidebarDesignerViewProps = {
    onNavigate: (viewIndex: number) => void;
}


const PolygonSidebarDesignerView = ({ onNavigate }: TPolygonSidebarDesignerViewProps): React.ReactElement => {

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
                <Empty
                    Icon={Bot}
                    title="Décrivez, l'IA construit"
                    description="Expliquez ce que vous voulez automatiser. Posez des questions, ajustez, perfectionnez."
                />

                {/* Messages vont apparaître ici */}
                <div className={styles.polygonSidebarDesignerViewMessages}>
                    {/* TODO: Ajouter les messages de conversation */}
                </div>
            </div>

            {/* Input pour envoyer des messages */}
            <div className={styles.polygonSidebarDesignerViewInputContainer}>
                <div className={styles.polygonSidebarDesignerViewInputWrapper}>
                <Textarea
                        placeholder="Ask AI"
                        className={styles.polygonSidebarDesignerViewInput}
                    />
                </div>
                <div className={styles.polygonSidebarDesignerViewInputFooter}>
                    <Button variant="default" size="iconSm" rounded="full" className={styles.polygonSidebarDesignerViewSendButton}>
                        <ArrowRight size={18} className={styles.buttonIconRight} />
                    </Button>
                </div>
            </div>
        </div>
    </div>
};


export {
    PolygonSidebarDesignerView,
};

