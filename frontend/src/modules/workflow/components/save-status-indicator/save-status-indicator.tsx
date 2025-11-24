import React from 'react';
import { Loader2, Check, AlertCircle } from 'lucide-react';
import { cn } from '../../../../lib/utils';
import styles from './save-status-indicator.module.scss';

type SaveStatus = 'idle' | 'saving' | 'success' | 'error';

interface SaveStatusIndicatorProps {
    status: SaveStatus;
    error?: string | null;
}

const SaveStatusIndicator = ({ status, error }: SaveStatusIndicatorProps): React.ReactElement | null => {
    if (status === 'idle') {
        return null;
    }

    return (
        <div className={cn(styles.saveStatusIndicator, styles[`status-${status}`])}>
            {status === 'saving' && (
                <>
                    <Loader2 className={styles.icon} size={16} />
                    <span className={styles.label}>Sauvegarde...</span>
                </>
            )}
            
            {status === 'success' && (
                <>
                    <Check className={styles.icon} size={16} />
                    <span className={styles.label}>Sauvegardé</span>
                </>
            )}
            
            {status === 'error' && (
                <>
                    <AlertCircle className={styles.icon} size={16} />
                    <span className={styles.label}>
                        {error || 'Erreur de sauvegarde'}
                    </span>
                </>
            )}
        </div>
    );
};

export { SaveStatusIndicator };

