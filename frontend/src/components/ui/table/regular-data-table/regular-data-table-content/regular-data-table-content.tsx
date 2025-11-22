import React, { useState } from "react";
import { flexRender } from "@tanstack/react-table";
import { cn } from "../../../../../lib/utils";
import styles from "../regular-data-table.module.scss";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "../../table/table";
import { SearchIcon } from "lucide-react";
import { Empty } from "../../../empty/empty";
import { ErrorMessage } from "../../../error-message/error-message";
import { useTranslation } from "../../../../../../../i18n/react";
import { TUseRegularDataTableReturn } from "../hook/use-regular-data-table";
import { TDataTable } from "../regular-data-table";
import {
    ContextMenu,
    ContextMenuContent,
    ContextMenuItem,
    ContextMenuSeparator,
    ContextMenuTrigger,
} from "../../../context-menu/context-menu";
import contextMenuStyles from "../../../context-menu/context-menu.module.scss";
import { useVanillaCSSInjection } from "../../../../../../../hooks/use-vanilla-css-injection";


type TRegularDataTableContentProps<TData, TValue> = {
    table: TUseRegularDataTableReturn<TData, TValue>['table'];
    rows: TUseRegularDataTableReturn<TData, TValue>['rows'];
    props: TDataTable<TData, TValue>;
};

