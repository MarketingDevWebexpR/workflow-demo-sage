import React from "react";
import { Form,  } from "../../../../components/ui/form/form/form";
import { ConfigurableKeyNumbersPropsSchema } from "./key-numbers"
import { usePropsForm } from "../../../../hooks/use-props-form";
import { KeyNumbersItemsField } from './key-numbers-items-field';
import { extractSchemaKeys } from "../../../../utils/zod.utils";
import styles from '../../../../components/ui/form/form/form.module.scss';


export function KeyNumbersPropsForm(): React.ReactElement {

    const form = usePropsForm({
        schema: ConfigurableKeyNumbersPropsSchema,
    });
    const keys = extractSchemaKeys(ConfigurableKeyNumbersPropsSchema);

    return <Form {...form}>
        <form
            className={styles.propsForm}
        >
            <div className={styles.propsFormContent}>

                <KeyNumbersItemsField
                    form={form}
                    name={keys.keyNumbers}
                />
            </div>
        </form>
    </Form>;
}