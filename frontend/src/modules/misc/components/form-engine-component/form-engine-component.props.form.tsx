import React from "react";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "../../../../components/ui/form/form/form";
import { ConfigurableFormEngineComponentPropsSchema } from "./form-engine-component";
import { usePropsForm } from "../../../../hooks/use-props-form";
import { extractSchemaKeys } from "../../../../utils/zod.utils";
import styles from '../../../../components/ui/form/form/form.module.scss';
import { Textarea } from "../../../../components/ui/form/base-fields/textarea/textarea";


export function FormEngineComponentPropsForm(): React.ReactElement {

    const keys = extractSchemaKeys(ConfigurableFormEngineComponentPropsSchema);
    const form = usePropsForm({
        schema: ConfigurableFormEngineComponentPropsSchema,
    });

    return <Form {...form}>
        <form className={styles.propsForm}>
            <div className={styles.propsFormContent}>

                {/* JSON Config */}
                <FormField
                    control={form.control}
                    name={keys.configJSON}
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Configuration JSON</FormLabel>
                            <FormControl>
                                <Textarea
                                    {...field as any}
                                    rows={20}
                                    placeholder='{"fields": {...}, "layout": {...}, "behavior": {...}}'
                                    className="font-mono text-sm"
                                />
                            </FormControl>
                            <FormDescription>
                                La configuration JSON du formulaire (fields, layout, behavior).
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />

            </div>
        </form>
    </Form>;
}

