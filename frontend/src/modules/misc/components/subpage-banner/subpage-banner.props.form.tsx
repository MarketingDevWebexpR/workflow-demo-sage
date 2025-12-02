import React from "react";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "../../../../components/ui/form/form/form";
import { ConfigurableSubpageBannerPropsSchema } from "./subpage-banner";
import { usePropsForm } from "../../../../hooks/use-props-form";
import FileField from "../../../../components/ui/form/base-fields/file-upload/file-field";
import RichTextEditor from "../../../../components/ui/form/base-fields/rich-text-editor/rich-text-editor";
import { extractSchemaKeys } from "../../../../utils/zod.utils";
import styles from '../../../../components/ui/form/form/form.module.scss';


const SubpageBannerPropsForm = (): React.ReactElement => {

    const keys = extractSchemaKeys(ConfigurableSubpageBannerPropsSchema);
    const form = usePropsForm({
        schema: ConfigurableSubpageBannerPropsSchema,
    });

    return <Form {...form}>
        <form className={styles.propsForm}>
            <div className={styles.propsFormContent}>

                {/* Image Upload */}
                <FormField
                    control={form.control}
                    name={keys.imageUrl}
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Image</FormLabel>
                            <FormControl>
                                <FileField
                                    value={field.value as any}
                                    onChange={field.onChange}
                                    accept="image/*"
                                />
                            </FormControl>
                            <FormDescription>
                                The visual of the banner.
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* Rich Text Content */}
                <FormField
                    control={form.control}
                    name={keys.text}
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Text</FormLabel>
                            <FormControl>
                                <RichTextEditor {...field as any} />
                            </FormControl>
                            <FormDescription>
                                Text of the banner.
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
    SubpageBannerPropsForm,
};
