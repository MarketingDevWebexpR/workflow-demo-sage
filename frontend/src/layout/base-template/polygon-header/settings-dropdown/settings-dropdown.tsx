import React, { useRef } from "react";
import { Settings, Zap, FileEdit } from "lucide-react";
import { Button } from "../../../../components/ui/button/button";
import { useNavigate } from "react-router-dom";
import { cn } from "../../../../lib/utils";
import styles from "./settings-dropdown.module.scss";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger, DropdownMenuItemContent, DropdownMenuItemIcon, DropdownMenuItemChevron } from "../../../../components/ui/dropdown-menu/dropdown-menu";


const SettingsDropdown = React.forwardRef<HTMLButtonElement, React.ComponentPropsWithoutRef<typeof Button>>(({ className, ...props }, ref) => {
    const navigate = useNavigate();
    const triggerRef = useRef<HTMLButtonElement | null>(null);

    const handleAutomationClick = () => {
        // Ajouter l'attribut inert au trigger pour empêcher le focus
        if (triggerRef.current) {
            triggerRef.current.setAttribute('inert', '');
            // Retirer l'attribut après un délai pour ne pas casser les futures interactions
            setTimeout(() => {
                triggerRef.current?.removeAttribute('inert');
            }, 500);
        }
        navigate('/admin/automation');
    };

    return <DropdownMenu>
        <DropdownMenuTrigger asChild>
            <Button
                variant="outline"
                size="icon"
                title="Settings"
                className={cn(className)}
                {...props}
                ref={(node) => {
                    triggerRef.current = node;
                    if (typeof ref === 'function') {
                        ref(node);
                    } else if (ref && 'current' in ref) {
                        (ref as React.MutableRefObject<HTMLButtonElement | null>).current = node;
                    }
                }}
            >
                <Settings size={16} className={styles.settingsIcon} />
                <span className={styles.screenReaderOnly}>Settings</span>
            </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className={styles.settingsDropdown}>
            {/* Editor */}
            <DropdownMenuItem onClick={() => navigate('/admin/pages')}>
                <DropdownMenuItemContent>
                    <DropdownMenuItemIcon icon={FileEdit} />
                    <span>Editor</span>
                    <DropdownMenuItemChevron />
                </DropdownMenuItemContent>
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            {/* Automation */}
            <DropdownMenuItem onClick={handleAutomationClick}>
                <DropdownMenuItemContent>
                    <DropdownMenuItemIcon icon={Zap} />
                    <span>Automation</span>
                    <span className={styles.newBadge}>New</span>
                    <DropdownMenuItemChevron />
                </DropdownMenuItemContent>
            </DropdownMenuItem>
        </DropdownMenuContent>
    </DropdownMenu>;
});


export {
    SettingsDropdown,
};
