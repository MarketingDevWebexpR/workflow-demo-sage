import React from "react";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "../../form/form";
import { type Control } from "react-hook-form";
import FileField from "../../base-fields/file-upload/file-field";


type TFileFieldControlledProps = {
    name: string;
    control: Control<any>;
    label?: string | React.ReactNode;
    accept?: string;
}

const FileFieldControlled = ({
    name,
    control,
    label,
    accept,
}: TFileFieldControlledProps) => {

    return <FormField
        name={name}
        control={control}
        render={({ field }) => (
            <FormItem data-field-name={name}>
                {label ? <FormLabel>{label}</FormLabel> : null}
                <FormControl>
                    <FileField
                        value={field.value}
                        onChange={field.onChange}
                        accept={accept}
                    />
                </FormControl>
                <FormMessage />
            </FormItem>
        )}
    />;
};


export {
    FileFieldControlled,
};

