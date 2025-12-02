import React from "react";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "../../form/form";
import { type Control } from "react-hook-form";
import { Textarea } from "../../base-fields/textarea/textarea";


type TTextareaFieldProps = {
    name: string;
    control: Control<any>;
    label?: string | React.ReactNode;
    placeholder?: string;
    disabled?: boolean;
    rows?: number;
}

const TextareaField = ({
    name,
    control,
    label,
    placeholder,
    disabled,
    rows,
}: TTextareaFieldProps) => {

    return <FormField
        name={name}
        control={control}
        render={({ field }) => (
            <FormItem data-field-name={name}>
                {label ? <FormLabel>{label}</FormLabel> : null}
                <FormControl>
                    <Textarea
                        placeholder={placeholder}
                        disabled={disabled}
                        rows={rows}
                        {...field}
                    />
                </FormControl>
                <FormMessage />
            </FormItem>
        )}
    />;
};


export {
    TextareaField,
};

