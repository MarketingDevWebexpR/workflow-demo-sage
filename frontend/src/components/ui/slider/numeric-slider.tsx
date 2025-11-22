import * as React from "react";
import * as SliderPrimitive from "@radix-ui/react-slider";
import { cn } from "../../../lib/utils";
import styles from "./slider.module.scss";


interface NumericSliderProps {
    className?: string;
    min?: number;
    max?: number;
    step?: number;
    value?: number;
    defaultValue?: number;
    onValueChange?: (value: number) => void;
    disabled?: boolean;
    orientation?: "horizontal" | "vertical";
    showValue?: boolean;
}

const NumericSlider = React.forwardRef<
    React.ElementRef<typeof SliderPrimitive.Root>,
    NumericSliderProps
>(({
    className,
    min = 0,
    max = 100,
    step = 1,
    value,
    defaultValue = 0,
    onValueChange,
    disabled = false,
    orientation = "horizontal",
    showValue = false,
    ...props
}, ref) => {
    const thumbRef = React.useRef<HTMLDivElement>(null);

    // Convertir en format attendu par Radix (tableau de nombres)
    const sliderValue = value !== undefined ? [value] : undefined;
    const sliderDefaultValue = [defaultValue];

    const handleValueChange = React.useCallback((newValues: number[]) => {
        if (onValueChange && newValues.length > 0) {
            const newValue = newValues[0];
            onValueChange(newValue);
        }
    }, [onValueChange]);

    React.useEffect(() => {
        if (thumbRef.current && showValue) {
            const displayValue = value !== undefined ? value : defaultValue;
            thumbRef.current.dataset.label = displayValue.toString();
        }
    }, [value, defaultValue, showValue]);

    return (
        <SliderPrimitive.Root
            ref={ref}
            data-slot="slider"
            defaultValue={sliderDefaultValue}
            value={sliderValue}
            min={min}
            max={max}
            step={step}
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

NumericSlider.displayName = "NumericSlider";

export { NumericSlider };
export type { NumericSliderProps };

