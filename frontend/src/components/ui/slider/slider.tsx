import * as React from "react";
import * as SliderPrimitive from "@radix-ui/react-slider";
import { cn } from "../../../lib/utils";
import styles from "./slider.module.scss";


interface SliderOption {
    value: string;
    label: string;
}

interface SliderProps {
    className?: string;
    values: SliderOption[];
    value?: string;
    defaultValue?: string;
    onValueChange?: (value: string) => void;
    disabled?: boolean;
    orientation?: "horizontal" | "vertical";
}

const Slider = React.forwardRef<
    React.ElementRef<typeof SliderPrimitive.Root>,
    SliderProps
>(({
    className,
    values,
    value,
    defaultValue,
    onValueChange,
    disabled = false,
    orientation = "horizontal",
    ...props
}, ref) => {
    // Validation des props
    if (!values || values.length === 0) {
        console.warn("Slider: values array is required and cannot be empty");
        return null;
    }

    const maxIndex = values.length - 1;

    const thumbRef = React.useRef<HTMLDivElement>(null);
    
    // Trouver l'index de la valeur actuelle
    const getValueIndex = (val: string | undefined) => {
        if (val === undefined) return 0;
        const index = values.findIndex(option => option.value === val);
        return index >= 0 ? index : 0;
    };

    const currentIndex = getValueIndex(value);
    const defaultIndex = getValueIndex(defaultValue);
    // const currentOption = values[currentIndex];

    // Convertir en format attendu par Radix (tableau de nombres)
    const sliderValue = [currentIndex];
    const sliderDefaultValue = [defaultIndex];

    const handleValueChange = React.useCallback((newValues: number[]) => {
        if (onValueChange && newValues.length > 0) {
            const newIndex = newValues[0];
            const newValue = values[newIndex].value;
            onValueChange(newValue);
        }
    }, [onValueChange, values]);

    React.useEffect(() => {
        if (thumbRef.current) {
            thumbRef.current.dataset.label = values[currentIndex].label;
        }
    }, [value]);

    return (
        <SliderPrimitive.Root
            ref={ref}
            data-slot="slider"
            defaultValue={sliderDefaultValue}
            value={sliderValue}
            min={0}
            max={maxIndex}
            step={1}
            disabled={disabled}
            orientation={orientation}
            onValueChange={handleValueChange}
            className={cn(
                styles.slider,
                className
            )}
            {...props}
        >
            <SliderPrimitive.Track
                data-slot="slider-track"
                className={styles.sliderTrack}
            >
                <SliderPrimitive.Range
                    data-slot="slider-range"
                    className={styles.sliderRange}
                />
            </SliderPrimitive.Track>
            <SliderPrimitive.Thumb
                data-slot="slider-thumb"
                className={styles.sliderThumb}
                ref={thumbRef}
            />
        </SliderPrimitive.Root>
    );
});

Slider.displayName = "Slider";

export { Slider };
export type { SliderProps, SliderOption };
