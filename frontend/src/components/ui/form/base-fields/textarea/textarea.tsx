import * as React from "react"
import { cn } from "../../../../../lib/utils"
import styles from "./textarea.module.scss"


const Textarea = React.forwardRef<
    HTMLTextAreaElement,
    React.ComponentProps<"textarea">
>(({ className, ...props }, ref) => {
    return (
        <textarea
            className={cn(
                styles.textarea,
                className
            )}
            ref={ref}
            {...props}
        />
    )
})
Textarea.displayName = "Textarea"


export { Textarea }