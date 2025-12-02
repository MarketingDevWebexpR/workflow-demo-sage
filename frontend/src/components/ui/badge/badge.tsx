import * as React from "react";
import { cn } from "../../../lib/utils";
import styles from "./badge.module.scss";


type BadgeProps = {
    text?: React.ReactNode;
    className?: string;
    children?: React.ReactNode;
    fallbackText?: string;
} & React.HTMLAttributes<HTMLDivElement>;

const Badge = React.forwardRef<HTMLDivElement, BadgeProps>(
    ({ text, className, children, fallbackText = '—', ...props }, ref) => {
        return (
            <div
                ref={ref}
                className={cn(styles.badge, className)}
                {...props}
            >
                {text || children || fallbackText}
            </div>
        );
    }
);

Badge.displayName = "Badge";


export {
    Badge,
};

