import React from "react";
import { Checkbox } from "../../../form/base-fields/checkbox/checkbox";
import { cn } from "../../../../../lib/utils";
import styles from "./checkbox-cell.module.scss";


const CheckboxCell = React.forwardRef<HTMLButtonElement, React.ComponentPropsWithoutRef<typeof Checkbox>>(({
    className,
    ...props
}, ref) => {

    return <Checkbox
        className={cn(
            styles.checkboxCell,
            className
        )}
        ref={ref}
        {...props}
    />;
});


export {
    CheckboxCell,
};