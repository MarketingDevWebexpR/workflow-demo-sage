
import { Form,  } from "../../../../components/ui/form/form/form";
import { ConfigurableCustomTabsPropsSchema } from "./custom-tabs"
import { TabsField } from "./tabs-field";
import { usePropsForm } from "../../../../hooks/use-props-form";
import { extractSchemaKeys } from "../../../../utils/zod.utils";
import styles from '../../../../components/ui/form/form/form.module.scss';


export function CustomTabsPropsForm(): React.ReactElement {

    const form = usePropsForm({
        schema: ConfigurableCustomTabsPropsSchema,
    });
    const keys = extractSchemaKeys(ConfigurableCustomTabsPropsSchema);

    return <Form {...form}>
        <form
            className={styles.propsForm}
        >
            <div className={styles.propsFormContent}>

                <TabsField
                    form={form}
                    name={keys.tabs}
                />
            </div>
        </form>
    </Form>;
}