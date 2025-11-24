import { useState } from 'react';
import styles from './synchronized-sliders.module.scss';
import React from 'react';
import {
    FormControl,
    FormField,
    FormItem,
} from '../../../../components/ui/form/form/form';
import { spacings } from '../../data/spacings';
import { Slider } from '../../../../components/ui/slider/slider';
import { type UseFormReturn } from 'react-hook-form';
import { Label } from '../../../../components/ui/form/label/label';
import { ChevronDown, ChevronRight } from 'lucide-react';


type TSynchronizedSlidersProps = {
    form: UseFormReturn<any>;
    icon: React.ReactNode;
    title: string;
    subSliders: [
        {
            icon: React.ReactNode;
            title: string;
            key: string;
        },
        {
            icon: React.ReactNode;
            title: string;
            key: string;
        }
    ];
}

const SynchronizedSliders = ({
    form,
    icon,
    title,
    subSliders,
}: TSynchronizedSlidersProps) => {

    const [prefersDistinction, setPrefersDistinction] = useState(
        !(form.getValues(subSliders[0].key) === form.getValues(subSliders[1].key))
    );

    // Récupérer les valeurs actuelles des champs
    const valueA = form.watch(subSliders[0].key);
    const valueB = form.watch(subSliders[1].key);

    // Déterminer la valeur du slider principal
    // Si les deux valeurs sont identiques, utiliser cette valeur
    // Sinon, utiliser la première valeur par défaut
    const mainSliderValue = valueA === valueB ? valueA : undefined;

    // Fonction pour synchroniser les deux valeurs
    const handleMainSliderChange = (newValue: string) => {
        const keyA = subSliders[0].key;
        const keyB = subSliders[1].key;

        form.setValue(keyA, newValue);
        form.setValue(keyB, newValue);
    };

    return <>
        <Label
            className={styles.sliderContainerSyncLabel}
            data-prefers-distinction={prefersDistinction}
            onClick={() => setPrefersDistinction(!prefersDistinction)}
        >
            {prefersDistinction ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
            {icon}
            {title}
        </Label>
        <div className={styles.sliderContainer}>
            <Slider
                values={Array.from(spacings.entries()).map(([id, { label }]) => ({
                    value: id,
                    label: label
                }))}
                value={mainSliderValue}
                onValueChange={handleMainSliderChange}
            />
        </div>

        {
            prefersDistinction && <>
                {
                    subSliders.map(subSlider => {

                        return <>

                            <Label className={styles.sliderDistinctionLabel}>
                                <ChevronRight size={14} />
                                {subSlider.icon}
                                {subSlider.title}
                            </Label>
                            <FormField
                                name={subSlider.key}
                                control={form.control}
                                render={({ field }) => (
                                    <FormItem className={styles.sliderContainer}>
                                        <FormControl>
                                            <Slider
                                                values={Array.from(spacings.entries()).map(([id, { label }]) => ({
                                                    value: id,
                                                    label: label
                                                }))}
                                                value={field.value as string}
                                                onValueChange={field.onChange}
                                            />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                        </>
                    })
                }
            </>
        }
    </>;
};


export {
    SynchronizedSliders,
};