import React from "react";
import { Moon, Sun, SunMoon, Home, FolderOpen, Download, HelpCircle, Keyboard, Upload, Share2, Sparkles, FileJson, Code, Library } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuItemContent,
    DropdownMenuItemIcon,
    DropdownMenuItemChevron,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
    DropdownMenuLabel,
    DropdownMenuShortcut,
} from "../../../../components/ui/dropdown-menu/dropdown-menu";
import { Button } from "../../../../components/ui/button/button";
import { usePrefersColorThemeStore } from "../../../../providers/prefers-color-theme/store";
import { useNavigate } from "react-router-dom";
import { cn } from "../../../../lib/utils";
import styles from "./header-menu-dropdown.module.scss";


type THeaderMenuDropdownProps = {
    className?: string;
}

const HeaderMenuDropdown = ({ className }: THeaderMenuDropdownProps): React.ReactElement => {
    const dispatch = usePrefersColorThemeStore((state) => state.dispatch);
    const theme = usePrefersColorThemeStore((state) => state.value);
    const navigate = useNavigate();

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button 
                    variant="outline" 
                    size="icon"
                    className={cn(styles.headerMenuDropdownTrigger, className)}
                >
                    <svg
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <line x1="3" y1="12" x2="21" y2="12"></line>
                        <line x1="3" y1="6" x2="21" y2="6"></line>
                        <line x1="3" y1="18" x2="21" y2="18"></line>
                    </svg>
                    <span className={styles.screenReaderOnly}>Menu</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent 
                align="start" 
                className={styles.headerMenuDropdownContent}
                sideOffset={8}
            >
                {/* Navigation principale */}
                <DropdownMenuItem
                    onClick={() => navigate('/')}
                    className={styles.headerMenuDropdownItem}
                >
                    <DropdownMenuItemContent>
                        <DropdownMenuItemIcon icon={Home} />
                        <span>Accueil</span>
                    </DropdownMenuItemContent>
                </DropdownMenuItem>

                <DropdownMenuSeparator className={styles.headerMenuDropdownSeparator} />

                {/* Actions fichiers */}
                <DropdownMenuItem
                    onClick={() => {}}
                    className={styles.headerMenuDropdownItem}
                >
                    <DropdownMenuItemContent>
                        <DropdownMenuItemIcon icon={FolderOpen} />
                        <span>Ouvrir</span>
                        <DropdownMenuShortcut>Cmd+O</DropdownMenuShortcut>
                    </DropdownMenuItemContent>
                </DropdownMenuItem>

                <DropdownMenuItem
                    onClick={() => {}}
                    className={styles.headerMenuDropdownItem}
                >
                    <DropdownMenuItemContent>
                        <DropdownMenuItemIcon icon={Download} />
                        <span>Enregistrer sous...</span>
                        <DropdownMenuItemChevron />
                    </DropdownMenuItemContent>
                </DropdownMenuItem>

                <DropdownMenuItem
                    onClick={() => {}}
                    className={styles.headerMenuDropdownItem}
                >
                    <DropdownMenuItemContent>
                        <DropdownMenuItemIcon icon={Upload} />
                        <span>Importer...</span>
                    </DropdownMenuItemContent>
                </DropdownMenuItem>

                <DropdownMenuItem
                    onClick={() => {}}
                    className={styles.headerMenuDropdownItem}
                >
                    <DropdownMenuItemContent>
                        <DropdownMenuItemIcon icon={Code} />
                        <span>Export web (HTML/CSS)</span>
                    </DropdownMenuItemContent>
                </DropdownMenuItem>

                <DropdownMenuItem
                    onClick={() => {}}
                    className={styles.headerMenuDropdownItem}
                >
                    <DropdownMenuItemContent>
                        <DropdownMenuItemIcon icon={FileJson} />
                        <span>Exporter en JSON</span>
                    </DropdownMenuItemContent>
                </DropdownMenuItem>

                <DropdownMenuSeparator className={styles.headerMenuDropdownSeparator} />

                {/* Partage */}
                <DropdownMenuItem
                    onClick={() => {}}
                    className={styles.headerMenuDropdownItem}
                >
                    <DropdownMenuItemContent>
                        <DropdownMenuItemIcon icon={Share2} />
                        <span>Partager...</span>
                        <DropdownMenuItemChevron />
                    </DropdownMenuItemContent>
                </DropdownMenuItem>

                <DropdownMenuSeparator className={styles.headerMenuDropdownSeparator} />

                {/* IA & Configuration */}
                <DropdownMenuLabel className={styles.headerMenuDropdownLabel}>
                    Intelligence artificielle
                </DropdownMenuLabel>

                <DropdownMenuItem
                    onClick={() => {}}
                    className={styles.headerMenuDropdownItem}
                >
                    <DropdownMenuItemContent>
                        <DropdownMenuItemIcon icon={Sparkles} />
                        <span>Définir un prompt système...</span>
                        <DropdownMenuItemChevron />
                    </DropdownMenuItemContent>
                </DropdownMenuItem>

                <DropdownMenuItem
                    onClick={() => {}}
                    className={styles.headerMenuDropdownItem}
                >
                    <DropdownMenuItemContent>
                        <DropdownMenuItemIcon icon={Library} />
                        <span>Bibliothèque de prompts</span>
                        <DropdownMenuItemChevron />
                    </DropdownMenuItemContent>
                </DropdownMenuItem>

                <DropdownMenuSeparator className={styles.headerMenuDropdownSeparator} />

                <DropdownMenuItem
                    onClick={() => {}}
                    className={styles.headerMenuDropdownItem}
                >
                    <DropdownMenuItemContent>
                        <DropdownMenuItemIcon icon={Keyboard} />
                        <span>Raccourcis clavier</span>
                        <DropdownMenuShortcut>?</DropdownMenuShortcut>
                    </DropdownMenuItemContent>
                </DropdownMenuItem>

                <DropdownMenuItem
                    onClick={() => {}}
                    className={styles.headerMenuDropdownItem}
                >
                    <DropdownMenuItemContent>
                        <DropdownMenuItemIcon icon={HelpCircle} />
                        <span>Aide</span>
                    </DropdownMenuItemContent>
                </DropdownMenuItem>

                <DropdownMenuSeparator className={styles.headerMenuDropdownSeparator} />

                {/* Thème */}
                <DropdownMenuLabel className={styles.headerMenuDropdownLabel}>
                    Apparence
                </DropdownMenuLabel>

                <DropdownMenuItem
                    onClick={() => dispatch({
                        type: 'SET_COLOR_SCHEME',
                        payload: 'prefers-color-scheme-light',
                    })}
                    className={cn(
                        styles.headerMenuDropdownItem,
                        theme === 'prefers-color-scheme-light' && styles.headerMenuDropdownItemActive
                    )}
                >
                    <DropdownMenuItemContent>
                        <DropdownMenuItemIcon icon={Sun} />
                        <span>Clair</span>
                        {theme === 'prefers-color-scheme-light' && (
                            <div className={styles.headerMenuDropdownItemCheck}>✓</div>
                        )}
                    </DropdownMenuItemContent>
                </DropdownMenuItem>

                <DropdownMenuItem
                    onClick={() => dispatch({
                        type: 'SET_COLOR_SCHEME',
                        payload: 'prefers-color-scheme-dark',
                    })}
                    className={cn(
                        styles.headerMenuDropdownItem,
                        theme === 'prefers-color-scheme-dark' && styles.headerMenuDropdownItemActive
                    )}
                >
                    <DropdownMenuItemContent>
                        <DropdownMenuItemIcon icon={Moon} />
                        <span>Sombre</span>
                        {theme === 'prefers-color-scheme-dark' && (
                            <div className={styles.headerMenuDropdownItemCheck}>✓</div>
                        )}
                    </DropdownMenuItemContent>
                </DropdownMenuItem>

                <DropdownMenuItem
                    onClick={() => dispatch({
                        type: 'SET_COLOR_SCHEME',
                        payload: 'prefers-color-scheme-system',
                    })}
                    className={cn(
                        styles.headerMenuDropdownItem,
                        theme === 'prefers-color-scheme-system' && styles.headerMenuDropdownItemActive
                    )}
                >
                    <DropdownMenuItemContent>
                        <DropdownMenuItemIcon icon={SunMoon} />
                        <span>Système</span>
                        {theme === 'prefers-color-scheme-system' && (
                            <div className={styles.headerMenuDropdownItemCheck}>✓</div>
                        )}
                    </DropdownMenuItemContent>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};


export {
    HeaderMenuDropdown,
};

