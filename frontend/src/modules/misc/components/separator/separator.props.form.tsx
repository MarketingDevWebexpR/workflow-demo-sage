import React from "react";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "../../../../components/ui/form/form/form";
import { ConfigurableSeparatorPropsSchema } from "./separator";
import { usePropsForm } from "../../../../hooks/use-props-form";
import { extractSchemaKeys } from "../../../../utils/zod.utils";
import styles from '../../../../components/ui/form/form/form.module.scss';
import { RadioGroup, RadioGroupItem } from "../../../../components/ui/form/base-fields/radio-group/radio-group";
import { MultipleSliders } from "../section-2-columns/multiple-sliders";
import { ArrowDownFromLine, ArrowUpFromLine } from "lucide-react";


export function SeparatorPropsForm(): React.ReactElement {

    const keys = extractSchemaKeys(ConfigurableSeparatorPropsSchema);
    const form = usePropsForm({
        schema: ConfigurableSeparatorPropsSchema,
    });

    return <Form {...form}>
        <form className={styles.propsForm}>
            <div className={styles.propsFormContent}>

                {/* Orientation */}
                <FormField
                    name={keys.orientation}
                    control={form.control}
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Orientation</FormLabel>
                            <FormControl>
                                <RadioGroup
                                    onValueChange={field.onChange}
                                    defaultValue={field.value as string | undefined}
                                >
                                    <FormItem className={styles.radioRow}>
                                        <FormControl>
                                            <RadioGroupItem
                                                value="horizontal"
                                                className={styles.radioWithLargeHitArea}
                                            />
                                        </FormControl>
                                        <FormLabel>Horizontal</FormLabel>
                                    </FormItem>
                                    <FormItem className={styles.radioRow}>
                                        <FormControl>
                                            <RadioGroupItem
                                                value="vertical"
                                                className={styles.radioWithLargeHitArea}
                                            />
                                        </FormControl>
                                        <FormLabel>Vertical</FormLabel>
                                    </FormItem>
                                </RadioGroup>
                            </FormControl>
                            <FormDescription>
                                The direction of the separator.
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* Margins */}
                <MultipleSliders
                    form={form}
                    sliders={[
                        {
                            type: "synchronized-sliders",
                            synchronizedSliderTitle: "Margin Y",
                            synchronizedSliderIcon: <><ArrowUpFromLine size={14} /> <ArrowDownFromLine size={14} /></>,
                            sliders: [
                                {
                                    title: "Margin top",
                                    key: keys.marginTop,
                                    icon: <ArrowUpFromLine size={14} />,
                                },
                                {
                                    title: "Margin bottom",
                                    key: keys.marginBottom,
                                    icon: <ArrowDownFromLine size={14} />,
                                },
                            ]
                        },
                    ]}
                />

            </div>
        </form>
    </Form>;
}

