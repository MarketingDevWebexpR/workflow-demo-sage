import React from "react";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage, } from "../../../../components/ui/form/form/form";
import { ConfigurableFancyTitlePropsSchema } from "./fancy-title"
import { usePropsForm } from "../../../../hooks/use-props-form";
import { extractSchemaKeys } from "../../../../utils/zod.utils";
import styles from '../../../../components/ui/form/form/form.module.scss';
import { Input } from "../../../../components/ui/form/base-fields/input/input";


const FancyTitlePropsForm = (): React.ReactElement => {

    const keys = extractSchemaKeys(ConfigurableFancyTitlePropsSchema);
    const form = usePropsForm({
        schema: ConfigurableFancyTitlePropsSchema,
    });

    return <Form {...form}>
        <form
            className={styles.propsForm}
        >
            {/* Formulaire */}
            <div className={styles.propsFormContent}>

                {/* Contenu */}
                <FormField
                    control={form.control}
                    name={keys.text}
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Text</FormLabel>
                            <FormControl>
                                <Input {...field as any} />
                            </FormControl>
                            <FormDescription>
                                Fancy title text.
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
            </div>
        </form>
    </Form>;
};


export {
    FancyTitlePropsForm,
};