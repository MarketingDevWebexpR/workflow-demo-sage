import React, { useState } from "react";
import {
    getCoreRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from "@tanstack/react-table";
import { type TDataTable } from "../regular-data-table";
import { RegularDataTableContent } from "../regular-data-table-content/regular-data-table-content";
import { RegularDataTablePagination } from "../regular-data-table-pagination/regular-data-table-pagination";


export type TUseRegularDataTableProps<TData, TValue> = TDataTable<TData, TValue> & {
    table?: ReturnType<typeof useReactTable<TData>>;
};

export type TUseRegularDataTableReturn<TData, _> = {
    table: ReturnType<typeof useReactTable<TData>>;
    rows: ReturnType<ReturnType<typeof useReactTable<TData>>['getRowModel']>['rows'];
    TableContent: React.FC;
    Pagination: React.FC;
};

export const useRegularDataTable = <TData, TValue>(
    props: TUseRegularDataTableProps<TData, TValue>
): TUseRegularDataTableReturn<TData, TValue> => {
    const { data, columns, isLoading } = props;

    const [pagination, setPagination] = useState({
        pageIndex: 0,
        pageSize: 20,
    });

    const table = props.table || useReactTable<TData>({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getRowId: row => (row as any).Id,
        ...props.type === 'static' ? {
            getPaginationRowModel: getPaginationRowModel(),
            onPaginationChange: setPagination,
            state: {
                pagination,
            },
        } : {},
    });

    const rows = table.getRowModel().rows;

    // Composants prêts à l'emploi
    const TableContent: React.FC = () => (
        <RegularDataTableContent<TData, TValue>
            table={table}
            rows={rows}
            props={props}
        />
    );

    const Pagination: React.FC = () => {
        if (props.type !== 'static' && props.type !== 'dynamic') {
            return null;
        }

        return <RegularDataTablePagination<TData, TValue>
            table={table}
            props={props}
            isLoading={isLoading}
        />;
    };

    return {
        table,
        rows,
        TableContent,
        Pagination,
    };
};

