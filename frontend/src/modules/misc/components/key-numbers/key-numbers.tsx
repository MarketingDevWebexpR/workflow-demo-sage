import React from "react";
import { cn } from "../../../../lib/utils";
import { z } from "zod";
import { DEBOUNCE_PROP } from "../../../../hooks/use-props-form";
import styles from './key-numbers.module.scss';


const ConfigurableKeyNumbersPropsSchema = z.object({
    keyNumbers: z.array( z.object({
        id: z.string().min(1),
        value: z.string().min(1).describe( DEBOUNCE_PROP ),
        title: z.string().min(1).describe( DEBOUNCE_PROP ),
        description: z.string().min(1).describe( DEBOUNCE_PROP ),
    })),
});

type TConfigurableKeyNumbersProps = z.infer<typeof ConfigurableKeyNumbersPropsSchema>;

type TStaticKeyNumbersProps = {};

type TKeyNumbersProps = TConfigurableKeyNumbersProps & TStaticKeyNumbersProps & React.HTMLAttributes<HTMLDivElement>;

function getDefaultProps(): TConfigurableKeyNumbersProps {
    return {
        keyNumbers: [],
    };
}

const KeyNumbers = React.forwardRef<HTMLDivElement, TKeyNumbersProps>(
    ({ className, ...props }, ref) => {

        const keyNumbers = props.keyNumbers || [];

        return <div
            className={cn(styles.keyNumbers, className)}
            ref={ref}
            {...props}
        >
        {
            keyNumbers.map((keyNumber) => {

                return <div 
                    key={keyNumber.id}
                    className={styles.keyNumber}
                >
                    <h2 className={styles.keyNumberValue}>{keyNumber.value}</h2>
                    <h3 className={styles.keyNumberTitle}>{keyNumber.title}</h3>
                    <p className={styles.keyNumberDescription}>{keyNumber.description}</p>
                </div>;
            })
        }
        </div>;
    }
);

KeyNumbers.displayName = 'KeyNumbers';


export {
    KeyNumbers,
    getDefaultProps,
    ConfigurableKeyNumbersPropsSchema,
    type TConfigurableKeyNumbersProps,
    type TStaticKeyNumbersProps,
    type TKeyNumbersProps,
};