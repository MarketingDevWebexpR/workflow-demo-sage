import React from "react";
import { cn } from "../../../../../lib/utils";
import styles from "./user-cell.module.scss";
import { Avatar } from "@radix-ui/react-avatar";
import { AvatarFallback, AvatarImage } from "../../../avatar/avatar";


type TUserCellProps = React.HTMLAttributes<HTMLDivElement> &{
    imgUrl: string | undefined | null;
    text: string | undefined | null;
    fallbackText?: string;
};

const UserCell = React.forwardRef<HTMLDivElement, TUserCellProps>(({
    className,
    imgUrl,
    text,
    fallbackText = 'No name.',
    ...props
}, ref) => {

    return <div
        className={cn(styles.userCell, className)} ref={ref} {...props}
        data-fallback={!text}
    >
        { !!text && <Avatar className={styles.userCellAvatar}>
            <AvatarImage className={styles.userCellImage} src={imgUrl || ''} alt={text} />
            <AvatarFallback className={styles.userCellImageFallback}>
                {text.substring(0, 2).toUpperCase()}
            </AvatarFallback>
        </Avatar>}
        <div className={styles.userCellText}>{text || fallbackText}</div>
    </div>;
});


export {
    UserCell,
};