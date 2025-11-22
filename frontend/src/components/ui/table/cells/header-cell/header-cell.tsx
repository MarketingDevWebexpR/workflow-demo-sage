import React from "react";
import styles from "./header-cell.module.scss";
import { cn } from "../../../../../lib/utils";
import { SortAsc, SortDesc } from "lucide-react";
import { SortDirection } from "@tanstack/react-table";


type THeaderCellProps = React.HTMLAttributes<HTMLDivElement> & {
    sort?: false | SortDirection,
    toggleSortFn?: ((event: unknown) => void) | undefined,
}

const HeaderCell = React.forwardRef<HTMLDivElement, THeaderCellProps>(({
    className,
    sort,
    toggleSortFn,
    children,
    onClick,
    ...props
}, ref) => {

    const SortIcon = sort === 'asc' ? SortAsc : sort === 'desc' ? SortDesc : '';
    
    return <div
        className={cn(
            styles.headerCell,
            (toggleSortFn || onClick) && styles.headerCellClickable,
            className
        )}
        ref={ref}
        onClick={(e) => {
            toggleSortFn?.(e);
            onClick?.(e);
        }}
        {...props}
    >
        {children}
        {SortIcon && <SortIcon size={16} className={styles.headerCellSortIcon} />}
    </div>
});

HeaderCell.displayName = "HeaderCell";

export {
    HeaderCell,
};