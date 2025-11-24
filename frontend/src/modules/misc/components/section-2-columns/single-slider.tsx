import styles from './synchronized-sliders.module.scss';
import React from 'react';
import { Slider } from '../../../../components/ui/slider/slider';
import { type UseFormReturn } from 'react-hook-form';
import { Label } from '../../../../components/ui/form/label/label';


type TSingleSliderProps = {
    form: UseFormReturn<any>;
    icon: React.ReactNode;
    title: string;
    name: string;
    values: {
        value: string;
        label: string;
    }[];
}

const SingleSlider = ({
    form,
    icon,
    title,
    name,
    values,
}: TSingleSliderProps) => {

    return <>
        <Label>
            {icon}
            {title}
        </Label>
        <div className={styles.sliderContainer}>
            <Slider
                values={values}
                value={form.watch(name)}
                onValueChange={(value) => {
                    console.log({ name, value });
                    form.setValue(name, value);
                }}
            />
        </div>
    </>;
};


export {
    SingleSlider,
};