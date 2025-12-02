import React, { useEffect } from "react";
import { Form } from "../../../../components/ui/form/form/form";
import { type FieldValues, useForm } from "react-hook-form";
import { type TFormEngineProps } from "./types";
import styles from './form-engine.module.scss';
import { formEngineItems } from "./items";
import useHiddenFields from "../../../../hooks/use-hidden-fields";
import { zodResolver } from "@hookform/resolvers/zod";
import { buildSchemaFromFields } from "./utils/build-schema";
import { evaluate } from "./logic";
import { Button } from "../../../../components/ui/button/button";


const FormEngine = <TFormValues extends FieldValues>({
    onSubmit,
    fields,
    layout,
    behavior,
}: TFormEngineProps<TFormValues>) => {

    const schema = buildSchemaFromFields(fields);

    const form = useForm<TFormValues>({
        resolver: zodResolver(schema),
    });
    const {
        hiddenFields,
        ifVisible,
        handleFieldsVisibility,
    } = useHiddenFields<keyof TFormValues>(behavior.initiallyHiddenFields);

    console.log('Dracolosse3: behavior.visibilityRules', behavior.visibilityRules);
    const watchedFields =[...new Set([
        ...behavior.visibilityRules.map(rule => {
            console.log('Dracolosse3: rule', rule);
            return rule.dependencies;
}).flat(),
        ...behavior.computedFields.map(field => field.dependencies).flat(),
    ])]
        .map(field => {
            console.log('Dracolosse3: field', field);
            return form.watch(field);
        });

    console.log('Dracolosse3: watchedFields', watchedFields);

    useEffect(
        handleFieldsVisibility(
            behavior.visibilityRules.map(rule => {


                const result = typeof rule.condition === 'function'
                    ? rule.condition(form.getValues())
                    : !!evaluate(rule.condition, form.getValues());

                if (rule.field === 'newsletter') {
                    console.log('Dracolosse: Le champ Newsletter est-il visible ?', result);
                } else { }

                return {
                    name: rule.field,
                    isVisible: typeof rule.condition === 'function'
                        ? rule.condition(form.getValues())
                        : !!evaluate(rule.condition, form.getValues()),
                };
            })
        ),
        watchedFields
    );
    console.log('watchedFields', watchedFields);

    console.log('Dracolosse: hiddenFields', hiddenFields);

    // ─────────────────────────────────────────────────────────
    // Filtrer les rows et items selon les champs visibles
    // ifVisible(fieldName) retourne [fieldName] si visible, [] si caché
    // ─────────────────────────────────────────────────────────
    const visibleRows = layout.structure
        .map(row => ({
            ...row,
            // Filtrer les items de la row pour ne garder que les champs visibles
            items: row.items.filter(fieldName => {

                console.log('fieldName', fieldName, ifVisible(fieldName as keyof TFormValues), { hiddenFields });

                return ifVisible(fieldName as keyof TFormValues).length > 0;
            })
        }))
        .filter(row => row.items.length > 0); // Ne garder que les rows qui ont au moins 1 item visible

    console.log({
        layoutStructre: layout.structure,
        visibleRows: visibleRows,
    })
    console.log('forme ngine');
    return <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className={styles.formEngine}>
            <div className={styles.formEngineBody}>
                {
                    visibleRows.map((row, index) => {

                        return <div
                            key={`form-row-${index}`}
                            style={{
                                '--items-per-row': row.itemsPerRow || 1, // mettre calcItemsPerRow(...) pour un rendu dynamique & responsive
                            } as React.CSSProperties}
                            className={styles.formRow}
                        >
                            {
                                row.items.map(formItemName => {

                                    const formItem = fields[formItemName];

                                    if (!formItem) {
                                        return <>Impossible de rendre le champ {formItemName} : Champ non trouvé</>;
                                    }

                                    if (formItem.type === 'custom') {
                                        return formItem.render?.() ?? <>
                                            Impossible de rendre le champ {formItemName} : Méthode render non définie
                                        </>;
                                    }

                                    const type = formItem.type;
                                    const FormEngineItemComponent = formEngineItems[type];

                                    return <FormEngineItemComponent
                                        key={`form-field-${formItemName as string}`}
                                        name={formItemName as string}
                                        control={form.control}
                                        label={formItem.label}
                                        {...formItem.props}
                                    />;
                                })
                            }
                        </div>
                    })}
            </div>
            <div className={styles.formEngineFooter}>
                <Button
                    type="submit"
                >
                    Enregistrer
                </Button>
            </div>
        </form>
    </Form>
};


export {
    FormEngine,
};
