import * as React from "react";
import { cn } from "../../../lib/utils";
import styles from "./command.module.scss";
import { SearchInputAuto } from "../form/base-fields/search-input-auto/search-input-auto";

type CommandProps = React.HTMLAttributes<HTMLDivElement>;

const Command = React.forwardRef<HTMLDivElement, CommandProps>(
    ({ className, ...props }, ref) => (
        <div
            ref={ref}
            className={cn(styles.command, className)}
            {...props}
        />
    )
);
Command.displayName = "Command";

type CommandInputProps = React.InputHTMLAttributes<HTMLInputElement>;

const CommandInput = React.forwardRef<HTMLInputElement, CommandInputProps>(
    ({ className, ...props }, ref) => (
        <div className={styles.commandInputWrapper}>
            <SearchInputAuto
                ref={ref}
                className={cn(styles.commandInput, className)}
                {...props}
            />
        </div>
    )
);
CommandInput.displayName = "CommandInput";

type CommandListProps = React.HTMLAttributes<HTMLDivElement>;

const CommandList = React.forwardRef<HTMLDivElement, CommandListProps>(
    ({ className, ...props }, ref) => (
        <div
            ref={ref}
            className={cn(styles.commandList, className)}
            {...props}
        />
    )
);
CommandList.displayName = "CommandList";

type CommandEmptyProps = React.HTMLAttributes<HTMLDivElement>;

const CommandEmpty = React.forwardRef<HTMLDivElement, CommandEmptyProps>(
    ({ className, children, ...props }, ref) => (
        <div
            ref={ref}
            className={cn(styles.commandEmpty, className)}
            {...props}
        >
            {children}
        </div>
    )
);
CommandEmpty.displayName = "CommandEmpty";

type CommandGroupProps = React.HTMLAttributes<HTMLDivElement> & {
    heading?: string;
};

const CommandGroup = React.forwardRef<HTMLDivElement, CommandGroupProps>(
    ({ className, heading, children, ...props }, ref) => (
        <div
            ref={ref}
            className={cn(styles.commandGroup, className)}
            {...props}
        >
            {heading && <div className={styles.commandGroupHeading}>{heading}</div>}
            {children}
        </div>
    )
);
CommandGroup.displayName = "CommandGroup";

type CommandItemProps = React.HTMLAttributes<HTMLDivElement> & {
    onSelect?: (value: string) => void;
    value?: string;
};

const CommandItem = React.forwardRef<HTMLDivElement, CommandItemProps>(
    ({ className, onSelect, value, ...props }, ref) => {
        const handleClick = () => {
            if (onSelect && value) {
                onSelect(value);
            }
        };

        return (
            <div
                ref={ref}
                className={cn(styles.commandItem, className)}
                onClick={handleClick}
                data-value={value}
                {...props}
            />
        );
    }
);
CommandItem.displayName = "CommandItem";

type CommandSeparatorProps = React.HTMLAttributes<HTMLDivElement>;

const CommandSeparator = React.forwardRef<HTMLDivElement, CommandSeparatorProps>(
    ({ className, ...props }, ref) => (
        <div
            ref={ref}
            className={cn(styles.commandSeparator, className)}
            {...props}
        />
    )
);
CommandSeparator.displayName = "CommandSeparator";

export {
    Command,
    CommandInput,
    CommandList,
    CommandEmpty,
    CommandGroup,
    CommandItem,
    CommandSeparator,
};

