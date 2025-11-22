import {
    ColumnDef,
    getCoreRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    SortingState,
    TableOptions,
    Updater,
    useReactTable,
} from "@tanstack/react-table"
import React, { useEffect, useState } from "react"
import styles from "./admin-data-table.module.scss";
import {
    RegularDataTableContent,
    RegularDataTablePagination,
    type TDataTable as TRegularDataTable,
} from "../regular-data-table/regular-data-table";
import { useTranslation } from "../../../../../../i18n/react";
import { Button } from "../../button/button";
import { Sprout } from "lucide-react";


interface IDataTable<TData, TValue> {
    columns: ColumnDef<TData, TValue>[],
    data: TData[],
    isLoading: boolean,
    error: Error | undefined,
    isDeletingBulk: boolean,
    idsBeingDeletedInBulk: number[],
    onRowClick: (row: TData) => void,
    Sheet: React.ComponentType<{ open: boolean, setOpen: (open: boolean) => void, canCreateItems?: boolean }>,
    DeleteBulk: React.ComponentType<any>,
    additionalReactTableProps?: Partial<TableOptions<TData>>,
    preventSheetOpenOnRowClick?: boolean,
    canCreateItems?: boolean,
    onSeedFakeData?: () => void,
    onNextItemSelected?: (row: TData | undefined) => void,
    onPrevItemSelected?: (row: TData | undefined) => void,
    dragAndDrop?: {
        onDragStart: (event: React.DragEvent, rowElement: HTMLElement) => void,
        handleSelector: string,
    },
    renderCustomEmptyState?: (open: boolean, setOpen: (open: boolean) => void) => React.ReactNode,
    hideActionsWhenCustomEmptyStateWithCreateButtonIsDisplayed?: boolean,
    SearchInput?: React.ComponentType<React.ComponentProps<"input">>,
    FilterSheet?: React.ComponentType<React.ComponentProps<"button">>,
}

type DynamicDataTableProps<TData, TValue> = IDataTable<TData, TValue> & {
    type: 'dynamic',
    onPrevClick: () => Promise<void>,
    onNextClick: () => Promise<void>,
    currentPagePointer: number,
    maxPagePointer: number | null,
    sorting?: SortingState,
    onSortingChange?: (updater: Updater<SortingState>) => void,
}

type StaticDataTableProps<TData, TValue> = IDataTable<TData, TValue> & {
    type: 'static',
    selectedItem?: TData,
    // ces deux props là seront à mettre dans tous les tableaux après,
    // elles permettent de revenir à la page 1 lorsque l'on change de filtre ou de recherche
    // ce qui permet d'éviter de rester sur une page qui n'existe plus
    queryText?: string | undefined,
    filters?: any,
}

type TDataTable<TData, TValue> = DynamicDataTableProps<TData, TValue> | StaticDataTableProps<TData, TValue>;


