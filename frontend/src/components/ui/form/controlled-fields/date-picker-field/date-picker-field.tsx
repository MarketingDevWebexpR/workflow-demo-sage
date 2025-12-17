import React from "react";
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "../../form/form";
import { format } from "date-fns";
import styles from "../../form/form.module.scss";
import { DatePicker } from "../../base-fields/date-picker/date-picker";
import { type Control } from "react-hook-form";


type TDatePickerFieldProps = {
    label?: string | React.ReactNode;
    description?: string | React.ReactNode;
    name: string;
    control: Control<any>;
}


const DatePickerField = ({
    name,
    control,
    label,
    description,
}: TDatePickerFieldProps) => {

    return <FormField
        name={name}
        control={control}
        render={({ field }) => (
            <FormItem>
                { label ? <FormLabel>{label}</FormLabel> : null }
                <div className={styles.relative}>
                    <FormControl>
                        <DatePicker
                            value={field.value ? format(field.value as Date, "yyyy-MM-dd") : ''}
                            onChange={(e) => {
                                const date = e.target.value ? new Date(e.target.value) : undefined;
                                field.onChange(date);
                            }}
                        />
                    </FormControl>
                </div>
                { description ? <FormDescription>{description}</FormDescription> : null }
                <FormMessage />
            </FormItem>
        )}
    />
};


export {
    DatePickerField,
};
