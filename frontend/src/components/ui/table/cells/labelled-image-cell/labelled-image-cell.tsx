import React from "react";
import { cn } from "../../../../../lib/utils";
import styles from "./labelled-image-cell.module.scss";
import { Avatar, AvatarFallback, AvatarImage } from "../../../avatar/avatar";
import { Image } from "lucide-react";


type TLabelledImageCellProps = React.HTMLAttributes<HTMLDivElement> & {
    imgUrl: string | undefined | null;
    text: string | undefined | null;
    fallbackText?: string;
};

const LabelledImageCell = React.forwardRef<HTMLDivElement, TLabelledImageCellProps>(({
    className,
    imgUrl,
    text,
    fallbackText = 'No label.',
    ...props
}, ref) => {

    return <div
        className={cn(styles.labelledImageCell, className)}
        ref={ref}
        {...props}
        data-fallback={!text}
    >
        {
            imgUrl
                ? <Avatar className={styles.labelledImageCellAvatar}>
                    <AvatarImage className={styles.labelledImageCellImage} src={imgUrl || ''} alt={text || ''} />
                    <AvatarFallback className={styles.labelledImageCellImageFallback}>
                        <Image className={styles.labelledImageCellImageFallbackIcon} size={16} />
                    </AvatarFallback>
                </Avatar>
                : <div className={styles.labelledImageCellImageFallback}>
                    <Image className={styles.labelledImageCellImageFallbackIcon} size={16} />
                </div>
        }
        <div className={styles.labelledImageCellText}>{text || fallbackText}</div>
    </div>;
});


export {
    LabelledImageCell,
};