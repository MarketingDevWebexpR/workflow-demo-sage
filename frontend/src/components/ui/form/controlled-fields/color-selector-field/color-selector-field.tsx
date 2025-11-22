import React from "react";
import styles from "./color-selector-field.module.scss";
import { Control } from "react-hook-form";
import { FormControl, FormDescription, FormField, FormItem, FormLabel } from "../../form/form";
import { cn } from "../../../../../lib/utils";
import { backgrounds } from "../../../../../modules/misc/data/backgrounds";


type TColorSelectorFieldProps = {
    name: string;
    control: Control<any>;
    label: string;
    className?: string;
}

const ColorSelectorField = ({
    name,
    control,
    label,
    className,
}: TColorSelectorFieldProps) => {

    return <FormField
        name={name}
        control={control}
        render={({ field }) => (
            <FormItem>
                <FormLabel>{label}</FormLabel>
                <FormControl>
                    <div className={cn(styles.colorSelectorField, className)}>
                        {Array.from(backgrounds.entries()).map(([key, { value }]) => {
                            const isSelected = field.value === key;

                            return (
                                <button
                                    key={key}
                                    type="button"
                                    onClick={() => field.onChange(key)}
                                    className={cn(
                                        styles.colorSelectorFieldItem,
                                        value,
                                        isSelected && styles.colorSelectorFieldItemSelected,
                                    )}
                                    aria-label={`Background ${key}`}
                                >
                                    {isSelected && (
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            className={styles.colorSelectorFieldItemIconCheck}
                                        >
                                            <polyline points="20 6 9 17 4 12"></polyline>
                                        </svg>
                                    )}
                                </button>
                            );
                        })}
                    </div>
                </FormControl>
                <FormDescription>Consider both light and dark modes.</FormDescription>
            </FormItem>
        )}
    />;
}


export {
    ColorSelectorField,
};