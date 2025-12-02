import * as React from 'react';
import { useState } from 'react';
import * as Icons from 'lucide-react';

import styles from './WorkflowBoundaryTile.module.scss';
import workflowTileStyles from '../WorkflowTile.module.scss';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuItemContent,
    DropdownMenuItemIcon,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '../../../../misc/components/dropdown-menu/dropdown-menu';
import { triggerOptions } from '../../../data/workflow-trigger-options';
import type { LucideProps } from 'lucide-react';


export default function WorkflowBoundaryTile(props: any) {
    const [open, setOpen] = useState(false);
    const boundary = props.item;

    // Déterminer si c'est le start ou end
    const isStart = boundary?.isStart ?? false;

    // Trouver le trigger sélectionné
    const selectedTrigger = boundary?.triggerType
        ? triggerOptions.find(t => t.id === boundary.triggerType)
        : null;

    // Icône et texte à afficher
    const getTriggerContent = () => {
        if (isStart) {
            // Si c'est le start et qu'un trigger est sélectionné
            if (selectedTrigger) {
                const IconComponent = Icons[selectedTrigger.icon as keyof typeof Icons] as React.ComponentType<{ size?: number; className?: string }>;
                const Icon = IconComponent || Icons.Play;
                return (
                    <>
                        <Icon size={18} className={styles.triggerIcon} />
                        {selectedTrigger.title}
                    </>
                );
            }
            // Sinon, message par défaut
            return (
                <>
                    <Icons.Sparkles size={18} className={styles.triggerIcon} />
                    Workflow started
                </>
            );
        } else {
            // Si c'est le end
            if (selectedTrigger) {
                const IconComponent = Icons[selectedTrigger.endIcon as keyof typeof Icons] as React.ComponentType<{ size?: number; className?: string }>;
                const Icon = IconComponent || Icons.Check;
                return (
                    <>
                        <Icon size={18} className={styles.triggerIcon} />
                        {selectedTrigger.endTitle}
                    </>
                );
            }
            // Message par défaut pour end - traduire depuis boundaries.workflowCompleted
            return (
                <>
                    <Icons.Check size={18} className={styles.triggerIcon} />
                    Workflow completed
                </>
            );
        }
    };

    const handleTriggerSelect = (triggerId: string) => {
        console.log('Trigger selected:', triggerId);
        setOpen(false);
        // TODO: Mettre à jour le workflow avec le trigger sélectionné
    };

    // Group triggers by category
    const categoriesMap = new Map<string, typeof triggerOptions>();
    triggerOptions.forEach(option => {
        if (!categoriesMap.has(option.category)) {
            categoriesMap.set(option.category, []);
        }
        const categoryArray = categoriesMap.get(option.category);
        if (categoryArray) {
            categoryArray.push(option);
        }
    });

    const categories = Array.from(categoriesMap.entries());

    // Si c'est un END, pas de dropdown - juste afficher le contenu
    if (!isStart) {
        return <div
            className={ [
                workflowTileStyles.commonItem,
                styles.workflowBoundaryTile,
            ].join(' ') }
            data-id={ props.id }
        >
            {getTriggerContent()}
        </div>;
    }

    // Si c'est un START, afficher le dropdown
    return (
        <DropdownMenu open={open} onOpenChange={setOpen}>
            <DropdownMenuTrigger asChild>
                <div
                    className={ [
                        workflowTileStyles.commonItem,
                        styles.workflowBoundaryTile,
                    ].join(' ') }
                    data-id={ props.id }
                >
                    {getTriggerContent()}
                </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent
                className={styles.dropdownContent}
                align="start"
                sideOffset={8}
            >
                <DropdownMenuLabel className={styles.dropdownLabel}>
                    Select trigger
                </DropdownMenuLabel>
                <DropdownMenuSeparator />

                {categories.map(([categoryName, options], categoryIndex) => (
                    <React.Fragment key={categoryName}>
                        {categoryIndex > 0 && <DropdownMenuSeparator />}
                        <DropdownMenuLabel className={styles.categoryLabel}>
                            {categoryName}
                        </DropdownMenuLabel>
                        {options.map((option) => {
                            const IconComponent = Icons[option.icon as keyof typeof Icons] as React.ComponentType<{ size?: number; className?: string }>;

                            return (
                                <DropdownMenuItem
                                    key={option.id}
                                    onClick={() => handleTriggerSelect(option.id)}
                                >
                                    <DropdownMenuItemContent>
                                        {IconComponent && <DropdownMenuItemIcon icon={IconComponent as unknown as React.ComponentType<LucideProps>} className={styles.optionIcon} />}
                                        <div className={styles.optionText}>
                                            <div className={styles.optionTitle}>{option.title}</div>
                                            <div className={styles.optionDescription}>{option.description}</div>
                                        </div>
                                    </DropdownMenuItemContent>
                                </DropdownMenuItem>
                            );
                        })}
                    </React.Fragment>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}

