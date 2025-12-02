import React from 'react';
import { Loader2 } from 'lucide-react';
import styles from './loading-message.module.scss';

/**
 * Composant qui affiche une row de chargement pendant que l'IA prépare la réponse
 * Remplace le simple cursor clignotant pour une meilleure UX
 */
export const LoadingMessage = (): React.ReactElement => {
    return (
        <div className={styles.loadingMessage}>
            <div className={styles.loadingIcon}>
                <Loader2 className={styles.spinner} size={20} />
            </div>
            <div className={styles.loadingText}>
                Préparation en cours...
            </div>
        </div>
    );
};

