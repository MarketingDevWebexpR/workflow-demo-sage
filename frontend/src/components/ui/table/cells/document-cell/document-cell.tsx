import React from "react";
import { cn } from "../../../../../lib/utils";
import styles from "./document-cell.module.scss";
import { DocumentItemIcon } from "../../../../../modules/document-library/components/document-library/components/document-item-icon/document-item-icon";
import { ChevronRight } from "lucide-react";


type TDocumentCellProps = React.HTMLAttributes<HTMLDivElement> & {
    path: string | undefined | null;
    fileName: string | undefined | null;
    fallbackText?: string;
    isFolder?: boolean;
    isLoading?: boolean;
};

const DocumentCell = React.forwardRef<HTMLDivElement, TDocumentCellProps>(({
    className,
    isLoading = false,
    path,
    fileName,
    fallbackText = 'File name not found.',
    isFolder = false,
    ...props
}, ref) => {

    console.log({ path, fileName, isFolder, });

    return <div
        className={cn(styles.documentCell, className)}
        ref={ref}
        {...props}
        data-fallback={!fileName}
        data-is-loading={isLoading}
    >
        <DocumentItemIcon
            type={isFolder ? 'SP.Folder' : 'SP.File'}
            name={fileName || fallbackText}
            isLoading={isLoading}
        />
        <div className={styles.documentInfos}>
            <div className={styles.documentName}>
                {fileName || fallbackText}
            </div>
            <div className={styles.documentPath}>
                {
                    decodeURIComponent(path ?? '')
                        .split('/')
                        .map((part, index, array) => {

                            return <React.Fragment key={part}>
                                <span>
                                    {part}
                                </span>
                                {index < array.length - 1 && <ChevronRight size={12} />}
                            </React.Fragment>
                        })
                }
            </div>
        </div>
    </div>;
});


export {
    DocumentCell,
};