// import { Button } from "../../components/ui/button/button";
import { ArrowLeft, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import styles from './not-found.module.scss';


const NotFound = () => {
    const navigate = useNavigate();
    console.log({ navigate, ArrowLeft });

    return (
        <div className={styles.notFoundPage}>
                    {/* Contenu principal */}
                    <div className={styles.notFoundPageMain}>
                        <Search className={styles.notFoundPageMainIcon} size={64} />

                        {/* Textes */}
                        <div className={styles.notFoundPageTextColumn}>
                            <h2 className={styles.notFoundPageMainTitle}>404 : Not found</h2>
                            <p className={styles.notFoundPageMainHint}>
                                The requested page could not be found.<br />It might have been deleted or moved to a different location.
                            </p>
                        </div>
                    </div>

                    {/* Boutons d'action */}
                    <div className={styles.notFoundPageButtons}>
                        {/* <Button 
                            onClick={() => navigate(-1)}
                        >
                            <ArrowLeft size={16} className={styles.notFoundPageButtonBackIcon} />
                            Back
                        </Button> */}
                    </div>
        </div>
    );
};


export {
    NotFound,
};