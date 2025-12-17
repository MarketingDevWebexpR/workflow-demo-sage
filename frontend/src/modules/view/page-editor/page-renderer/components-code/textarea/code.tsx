export const textareaCode = `// Helper cn
const cn = (...classes: any[]) => classes.filter(Boolean).join(' ');

import * as React from "react"


const Textarea = React.forwardRef<
    HTMLTextAreaElement,
    React.ComponentProps<"textarea">
>(({ className, ...props }, ref) => {
    return (
        <textarea
            className={cn(
                "textarea",
                className
            )}
            ref={ref}
            {...props}
        />
    )
})
Textarea.displayName = "Textarea"


export { Textarea }`;

