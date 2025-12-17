import { Filter } from "lucide-react"
import { Button } from "../button/button";
import React from "react";
import styles from './filter-button.module.scss';
import { useTranslation } from "../../../../i18n/react";
import { cn } from "../../../lib/utils";


type FilterButtonProps = {
    activeFilterCount: number;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

const FilterButton = React.forwardRef<HTMLButtonElement, FilterButtonProps>(({ activeFilterCount, className, ...props }, ref) => {
    const { t } = useTranslation();

    return <Button variant="outline" size="sm" className={cn(styles.filterButton, className)} ref={ref} {...props}>
        <Filter size={16} className={styles.filterButtonIcon} />
        {t("general.actions.filters")}
        {activeFilterCount ? (
            <span className={styles.filterButtonActiveFilterCount}>
                {activeFilterCount}
            </span>
        ) : null}
    </Button>;
});

FilterButton.displayName = 'FilterButton';


export {
    FilterButton,
};
