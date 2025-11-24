import React from 'react';
import styles from './fancy-title.module.scss';
import { cn } from '../../../../lib/utils';
import { z } from 'zod';
import { DEBOUNCE_PROP } from '../../../../hooks/use-props-form';


const ConfigurableFancyTitlePropsSchema = z.object({
    text: z.string().describe( DEBOUNCE_PROP ),
});

type TConfigurableFancyTitleProps = z.infer<typeof ConfigurableFancyTitlePropsSchema>;

type TStaticFancyTitleProps = {};

type TFancyTitleProps = TConfigurableFancyTitleProps & TStaticFancyTitleProps & React.HTMLAttributes<HTMLDivElement>;

function getDefaultProps(): TConfigurableFancyTitleProps {
    return {
        text: 'A fancy title',
    };
}

const FancyTitle = React.forwardRef<HTMLDivElement, TFancyTitleProps>(({
    className,
    text,
    ...props
}, ref) => {
    return <h2 className={cn(styles.fancyTitle, className)} ref={ref} {...props}>
        {text}
    </h2>;
});

FancyTitle.displayName = 'FancyTitle';


export {
    FancyTitle,
    getDefaultProps,
    ConfigurableFancyTitlePropsSchema,
    type TConfigurableFancyTitleProps,
    type TStaticFancyTitleProps,
    type TFancyTitleProps,
};