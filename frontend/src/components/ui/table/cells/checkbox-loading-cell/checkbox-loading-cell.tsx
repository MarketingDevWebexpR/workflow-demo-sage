import React from "react";
import { Checkbox } from "../../../form/base-fields/checkbox/checkbox";
import { cn } from "../../../../../lib/utils";
import styles from "./checkbox-loading-cell.module.scss";
import { Loader } from "lucide-react";


const CheckboxLoadingCell = React.forwardRef<HTMLButtonElement, React.ComponentPropsWithoutRef<typeof Checkbox>>(({
    className,
    ...props
}, ref) => {

    return <span className={styles.checkboxLoadingCell}>
        <Checkbox
            className={cn(
                styles.checkboxLoadingCellCheckbox,
                className
            )}
            ref={ref}
            {...props}
        />
        <Loader className={styles.checkboxLoadingCellLoader} size={14} />
    </span>
});


export {
    CheckboxLoadingCell,
};