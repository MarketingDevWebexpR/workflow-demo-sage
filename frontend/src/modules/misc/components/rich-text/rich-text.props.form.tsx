import React from "react";
import { Form, FormLabel, FormMessage, FormControl, FormDescription, FormItem, FormField, } from "../../../../components/ui/form/form/form";
import { ConfigurableRichTextPropsSchema } from "./rich-text"
import RichTextEditor from "../../../../components/ui/form/base-fields/rich-text-editor/rich-text-editor";
import { usePropsForm } from "../../../../hooks/use-props-form";
import { extractSchemaKeys } from "../../../../utils/zod.utils";
import styles from '../../../../components/ui/form/form/form.module.scss';


export function RichTextPropsForm(): React.ReactElement {

    const form = usePropsForm({
        schema: ConfigurableRichTextPropsSchema,
    });
    const keys = extractSchemaKeys(ConfigurableRichTextPropsSchema);

    return <Form {...form}>
        <form
            className={styles.propsForm}
        >

            <div className={styles.propsFormContent}>

                <FormField
                    control={form.control}
                    name={keys.content}
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Content</FormLabel>
                            <FormControl>
                                <RichTextEditor {...field as any} />
                            </FormControl>
                            <FormDescription>
                                The content of the block.
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />

            </div>
        </form>
    </Form>;
}