export const badgeCode = `// Helper cn
const cn = (...classes: any[]) => classes.filter(Boolean).join(' ');

import * as React from "react";


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
                className={cn("badge", className)}
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
};`;

