export const buttonCode = `// Helper cn
const cn = (...classes: any[]) => classes.filter(Boolean).join(' ');

import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"



const buttonVariants = cva(
    "button",
    {
        variants: {
            variant: {
                default: "button-default",
                outline: "button-outline",
                destructive: "button-destructive",
                ghost: "button-ghost",
                link: "button-link",
                primaryOutline: "button-primaryOutline",
                secondary: "button-secondary",
            },
            size: {
                default: "button-defaultSize",
                sm: "button-sm",
                lg: "button-lg",
                icon: "button-icon",
                iconSm: "button-iconSm",
            },
            rounded: {
                regular: "button-roundedRegular",
                full: "button-roundedFull",
                none: "button-roundedNone",
                abstract: "button-roundedAbstract",
            },
        },
        defaultVariants: {
            variant: "default",
            size: "default",
            rounded: "regular",
        },
    }
)

export interface ButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
    asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant, size, rounded, asChild = false, ...props }, ref) => {
        const Comp = asChild ? Slot : "button"
        return (
            <Comp
                className={cn(buttonVariants({ variant, size, rounded, className }))}
                ref={ref}
                {...props}
            />
        )
    }
)
Button.displayName = "Button"

export { Button, buttonVariants }`;

