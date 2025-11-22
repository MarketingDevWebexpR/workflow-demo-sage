import React from "react";
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "../../form/form";
import { Control } from "react-hook-form";
import { ToggleButton } from "../../base-fields/toggle-button/toggle-button";
import styles from './toggle-button-group-field.module.scss';


type TToggleButtonGroupFieldProps = {
    name: string;
    control: Control<any>;
    label?: string | React.ReactNode;
    description?: string | React.ReactNode;
    items: {
        label: string | React.ReactNode;
        value: string | number;
    }[];
    disabled?: boolean;
}

const ToggleButtonGroupField = ({
    name,
    control,
    label,
    description,
    items,
    disabled = false,
}: TToggleButtonGroupFieldProps) => {

    return <FormField
        name={name}
        control={control}
        render={({ field }) => (
            <FormItem
                data-field-name={name}
            >
                {label ? <FormLabel>{label}</FormLabel> : null}
                {description ? <FormDescription>{description}</FormDescription> : null}
                <FormControl>
                    <div className={styles.toggleButtonGroup}>
                        {items.map((item) => {
                            const currentValue = field.value as (string | number)[] | undefined;
                            const isPressed = currentValue?.includes(item.value) || false;

                            return (
                                <ToggleButton
                                    key={`toggle-button-${item.value}`}
                                    pressed={isPressed}
                                    disabled={disabled}
                                    onPressedChange={(pressed) => {
                                        const newValue = currentValue || [];
                                        field.onChange(
                                            pressed
                                                ? [...newValue, item.value]
                                                : newValue.filter((value) => value !== item.value)
                                        );
                                    }}
                                >
                                    {item.label}
                                </ToggleButton>
                            );
                        })}
                    </div>
                </FormControl>
                <FormMessage />
            </FormItem>
        )}
    />;
};


export {
    ToggleButtonGroupField,
};

