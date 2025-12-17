export const switchCode = `// Helper cn
const cn = (...classes: any[]) => classes.filter(Boolean).join(' ');

import * as React from "react"
import * as SwitchPrimitives from "@radix-ui/react-switch"


const Switch = React.forwardRef<
    React.ElementRef<typeof SwitchPrimitives.Root>,
    React.ComponentPropsWithoutRef<typeof SwitchPrimitives.Root>
>(({ className, ...props }, ref) => (
    <SwitchPrimitives.Root
        className={cn(
            "switch",
            className
        )}
        {...props}
        ref={ref}
    >
        <SwitchPrimitives.Thumb
            className={cn(
                "switchThumb"
            )}
        />
    </SwitchPrimitives.Root>
))

Switch.displayName = SwitchPrimitives.Root.displayName;


export { 
    Switch,
};`;

