import React from "react";
import { cn } from "../../../lib/utils";
import styles from "./drop-preview.module.scss";
import { Badge } from "../../../components/ui/badge/badge";
import { ArrowDown } from "lucide-react";


type TDropPreviewProps = {
    previewRect: { left: number; top: number; width: number } | null;
    dragOverInfos: any;
    dragOverComponentTitle: string | undefined;
}

const DropPreview = ({
    previewRect,
    dragOverInfos,
    dragOverComponentTitle,
}: TDropPreviewProps): React.ReactElement => {

    console.log({ dragOverInfos });
    return <div
        data-drop-placeholder
        className={cn(
            styles.dropPreview,
            dragOverInfos ? styles.dropPreviewVisible : styles.dropPreviewHidden
        )}
        style={previewRect ? {
            left: previewRect.left,
            top: previewRect.top,
            width: previewRect.width,
        } : {
            left: dragOverInfos?.left,
            top: dragOverInfos?.top,
            width: '100%',
        }}
    >
        <Badge
            className={styles.dropPreviewBadge}
            icon={<ArrowDown name="arrow-down" />}
            text={
                dragOverInfos?.afterComponentId
                    ? `Insérer avant ${dragOverComponentTitle}`
                    : `Mettre dans ${dragOverInfos?.layerTitle}`
            }
        />
    </div>;
}

export {
    DropPreview,
    type TDropPreviewProps,
}