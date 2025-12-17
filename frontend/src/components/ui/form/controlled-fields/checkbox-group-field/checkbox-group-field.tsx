import React from "react";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "../../form/form";
import { type Control } from "react-hook-form";
import { Checkbox } from "../../base-fields/checkbox/checkbox";
import styles from '../../form/form.module.scss';


type TCheckboxGroupFieldProps = {
    name: string,
    control: Control<any>,
    label?: string | React.ReactNode,
    items: {
        label: string | React.ReactNode,
        value: string | number,
    }[],
}

const CheckboxGroupField = ({
    name,
    control,
    label,
    items,
}: TCheckboxGroupFieldProps) => {

    return <FormField
        name={name}
        control={control}
        render={() => (
            <FormItem
                data-field-name={name}
            >
                { label ? <FormLabel>{label}</FormLabel> : null }
                {items.map((item) => (
                    <FormField
                        key={`checkbox-group-field-${item.value}`}
                        control={control}
                        name={name}
                        render={({ field }) => {
                            return (
                                <FormItem
                                    className={styles.checkboxRow}
                                >
                                    <FormControl>
                                        <Checkbox
                                            className={styles.checkboxWithLargeHitArea}
                                            checked={(field.value)?.includes(item.value) || false}
                                            onCheckedChange={checked => {
                                                field.onChange(
                                                    checked
                                                        ? [...(Array.isArray(field.value) ? field.value : []), item.value ]
                                                        : (
                                                            (Array.isArray(field.value) ? field.value : [])
                                                        ).filter((value) => value !== item.value)
                                                );
                                            }}
                                        />
                                    </FormControl>
                                    <FormLabel>
                                        {item.label}
                                    </FormLabel>
                                </FormItem>
                            )
                        }}
                    />
                ))}
                <FormMessage />
            </FormItem>
        )}
    />;
};


export {
    CheckboxGroupField,
};