import * as React from "react";
import { cn } from '../../../../../lib/utils';
import { Button } from "../../../button/button";
import styles from "./toggle-button.module.scss";


export interface ToggleButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    pressed?: boolean;
    onPressedChange?: (pressed: boolean) => void;
}

const ToggleButton = React.forwardRef<HTMLButtonElement, ToggleButtonProps>(
    ({ className, pressed = false, onPressedChange, children, onClick, ...props }, ref) => {
        const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
            event.preventDefault();
            onPressedChange?.(!pressed);
            onClick?.(event);
        };

        return (
            <Button
                variant="outline"
                size="sm"
                rounded="full"
                ref={ref}
                type="button"
                role="checkbox"
                aria-checked={pressed}
                data-state={pressed ? "on" : "off"}
                className={cn(
                    styles.toggleButton,
                    pressed && styles.toggleButtonPressed,
                    className
                )}
                onClick={handleClick}
                {...props}
            >
                {children}
            </Button>
        );
    }
);

ToggleButton.displayName = "ToggleButton";

export { ToggleButton };

