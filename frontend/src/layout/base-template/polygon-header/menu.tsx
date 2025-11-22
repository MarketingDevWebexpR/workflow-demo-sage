import { useState } from "react";
import { Button } from "../../../components/ui/button/button";
import { useLocation, useNavigate } from "react-router-dom";
import { ColorThemeToggle } from "./color-theme-toggle/color-theme-toggle";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "../../../components/ui/sheet/sheet";
import { ChevronRight, MenuIcon } from "lucide-react";
import { cn } from "../../../lib/utils";
import styles from "./menu.module.scss";
import { SettingsDropdown } from "./settings-dropdown/settings-dropdown";


type TMenuProps = {
    isMobile?: boolean;
}

const Menu = ({
    isMobile = false,
}: TMenuProps) => {

    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);
    const location = useLocation();

    // Navigation items - hardcodé pour l'instant
    const navigationItems = [
        { id: 1, title: 'Home', path: '/' },
        { id: 2, title: 'Automation', path: '/admin/automation' },
    ];

    // Fonction pour vérifier si un élément de navigation est actif
    const isNavigationItemActive = (path: string) => {
        return location.pathname === path;
    };

    return <>
        <div
            className={cn(
                styles.menuDesktop,
                isMobile && styles.masked,
            )}
            data-menu="desktop"
        >

            {/* Navigation */}
            {navigationItems?.map((item) => (
                <Button
                    key={`header-nav-${item.id}`}
                    variant="link"
                    onClick={() => navigate(item.path)}
                    className={cn(
                        styles.menuItem,
                        isNavigationItemActive(item.path) && styles.menuItemActive,
                    )}
                >
                    {item.title}
                    <span className={styles.menuItemFancyBar} />
                </Button>
            ))}

            <ColorThemeToggle className={styles.colorThemeToggle} />

            <SettingsDropdown className={styles.settingsDropdown} />
        </div>
        <div
            data-menu="mobile"
            className={cn(
                styles.menuMobile,
                !isMobile && styles.masked,
            )}
        >
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
                <SheetTrigger
                    className={cn(
                        !isMobile && styles.mobileSheetTriggerHiddenOnDesktop,
                        isMobile && styles.mobileSheetTriggerVisibleOnMobile,
                    )}
                >
                    <MenuIcon
                        size={24}
                        className={styles.mobileSheetTriggerIcon}
                    />
                </SheetTrigger>
                <SheetContent
                    className={styles.mobileSheetContent}
                >
                    <SheetHeader>
                        <SheetTitle>Menu</SheetTitle>
                    </SheetHeader>

                    <div className={styles.mobileSheetContentBody}>
                        <div className={styles.mobileSheetContentBodyList}>
                            {/* Home button */}
                            <Button
                                onClick={() => {
                                    navigate('/');
                                    setIsOpen(false);
                                }}
                                variant="link"
                                className={styles.mobileSheetMenuItem}
                            >
                                <span>Home</span>
                                <ChevronRight size={16} />
                            </Button>

                            {/* Navigation items */}
                            {navigationItems?.map((item) => (
                                <Button
                                    key={`mobile-header-nav-${item.id}`}
                                    onClick={() => {
                                        navigate(item.path);
                                        setIsOpen(false);
                                    }}
                                    variant="link"
                                    className={styles.mobileSheetMenuItem}
                                >
                                    <span>{item.title}</span>
                                    <ChevronRight size={16} />
                                </Button>
                            ))}
                        </div>
                        <div className={styles.mobileSheetContentBodyFooter}>
                            <ColorThemeToggle />
                        </div>
                    </div>
                </SheetContent>
            </Sheet>
        </div>
    </>
};


export {
    Menu,
};
