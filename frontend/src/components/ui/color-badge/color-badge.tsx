import React from "react";
import { COLOR_SCHEME_CLASSES, TColorScheme } from "../../../../../models/misc/color.model";
import { cn } from "../../../lib/utils";
import styles from "./color-badge.module.scss";


type TColorBadgeProps = {
    colorScheme: TColorScheme;
    label: string;
    className?: string;
}

function ColorBadge({ colorScheme, label, className }: TColorBadgeProps) {
    const classes = COLOR_SCHEME_CLASSES[colorScheme];

    return <div className={cn(
        styles.colorBadge,
        classes.background,
        classes.text,
        classes.border,
        className
    )} title={label}>
        {label}
    </div>;
}


export {
    ColorBadge,
    type TColorBadgeProps,
};