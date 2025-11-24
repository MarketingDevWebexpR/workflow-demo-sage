import React from 'react';
import { Label } from '../../../../../components/ui/form/label/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../../../components/ui/form/base-fields/select/select';
import { Button } from '../../../../../components/ui/button/button';
import { ExternalLink, PanelRightOpen, Maximize2, Layout } from 'lucide-react';
import styles from './UITaskForm.module.scss';


export const UITaskForm: React.FC = () => {
    const [displayMode, setDisplayMode] = React.useState<string>('panel');

    const handleOpenUI = () => {
        console.log('Ouvrir l\'IHM en mode:', displayMode);
        // TODO: Implémenter l'ouverture de l'IHM selon le mode
    };

    return (
        <div className={styles.uiTaskForm}>
            <div className={styles.field}>
                <Label>Mode d'affichage</Label>
                <Select value={displayMode} onValueChange={setDisplayMode}>
                    <SelectTrigger>
                        <SelectValue placeholder="Sélectionner un mode d'affichage" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="panel">
                            <div className={styles.selectItemContent}>
                                <PanelRightOpen size={16} />
                                <span>Affichage dans un panel latéral</span>
                            </div>
                        </SelectItem>
                        <SelectItem value="dialog">
                            <div className={styles.selectItemContent}>
                                <Layout size={16} />
                                <span>Affichage dans une boîte de dialogue centrée</span>
                            </div>
                        </SelectItem>
                        <SelectItem value="fullscreen">
                            <div className={styles.selectItemContent}>
                                <Maximize2 size={16} />
                                <span>Affichage dans un écran à part</span>
                            </div>
                        </SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <div className={styles.previewCard}>
                <div className={styles.previewHeader}>
                    <span className={styles.previewTitle}>Aperçu de l'interface</span>
                </div>
                <div className={styles.previewBody}>
                    <p className={styles.previewDescription}>
                        Configurez et testez l'interface utilisateur qui sera affichée lors de l'exécution de cette tâche.
                    </p>
                    <Button 
                        onClick={handleOpenUI} 
                        className={styles.openButton}
                        variant="default"
                    >
                        <ExternalLink size={16} />
                        Ouvrir l'IHM
                    </Button>
                </div>
            </div>
        </div>
    );
};

