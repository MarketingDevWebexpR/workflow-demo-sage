import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "../../../lib/utils";
import styles from "./button.module.scss";


const buttonVariants = cva(
    styles.button,
    {
        variants: {
            variant: {
                default: styles.default,
                outline: styles.outline,
                primaryOutline: styles.primaryOutline,
                destructive: styles.destructive,
                secondary: styles.secondary,
                ghost: styles.ghost,
                link: styles.link,
            },
            size: {
                default: styles.defaultSize,
                sm: styles.sm,
                lg: styles.lg,
                icon: styles.icon,
                iconSm: styles.iconSm,
            },
            rounded: {
                regular: styles.roundedRegular,
                full: styles.roundedFull,
                none: styles.roundedNone,
                abstract: styles.roundedAbstract,
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

export { Button, buttonVariants }
