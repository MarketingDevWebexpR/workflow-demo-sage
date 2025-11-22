import React from "react";
import { Button } from "../../../button/button";
import { ArrowLeftIcon, ArrowRightIcon } from "lucide-react";
import styles from "./regular-data-table-pagination.module.scss";
import { useTranslation } from "../../../../../../../i18n/react";
import { useReactTable } from "@tanstack/react-table";
import { TDataTable } from "../regular-data-table";


type TRegularDataTablePaginationProps<TData, TValue> = {
    table: ReturnType<typeof useReactTable<TData>>;
    props: TDataTable<TData, TValue>;
    isLoading: boolean;
}

const RegularDataTablePagination = <TData, TValue>({
    table,
    props,
    isLoading,
}: TRegularDataTablePaginationProps<TData, TValue>) => {
    const { t } = useTranslation();

    return <div className={styles.dataTablePagination}>
        <Button
            variant="outline"
            size="sm"
            onClick={props.type === 'dynamic' ? props.onPrevClick : () => table.previousPage()}
            disabled={props.type === 'dynamic' ? isLoading || props.currentPagePointer < 1 : !table.getCanPreviousPage()}
        >
            <ArrowLeftIcon size={18} className={styles.dataTablePreviousIcon} />
            {t("general.table.paginationPrevious")}
        </Button>
        <Button
            variant="outline"
            size="sm"
            onClick={props.type === 'dynamic' ? props.onNextClick : () => table.nextPage()}
            disabled={props.type === 'dynamic' ? isLoading || props.maxPagePointer === props.currentPagePointer : !table.getCanNextPage()}
        >
            {t("general.table.paginationNext")}
            <ArrowRightIcon size={18} className={styles.dataTableNextIcon} />
        </Button>
    </div>;
};


export {
    RegularDataTablePagination,
};
