import { ColumnDef, useReactTable } from "@tanstack/react-table";
import React from "react";
import { LucideIcon } from "lucide-react";
import { cn } from "../../../../lib/utils";
import styles from "./regular-data-table.module.scss";
import { useRegularDataTable, type TUseRegularDataTableProps, type TUseRegularDataTableReturn } from "./hook/use-regular-data-table";
import { RegularDataTableContent } from "./regular-data-table-content/regular-data-table-content";
import { RegularDataTablePagination } from "./regular-data-table-pagination/regular-data-table-pagination";


export type TContextMenuAction<TData> = {
    label: string,
    icon: LucideIcon,
    onClick: (item: TData) => void,
    danger?: boolean,
    separator?: boolean,
}

interface IDataTable<TData, TValue> {
    className?: string,
    columns: ColumnDef<TData, TValue>[],
    data: TData[],
    isLoading: boolean,
    error: Error | undefined,
    isDeletingBulk?: boolean,
    idsBeingDeletedInBulk?: number[],
    onRowClick: (row: TData) => void,
    table?: ReturnType<typeof useReactTable<TData>>,
    dragAndDrop?: {
        onDragStart: (event: React.DragEvent, rowElement: HTMLElement) => void,
        handleSelector: string,
    },
    renderCustomEmptyState?: () => React.ReactNode,
    contextMenuActions?: TContextMenuAction<TData>[],
}

type DynamicDataTableProps<TData, TValue> = IDataTable<TData, TValue> & {
    type: 'dynamic',
    onPrevClick: () => Promise<void>,
    onNextClick: () => Promise<void>,
    currentPagePointer: number,
    maxPagePointer: number | null,
}

type StaticDataTableProps<TData, TValue> = IDataTable<TData, TValue> & {
    type: 'static',
}

type InfiniteScrollDynamicDataTableProps<TData, TValue> = IDataTable<TData, TValue> & {
    type: 'infinite-scroll',
}

type TDataTable<TData, TValue> =
    | DynamicDataTableProps<TData, TValue>
    | StaticDataTableProps<TData, TValue>
    | InfiniteScrollDynamicDataTableProps<TData, TValue>


const RegularDataTable = <TData, TValue>(props: TDataTable<TData, TValue>) => {
    const { isLoading } = props;

    const { table, rows } = useRegularDataTable<TData, TValue>(props);

    return <div
        className={cn(
            styles.dataTableRoot,
            !props.table && styles.notAdminDataTable,
            props.className,
        )}
        data-is-loading={!!isLoading}
        data-table
    >
        <RegularDataTableContent<TData, TValue>
            table={table}
            rows={rows}
            props={props}
        />
        {/* Pagination pour les data-tables. Les data-tables admin (props.table !== undefined) ont leur propre bloc de pagination pour l'instant - voir pour factoriser ça. */}
        {(props.type === 'static' || props.type === 'dynamic') && !props.table && <RegularDataTablePagination<TData, TValue>
            table={table}
            props={props}
            isLoading={isLoading}
        /> }
    </div>;
};


export {
    RegularDataTable,
    RegularDataTableContent,
    RegularDataTablePagination,
    useRegularDataTable,
    type TDataTable,
    type DynamicDataTableProps,
    type StaticDataTableProps,
    type InfiniteScrollDynamicDataTableProps,
    type TUseRegularDataTableProps,
    type TUseRegularDataTableReturn,
};
