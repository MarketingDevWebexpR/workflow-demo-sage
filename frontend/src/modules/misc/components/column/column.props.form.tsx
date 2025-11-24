import React from "react";
import { Form } from "../../../../components/ui/form/form/form";
import { ConfigurableColumnPropsSchema } from "./column";
import { usePropsForm } from "../../../../hooks/use-props-form";
import { extractSchemaKeys } from "../../../../utils/zod.utils";
import styles from '../../../../components/ui/form/form/form.module.scss';
import { BetweenHorizonalEnd } from "lucide-react";
import { MultipleSliders } from "../section-2-columns/multiple-sliders";
import { spacings } from "../../data/spacings";


export function ColumnPropsForm(): React.ReactElement {

    const form = usePropsForm({
        schema: ConfigurableColumnPropsSchema,
    });
    const keys = extractSchemaKeys(ConfigurableColumnPropsSchema);

    return <Form {...form}>
        <form
            className={styles.propsForm}
        >

            <div className={styles.propsFormContent}>

                <MultipleSliders
                    form={form}
                    sliders={[
                        {
                            type: "single-slider",
                            title: "Gap",
                            icon: <BetweenHorizonalEnd size={14} />,
                            name: keys.gapSize,
                            values: Array.from(spacings.entries()).map(([id, { label }]) => ({
                                value: id,
                                label: label
                            }))
                        },
                    ]}
                />
            </div>
        </form>
    </Form>;
}