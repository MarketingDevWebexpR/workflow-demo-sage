import React, { forwardRef } from "react";
import { Tabs, TabsList, TabsTrigger } from "../tabs/tabs";
import { cn } from "../../../lib/utils";
import { ScrollArea, ScrollBar } from "../scroll-area/scroll-area";
import styles from './category-tabs.module.scss';


export interface ICategoryTabTriggerProps extends Omit<React.HTMLAttributes<HTMLButtonElement>, 'onClick'> {
    id: string;
    isActive?: boolean;
    isLoading?: boolean;
    onClick?: (id: string) => void;
}

export const CategoryTabTrigger = forwardRef<HTMLButtonElement, ICategoryTabTriggerProps>(({
    id,
    isActive,
    isLoading,
    onClick,
    children,
    className,
    ...props
}, ref) => {
    return (
        <TabsTrigger
            ref={ref}
            key={`category-tab-${id}`}
            value={id}
            onClick={() => onClick?.(id)}
            className={cn(
                styles.categoryTabTrigger,
                isActive
                    ? styles.categoryTabTriggerActive
                    : styles.categoryTabTriggerInactive,
                isLoading && styles.categoryTabTriggerLoading,
                className
            )}
            data-is-loading={!!isLoading}
            {...props}
        >
            {
                children
            }
        </TabsTrigger>
    );
});

CategoryTabTrigger.displayName = 'CategoryTabTrigger';

export interface ICategoryTabsProps {
    activeCategory: string;
    onCategoryChange: (categoryId: string) => void;
    className?: string;
    children: React.ReactNode;
}

const CategoryTabs: React.FC<ICategoryTabsProps & React.HTMLAttributes<HTMLDivElement>> = ({
    activeCategory,
    onCategoryChange,
    className,
    children,
    ...props
}) => {
    const handleTabChange = (id: string) => {
        onCategoryChange(id);
    };

    // Ajouter la propriété isActive et onClick aux enfants
    const enhancedChildren = React.Children.map(children, (child) => {
        if (React.isValidElement<ICategoryTabTriggerProps>(child) && child.type === CategoryTabTrigger) {
            return React.cloneElement(child, {
                isActive: child.props.id === activeCategory,
                onClick: handleTabChange,
            } as Partial<ICategoryTabTriggerProps>);
        }
        return child;
    });

    return (
        <div className={cn(styles.categoryTabs, className)} {...props}>
            <ScrollArea className={styles.categoryTabsScrollArea}>
                <Tabs
                    value={activeCategory}
                    onValueChange={onCategoryChange}
                    className={styles.tabs}
                >
                    <TabsList className={styles.tabsList}>
                        {enhancedChildren}
                    </TabsList>
                </Tabs>
                <ScrollBar orientation="horizontal" />
            </ScrollArea>
        </div>
    );
};

export default CategoryTabs; 