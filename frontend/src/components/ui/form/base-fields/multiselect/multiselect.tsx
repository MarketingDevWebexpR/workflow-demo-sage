import * as React from "react";
import { CheckIcon, ChevronsUpDownIcon, XIcon, InboxIcon } from "lucide-react";
import { cn } from "../../../../../lib/utils";
import styles from "./multiselect.module.scss";
import { Button } from "../../../button/button";
import { Popover, PopoverTrigger, PopoverContent } from "../../../popover/popover";
import { Command, CommandInput, CommandList, CommandGroup, CommandItem, CommandSeparator, CommandEmpty } from "../../../command/command";
import { Badge } from "../../../badge/badge";
import { Empty } from "../../../empty/empty";


type MultiSelectContextType = {
    open: boolean;
    setOpen: (open: boolean) => void;
    selectedValues: Set<string>;
    toggleValue: (value: string) => void;
    items: Map<string, React.ReactNode>;
    onItemAdded: (value: string, label: React.ReactNode) => void;
    // Virtual focus for keyboard navigation
    focusedValue: string | null;
    setFocusedValue: (value: string | null) => void;
    visibleValues: string[];
    registerValue: (value: string) => void;
    unregisterValue: (value: string) => void;
    // Screen reader announcements
    announce: (message: string) => void;
};
const MultiSelectContext = React.createContext<MultiSelectContextType | null>(null);

type MultiSelectSearchContextType = {
    searchValue: string;
    applyHighlight: (node: React.ReactNode) => React.ReactNode;
};
const MultiSelectSearchContext = React.createContext<MultiSelectSearchContextType | null>(null);

export function MultiSelect({
    children,
    values,
    defaultValues,
    onValuesChange,
}: {
    children: React.ReactNode;
    values?: string[];
    defaultValues?: string[];
    onValuesChange?: (values: string[]) => void;
}) {
    const [open, setOpen] = React.useState(false);
    const [internalValues, setInternalValues] = React.useState(
        new Set<string>(values ?? defaultValues)
    );
    const selectedValues = values ? new Set(values) : internalValues;
    const [items, setItems] = React.useState<Map<string, React.ReactNode>>(new Map());

    // Virtual focus for keyboard navigation
    const [focusedValue, setFocusedValue] = React.useState<string | null>(null);
    const [visibleValues, setVisibleValues] = React.useState<string[]>([]);

    // Screen reader announcements
    const [announcement, setAnnouncement] = React.useState("");

    function toggleValue(value: string) {
        const getNewSet = (prev: Set<string>) => {
            const newSet = new Set(prev);
            const wasSelected = newSet.has(value);
            if (wasSelected) {
                newSet.delete(value);
            } else {
                newSet.add(value);
            }
            return newSet;
        };
        const newSet = getNewSet(selectedValues);
        setInternalValues(getNewSet);
        onValuesChange?.([...newSet]);

        // Announce the change
        const label = items.get(value);
        const action = selectedValues.has(value) ? "désélectionné" : "sélectionné";
        announce(`${label} ${action}. ${newSet.size} sur ${items.size} sélectionné${newSet.size > 1 ? 's' : ''}.`);
    }

    function announce(message: string) {
        setAnnouncement(message);
        setTimeout(() => setAnnouncement(""), 1000);
    }

    const onItemAdded = React.useCallback((value: string, label: React.ReactNode) => {
        setItems(prev => {
            if (prev.get(value) === label) return prev;
            return new Map(prev).set(value, label);
        });
    }, []);

    // Register/unregister values for navigation
    const registerValue = React.useCallback((value: string) => {
        setVisibleValues(prev => {
            if (prev.includes(value)) return prev;
            return [...prev, value];
        });
    }, []);

    const unregisterValue = React.useCallback((value: string) => {
        setVisibleValues(prev => prev.filter(v => v !== value));
    }, []);

    // Reset virtual focus and visible values when popover closes OR opens
    React.useEffect(() => {
        if (!open) {
            setFocusedValue(null);
            setVisibleValues([]);
        } else {
            // Force reset when opening to avoid stale state from previous multiselect
            setFocusedValue(null);
            setVisibleValues([]);
        }
    }, [open]);

    return (
        <MultiSelectContext.Provider
            value={{
                open,
                setOpen,
                selectedValues,
                toggleValue,
                items,
                onItemAdded,
                focusedValue,
                setFocusedValue,
                visibleValues,
                registerValue,
                unregisterValue,
                announce,
            }}
        >
            {/* Screen reader live region */}
            <div
                role="status"
                aria-live="polite"
                aria-atomic="true"
                className={styles.srOnly}
            >
                {announcement}
            </div>
            <Popover open={open} onOpenChange={setOpen} modal={true}>
                {children}
            </Popover>
        </MultiSelectContext.Provider>
    );
}

