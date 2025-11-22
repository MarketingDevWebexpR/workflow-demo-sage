import { Moon, Sun, SunMoon } from "lucide-react"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuItemContent,
    DropdownMenuItemIcon,
    DropdownMenuTrigger
} from "../../../../components/ui/dropdown-menu/dropdown-menu"
import { Button } from "../../../../components/ui/button/button"
import React from "react"
import { usePrefersColorThemeStore } from "../../../../providers/prefers-color-theme/store"
import { cn } from "../../../../lib/utils"
import styles from "./color-theme-toggle.module.scss";


const ColorThemeToggle = React.forwardRef<HTMLButtonElement, React.ComponentPropsWithoutRef<typeof Button>>(({ className, ...props }, ref) => {

    const dispatch = usePrefersColorThemeStore((state) => state.dispatch);
    const theme = usePrefersColorThemeStore((state) => state.value);

    return <DropdownMenu>
        <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon" title="Toggle theme" className={cn(className)} {...props} ref={ref}>
                {theme === 'prefers-color-scheme-light' ? <Sun className={styles.triggerIcon} /> : null}
                {theme === 'prefers-color-scheme-dark' ? <Moon className={styles.triggerIcon} /> : null}
                {theme === 'prefers-color-scheme-system' ? <SunMoon className={styles.triggerIcon} /> : null}
                <span className={styles.screenReaderOnly}>Toggle theme</span>
            </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
            <DropdownMenuItem
                onClick={() => dispatch({
                    type: 'SET_COLOR_SCHEME',
                    payload: 'prefers-color-scheme-light',
                })}>
                <DropdownMenuItemContent>
                    <DropdownMenuItemIcon icon={Sun} />
                    <span>Light</span>
                </DropdownMenuItemContent>
            </DropdownMenuItem>
            <DropdownMenuItem
                onClick={() => dispatch({
                    type: 'SET_COLOR_SCHEME',
                    payload: 'prefers-color-scheme-dark',
                })}>
                <DropdownMenuItemContent>
                    <DropdownMenuItemIcon icon={Moon} />
                    <span>Dark</span>
                </DropdownMenuItemContent>
            </DropdownMenuItem>
            <DropdownMenuItem
                onClick={() => dispatch({
                    type: 'SET_COLOR_SCHEME',
                    payload: 'prefers-color-scheme-system',
                })}>
                <DropdownMenuItemContent>
                    <DropdownMenuItemIcon icon={SunMoon} />
                    <span>System</span>
                </DropdownMenuItemContent>
            </DropdownMenuItem>
        </DropdownMenuContent>
    </DropdownMenu>;
});


export {
    ColorThemeToggle,
};
