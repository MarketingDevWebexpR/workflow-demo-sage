import React from 'react';
import { cn } from '../../../../../lib/utils';
import styles from './image-cell.module.scss';
import { Image } from 'lucide-react';


type TImageCellProps = React.HTMLAttributes<HTMLDivElement> & {
    imgUrl: string | undefined | null;
    imgAlt?: string;
};

const ImageCell = React.forwardRef<HTMLDivElement, TImageCellProps>(({
    className,
    imgUrl,
    imgAlt,
    ...props
}, ref) => {
    return <div ref={ref} className={cn(styles.imageCell, className)} {...props}>
        {
            imgUrl
                ? <img
                    src={imgUrl}
                    alt={imgAlt}
                />
                : <div className={styles.imageCellFallback}>
                    <Image className={styles.imageCellFallbackIcon} />
                </div>
        }
    </div>
});

ImageCell.displayName = 'ImageCell';


export {
    ImageCell,
};