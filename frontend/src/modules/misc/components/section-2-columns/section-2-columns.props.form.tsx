import { Form, } from "../../../../components/ui/form/form/form";
import { usePropsForm } from "../../../../hooks/use-props-form";
import { ConfigurableSection2ColumnsPropsSchema } from "./section-2-columns";
import { extractSchemaKeys } from "../../../../utils/zod.utils";
import styles from '../../../../components/ui/form/form/form.module.scss';
import { MultipleSliders } from "./multiple-sliders";
import { ArrowDownFromLine, ArrowLeftFromLine, ArrowRightFromLine, ArrowUpFromLine, BetweenHorizonalEnd, BetweenVerticalEnd, PanelBottomClose, PanelLeftClose, PanelRightClose, PanelTopClose, SquareRoundCorner } from "lucide-react";
import { LayoutField } from "../../../../components/ui/form/controlled-fields/layout-field/layout-field";
import { ColorSelectorField } from "../../../../components/ui/form/controlled-fields/color-selector-field/color-selector-field";
import { AlignmentSelectorField } from "../../../../components/ui/form/controlled-fields/alignment-selector-field/alignment-selector-field";
import { radii } from "../../data/radii";


export const Section2ColumnsPropsForm = () => {

    const form = usePropsForm({
        schema: ConfigurableSection2ColumnsPropsSchema,
    });
    const keys = extractSchemaKeys(ConfigurableSection2ColumnsPropsSchema);

    return <Form {...form}>
        <form
            className={styles.propsForm}
            data-form-container
        >

            <div className={styles.propsFormContent} style={{
                "gap": "var(--spacing-12)"
            }}>

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
                        {
                            type: "synchronized-sliders",
                            synchronizedSliderTitle: "Gap",
                            synchronizedSliderIcon: <><BetweenHorizonalEnd size={14} /><BetweenVerticalEnd size={14} /></>,
                            sliders: [
                                {
                                    title: "Row gap",
                                    key: keys.rowGap,
                                    icon: <BetweenHorizonalEnd size={14} />,
                                },
                                {
                                    title: "Column gap",
                                    key: keys.columnGap,
                                    icon: <BetweenVerticalEnd size={14} />,
                                },
                            ]
                        },
                        {
                            type: 'single-slider',
                            title: 'Border radius',
                            icon: <SquareRoundCorner size={14} />,
                            name: keys.radius,
                            values: Array.from(radii.entries()).map(([id, { label }]) => ({
                                value: id,
                                label: label
                            })),
                        }
                    ]}
                    form={form}
                />

                {/* Layout */}
                <LayoutField
                    name={keys.layout}
                    control={form.control}
                    label="Layout"
                />
 
                {/* Alignment */}
                <AlignmentSelectorField
                    name={keys.alignment}
                    control={form.control}
                />

            </div>
        </form>
    </Form>;
}