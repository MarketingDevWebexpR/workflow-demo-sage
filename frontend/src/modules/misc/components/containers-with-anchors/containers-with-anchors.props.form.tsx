import { Form,  } from "../../../../components/ui/form/form/form";
import { ContainersField } from "./containers-field";
import { usePropsForm } from "../../../../hooks/use-props-form";
import { ContainersWithAnchorsPropsSchema } from "./containers-with-anchors";
import { extractSchemaKeys } from "../../../../utils/zod.utils";
import styles from '../../../../components/ui/form/form/form.module.scss';


const ContainersWithAnchorsPropsForm = () => {

    const form = usePropsForm({
        schema: ContainersWithAnchorsPropsSchema,
    });
    const keys = extractSchemaKeys(ContainersWithAnchorsPropsSchema);

    return <Form {...form}>
        <form
            className={styles.propsForm}
        >
            <div className={styles.propsFormContent}>

                <ContainersField
                    form={form}
                    name={keys.titles}
                />
            </div>
        </form>
    </Form>;
}

export {
    ContainersWithAnchorsPropsForm,
};