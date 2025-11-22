import React from "react";
import { GripVertical } from "lucide-react";
import { cn } from "../../../../../lib/utils";
import styles from "./drag-cell.module.scss";

type TDragCellProps = {
    className?: string;
    isLoading?: boolean;
};

const DragCell = React.forwardRef<HTMLDivElement, TDragCellProps>(
    ({ 
        className,
        isLoading = false,
        ...props 
    }, ref) => {

        return (
            <div 
                className={cn(
                    styles.dragCell,
                    'drag-handle',
                    className
                )}
                ref={ref}
                data-is-loading={isLoading}
                onMouseDown={(e) => {
                    e.stopPropagation();
                }}
                onClick={(e) => {
                    e.stopPropagation();
                }}
                {...props}
            >
                <GripVertical size={16} className={styles.dragIcon} />
            </div>
        );
    }
);

DragCell.displayName = 'DragCell';

export {
    DragCell
};
