import React from "react";
import * as TabsPrimitive from "@radix-ui/react-tabs";
import { ScrollArea, ScrollBar } from "../scroll-area/scroll-area";
import { cn } from "../../../../lib/utils";
import styles from './fancy-tabs.module.scss';


export interface IFancyTabValue {
    value: string;
    label: React.ReactNode;
}

export interface IFancyTabsProps {
    values: IFancyTabValue[];
    defaultValue?: string;
    value?: string;
    onValueChange?: (value: string) => void;
    className?: string;
    children?: React.ReactNode;
}

const FancyTabs: React.FC<IFancyTabsProps> = ({
    values,
    defaultValue,
    value,
    onValueChange,
    className,
    children,
}) => {
    return (
        <TabsPrimitive.Root
            defaultValue={defaultValue || values[0]?.value}
            value={value}
            onValueChange={onValueChange}
            className={cn(styles.fancyTabs, className)}
        >
            <ScrollArea className={styles.scrollArea}>
                <TabsPrimitive.List className={styles.tabsList}>
                    {values.map((tab) => (
                        <TabsPrimitive.Trigger
                            key={tab.value}
                            value={tab.value}
                            className={styles.tab}
                            data-state-active={styles.tabActive}
                        >
                            {tab.label}
                            <span className={styles.fancyBar} aria-hidden="true" />
                        </TabsPrimitive.Trigger>
                    ))}
                </TabsPrimitive.List>
                <ScrollBar orientation="horizontal" />
            </ScrollArea>
            {children}
        </TabsPrimitive.Root>
    );
};

const FancyTabsContent = React.forwardRef<
    React.ElementRef<typeof TabsPrimitive.Content>,
    React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(({ className, ...props }, ref) => (
    <TabsPrimitive.Content
        ref={ref}
        className={cn(styles.tabsContent, className)}
        {...props}
    />
));
FancyTabsContent.displayName = TabsPrimitive.Content.displayName;

export default FancyTabs;
export { FancyTabsContent };

export const FancyTabLabel: React.FC<{
    main: string;
    parenthesis?: string | number;
}> = ({ main, parenthesis }) => (
    <>
        <span>{main}</span>
        {parenthesis !== undefined && (
            <span className={styles.parenthesis}>({parenthesis})</span>
        )}
    </>
);

