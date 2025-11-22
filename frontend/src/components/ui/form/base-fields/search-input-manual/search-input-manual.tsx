import { Search } from "lucide-react";
import { Input } from "../input/input";
import styles from "./search-input-manual.module.scss";
import React, { useImperativeHandle, useRef } from "react";
import { cn } from "../../../../../lib/utils";


type TSearchInputManualProps = React.ComponentProps<"input"> & {
    onSearch: (value: string) => void;
}

const SearchInputManual = React.forwardRef<HTMLInputElement, TSearchInputManualProps>(({
    className,
    onSearch,
    ...props
}, ref) => {

    const {ref: _unusedRef, ..._props} = props;
    const inputRef = useRef<HTMLInputElement>(null);

    useImperativeHandle(ref, () => inputRef.current!);

    return <div
        className={styles.searchInputManualWrapper}
    >
        <Input
            ref={inputRef}
            placeholder="Search..."
            className={cn(styles.searchInputManual, className)}
            onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {

                if (e.key !== 'Enter')
                    return;

                onSearch?.(e.currentTarget.value);
            }}
            {..._props}
        />
        <button
            className={styles.searchInputManualButton}
            onClick={e => {
                e.preventDefault();
                onSearch?.(inputRef.current?.value ?? '');
            }}
        >
            <Search size={16} />
        </button>
    </div>;
});

SearchInputManual.displayName = 'SearchInputManual';


export {
    SearchInputManual,
};
