export const inputCode = `// Helper cn
const cn = (...classes: any[]) => classes.filter(Boolean).join(' ');

import * as React from "react"


const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
    ({ className, type, ...props }, ref) => {
        return <input
            type={type}
            className={cn(
                "input",
                className
            )}
            ref={ref}
            {...props}
        />;
    }
)

Input.displayName = "Input";


export {
    Input,
};`;

