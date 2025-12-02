import React from "react";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "../../form/form";
import { type Control } from "react-hook-form";
import { Input } from "../../base-fields/input/input";


type TInputFieldProps = {
    name: string;
    control: Control<any>;
    label?: string | React.ReactNode;
    placeholder?: string;
    type?: string;
    disabled?: boolean;
}

const InputField = ({
    name,
    control,
    label,
    placeholder,
    type = "text",
    disabled,
}: TInputFieldProps) => {

    return <FormField
        name={name}
        control={control}
        render={({ field }) => (
            <FormItem data-field-name={name}>
                {label ? <FormLabel>{label}</FormLabel> : null}
                <FormControl>
                    <Input
                        type={type}
                        placeholder={placeholder}
                        disabled={disabled}
                        {...field}
                    />
                </FormControl>
                <FormMessage />
            </FormItem>
        )}
    />;
};


export {
    InputField,
};

