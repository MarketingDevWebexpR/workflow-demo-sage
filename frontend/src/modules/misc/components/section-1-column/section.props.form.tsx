import { Form,  } from "../../../../components/ui/form/form/form";
import { ConfigurableSectionPropsSchema } from "./section-1-column";
import { usePropsForm } from "../../../../hooks/use-props-form";
import { extractSchemaKeys } from "../../../../utils/zod.utils";
import styles from '../../../../components/ui/form/form/form.module.scss';
import { ArrowRightFromLine, ArrowLeftFromLine, PanelBottomClose, PanelLeftClose, PanelRightClose, PanelTopClose, ArrowUpFromLine, ArrowDownFromLine,  } from "lucide-react";
import { ColorSelectorField } from "../../../../components/ui/form/controlled-fields/color-selector-field/color-selector-field";
import { MultipleSliders } from "../section-2-columns/multiple-sliders";


export const SectionPropsForm = () => {

    const form = usePropsForm({
        schema: ConfigurableSectionPropsSchema,
    });
    const keys = extractSchemaKeys(ConfigurableSectionPropsSchema);

    return <Form {...form}>
        <form
            className={styles.propsForm}
        >

            <div className={styles.propsFormContent}>

                {/* Background */}
                <ColorSelectorField
                    name={keys.background}
                    control={form.control}
                    label="Background"
                />

                {/* Spacings */}
                <MultipleSliders
                    sliders={[
                        {
                            type: "synchronized-sliders",
                            synchronizedSliderTitle: "Padding X",
                            synchronizedSliderIcon: <><PanelLeftClose size={14} /> <PanelRightClose size={14} /></>,
                            sliders: [
                                {
                                    title: "Padding left",
                                    key: keys.paddingLeft,
                                    icon: <PanelLeftClose size={14} />,
                                },
                                {
                                    title: "Padding right",
                                    key: keys.paddingRight,
                                    icon: <PanelRightClose size={14} />,
                                },
                            ]
                        },
                        {
                            type: "synchronized-sliders",
                            synchronizedSliderTitle: "Padding Y",
                            synchronizedSliderIcon: <><PanelTopClose size={14} /> <PanelBottomClose size={14} /></>,
                            sliders: [
                                {
                                    title: "Padding top",
                                    key: keys.paddingTop,
                                    icon: <PanelTopClose size={14} />,
                                },
                                {
                                    title: "Padding bottom",
                                    key: keys.paddingBottom,
                                    icon: <PanelBottomClose size={14} />,
                                },
                            ]
                        },
                        {
                            type: "synchronized-sliders",
                            synchronizedSliderTitle: "Margin X",
                            synchronizedSliderIcon: <><ArrowLeftFromLine size={14} /> <ArrowRightFromLine size={14} /></>,
                            sliders: [
                                {
                                    title: "Margin left",
                                    key: keys.marginLeft,
                                    icon: <ArrowLeftFromLine size={14} />,
                                },
                                {
                                    title: "Margin right",
                                    key: keys.marginRight,
                                    icon: <ArrowRightFromLine size={14} />,
                                },
                            ]
                        },
                        {
                            type: "synchronized-sliders",
                            synchronizedSliderTitle: "Margin Y",
                            synchronizedSliderIcon: <><ArrowUpFromLine size={14} /> <ArrowDownFromLine size={14} /></>,
                            sliders: [
                                {
                                    title: "Margin top",
                                    key: keys.marginTop,
                                    icon: <ArrowUpFromLine size={14} />,
                                },
                                {
                                    title: "Margin bottom",
                                    key: keys.marginBottom,
                                    icon: <ArrowDownFromLine size={14} />,
                                },
                            ]
                        },
                    ]}
                    form={form}
                />
            </div>
        </form>
    </Form>;
}