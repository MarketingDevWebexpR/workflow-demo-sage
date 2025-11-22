import React, { forwardRef } from "react";
import { cn } from "../../../lib/utils";
import styles from './empty.module.scss';


type TEmptyProps = {
    Icon: React.ElementType,
    title: string,
    description: string,
    children?: React.ReactNode,
    className?: string,
    small?: boolean,
}

const Empty = forwardRef<HTMLDivElement, TEmptyProps>(({
    Icon,
    title,
    description,
    children,
    className,
    small,
}, ref): React.ReactElement => {

   return <div
        ref={ref}
        className={cn(
            styles.empty,
            small && styles.emptySmall,
            className
        )}
    >
        <Icon size={ small ? 35 : 60} className={styles.emptyIcon} />
        <div className={styles.emptyContent}>
            <p className={styles.emptyTitle}>{ title }</p>
            <p className={styles.emptyDescription}>{ description }</p>
        </div>
        { children
            ? children
            : null
        }
    </div>;
});

Empty.displayName = "Empty";

export {
    Empty,
}