export function MultiSelectTrigger({
    className,
    children,
    ...props
}: {
    className?: string;
    children?: React.ReactNode;
} & React.ComponentPropsWithoutRef<typeof Button>) {
    const { open } = useMultiSelectContext();

    return (
        <PopoverTrigger asChild>
            <Button
                {...props}
                variant={props.variant ?? "outline"}
                role={props.role ?? "combobox"}
                aria-expanded={props["aria-expanded"] ?? open}
                className={cn(
                    styles.multiSelectTrigger,
                    className
                )}
            >
                {children}
                <ChevronsUpDownIcon className={styles.multiSelectTriggerIcon} />
            </Button>
        </PopoverTrigger>
    );
}

export function MultiSelectValue({
    placeholder,
    clickToRemove = true,
    className,
    overflowBehavior = "wrap-when-open",
    ...props
}: {
    placeholder?: string;
    clickToRemove?: boolean;
    overflowBehavior?: "wrap" | "wrap-when-open" | "cutoff";
} & Omit<React.ComponentPropsWithoutRef<"div">, "children">) {
    const { selectedValues, toggleValue, items, open } = useMultiSelectContext();
    const [overflowAmount, setOverflowAmount] = React.useState(0);
    const valueRef = React.useRef<HTMLDivElement>(null);
    const overflowRef = React.useRef<HTMLDivElement>(null);

    const shouldWrap =
        overflowBehavior === "wrap" ||
        (overflowBehavior === "wrap-when-open" && open);

    const checkOverflow = React.useCallback(() => {
        if (valueRef.current === null) return;

        const containerElement = valueRef.current;
        const overflowElement = overflowRef.current;
        const items = containerElement.querySelectorAll<HTMLElement>(
            "[data-selected-item]"
        );

        if (overflowElement !== null) overflowElement.style.display = "none";
        items.forEach(child => child.style.removeProperty("display"));
        let amount = 0;
        for (let i = items.length - 1; i >= 0; i--) {
            const child = items[i]!;
            if (containerElement.scrollWidth <= containerElement.clientWidth) {
                break;
            }
            amount = items.length - i;
            child.style.display = "none";
            overflowElement?.style.removeProperty("display");
        }
        setOverflowAmount(amount);
    }, []);

    React.useEffect(() => {
        if (valueRef.current == null) return;

        const observer = new ResizeObserver(checkOverflow);
        observer.observe(valueRef.current);
        return () => observer.disconnect();
    }, [checkOverflow]);

    React.useLayoutEffect(() => {
        checkOverflow();
    }, [selectedValues, checkOverflow, open]);

    if (selectedValues.size === 0 && placeholder) {
        return (
            <span className={styles.multiSelectPlaceholder}>
                {placeholder}
            </span>
        );
    }

    return (
        <div
            {...props}
            ref={valueRef}
            className={cn(
                styles.multiSelectValueContainer,
                shouldWrap && styles.multiSelectValueContainerWrap,
                className
            )}
        >
            {[...selectedValues]
                .filter(value => items.has(value))
                .map(value => (
                    <div
                        key={value}
                        data-selected-item
                        className={styles.multiSelectValueItem}
                        onClick={
                            clickToRemove
                                ? e => {
                                    e.stopPropagation();
                                    toggleValue(value);
                                }
                                : undefined
                        }
                    >
                        <Badge
                            text={items.get(value)}
                            className={styles.multiSelectBadge}
                        />
                        {clickToRemove && (
                            <XIcon className={styles.multiSelectRemoveIcon} />
                        )}
                    </div>
                ))}
            <Badge
                text={`+${overflowAmount}`}
                ref={overflowRef}
                style={{
                    display: overflowAmount > 0 && !shouldWrap ? "block" : "none",
                }}
            />
        </div>
    );
}

