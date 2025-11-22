import React from "react";
import { Control } from "react-hook-form";
import { layouts } from "../../../../../modules/misc/data/layouts";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "../../form/form";
import { RadioGroup, RadioGroupItem } from "../../base-fields/radio-group/radio-group";
import styles from '../../form/form.module.scss';
import { cn } from "../../../../../lib/utils";



type TLayoutFieldProps = {
    name: string;
    control: Control<any>;
    label: string;
}


const LayoutField = ({
    name,
    control,
    label,
}: TLayoutFieldProps) => {

    return <FormField
        name={name}
        control={control}
        render={({ field }) => (
            <FormItem>
                <FormLabel>Layout</FormLabel>
                <FormControl>
                    <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value as string | undefined}
                        className={styles.layoutField}
                    >
                        {Array.from(layouts.entries()).map(([id, { label, value }]) => (
                            <>
                                <FormItem key={`form-item-padding-x-${id}`} className={styles.radioRow}>
                                    <FormControl>
                                        <RadioGroupItem
                                            value={id}
                                            className={styles.radioWithLargeHitArea}
                                        />
                                    </FormControl>
                                    <FormLabel>{label}</FormLabel>
                                </FormItem>
                                <div className={cn(styles.layoutFieldThumbnail, value)}>
                                    <div></div>
                                    <div></div>
                                </div>
                            </>
                        ))}
                    </RadioGroup>
                </FormControl>
                <FormMessage />
            </FormItem>
        )}
    />;
};


export {
    LayoutField,
};