import { Loader2 } from "lucide-react";
import styles from './loading.module.scss';


const Loading = () => {
    return (
        <div className={styles.loadingPage}>
            <Loader2 size={32} className={styles.loadingPageIcon} />
        </div>
    );
};


export {
    Loading,
};