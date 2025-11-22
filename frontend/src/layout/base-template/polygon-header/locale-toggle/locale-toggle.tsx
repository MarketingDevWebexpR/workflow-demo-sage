import { Languages } from "lucide-react"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuItemContent,
    DropdownMenuTrigger
} from "../../../../components/ui/dropdown-menu/dropdown-menu"
import { Button } from "../../../../components/ui/button/button"
import React from "react"
import { useTranslation } from "../../../../../../i18n/react"
import { cn } from "../../../../lib/utils"
import styles from "./locale-toggle.module.scss";


const LocaleToggle = React.forwardRef<HTMLButtonElement, React.ComponentPropsWithoutRef<typeof Button>>(({ className, ...props }, ref) => {

    const { setLocale, locale } = useTranslation();

    return <DropdownMenu>
        <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon" title="Choose language" className={cn(className)} {...props} ref={ref}>
                <Languages className={styles.triggerIcon} />
                <span className={styles.screenReaderOnly}>Choose language</span>
            </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
            <DropdownMenuItem
                className={cn(
                    locale === 'en' && styles.dropdownMenuItemActive
                )}
                onClick={() => setLocale('en')}>
                <DropdownMenuItemContent>
                    <span className={styles.dropdownMenuItemFlag}>🇬🇧</span>
                    <span>English</span>
                </DropdownMenuItemContent>
            </DropdownMenuItem>
            <DropdownMenuItem
                className={cn(
                    locale === 'fr' && styles.dropdownMenuItemActive
                )}
                onClick={() => setLocale('fr')}>
                <DropdownMenuItemContent>
                    <span className={styles.dropdownMenuItemFlag}>🇫🇷</span>
                    <span>Français</span>
                </DropdownMenuItemContent>
            </DropdownMenuItem>
        </DropdownMenuContent>
    </DropdownMenu>;
});


export {
    LocaleToggle,
};

