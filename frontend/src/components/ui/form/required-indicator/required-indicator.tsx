import React from "react";
import { cn } from "../../../../lib/utils";
import styles from "./required-indicator.module.scss"


const RequiredIndicator =  React.forwardRef<HTMLSpanElement, React.HTMLAttributes<HTMLSpanElement>>(({ className, ...props }, ref) => (
    <span ref={ref} className={cn(styles.requiredIndicator, className)} {...props}>
        *
    </span>
));

RequiredIndicator.displayName = "RequiredIndicator";


export {
    RequiredIndicator,
};