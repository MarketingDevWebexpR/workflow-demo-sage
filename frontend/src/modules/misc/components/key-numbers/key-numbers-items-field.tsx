import { Trash } from "lucide-react";
import { PlusCircle } from "lucide-react";
import { Button } from "../../../../components/ui/button/button";
import { FormControl, FormDescription, FormField, FormLabel, FormMessage } from "../../../../components/ui/form/form/form";
import { FormItem } from "../../../../components/ui/form/form/form";
import { useFieldArray, type UseFormReturn } from "react-hook-form";
import { Input } from "../../../../components/ui/form/base-fields/input/input";
import { appLaunchTimestamp } from "../../../../utils/number.utils";
import { v4 as uuidv4 } from 'uuid';
import { Textarea } from "../../../../components/ui/form/base-fields/textarea/textarea";


export function KeyNumbersItemsField({
    form,
    name,
}: {
    form: UseFormReturn<any>;
    name: string;
}) {

    const { control, } = form;
    const { fields, append, remove } = useFieldArray({ control, name, });

    return <div>
        <div className="mb-4">
            <FormLabel>Items</FormLabel>
            <FormDescription>
                Add the key numbers you want to display.
            </FormDescription>
        </div>

        <div className="flex flex-col gap-4 [&>div:not(:last-child)]:border-b [&>div:not(:last-child)]:border-[--border-color-standard] [&>div:not(:last-child)]:pb-6">
            {fields.map((field, index) => (
                <div key={field.id} className="flex items-center gap-6 rounded-lg">
                    <div className="flex flex-col gap-4">
                    <FormField
                        control={form.control}
                        name={`${name}[${index}].value`}
                        render={({ field }) => (
                            <FormItem className="flex-1">
                                <FormLabel>Key number {index + 1}<span className="text-red-500 ml-1">*</span></FormLabel>
                                <FormControl>
                                    <Input
                                        value={field.value}
                                        onChange={field.onChange}
                                        onBlur={field.onBlur}
                                        placeholder="Key number"
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name={`${name}[${index}].title`}
                        render={({ field }) => (
                            <FormItem className="flex-1">
                                <FormLabel>Title of the item {index + 1}<span className="text-red-500 ml-1">*</span></FormLabel>
                                <FormControl>
                                    <Input
                                        value={field.value}
                                        onChange={field.onChange}
                                        onBlur={field.onBlur}
                                        placeholder="Title of the item"
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    </div>

                    <FormField
                        control={form.control}
                        name={`${name}[${index}].description`}
                        render={({ field }) => (
                            <FormItem className="flex-1">
                                <FormLabel>Description of the item {index + 1}<span className="text-red-500 ml-1">*</span></FormLabel>
                                <FormControl>
                                    <Textarea
                                        value={field.value}
                                        onChange={field.onChange}
                                        onBlur={field.onBlur}
                                        placeholder="Description of the item"
                                        rows={5}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <Button
                        className="self-center"
                        type="button"
                        variant="destructive"
                        size="icon"
                        onClick={() => remove(index)}
                    >
                        <Trash className="w-4 h-4 stroke-[--text-destructive-foreground]" />
                    </Button>
                </div>
            ))}

            <Button
                type="button"
                onClick={() => append({
                    id: `${appLaunchTimestamp}-${uuidv4()}`,
                    value: undefined,
                    title: undefined,
                    description: undefined,
                })}
                variant="outline"
            >
                <PlusCircle className="w-4 h-4 mr-2" />  New
            </Button>
        </div>
    </div>
}