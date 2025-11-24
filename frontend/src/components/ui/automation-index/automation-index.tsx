import React, { useEffect, useState, useRef } from 'react';
import * as Icons from 'lucide-react';
import { Button } from '../button/button';
import styles from './automation-index.module.scss';
import { Textarea } from '../form/base-fields/textarea/textarea';


interface IAutomationHomePageProps {
    onCreateClick: (workflowName: string) => void;
    dataState?: 'open' | 'closed';
}

// Textes en dur (pas d'i18n pour le moment)
const TEXTS = {
    title: "Build processes by ",
    titleHighlight: "chatting with AI",
    titleEnd: "",
    description: "Describe your repetitive tasks once and let AI handle them forever.",
    inputPlaceholder: "Describe any process...",
    createButton: "Create workflow",
};

const AutomationIndex: React.FC<IAutomationHomePageProps> = ({ onCreateClick, dataState }) => {
    const [workflowName, setWorkflowName] = useState('');
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const handleCreateClick = () => {
        onCreateClick(workflowName.trim());
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        
        if (e.key === 'Enter') {
            e.preventDefault();
            handleCreateClick();
        }
    };

    useEffect(() => {
        const handleDocumentClick = (e: MouseEvent) => {
            if (!(e.target instanceof HTMLElement)) return;

            // Ne pas focus si on clique sur le bouton
            if (e.target.closest('button')) return;

            // Ne pas focus si on clique sur le header
            if (e.target.closest('header')) return;

            // Ne pas focus si on clique sur la sidebar
            if (e.target.closest('[class*="sidebar"]')) return;

            // Focus sur le textarea
            textareaRef.current?.focus();
        };

        document.addEventListener('click', handleDocumentClick);

        return () => {
            document.removeEventListener('click', handleDocumentClick);
        };
    }, []);

    return (
        <div className={styles.automation} data-state={dataState}>

            {/* Contenu principal */}
            <div className={styles.automationContent}>
                <div className={styles.automationText}>
                    <h1 className={styles.automationTitle}>
                        {TEXTS.title}
                        <span className={styles.automationTitleHighlight}>
                            {TEXTS.titleHighlight}
                        </span>
                        {TEXTS.titleEnd}
                    </h1>
                    <p className={styles.automationDescription}>
                        {TEXTS.description}
                    </p>
                </div>
                <div className={styles.automationFormContainer}>
                    <div className={styles.textareaContainer}>
                        <Textarea
                            ref={textareaRef}
                            className={styles.automationTextarea}
                            placeholder={TEXTS.inputPlaceholder}
                            value={workflowName}
                            onChange={(e) => setWorkflowName(e.target.value)}
                            onKeyDown={handleKeyDown}
                            autoFocus
                            rows={1}
                        />
                    </div>
                    <div className={styles.automationFormContainerActions}>
                        <Button variant="outline" size="iconSm" rounded="full">
                            <Icons.Image size={14} />
                        </Button>
                        <Button variant="outline" size="iconSm" rounded="full">
                            <Icons.Paperclip size={14} />
                        </Button>
                        <Button variant="outline" size="iconSm" rounded="full">
                            <Icons.AtSign size={14} />
                        </Button>
                    <Button onClick={handleCreateClick} size="icon" rounded="full" className={styles.submitButton}>
                        <Icons.ArrowRight size={18} className={styles.buttonIconRight} />
                    </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};


export {
    AutomationIndex,
};
