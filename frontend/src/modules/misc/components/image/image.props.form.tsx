import React from "react";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "../../../../components/ui/form/form/form";
import { ConfigurableImagePropsSchema } from "./image";
import { usePropsForm } from "../../../../hooks/use-props-form";
import FileField from "../../../../components/ui/form/base-fields/file-upload/file-field";
import { ArrowDownFromLine, ArrowLeftFromLine, ArrowRightFromLine, ArrowUpFromLine, MoveVertical, SquareRoundCorner } from "lucide-react";
import { radii } from "../../data/radii";
import { extractSchemaKeys } from "../../../../utils/zod.utils";
import styles from '../../../../components/ui/form/form/form.module.scss';
import { MultipleSliders } from "../section-2-columns/multiple-sliders";


export function ImagePropsForm(): React.ReactElement {

    const keys = extractSchemaKeys(ConfigurableImagePropsSchema);
    const form = usePropsForm({
        schema: ConfigurableImagePropsSchema,
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
                                The image to display.
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* Spacings & Styling */}
                <MultipleSliders
                    form={form}
                    sliders={[
                        {
                            type: "synchronized-sliders",
                            synchronizedSliderTitle: "Margin X",
                            synchronizedSliderIcon: <><ArrowLeftFromLine size={14} /> <ArrowRightFromLine size={14} /></>,
                            sliders: [
                                {
                                    title: "Margin left",
                                    key: keys.marginLeft,
                                    icon: <ArrowLeftFromLine size={14} />,
                                },
                                {
                                    title: "Margin right",
                                    key: keys.marginRight,
                                    icon: <ArrowRightFromLine size={14} />,
                                },
                            ]
                        },
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
                        {
                            type: 'single-slider',
                            title: 'Border radius',
                            icon: <SquareRoundCorner size={14} />,
                            name: keys.radius,
                            values: Array.from(radii.entries()).map(([id, { label }]) => ({
                                value: id,
                                label: label
                            })),
                        },
                        {
                            type: 'single-slider',
                            title: 'Height',
                            icon: <MoveVertical size={14} />,
                            name: keys.height,
                            values: Array(1001 - 1).fill(0).map((_, index) => {
                                return {
                                    value: (index + 1).toString(),
                                    label: `${index + 1}px`,
                                }
                            }),
                        },
                    ]}
                />

            </div>
        </form>
    </Form>;
}
