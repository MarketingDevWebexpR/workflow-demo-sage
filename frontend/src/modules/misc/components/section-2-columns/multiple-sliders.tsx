import { type UseFormReturn } from "react-hook-form";
import { SynchronizedSliders } from "./synchronized-sliders";
import React from "react";
import styles from "./multiple-sliders.module.scss";
import { SingleSlider } from "./single-slider";


type TMultipleSlidersProps = {
    form: UseFormReturn<any>;
    sliders: (
        | {
            type: "single-slider";
            title: string;
            icon: React.ReactNode;
            name: string;
            values: {
                value: string;
                label: string;
            }[];
        }
        | {
            type: "synchronized-sliders";
            synchronizedSliderTitle: string;
            synchronizedSliderIcon: React.ReactNode;
            sliders: {
                title: string;
                key: string;
                icon: React.ReactNode;
            }[];
        }
    )[];
}

const MultipleSliders = ({
    form,
    sliders,
}: TMultipleSlidersProps) => {

    return <div className={styles.multipleSynchronizedSliders}>
        {
            sliders.map((slider, index) => {

                if (slider.type === "synchronized-sliders") {
                    return <SynchronizedSliders
                        key={`synchronized-slider-${index}`}
                        form={form}
                        icon={slider.synchronizedSliderIcon}
                        title={slider.synchronizedSliderTitle}
                        subSliders={[
                            {
                                icon: slider.sliders[0].icon,
                                title: slider.sliders[0].title,
                                key: slider.sliders[0].key,
                            },
                            {
                                icon: slider.sliders[1].icon,
                                title: slider.sliders[1].title,
                                key: slider.sliders[1].key,
                            }
                        ]}
                    />
                }

                else if (slider.type === "single-slider") {
                    return <SingleSlider
                        key={`single-slider-${index}`}
                        form={form}
                        icon={slider.icon}
                        title={slider.title}
                        name={slider.name}
                        values={slider.values}
                    />;
                }

                return null;
            })
        }
    </div>;
};


export {
    MultipleSliders,
};