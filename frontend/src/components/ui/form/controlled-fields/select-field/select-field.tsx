import React from "react";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "../../form/form";
import { type Control } from "react-hook-form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../base-fields/select/select";


type TSelectFieldProps = {
    name: string;
    control: Control<any>;
    label?: string | React.ReactNode;
    placeholder?: string;
    items?: {
        label: string;
        value: string;
    }[];
    disabled?: boolean;
}

const SelectField = ({
    name,
    control,
    label,
    placeholder,
    items = [],
    disabled,
}: TSelectFieldProps) => {

    try {
    return <FormField
        name={name}
        control={control}
        render={({ field }) => (
            <FormItem data-field-name={name}>
                {label ? <FormLabel>{label}</FormLabel> : null}
                <Select onValueChange={field.onChange} defaultValue={field.value} disabled={disabled}>
                    <FormControl>
                        <SelectTrigger>
                            <SelectValue placeholder={placeholder} />
                        </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                        {items.map((item) => (
                            <SelectItem key={item.value} value={item.value}>
                                {item.label}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                <FormMessage />
            </FormItem>
        )}
    />;
    }
    catch (error) {
        console.error('select field', {name, items, disabled});
        return <>test</>;
    }
};


export {
    SelectField,
};

