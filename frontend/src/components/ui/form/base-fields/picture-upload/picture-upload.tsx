import { useState, useEffect } from "react";
import { Camera } from "lucide-react";
import { cn } from "../../../../../lib/utils";
import { v4 as uuidv4 } from 'uuid';
import styles from "./picture-upload.module.scss";
import { useTranslation } from "../../../../../../i18n/react";


export interface IPictureUploadProps {
    value?: string | File;
    onChange?: (file: File) => void;
    className?: string;
    variant?: 'circular' | 'rectangular';
    objectFit?: 'cover' | 'contain';
}

const PictureUpload = ({
    value,
    onChange,
    className,
    variant = 'circular',
    objectFit = 'cover',
}: IPictureUploadProps) => {
    const { t } = useTranslation();
    const [preview, setPreview] = useState<string | null>(typeof value === 'string' ? value : null);

    useEffect(() => {
        if (typeof value === "string") {
            setPreview(value);
        } else if (value instanceof File) {
            setPreview(URL.createObjectURL(value));
        }
    }, [value]);

    const id = `file-upload-${uuidv4()}`;

    return (
        <div className={cn(
            styles.pictureUpload,
            variant === 'rectangular' && styles.pictureUploadRectangular,
            className
        )}>
            <input
                type="file"
                accept="image/*"
                className={styles.displayNone}
                onChange={(event) => {
                    const file = event.target.files?.[0];
                    if (file && onChange) {
                        onChange(file);
                    }
                }}
                id={id}
            />
            <label htmlFor={id} className={cn(
                styles.pictureUploadLabel,
                !preview && styles.pictureUploadLabelWithoutPreview,
            )} tabIndex={0} onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                    event.currentTarget.click();
                }
            }}>
                {preview ? (
                    <>
                        <img src={preview} alt={t("general.ui.pictureUpload.preview")} className={cn(
                            styles.pictureUploadImagePreview,
                            objectFit === 'contain' && styles.pictureUploadImagePreviewContain,
                        )} />

                        {/* Voile noir au survol */}
                        <div className={styles.pictureUploadOverlay}>
                            <Camera size={22} />
                            {t("general.ui.pictureUpload.clickToChange")}
                        </div>
                    </>
                ) : (
                    <div className={styles.pictureUploadLabelEmpty}>
                        <Camera size={22} />
                        {t("general.ui.pictureUpload.clickToAdd")}
                    </div>
                )}
            </label>
        </div>
    );
};


export {
    PictureUpload,
};
