import { COLOR_SCHEMES, COLOR_SCHEME_CLASSES, type TColorScheme } from "@/models/misc/color.model";
import { cn } from "../../../lib/utils";
import styles from "./color-scheme-selector.module.scss";
import { useTranslation } from "../../../../i18n/react";


interface ColorSchemeSelectorProps {
    value: TColorScheme;
    onChange: (value: TColorScheme) => void;
    className?: string;
}

export function ColorSchemeSelector({ value, onChange, className }: ColorSchemeSelectorProps) {
    const { t } = useTranslation();
    const colorSchemes = Object.values(COLOR_SCHEMES);

    return (
        <div className={cn(styles.colorSchemeSelector, className)}>
            {colorSchemes.map((colorScheme) => {
                const classes = COLOR_SCHEME_CLASSES[colorScheme];
                const isSelected = value === colorScheme;
                
                return (
                    <button
                        key={colorScheme}
                        type="button"
                        onClick={() => onChange(colorScheme)}
                        className={cn(
                            styles.colorSchemeSelectorItem,
                            classes.background,
                            classes.border,
                            isSelected && styles.colorSchemeSelectorItemSelected,
                        )}
                        aria-label={t("general.ui.colorSchemeSelector.ariaLabel", { colorScheme })}
                    >
                        {isSelected && (
                            <svg 
                                xmlns="http://www.w3.org/2000/svg" 
                                viewBox="0 0 24 24" 
                                fill="none" 
                                stroke="currentColor" 
                                strokeWidth="2" 
                                strokeLinecap="round" 
                                strokeLinejoin="round" 
                                className={cn("w-4 h-4", classes.text)}
                            >
                                <polyline points="20 6 9 17 4 12"></polyline>
                            </svg>
                        )}
                    </button>
                );
            })}
        </div>
    );
} 