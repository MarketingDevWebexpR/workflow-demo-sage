import React from "react";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "../../form/form";
import { type Control } from "react-hook-form";
import { MultiSelect, MultiSelectContent, MultiSelectItem, MultiSelectTrigger, MultiSelectValue } from "../../base-fields/multiselect/multiselect";


type TMultiSelectFieldProps = {
    name: string;
    control: Control<any>;
    label?: string | React.ReactNode;
    placeholder?: string;
    items?: {
        label: string;
        value: string;
    }[];
    disabled?: boolean;
    search?: boolean | { placeholder?: string; emptyMessage?: string };
    emptyState?: {
        title: string;
        description: string;
    };
}

const MultiSelectField = ({
    name,
    control,
    label,
    placeholder,
    items = [],
    disabled,
    search = true,
    emptyState,
}: TMultiSelectFieldProps) => {

    return <FormField
        name={name}
        control={control}
        render={({ field }) => (
            <FormItem data-field-name={name}>
                {label ? <FormLabel>{label}</FormLabel> : null}
                <FormControl>
                    <MultiSelect
                        values={field.value || []}
                        onValuesChange={field.onChange}
                    >
                        <MultiSelectTrigger disabled={disabled}>
                            <MultiSelectValue placeholder={placeholder} />
                        </MultiSelectTrigger>
                        <MultiSelectContent search={search} emptyState={emptyState}>
                            {items.map((item) => (
                                <MultiSelectItem key={item.value} value={item.value}>
                                    {item.label}
                                </MultiSelectItem>
                            ))}
                        </MultiSelectContent>
                    </MultiSelect>
                </FormControl>
                <FormMessage />
            </FormItem>
        )}
    />;
};


export {
    MultiSelectField,
};

