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
            {/* Background complexe avec diagramme de flux */}
            <svg className={styles.automationBackground} viewBox="0 0 160 100" preserveAspectRatio="xMidYMid meet">
                <defs>
                    <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="var(--border-primary)" stopOpacity="0.1" />
                        <stop offset="50%" stopColor="var(--border-primary)" stopOpacity="0.4" />
                        <stop offset="100%" stopColor="var(--border-primary)" stopOpacity="0.1" />
                    </linearGradient>
                </defs>

                {/* Ligne principale */}
                <line x1="8" y1="50" x2="25" y2="50" className={styles.mainLine} />
                <line x1="135" y1="50" x2="152" y2="50" className={styles.mainLine} />

                {/* START NODE */}
                <g className={styles.node1}>
                    <rect x="9" y="47" width="6" height="6" />
                </g>

                {/* Premier split triple */}
                <line x1="25" y1="50" x2="25" y2="22" className={styles.branch1} />
                <line x1="25" y1="50" x2="45" y2="50" className={styles.branch2} />
                <line x1="25" y1="50" x2="25" y2="78" className={styles.branch3} />
                <g className={styles.node2}>
                    <rect x="22" y="47" width="6" height="6" />
                </g>

                {/* VOIE HAUTE - Double split */}
                <line x1="25" y1="22" x2="50" y2="22" className={styles.branch4} />
                <g className={styles.node3}>
                    <rect x="22.5" y="19.5" width="5" height="5" />
                </g>

                <line x1="50" y1="22" x2="50" y2="14" className={styles.branch5} />
                <line x1="50" y1="22" x2="50" y2="30" className={styles.branch6} />
                <g className={styles.node4}>
                    <rect x="47.5" y="19.5" width="5" height="5" />
                </g>

                {/* Sous-branches haute */}
                <line x1="50" y1="14" x2="70" y2="14" className={styles.branch7} />
                <line x1="50" y1="30" x2="70" y2="30" className={styles.branch8} />
                <g className={styles.node5}>
                    <rect x="48" y="12" width="4" height="4" />
                </g>
                <g className={styles.node6}>
                    <rect x="48" y="28" width="4" height="4" />
                </g>

                {/* Triple split sur voie haute */}
                <line x1="70" y1="14" x2="70" y2="10" className={styles.branch9} />
                <line x1="70" y1="14" x2="85" y2="14" className={styles.branch10} />
                <line x1="70" y1="14" x2="70" y2="18" className={styles.branch11} />
                <g className={styles.node7}>
                    <rect x="68" y="12" width="4" height="4" />
                </g>

                <line x1="70" y1="10" x2="85" y2="10" className={styles.branch12} />
                <line x1="70" y1="18" x2="85" y2="18" className={styles.branch13} />
                <line x1="85" y1="10" x2="85" y2="22" className={styles.branch14} />
                <line x1="85" y1="18" x2="85" y2="22" className={styles.branch15} />
                <g className={styles.node8}>
                    <rect x="82.5" y="19.5" width="5" height="5" />
                </g>

                {/* Convergence voie haute + milieu */}
                <line x1="70" y1="30" x2="85" y2="30" className={styles.branch16} />
                <line x1="85" y1="22" x2="85" y2="30" className={styles.branch17} />
                <line x1="85" y1="30" x2="105" y2="30" className={styles.branch18} />
                <g className={styles.node9}>
                    <rect x="82.5" y="27.5" width="5" height="5" />
                </g>

                {/* VOIE MILIEU */}
                <line x1="45" y1="50" x2="65" y2="50" className={styles.branch19} />
                <g className={styles.node10}>
                    <rect x="42.5" y="47.5" width="5" height="5" />
                </g>
                <line x1="65" y1="50" x2="65" y2="42" className={styles.branch20} />
                <line x1="65" y1="50" x2="65" y2="58" className={styles.branch21} />
                <g className={styles.node11}>
                    <rect x="62.5" y="47.5" width="5" height="5" />
                </g>

                <line x1="65" y1="42" x2="85" y2="42" className={styles.branch22} />
                <line x1="65" y1="58" x2="85" y2="58" className={styles.branch23} />
                <line x1="85" y1="42" x2="105" y2="42" className={styles.branch24} />
                <line x1="85" y1="58" x2="105" y2="58" className={styles.branch25} />
                <g className={styles.node12}>
                    <rect x="83" y="40" width="4" height="4" />
                </g>
                <g className={styles.node13}>
                    <rect x="83" y="56" width="4" height="4" />
                </g>

                {/* VOIE BASSE - Symétrique de la haute */}
                <line x1="25" y1="78" x2="50" y2="78" className={styles.branch26} />
                <g className={styles.node14}>
                    <rect x="22.5" y="75.5" width="5" height="5" />
                </g>

                <line x1="50" y1="78" x2="50" y2="70" className={styles.branch27} />
                <line x1="50" y1="78" x2="50" y2="86" className={styles.branch28} />
                <g className={styles.node15}>
                    <rect x="47.5" y="75.5" width="5" height="5" />
                </g>

                <line x1="50" y1="70" x2="70" y2="70" className={styles.branch29} />
                <line x1="50" y1="86" x2="70" y2="86" className={styles.branch30} />
                <g className={styles.node16}>
                    <rect x="48" y="68" width="4" height="4" />
                </g>
                <g className={styles.node17}>
                    <rect x="48" y="84" width="4" height="4" />
                </g>

                <line x1="70" y1="86" x2="70" y2="82" className={styles.branch31} />
                <line x1="70" y1="86" x2="85" y2="86" className={styles.branch32} />
                <line x1="70" y1="86" x2="70" y2="90" className={styles.branch33} />
                <g className={styles.node18}>
                    <rect x="68" y="84" width="4" height="4" />
                </g>

                <line x1="70" y1="82" x2="85" y2="82" className={styles.branch34} />
                <line x1="70" y1="90" x2="85" y2="90" className={styles.branch35} />
                <line x1="85" y1="82" x2="85" y2="78" className={styles.branch36} />
                <line x1="85" y1="90" x2="85" y2="78" className={styles.branch37} />
                <g className={styles.node19}>
                    <rect x="82.5" y="75.5" width="5" height="5" />
                </g>

                <line x1="70" y1="70" x2="85" y2="70" className={styles.branch38} />
                <line x1="85" y1="78" x2="85" y2="70" className={styles.branch39} />
                <line x1="85" y1="70" x2="105" y2="70" className={styles.branch40} />
                <g className={styles.node20}>
                    <rect x="82.5" y="67.5" width="5" height="5" />
                </g>

                {/* CONVERGENCE FINALE */}
                <line x1="105" y1="30" x2="105" y2="42" className={styles.branch41} />
                <line x1="105" y1="58" x2="105" y2="70" className={styles.branch42} />
                <line x1="105" y1="42" x2="120" y2="42" className={styles.branch43} />
                <line x1="105" y1="58" x2="120" y2="58" className={styles.branch44} />
                <g className={styles.node21}>
                    <rect x="103" y="40" width="4" height="4" />
                </g>
                <g className={styles.node22}>
                    <rect x="103" y="56" width="4" height="4" />
                </g>

                <line x1="120" y1="42" x2="120" y2="50" className={styles.branch45} />
                <line x1="120" y1="58" x2="120" y2="50" className={styles.branch46} />
                <line x1="120" y1="50" x2="135" y2="50" className={styles.branch47} />
                <g className={styles.node23}>
                    <rect x="117" y="47" width="6" height="6" />
                </g>

                {/* END NODE */}
                <g className={styles.node24}>
                    <rect x="145" y="47" width="6" height="6" />
                </g>

                {/* 6 PARTICULES avec chemins différents */}
                <circle cx="12" cy="50" r="1.5" className={styles.particle1} fill="var(--border-primary)" />
                <circle cx="12" cy="10" r="1.2" className={styles.particle2} fill="var(--border-primary)" />
                <circle cx="12" cy="14" r="1.2" className={styles.particle3} fill="var(--border-primary)" />
                <circle cx="12" cy="42" r="1.2" className={styles.particle4} fill="var(--border-primary)" />
                <circle cx="12" cy="70" r="1.2" className={styles.particle5} fill="var(--border-primary)" />
                <circle cx="12" cy="86" r="1.2" className={styles.particle6} fill="var(--border-primary)" />
            </svg>

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