export function MultiSelectContent({
    search = true,
    children,
    showCloseButton = true,
    closeButtonText = "OK",
    emptyState,
    ...props
}: {
    search?: boolean | { placeholder?: string; emptyMessage?: string };
    children: React.ReactNode;
    showCloseButton?: boolean;
    closeButtonText?: string;
    emptyState?: {
        title: string;
        description: string;
    };
} & Omit<React.ComponentPropsWithoutRef<typeof Command>, "children">) {
    const {
        setOpen,
        toggleValue,
        focusedValue,
        setFocusedValue,
        visibleValues,
        announce
    } = useMultiSelectContext();
    const canSearch = typeof search === "object" ? true : search;
    const [searchValue, setSearchValue] = React.useState("");
    const inputRef = React.useRef<HTMLInputElement>(null);

    // Check if there are any items
    const hasItems = React.useMemo(() => {
        const childrenArray = React.Children.toArray(children);
        return childrenArray.length > 0;
    }, [children]);

    // Keyboard navigation handler
    const handleKeyDown = React.useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
        switch (e.key) {
            case 'ArrowDown':
                e.preventDefault();
                if (visibleValues.length === 0) return;

                if (!focusedValue) {
                    // From input → first item
                    setFocusedValue(visibleValues[0]!);
                    announce(`Navigation dans la liste. ${visibleValues.length} option${visibleValues.length > 1 ? 's' : ''} disponible${visibleValues.length > 1 ? 's' : ''}.`);
                } else {
                    // Next item
                    const currentIndex = visibleValues.indexOf(focusedValue);
                    if (currentIndex < visibleValues.length - 1) {
                        setFocusedValue(visibleValues[currentIndex + 1]!);
                    }
                }
                break;

            case 'ArrowUp': {
                e.preventDefault();
                if (!focusedValue) return;

                const currentIndex = visibleValues.indexOf(focusedValue);
                if (currentIndex > 0) {
                    // Previous item
                    setFocusedValue(visibleValues[currentIndex - 1]!);
                } else {
                    // Back to input
                    setFocusedValue(null);
                    inputRef.current?.focus();
                }
                break;
            }

            case 'Enter':
            case ' ':
                if (focusedValue) {
                    e.preventDefault();
                    toggleValue(focusedValue);
                }
                break;

            case 'Home':
                if (focusedValue) {
                    e.preventDefault();
                    setFocusedValue(visibleValues[0] || null);
                }
                break;

            case 'End':
                if (focusedValue) {
                    e.preventDefault();
                    setFocusedValue(visibleValues[visibleValues.length - 1] || null);
                }
                break;

            case 'Escape':
                e.preventDefault();
                setOpen(false);
                break;

            case 'Tab':
                // Let Tab work naturally to move to OK button
                break;

            default:
                // Any other key typing should reset virtual focus
                if (e.key.length === 1) {
                    setFocusedValue(null);
                }
                break;
        }
    }, [focusedValue, visibleValues, setFocusedValue, toggleValue, setOpen, announce]);

    // Fonction pour surligner le texte qui matche
    const highlightText = (text: string, search: string): React.ReactNode => {
        if (!search) return text;

        const searchLower = search.toLowerCase();
        const textLower = text.toLowerCase();
        const parts: React.ReactNode[] = [];
        let lastIndex = 0;

        let index = textLower.indexOf(searchLower);
        while (index !== -1) {
            // Ajouter le texte avant le match
            if (index > lastIndex) {
                parts.push(text.substring(lastIndex, index));
            }
            // Ajouter le texte matché avec highlight
            parts.push(
                <span key={`highlight-${lastIndex}-${index}`} className={styles.highlightedText}>
                    {text.substring(index, index + search.length)}
                </span>
            );
            lastIndex = index + search.length;
            index = textLower.indexOf(searchLower, lastIndex);
        }

        // Ajouter le reste du texte
        if (lastIndex < text.length) {
            parts.push(text.substring(lastIndex));
        }

        return parts.length > 0 ? parts : text;
    };

    // Fonction pour appliquer le highlight récursivement
    const applyHighlight = React.useCallback((node: React.ReactNode): React.ReactNode => {
        if (!searchValue) return node;

        if (typeof node === 'string') {
            return highlightText(node, searchValue);
        }

        if (typeof node === 'number') {
            return node;
        }

        if (Array.isArray(node)) {
            return node.map((child, index) => (
                <React.Fragment key={index}>{applyHighlight(child)}</React.Fragment>
            ));
        }

        if (React.isValidElement(node)) {
            if (typeof node.type !== 'string') {
                return node;
            }

            const nodeProps = node.props as { children?: React.ReactNode };
            if (nodeProps.children) {
                return React.cloneElement(node, {}, applyHighlight(nodeProps.children));
            }
        }

        return node;
    }, [searchValue]);

    return (
        <>
            <div style={{ display: "none" }}>
                <Command>
                    <CommandList>{children}</CommandList>
                </Command>
            </div>
            <PopoverContent className={styles.multiSelectContent} align="start">
                <Command {...props}>
                    {canSearch ? (
                        <CommandInput
                            ref={inputRef}
                            placeholder={
                                typeof search === "object" ? search.placeholder : undefined
                            }
                            value={searchValue}
                            onChange={(e) => {
                                setSearchValue(e.target.value);
                            }}
                            onKeyDown={handleKeyDown}
                            role="combobox"
                            aria-expanded="true"
                            aria-autocomplete="list"
                            aria-controls="multiselect-listbox"
                            aria-activedescendant={focusedValue ? `multiselect-option-${focusedValue}` : undefined}
                        />
                    ) : (
                        <button autoFocus className={styles.srOnly} />
                    )}
                    <MultiSelectSearchContext.Provider value={{ searchValue, applyHighlight }}>
                        <CommandList
                            id="multiselect-listbox"
                            role="listbox"
                            aria-label="Options de sélection multiple"
                            aria-multiselectable="true"
                            tabIndex={-1}
                        >
                            {canSearch && searchValue && React.Children.count(children) === 0 && (
                                <CommandEmpty>
                                    {typeof search === "object" && search.emptyMessage
                                        ? search.emptyMessage
                                        : "Aucun résultat trouvé."}
                                </CommandEmpty>
                            )}
                            {!hasItems && !searchValue && emptyState && (
                                <div style={{ padding: '1rem' }}>
                                    <Empty
                                        Icon={InboxIcon}
                                        title={emptyState.title}
                                        description={emptyState.description}
                                        small
                                    />
                                </div>
                            )}
                            {children}
                        </CommandList>
                    </MultiSelectSearchContext.Provider>
                    {showCloseButton && (
                        <div className={styles.multiSelectFooter}>
                            <Button
                                type="button"
                                onClick={() => setOpen(false)}
                                variant="outline"
                                size="sm"
                                className={styles.multiSelectCloseButton}
                            >
                                {closeButtonText}
                            </Button>
                        </div>
                    )}
                </Command>
            </PopoverContent>
        </>
    );
}

