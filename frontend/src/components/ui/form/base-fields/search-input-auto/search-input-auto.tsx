import { Search } from "lucide-react";
import React from "react";
import { Input } from "../input/input";
import styles from '../../form/form.module.scss';
import { cn } from "../../../../../lib/utils";


const SearchInputAuto = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(({
    className,
    ...props
}, ref) => {

    return <div className={cn(styles.relative, className)}>
        <Search className={styles.inputIcon} size={16} />
        <Input
            className={styles.inputWithIcon}
            placeholder="Search..."
            {...props}
            ref={ref}
        />
    </div>;
});

SearchInputAuto.displayName = 'SearchInputAuto';


export {
    SearchInputAuto,
};