import { cn } from "../../../../lib/utils";
import styles from './badge.module.scss';
import React from "react";


type TBadgeProps = React.HTMLAttributes<HTMLDivElement> & {
    icon?: React.ReactNode;
    text: string | React.ReactNode | null | undefined;
    fallbackText?: string;
};

const Badge = React.forwardRef<HTMLDivElement, TBadgeProps>(
    ({
        className,
        icon,
        text,
        fallbackText = '—',
        ...props
    }, ref) => {

        return <div
            className={cn(
                styles.badge,
                className
            )}
            ref={ref}
            data-fallback={!text}
            {...props}
        >
            {icon}
            <span>{text || fallbackText}</span>
        </div>;
    }
);

Badge.displayName = 'Badge';


export {
    Badge,
};