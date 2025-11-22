import React from "react";
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "../../form/form";
import { Control } from "react-hook-form";
import { RadioGroup, RadioGroupItem } from "../../base-fields/radio-group/radio-group";
import styles from '../../form/form.module.scss';
import { cn } from "../../../../../lib/utils";


type TRadioGroupFieldProps = {
    name: string;
    control: Control<any>;
    label?: string | React.ReactNode;
    description?: string | React.ReactNode;
    items: {
        label: string | React.ReactNode;
        value: string | number;
        className?: string;
    }[];
    className?: string;
}

const RadioGroupField = ({
    name,
    control,
    label,
    description,
    items,
    className,
}: TRadioGroupFieldProps) => {

    return <FormField
        name={name}
        control={control}
        render={({ field }) => (
            <FormItem>
                {label ? <FormLabel>{label}</FormLabel> : null}
                {description ? <FormDescription>{description}</FormDescription> : null}
                <FormControl>
                    <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value as string | undefined}
                        className={className}
                    >
                        {items.map((item) => (
                            <FormItem key={`form-item-radio-${item.value}`} className={cn( styles.radioRow, item.className )}>
                                <FormControl>
                                    <RadioGroupItem
                                        value={item.value.toString()}
                                        className={styles.radioWithLargeHitArea}
                                    />
                                </FormControl>
                                <FormLabel>{item.label}</FormLabel>
                            </FormItem>
                        ))}
                    </RadioGroup>
                </FormControl>
                <FormMessage />
            </FormItem>
        )}
    />;
};


export {
    RadioGroupField,
};