const RegularDataTableContent = <TData, TValue>({
    table,
    rows,
    props,
}: TRegularDataTableContentProps<TData, TValue>) => {
    const { t } = useTranslation();
    const { columns, error, isLoading, onRowClick } = props;
    const [openContextMenuRowId, setOpenContextMenuRowId] = useState<string | null>(null);

    // Inject dynamic CSS to highlight the row with open context menu
    useVanillaCSSInjection({
        id: 'context-menu-row-highlight',
        css: openContextMenuRowId
            ? `
                [data-row-id="${openContextMenuRowId}"] {
                    background-color: var(--surface-2) !important;
                }


                /*[data-row-id="${openContextMenuRowId}"]::before {
                content: '';
                position: fixed;
                outline: 2px solid var(--border-primary);
                width: var(--table-width, 1472px);
                outline-offset: 2px;
                height: var(--table-row-height, 73px);
                z-index: 1;
                border-radius: var(--radius-xs);
                }*/
            `
            : '',
    });

    return <Table className={cn(
        styles.dataTable,
        !rows?.length && styles.tableEmpty,
    )}>
        <TableHeader className={styles.dataTableHeader}>
            {table.getHeaderGroups().map((headerGroup) => (
                <TableRow
                    key={headerGroup.id}
                >
                    {headerGroup.headers.map((header) => {
                        return <TableHead
                            key={header.id}
                            className={cn({
                                [styles.selectCell]: header.column.id === 'select',
                                [styles.pointerEventsNone]: isLoading,
                            })}
                            style={{
                                width: header.column.columnDef.size,
                                minWidth: header.column.columnDef.minSize,
                                maxWidth: header.column.columnDef.maxSize,
                            }}
                        >
                            {header.isPlaceholder
                                ? null
                                : flexRender(
                                    header.column.columnDef.header,
                                    header.getContext()
                                )}
                        </TableHead>;
                    })}
                </TableRow>
            ))}
        </TableHeader>
        <TableBody>
            {rows?.length ? (
                rows.map(row => {

                    const tableRow = <TableRow
                        key={`table-row-${row.id}`}
                        data-state={row.getIsSelected() && "selected"}
                        data-row-id={row.id}
                        className={cn({
                            [styles.cursorPointer]: !isLoading,
                            [styles.cursorDefault]: isLoading,
                            [styles.beingDeleted]: props.isDeletingBulk && props.idsBeingDeletedInBulk?.includes(+row.id),
                        })}
                        onClick={(e) => {

                            if (isLoading) {
                                return;
                            }

                            const isCheckboxCell = !!(e.target as HTMLElement).closest('[data-col-id="select"]');
                            const isDragHandle = !!(e.target as HTMLElement).closest('.drag-handle');

                            if (isCheckboxCell || isDragHandle) {
                                return;
                            }

                            onRowClick(row.original);
                        }}
                        {...(props.dragAndDrop ? (() => {

                            return {
                                onPointerDown: (e) => {
                                    const isDragHandle = !!(e.target as HTMLElement).closest(props.dragAndDrop!.handleSelector);
                                    if (isDragHandle) {
                                        const rowElement = e.currentTarget;
                                        rowElement.draggable = true;

                                        const handleDragStart = (event: DragEvent) => {
                                            props.dragAndDrop!.onDragStart(event as any, rowElement);
                                            rowElement.removeEventListener('dragstart', handleDragStart);
                                        };

                                        const handleDragEnd = () => {
                                            rowElement.draggable = false;
                                            rowElement.removeEventListener('dragend', handleDragEnd);
                                        };

                                        rowElement.addEventListener('dragstart', handleDragStart);
                                        rowElement.addEventListener('dragend', handleDragEnd);
                                    }
                                }
                            };
                        })() : {})}
                    >
                        {row.getVisibleCells().map((cell) => {

                            return <TableCell
                                key={cell.id}
                                className={cn(
                                    cell.column.id === 'select' ? styles.selectCell : '',
                                    cell.column.id === 'drag' ? styles.dragCell : '',
                                    styles.dataTableCell
                                )}
                                style={{
                                    width: cell.column.columnDef.size,
                                    minWidth: cell.column.columnDef.minSize,
                                    maxWidth: cell.column.columnDef.maxSize,
                                }}
                                data-col-id={cell.column.id}
                            >
                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                            </TableCell>;
                        })}
                    </TableRow>;

                    // Wrap with ContextMenu if actions are provided
                    if (props.contextMenuActions && props.contextMenuActions.length > 0) {
                        return <ContextMenu
                            key={`context-menu-${row.id}`}
                            onOpenChange={(open) => {
                                setOpenContextMenuRowId(open ? row.id : null);
                            }}
                        >
                            <ContextMenuTrigger asChild>
                                {tableRow}
                            </ContextMenuTrigger>
                            <ContextMenuContent>
                                {props.contextMenuActions.map((action, index) => {
                                    const isLastItem = index === props.contextMenuActions!.length - 1;
                                    return <React.Fragment key={`${action.label}-${index}`}>
                                        <ContextMenuItem
                                            className={contextMenuStyles.contextMenuItem}
                                            onClick={() => action.onClick(row.original)}
                                        >
                                            <action.icon size={16} className={cn(
                                                contextMenuStyles.contextMenuItemIcon,
                                                action.danger && contextMenuStyles.contextMenuItemIconDanger,
                                            )} />
                                            <span className={contextMenuStyles.contextMenuItemText}>{action.label}</span>
                                        </ContextMenuItem>
                                        {action.separator && !isLastItem && <ContextMenuSeparator />}
                                    </React.Fragment>;
                                })}
                            </ContextMenuContent>
                        </ContextMenu>;
                    }

                    return tableRow;
                })
            ) : error ? (
                <TableRow className={styles.tableRowEmpty}>
                    <TableCell colSpan={columns.length}>
                        <ErrorMessage error={error} />
                    </TableCell>
                </TableRow>
            ) : (
                <TableRow className={styles.tableRowEmpty}>
                    <TableCell colSpan={columns.length}>
                        {props.renderCustomEmptyState ? props.renderCustomEmptyState() : <Empty
                            Icon={SearchIcon}
                            title={t("general.table.noResults")}
                            description={t("general.table.noResultsEmptyState")}
                        />}
                    </TableCell>
                </TableRow>
            )}
        </TableBody>
    </Table>;
};


export {
    RegularDataTableContent,
};

