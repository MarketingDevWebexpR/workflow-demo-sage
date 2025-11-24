import React from "react";
import { Form,  } from "../../../../components/ui/form/form/form";
import { ConfigurableAccordionPropsSchema } from "./accordion"
import { usePropsForm } from "../../../../hooks/use-props-form";
import { AccordionItemsField } from "./accordion-items-field";
import { extractSchemaKeys } from "../../../../utils/zod.utils";
import styles from '../../../../components/ui/form/form/form.module.scss';


export function AccordionPropsForm(): React.ReactElement {

    const form = usePropsForm({
        schema: ConfigurableAccordionPropsSchema,
    });
    const keys = extractSchemaKeys(ConfigurableAccordionPropsSchema);

    return <Form {...form}>
        <form
            className={styles.propsForm}
        >
            <div className={styles.propsFormContent}>

                <AccordionItemsField
                    form={form}
                    name={keys.items}
                />
            </div>
        </form>
    </Form>;
}