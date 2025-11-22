import * as React from "react"
import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu"
import { Check, ChevronRight, Circle, type LucideProps } from "lucide-react"

import { cn } from "../../../lib/utils"
import styles from './dropdown-menu.module.scss';

const DropdownMenu = DropdownMenuPrimitive.Root

const DropdownMenuTrigger = DropdownMenuPrimitive.Trigger

const DropdownMenuGroup = DropdownMenuPrimitive.Group

const DropdownMenuPortal = DropdownMenuPrimitive.Portal

const DropdownMenuSub = DropdownMenuPrimitive.Sub

const DropdownMenuRadioGroup = DropdownMenuPrimitive.RadioGroup

const DropdownMenuSubTrigger = React.forwardRef<
    React.ElementRef<typeof DropdownMenuPrimitive.SubTrigger>,
    React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.SubTrigger> & {
        inset?: boolean
    }
>(({ className, inset, children, ...props }, ref) => (
    <DropdownMenuPrimitive.SubTrigger
        ref={ref}
        className={cn(
            styles.dropdownMenuSubTrigger,
            inset && styles.inset,
            className
        )}
        {...props}
    >
        {children}
        <ChevronRight style={{ marginLeft: 'auto' }} />
    </DropdownMenuPrimitive.SubTrigger>
))
DropdownMenuSubTrigger.displayName =
    DropdownMenuPrimitive.SubTrigger.displayName

const DropdownMenuSubContent = React.forwardRef<
    React.ElementRef<typeof DropdownMenuPrimitive.SubContent>,
    React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.SubContent>
>(({ className, ...props }, ref) => (
    <DropdownMenuPrimitive.SubContent
        ref={ref}
        className={cn(
            styles.dropdownMenuSubContent,
            className
        )}
        {...props}
    />
))
DropdownMenuSubContent.displayName =
    DropdownMenuPrimitive.SubContent.displayName

const DropdownMenuContent = React.forwardRef<
    React.ElementRef<typeof DropdownMenuPrimitive.Content>,
    React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Content>
>(({ className, sideOffset = 4, ...props }, ref) => (
    <DropdownMenuPrimitive.Portal>
        <DropdownMenuPrimitive.Content
            ref={ref}
            sideOffset={sideOffset}
            className={cn(
                styles.dropdownMenuContent,
                className
            )}
            {...props}
        />
    </DropdownMenuPrimitive.Portal>
))
DropdownMenuContent.displayName = DropdownMenuPrimitive.Content.displayName

const DropdownMenuItem = React.forwardRef<
    React.ElementRef<typeof DropdownMenuPrimitive.Item>,
    React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Item> & {
        inset?: boolean
    }
>(({ className, inset, ...props }, ref) => (
    <DropdownMenuPrimitive.Item
        ref={ref}
        className={cn(
            styles.dropdownMenuItem,
            inset && styles.inset,
            className
        )}
        {...props}
    />
))
DropdownMenuItem.displayName = DropdownMenuPrimitive.Item.displayName

const DropdownMenuCheckboxItem = React.forwardRef<
    React.ElementRef<typeof DropdownMenuPrimitive.CheckboxItem>,
    React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.CheckboxItem>
>(({ className, children, checked, ...props }, ref) => (
    <DropdownMenuPrimitive.CheckboxItem
        ref={ref}
        className={cn(
            styles.dropdownMenuCheckboxItem,
            className
        )}
        checked={checked}
        {...props}
    >
        <span className={styles.itemIndicator}>
            <DropdownMenuPrimitive.ItemIndicator>
                <Check style={{ width: '1rem', height: '1rem' }} />
            </DropdownMenuPrimitive.ItemIndicator>
        </span>
        {children}
    </DropdownMenuPrimitive.CheckboxItem>
))
DropdownMenuCheckboxItem.displayName =
    DropdownMenuPrimitive.CheckboxItem.displayName

const DropdownMenuRadioItem = React.forwardRef<
    React.ElementRef<typeof DropdownMenuPrimitive.RadioItem>,
    React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.RadioItem>
