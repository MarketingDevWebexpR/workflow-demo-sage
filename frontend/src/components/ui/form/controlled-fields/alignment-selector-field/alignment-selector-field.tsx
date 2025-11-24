
import { FormControl, FormField, FormItem, FormLabel } from "../../form/form";
import { type Control } from "react-hook-form";
import styles from './alignment-selector-field.module.scss';
import { RadioGroup, RadioGroupItem } from "../../base-fields/radio-group/radio-group";
import { alignments } from "../../../../../modules/misc/data/alignments";
import { cn } from "../../../../../lib/utils";
import formStyles from '../../form/form.module.scss';


type TAlignmentSelectorFieldProps = {
    name: string;
    control: Control<any>;
}

const AlignmentSelectorField = ({
    name,
    control,
}: TAlignmentSelectorFieldProps) => {

    return <FormField
    name={name}
    control={control}
    render={({ field }) => (
        <FormItem>
            <FormLabel>Content alignment</FormLabel>
            <FormControl>
                <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={field.value as string | undefined}
                    className={styles.alignmentSelectorField}
                >
                    {
                        Array.from(alignments.entries()).map(([id, { label, value }]) => {

                            return <>
                                <FormItem key={`form-item-alignment-${id}`} className={formStyles.radioRow}>
                                    <FormControl>
                                        <RadioGroupItem
                                            value={id}
                                            className={formStyles.radioWithLargeHitArea}
                                        />
                                    </FormControl>
                                    <FormLabel>{label}</FormLabel>
                                </FormItem>
                                <div className={cn(styles.alignmentSelectorFieldThumbnail, value)}>
                                    <div></div>
                                    <div></div>
                                </div>
                            </>
                        })
                    }
                </RadioGroup>
            </FormControl>
        </FormItem>
    )}
/>
};


export {
    AlignmentSelectorField,
};