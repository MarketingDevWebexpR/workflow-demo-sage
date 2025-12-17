export const separatorCode = `// Helper cn
const cn = (...classes: any[]) => classes.filter(Boolean).join(' ');

import * as React from "react";
import * as SeparatorPrimitive from "@radix-ui/react-separator";

type SeparatorProps = {
    orientation?: "horizontal" | "vertical";
    className?: string;
} & React.ComponentPropsWithoutRef<typeof SeparatorPrimitive.Root>;

const Separator = React.forwardRef<HTMLDivElement, SeparatorProps>(
    ({ className, orientation = "horizontal", ...props }, ref) => {
        return <SeparatorPrimitive.Root
            ref={ref}
            decorative={true}
            orientation={orientation}
            className={cn(
                "separator",
                orientation === "horizontal" ? "separatorHorizontal" : "separatorVertical",
                className
            )}
            {...props}
        />
    }
);

Separator.displayName = SeparatorPrimitive.Root.displayName;


export {
    Separator,
};`;

