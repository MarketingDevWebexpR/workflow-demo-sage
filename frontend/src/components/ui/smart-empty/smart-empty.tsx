import type { ElementType, ReactElement, ReactNode } from "react";
import { Empty } from "../empty/empty";
import { Search, ShieldAlert } from "lucide-react";
import { Button } from "../button/button";
import emptyStyles from "../empty/empty.module.scss";
import { type TSPPermissionMap } from "@/utils/sharepoint.utils";


type TSmartEmptyProps = {
    // Détection automatique du contexte
    queryText?: string;
    activeFiltersCount?: number;

    // Permissions (priorité : listPermissions > webPermissions)
    listPermissions?: TSPPermissionMap;
    webPermissions?: TSPPermissionMap;

    // Callbacks pour réinitialisation
    onResetSearch?: () => void;
    onResetFilters?: () => void;

    // Labels i18n pour les boutons de réinitialisation
    resetSearchLabel?: string;
    resetFiltersLabel?: string;

    // Contenu pour le cas "liste vide avec permissions d'écriture"
    emptyContent: {
        Icon: ElementType;
        title: string;
        description: string;
        actions?: ReactNode;
    };

    // Contenu pour le cas "aucun résultat (filtres/recherche actifs)"
    noResultsContent: {
        title: string;
        description: string;
    };

    // Contenu pour le cas "liste vide en lecture seule"
    readOnlyContent: {
        title: string;
        description: string;
    };
};

/**
 * Composant intelligent d'empty state qui gère automatiquement 3 contextes :
 * 1. Aucun résultat suite à filtres/recherche actifs → Affiche une icône Search avec boutons de réinitialisation
 * 2. Liste vide en lecture seule (pas de permissions d'écriture) → Affiche une icône ShieldAlert sans actions
 * 3. Liste vraiment vide avec permissions d'écriture → Affiche le contenu personnalisé avec actions
 *
 * Note sur les permissions :
 * - Si `listPermissions` est fourni, on l'utilise en priorité
 * - Sinon, fallback sur `webPermissions` pour compatibilité
 */
const SmartEmpty = ({
    queryText,
    activeFiltersCount = 0,
    listPermissions,
    webPermissions,
    onResetSearch,
    onResetFilters,
    resetSearchLabel = "Reset search",
    resetFiltersLabel = "Reset filters",
    emptyContent,
    noResultsContent,
    readOnlyContent,
}: TSmartEmptyProps): ReactElement => {

    // Détection du contexte
    const hasFilters = activeFiltersCount > 0;
    const hasSearch = !!queryText && queryText.trim().length > 0;
    const hasFiltersOrSearch = hasFilters || hasSearch;

    // Déterminer les permissions à utiliser (priorité à listPermissions)
    const permissions = listPermissions ?? webPermissions;
    const canWrite = permissions?.addListItems ?? false;

    // CAS 1 : Aucun résultat suite à filtres/recherche
    if (hasFiltersOrSearch) {
        return <Empty
            Icon={Search}
            title={noResultsContent.title}
            description={noResultsContent.description}
        >
            <div className={emptyStyles.emptyActions}>
                {hasSearch && onResetSearch && (
                    <Button
                        onClick={onResetSearch}
                        variant="outline"
                    >
                        {resetSearchLabel}
                    </Button>
                )}
                {hasFilters && onResetFilters && (
                    <Button
                        onClick={onResetFilters}
                        variant="outline"
                    >
                        {resetFiltersLabel}
                    </Button>
                )}
            </div>
        </Empty>;
    }

    // CAS 2 : Liste vraiment vide mais utilisateur en lecture seule
    if (!canWrite) {
        return <Empty
            Icon={ShieldAlert}
            title={readOnlyContent.title}
            description={readOnlyContent.description}
        />;
    }

    // CAS 3 : Liste vraiment vide avec permissions d'écriture
    return <Empty
        Icon={emptyContent.Icon}
        title={emptyContent.title}
        description={emptyContent.description}
    >
        {emptyContent.actions}
    </Empty>;
};


export {
    SmartEmpty,
};
