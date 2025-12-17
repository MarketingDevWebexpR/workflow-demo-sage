import * as React from "react"
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react"
import { cn } from "../../../lib/utils"
import { type ButtonProps, buttonVariants } from "../button/button"
import styles from "./pagination.module.scss"
import { useTranslation } from "../../../../i18n/react"


const Pagination = ({ className, ...props }: React.ComponentProps<"nav">) => (
    <nav
        role="navigation"
        aria-label="pagination"
        className={cn(styles.pagination, className)}
        {...props}
    />
)
Pagination.displayName = "Pagination"

const PaginationContent = React.forwardRef<
    HTMLUListElement,
    React.ComponentProps<"ul">
>(({ className, ...props }, ref) => (
    <ul
        ref={ref}
        className={cn(styles.paginationContent, className)}
        {...props}
    />
))
PaginationContent.displayName = "PaginationContent"

const PaginationItem = React.forwardRef<
    HTMLLIElement,
    React.ComponentProps<"li">
>(({ className, ...props }, ref) => (
    <li ref={ref} className={cn(styles.paginationItem, className)} {...props} />
))
PaginationItem.displayName = "PaginationItem"

type PaginationLinkProps = {
    isActive?: boolean
} & Pick<ButtonProps, "size"> &
    React.ComponentProps<"a">

const PaginationLink = ({
    className,
    isActive,
    size = "icon",
    ...props
}: PaginationLinkProps) => (
    <a
        aria-current={isActive ? "page" : undefined}
        className={cn(
            buttonVariants({
                variant: isActive ? "outline" : "ghost",
                size,
            }),
            className
        )}
        {...props}
    />
)
PaginationLink.displayName = "PaginationLink"

const PaginationPrevious = ({
    className,
    ...props
}: React.ComponentProps<typeof PaginationLink>) => {
    const { t } = useTranslation();
    
    return (
        <PaginationLink
            aria-label={t("general.table.paginationPreviousAriaLabel")}
            size="default"
            className={cn(styles.paginationPrevious, className)}
            {...props}
        >
            <ChevronLeft size={16} />
            <span>{t("general.table.paginationPrevious")}</span>
        </PaginationLink>
    );
}
PaginationPrevious.displayName = "PaginationPrevious"

const PaginationNext = ({
    className,
    ...props
}: React.ComponentProps<typeof PaginationLink>) => {
    const { t } = useTranslation();
    
    return (
        <PaginationLink
            aria-label={t("general.table.paginationNextAriaLabel")}
            size="default"
            className={cn(styles.paginationNext, className)}
            {...props}
        >
            <span>{t("general.table.paginationNext")}</span>
            <ChevronRight size={16} />
        </PaginationLink>
    );
}
PaginationNext.displayName = "PaginationNext"

const PaginationEllipsis = ({
    className,
    ...props
}: React.ComponentProps<"span">) => {
    const { t } = useTranslation();
    
    return (
        <span
            aria-hidden
            className={cn(styles.paginationEllipsis, className)}
            {...props}
        >
            <MoreHorizontal size={16} />
            <span className={styles.paginationEllipsisText}>{t("general.table.paginationMorePages")}</span>
        </span>
    );
};

PaginationEllipsis.displayName = "PaginationEllipsis";


export {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
};