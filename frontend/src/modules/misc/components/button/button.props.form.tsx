import { Form, FormControl, FormDescription, FormField, FormLabel, FormMessage } from "../../../../components/ui/form/form/form";
import { FormItem } from "../../../../components/ui/form/form/form";
import { useEffect } from "react";
import { Input } from "../../../../components/ui/form/base-fields/input/input";
import { usePropsForm } from "../../../../hooks/use-props-form";
import { ConfigurableButtonPropsSchema, type TConfigurableButtonProps } from "./button";
import { RadioGroupItem } from "../../../../components/ui/form/base-fields/radio-group/radio-group";
import { RadioGroup } from "../../../../components/ui/form/base-fields/radio-group/radio-group";
import { buttonVariants } from "../../data/button-variants";
import { buttonOnClickBehaviors, type TButtonOnClickBehavior } from "../../data/button-onclick-behaviors";
import RichTextEditor from "../../../../components/ui/form/base-fields/rich-text-editor/rich-text-editor";
import useHiddenFields from "../../../../hooks/use-hidden-fields";
import { SelectContent, SelectItem } from "../../../../components/ui/form/base-fields/select/select";
import { SelectTrigger, SelectValue } from "../../../../components/ui/form/base-fields/select/select";
import { Select } from "../../../../components/ui/form/base-fields/select/select";
import { extractSchemaKeys } from "../../../../utils/zod.utils";
import { usePageStore } from "../../../view/store/page.store";
import styles from '../../../../components/ui/form/form/form.module.scss';


export function ButtonPropsForm() {

    const form = usePropsForm({
        schema: ConfigurableButtonPropsSchema,
    });
    const keys = extractSchemaKeys(ConfigurableButtonPropsSchema._def.schema);
    
    const pages = usePageStore(state => state.data);

    type TFieldsNames = keyof TConfigurableButtonProps;

    const {
        isVisible,
        handleFieldsVisibility,
    } = useHiddenFields<TFieldsNames>([
        keys.externalLink,
        keys.modalContent,
        keys.internalPageId,
    ]);

    const onClickBehaviorValue = form.watch(keys.onClickBehavior) as TButtonOnClickBehavior;

    useEffect(handleFieldsVisibility([
        {
            name: keys.externalLink,
            isVisible: onClickBehaviorValue === 'openExternalLink',
        },
        {
            name: keys.modalContent,
            isVisible: onClickBehaviorValue === 'openModal',
        },
        {
            name: keys.internalPageId,
            isVisible: onClickBehaviorValue === 'openInternalLink',
        },
    ]), [onClickBehaviorValue]);

    return <Form {...form}>
        <form
            className={styles.propsForm}
        >
            {/* Formulaire */}
            <div className={styles.propsFormContent}>

                {/* Titre */}
                <FormField
                    control={form.control}
                    name={keys.textContent}
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Text</FormLabel>
                            <FormControl>
                                <Input {...field as any} />
                            </FormControl>
                            <FormDescription>
                                Text of the button.
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* Variante */}
                <FormField
                    name={keys.variant}
                    control={form.control}
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Variant</FormLabel>
                            <FormControl>
                                <RadioGroup
                                    onValueChange={field.onChange}
                                    defaultValue={field.value as string | undefined}
                                >
                                    {Object.entries(buttonVariants).map(([id, { label }]) => (
                                        <FormItem key={`form-item-button-variant-${id}`} className={styles.radioRow}>
                                            <FormControl>
                                                <RadioGroupItem
                                                    value={id}
                                                    className={styles.radioWithLargeHitArea}
                                                />
                                            </FormControl>
                                            <FormLabel>{label}</FormLabel>
                                        </FormItem>
                                    ))}
                                </RadioGroup>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* Comportement au clic */}
                <FormField
                    name={keys.onClickBehavior}
                    control={form.control}
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Click behavior</FormLabel>
                            <FormControl>
                                <RadioGroup
                                    onValueChange={field.onChange}
                                    defaultValue={field.value as string | undefined}
                                >
                                    {Object.entries(buttonOnClickBehaviors).map(([id, { label }]) => (
                                        <FormItem key={`form-item-onclick-behavior-${id}`} className={styles.radioRow}>
                                            <FormControl>
                                                <RadioGroupItem
                                                    value={id}
                                                    className={styles.radioWithLargeHitArea}
                                                />
                                            </FormControl>
                                            <FormLabel>{label}</FormLabel>
                                        </FormItem>
                                    ))}
                                </RadioGroup>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* Lien externe */}
                {isVisible(keys.externalLink) && <FormField
                    name={keys.externalLink}
                    control={form.control}
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>External link</FormLabel>
                            <FormControl>
                                <Input placeholder="https://exemple.com" {...field as any} />
                            </FormControl>
                            <FormDescription>
                                External link to open.
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />}

                {/* Contenu de la fenêtre modale */}
                {isVisible(keys.modalContent) && <FormField
                    control={form.control}
                    name={keys.modalContent}
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Content</FormLabel>
                            <FormControl>
                                <RichTextEditor {...field as any} />
                            </FormControl>
                            <FormDescription>
                                Content of the modal window.
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />}

                {/* Sélecteur des pages du site pour une navigation interne */}
                {isVisible(keys.internalPageId) && <FormField
                    control={form.control}
                    name={keys.internalPageId}
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Site page</FormLabel>
                            <Select onValueChange={(val) => {
                                field.onChange(val === "" ? undefined : Number(val));
                            }} defaultValue={(field.value as string)?.toString()}>
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select a site page" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    {
                                        pages.map(item => {

                                            return <SelectItem
                                                key={`internal-link-${item.Id}`}
                                                value={item.Id.toString()}
                                            >
                                                {item.Title}
                                            </SelectItem>;
                                        })
                                    }
                                </SelectContent>
                            </Select>
                            <FormDescription>
                                Choose the site page to navigate to.
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />}
            </div>
        </form>
    </Form>;
}