>(({ className, children, ...props }, ref) => (
    <DropdownMenuPrimitive.RadioItem
        ref={ref}
        className={cn(
            styles.dropdownMenuRadioItem,
            className
        )}
        {...props}
    >
        <span className={styles.itemIndicator}>
            <DropdownMenuPrimitive.ItemIndicator>
                <Circle style={{ width: '0.5rem', height: '0.5rem' }} />
            </DropdownMenuPrimitive.ItemIndicator>
        </span>
        {children}
    </DropdownMenuPrimitive.RadioItem>
))
DropdownMenuRadioItem.displayName = DropdownMenuPrimitive.RadioItem.displayName

const DropdownMenuLabel = React.forwardRef<
    React.ElementRef<typeof DropdownMenuPrimitive.Label>,
    React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Label> & {
        inset?: boolean
    }
>(({ className, inset, ...props }, ref) => (
    <DropdownMenuPrimitive.Label
        ref={ref}
        className={cn(
            styles.dropdownMenuLabel,
            inset && styles.inset,
            className
        )}
        {...props}
    />
))
DropdownMenuLabel.displayName = DropdownMenuPrimitive.Label.displayName

const DropdownMenuSeparator = React.forwardRef<
    React.ElementRef<typeof DropdownMenuPrimitive.Separator>,
    React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Separator>
>(({ className, ...props }, ref) => (
    <DropdownMenuPrimitive.Separator
        ref={ref}
        className={cn(styles.dropdownMenuSeparator, className)}
        {...props}
    />
))
DropdownMenuSeparator.displayName = DropdownMenuPrimitive.Separator.displayName

const DropdownMenuShortcut = ({
    className,
    ...props
}: React.HTMLAttributes<HTMLSpanElement>) => {
    return (
        <span
            className={cn(styles.dropdownMenuShortcut, className)}
            {...props}
        />
    )
}
DropdownMenuShortcut.displayName = "DropdownMenuShortcut"

const DropdownMenuItemIcon = React.forwardRef<
    SVGSVGElement,
    {
        icon: React.ComponentType<LucideProps>;
        size?: number;
        className?: string;
    }
>(({ icon: Icon, size = 16, className, ...props }, _ref) => (
    <Icon
        size={size}
        className={cn(styles.dropdownMenuItemIcon, className)}
        {...props}
    />
))
DropdownMenuItemIcon.displayName = "DropdownMenuItemIcon"

const DropdownMenuItemChevron = React.forwardRef<
    SVGSVGElement,
    React.ComponentPropsWithoutRef<'svg'> & {
        size?: number;
    }
>(({ size = 16, className, ...props }, _ref) => (
    <ChevronRight
        size={size}
        className={cn(styles.dropdownMenuItemChevron, className)}
        {...props}
    />
))
DropdownMenuItemChevron.displayName = "DropdownMenuItemChevron"

const DropdownMenuItemContent = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => {
    const childrenArray = React.Children.toArray(children);
    const chevron = childrenArray.find(
        (child) => React.isValidElement(child) && child.type === DropdownMenuItemChevron
    );
    const otherChildren = childrenArray.filter(
        (child) => !(React.isValidElement(child) && child.type === DropdownMenuItemChevron)
    );

    return (
        <div
            ref={ref}
            className={cn(styles.dropdownMenuItemContent, className)}
            {...props}
        >
            <div className={styles.dropdownMenuItemContentMain}>
                {otherChildren}
            </div>
            {chevron}
        </div>
    );
})
DropdownMenuItemContent.displayName = "DropdownMenuItemContent"

export {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuCheckboxItem,
    DropdownMenuRadioItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuShortcut,
    DropdownMenuGroup,
    DropdownMenuPortal,
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuSubTrigger,
    DropdownMenuRadioGroup,
    DropdownMenuItemContent,
    DropdownMenuItemIcon,
    DropdownMenuItemChevron,
}
