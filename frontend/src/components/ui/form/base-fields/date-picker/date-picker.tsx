import { CalendarIcon, } from "lucide-react"
import React from "react";
import { Input } from "../input/input";
import styles from "../../form/form.module.scss";
import { cn } from "../../../../../lib/utils";
import datePickerStyles from "./date-picker.module.scss";


const DatePicker = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(({ className, ...props }, ref) => {

    return <div className={styles.relative}>
        <Input
            type="date"
            className={cn(
                styles.inputDate,
                className
            )}
            {...props}
            ref={ref}
        />
        <div className={datePickerStyles.calendarIconWrapper}><CalendarIcon className={cn(styles.inputIcon,  className)} size={18} /></div>
    </div>
});


export {
    DatePicker,
};