const AdminDataTable = <TData, TValue>(props: TDataTable<TData, TValue>) => {
    const { t } = useTranslation();

    // On destructure uniquement les props communes aux deux types de tableau,
    // ainsi TypeScript comprend que "type" est discriminant à l'usage de props.machin.
    const {
        data,
        columns,
        isLoading,
    } = props;

    const [pagination, setPagination] = useState({
        pageIndex: 0,
        pageSize: 20,
    });

    useEffect(() => {
        if (props.type === 'static') {
            if (props.queryText || (props.filters && Object.keys(props.filters).length > 0)) {
                setPagination(prev => ({
                    ...prev,
                    pageIndex: 0,
                }));
            }
        }
    }, [
        ...(props.type === 'static' ? [props.queryText, props.filters] : []),
    ]);

    const table = useReactTable<TData>({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getRowId: row => {
            console.log('get Row Id', row);
            return (row as any).Id || (row as any).id;
        },

        ...props.type === 'static' ? {
            getSortedRowModel: getSortedRowModel(),
            getPaginationRowModel: getPaginationRowModel(),
            onPaginationChange: (updater) => {
                setPagination(old => {
                    const newPagination = typeof updater === 'function' ? updater(old) : updater;
                    return newPagination;
                });
            },
            autoResetPageIndex: props.type === 'static' ? false : true,
            state: {
                pagination,
            },

        } : {},

        ...props.type === 'dynamic' ? {
            manualSorting: true,
            onSortingChange: props.onSortingChange,
            state: {
                sorting: props.sorting,
            },
        } : {},

        ...props.additionalReactTableProps || {},
    });

    useEffect(() => {
        if ((props as any).selectedItem) {

            const selectedItemId = (props as any).selectedItem.Id;
            const allRows = table.getPrePaginationRowModel().rows;
            const selectedItemIndex = allRows.findIndex(row => row.id === selectedItemId);

            // Préparer l'élément suivant
            const nextItemIndex = selectedItemIndex + 1;
            const nextItem = allRows[nextItemIndex];
            if (nextItem && (props as any).onNextItemSelected) {
                (props as any).onNextItemSelected(nextItem.original);
            } else if ((props as any).onNextItemSelected) {
                (props as any).onNextItemSelected(undefined);
            }

            // Préparer l'élément précédent
            const prevItemIndex = selectedItemIndex - 1;
            const prevItem = allRows[prevItemIndex];
            if (prevItem && (props as any).onPrevItemSelected) {
                (props as any).onPrevItemSelected(prevItem.original);
            } else if ((props as any).onPrevItemSelected) {
                (props as any).onPrevItemSelected(undefined);
            }
        }
    }, [(props as any).selectedItem]);

    const [open, setOpen] = useState(false);

    const selectedRows = table.getFilteredSelectedRowModel().rows;
    const selectedCount = selectedRows.length;
    const unparsedSelectedIds = selectedRows.map(row => row.id);
    const selectedIds = selectedRows.map(row => parseInt(row.id));

    // Préparer les props pour le RegularDataTable
    const regularDataTableProps: TRegularDataTable<TData, TValue> = {
        ...props,
        table,
        onRowClick: (row) => {
            if (!props.preventSheetOpenOnRowClick)
                setOpen(true);

            props.onRowClick(row);
        },
        renderCustomEmptyState: props.renderCustomEmptyState ? () => props.renderCustomEmptyState!(open, setOpen) : undefined,
    };

    const hasSearchOrFilter = !!(props.SearchInput || props.FilterSheet);

    // Détermine si l'empty state personnalisé est affiché
    const isCustomEmptyStateWithCreateButtonDisplayed =
        (props.hideActionsWhenCustomEmptyStateWithCreateButtonIsDisplayed ?? true ) &&
        props.renderCustomEmptyState &&
        (data.length === 0 || (data[0] as any)?.Id < 0 ) &&
        !props.error;

    return <div
        className={styles.adminDataTable}
        data-is-loading={!!isLoading}
        data-table
    >
        <div className={styles.adminDataTableHeader}>

            <div className={styles.adminDataTableHeaderStart}>
                {!isCustomEmptyStateWithCreateButtonDisplayed && <props.Sheet
                    open={open}
                    setOpen={setOpen}
                    canCreateItems={props.canCreateItems}
                />}

                {props.onSeedFakeData && <Button variant="outline"
                    onClick={() => {
                        props.onSeedFakeData?.();
                    }}
                >
                    <Sprout size={16} />
                    {t("general.table.seedFakeData")}
                </Button>}

                {
                    selectedCount > 0 || props.isDeletingBulk
                        ? <div className={styles.adminDataTableHeaderSelection}>
                            <props.DeleteBulk
                                unparsedSelectedIds={unparsedSelectedIds}
                                selectedIds={selectedIds}
                            />
                            <div className={styles.adminDataTableHeaderSelectionCount}>
                                {t("general.table.itemsSelected", {
                                    count: table.getFilteredSelectedRowModel().rows.length,
                                    total: table.getFilteredRowModel().rows.length
                                })}
                            </div>
                        </div>
                        : ''
                }
            </div>

            {hasSearchOrFilter && <div className={styles.adminDataTableHeaderMiddle}>
                {props.SearchInput ? <props.SearchInput /> : null}
                {props.FilterSheet ? <props.FilterSheet /> : null}
            </div>}

            <div className={styles.adminDataTableHeaderEnd}>
                <RegularDataTablePagination<TData, TValue>
                    table={table}
                    props={regularDataTableProps}
                    isLoading={isLoading}
                />
                <div className={styles.adminDataTableHeaderFocusFix}>{t("general.table.focusFix")}</div>
            </div>
        </div>
        <div className={styles.adminDataTableMain}>
            <RegularDataTableContent<TData, TValue>
                table={table}
                rows={table.getRowModel().rows}
                props={regularDataTableProps}
            />
        </div>
    </div>;
};


export {
    AdminDataTable,
};