export function MultiSelectItem({
    value,
    children,
    badgeLabel,
    onSelect,
    ...props
}: {
    badgeLabel?: React.ReactNode;
    value: string;
    onSelect?: (value: string) => void;
} & Omit<React.ComponentPropsWithoutRef<typeof CommandItem>, "value" | "onSelect">) {
    const {
        toggleValue,
        selectedValues,
        onItemAdded,
        focusedValue,
        registerValue,
        unregisterValue
    } = useMultiSelectContext();
    const searchContext = React.useContext(MultiSelectSearchContext);
    const isSelected = selectedValues.has(value);
    const isFocused = focusedValue === value;
    const itemRef = React.useRef<HTMLDivElement>(null);

    React.useEffect(() => {
        onItemAdded(value, badgeLabel ?? children);
    }, [value, children, onItemAdded, badgeLabel]);

    // Fonction pour extraire le texte d'un ReactNode
    const getTextFromNode = (node: React.ReactNode): string => {
        if (typeof node === 'string') return node;
        if (typeof node === 'number') return String(node);
        if (React.isValidElement(node)) {
            const nodeProps = node.props as { children?: React.ReactNode };
            if (nodeProps.children) {
                return getTextFromNode(nodeProps.children);
            }
        }
        if (Array.isArray(node)) {
            return node.map(getTextFromNode).join(' ');
        }
        return '';
    };

    // Si on a une recherche active et que l'item ne matche pas, ne pas l'afficher
    const searchValue = searchContext?.searchValue || '';
    const isVisible = React.useMemo(() => {
        if (!searchValue) return true;

        const searchLower = searchValue.toLowerCase();
        const valueLower = value.toLowerCase();
        const textLower = getTextFromNode(children).toLowerCase();

        return valueLower.includes(searchLower) || textLower.includes(searchLower);
    }, [searchValue, value, children]);

    // Register/unregister for keyboard navigation
    React.useEffect(() => {
        if (isVisible) {
            registerValue(value);
        }
        return () => {
            if (isVisible) {
                unregisterValue(value);
            }
        };
    }, [value, isVisible, registerValue, unregisterValue]);

    // Scroll into view when focused
    React.useEffect(() => {
        if (isFocused && itemRef.current) {
            itemRef.current.scrollIntoView({
                block: 'nearest',
                behavior: 'smooth'
            });
        }
    }, [isFocused]);

    if (!isVisible) {
        return null;
    }

    // Appliquer le highlight si nécessaire
    const displayContent = searchContext?.applyHighlight
        ? searchContext.applyHighlight(children)
        : children;

    return (
        <CommandItem
            {...props}
            ref={itemRef}
            value={value}
            onSelect={() => {
                toggleValue(value);
                onSelect?.(value);
            }}
            id={`multiselect-option-${value}`}
            role="option"
            aria-selected={isSelected}
            data-focused={isFocused}
            data-selected={isSelected}
            className={cn(
                props.className,
                isFocused && styles.multiSelectItemFocused,
                isSelected && !isFocused && styles.multiSelectItemSelected
            )}
        >
            <CheckIcon
                className={cn(
                    styles.multiSelectCheckIcon,
                    isSelected ? styles.multiSelectCheckIconSelected : styles.multiSelectCheckIconUnselected
                )}
                aria-hidden="true"
            />
            <span>{displayContent}</span>
        </CommandItem>
    );
}

export function MultiSelectGroup(
    props: React.ComponentPropsWithoutRef<typeof CommandGroup>
) {
    return <CommandGroup {...props} />;
}

export function MultiSelectSeparator(
    props: React.ComponentPropsWithoutRef<typeof CommandSeparator>
) {
    return <CommandSeparator {...props} />;
}

function useMultiSelectContext() {
    const context = React.useContext(MultiSelectContext);
    if (context === null) {
        throw new Error(
            "useMultiSelectContext must be used within a MultiSelectContext"
        );
    }
    return context;
}
