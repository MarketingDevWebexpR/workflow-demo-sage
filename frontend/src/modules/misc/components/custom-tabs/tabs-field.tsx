import { Trash } from "lucide-react";
import { PlusCircle } from "lucide-react";
import { Button } from "../../../../components/ui/button/button";
import { FormControl, FormDescription, FormField, FormLabel, FormMessage } from "../../../../components/ui/form/form/form";
import { FormItem } from "../../../../components/ui/form/form/form";
import { useFieldArray, type UseFormReturn } from "react-hook-form";
import { Input } from "../../../../components/ui/form/base-fields/input/input";
import { appLaunchTimestamp } from "../../../../utils/number.utils";
import { v4 as uuidv4 } from 'uuid';


export function TabsField({
    form,
    name,
}: {
    form: UseFormReturn<any>;
    name: string;
}) {

    const { control, } = form;
    const { fields, append, remove } = useFieldArray({ control, name, });

    console.log('form.getValues()', form.getValues() );
    return <div>
        <div className="mb-4">
            <FormLabel>Onglets</FormLabel>
            <FormDescription>
                Ajoutez les onglets que vous souhaitez afficher.
            </FormDescription>
        </div>

        <div className="flex flex-col gap-4">
            {fields.map((field, index) => (
                <div key={field.id} className="flex items-center gap-3 rounded-lg">
                    <FormField
                        control={form.control}
                        name={`${name}[${index}].title`}
                        render={({ field }) => (
                            <FormItem className="flex-1">
                                <FormLabel>Title of the tab {index + 1}<span className="text-red-500 ml-1">*</span></FormLabel>
                                <FormControl>
                                    <Input 
                                        value={field.value}
                                        onChange={field.onChange}
                                        onBlur={field.onBlur}
                                        placeholder="Title of the tab" 
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <Button
                        className="self-end"
                        type="button"
                        variant="destructive"
                        size="icon"
                        onClick={() => remove(index)}
                    >
                        <Trash className="w-4 h-4" />
                    </Button>
                </div>
            ))}

            <Button
                type="button"
                onClick={() => append({
                    id: `${appLaunchTimestamp}-${uuidv4()}`,
                    title: undefined,
                })}
                variant="outline"
            >
                <PlusCircle className="w-4 h-4 mr-2" /> New
            </Button>
        </div>
    </div>
}