import * as React from "react";
import * as SeparatorPrimitive from "@radix-ui/react-separator";
import { cn } from "../../../../lib/utils";
import styles from "./separator.module.scss";
import { z } from "zod";
import { getSpacing, spacings, type TSpacingKey } from "../../data/spacings";


const ConfigurableSeparatorPropsSchema = z.object({
    orientation: z.enum(['horizontal', 'vertical']),
    marginTop: z.enum(Array.from(spacings.entries()).map(([id]) => id) as [TSpacingKey, ...TSpacingKey[]]),
    marginBottom: z.enum(Array.from(spacings.entries()).map(([id]) => id) as [TSpacingKey, ...TSpacingKey[]]),
});

type TConfigurableSeparatorProps = z.infer<typeof ConfigurableSeparatorPropsSchema>;

type TStaticSeparatorProps = {};

type TSeparatorProps = TConfigurableSeparatorProps & TStaticSeparatorProps & React.HTMLAttributes<HTMLDivElement>;

function getDefaultProps(): TConfigurableSeparatorProps {
    return {
        orientation: 'horizontal',
        marginTop: 'md',
        marginBottom: 'md',
    };
}

const Separator = React.forwardRef<HTMLDivElement, TSeparatorProps>(
    ({ className, orientation = "horizontal", marginTop, marginBottom, ...props }, ref) => {

        return <SeparatorPrimitive.Root
            ref={ref}
            decorative={true}
            orientation={orientation}
            className={cn(
                styles.separator,
                orientation === "horizontal" ? styles.separatorHorizontal : styles.separatorVertical,
                marginTop && getSpacing(marginTop).value.marginTop,
                marginBottom && getSpacing(marginBottom).value.marginBottom,
                className
            )}
            {...props}
        />
    }
);

Separator.displayName = SeparatorPrimitive.Root.displayName;


export {
    Separator,
    getDefaultProps,
    ConfigurableSeparatorPropsSchema,
    type TConfigurableSeparatorProps,
    type TStaticSeparatorProps,
    type TSeparatorProps,
};
