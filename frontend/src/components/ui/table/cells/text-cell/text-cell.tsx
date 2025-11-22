import { cn } from "../../../../../lib/utils";
import styles from './text-cell.module.scss';
import React from "react";



type TTextCellProps = React.HTMLAttributes<HTMLDivElement> & {
    text: string | null | undefined;
    fallbackText?: string;
    variant?: 'important' | 'secondary';
    isLoading?: boolean;
};

const TextCell = React.forwardRef<HTMLDivElement, TTextCellProps>(
    ({ 
        className,
        text,
        fallbackText = 'No text.',
        variant,
        isLoading = false,
        ...props 
    }, ref) => {

        return <div
        className={cn(
            styles.textCell,
            variant === 'important' && styles.textCellImportant,
            variant === 'secondary' && styles.textCellSecondary,

            className
        )}
        ref={ref}
        data-fallback={!text}
        data-is-loading={isLoading}
        {...props}  
        >
            {text || fallbackText}
        </div>
    }
);

TextCell.displayName = 'TextCell';


export {
    TextCell
};