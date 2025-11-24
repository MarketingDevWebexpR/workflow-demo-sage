import React from "react";
// import { Badge } from "../../../components/ui/badge/badge";
import { cn } from "../../../lib/utils";
import styles from "./component-highlighter.module.scss";
import { type LucideProps } from "lucide-react";


type TComponentHighlighterProps = {
    componentRect: DOMRect | null;
    savedRect: React.MutableRefObject<DOMRect | null>;
    isEditing: boolean;
    componentTitle: string | undefined;
    ComponentIcon: React.ComponentType<LucideProps> | undefined;
}

const ComponentHighlighter = ({
    componentRect,
    savedRect,
    isEditing,
    componentTitle,
    ComponentIcon,
}: TComponentHighlighterProps) => {

    return <div
        data-component-highlighter
        className={cn(
            styles.componentHighlighter,
            componentRect ? styles.componentHighlighterVisible : styles.componentHighlighterHidden,
            isEditing ? styles.componentHighlighterEditOn : styles.componentHighlighterEditOff
        )}
        style={componentRect ? {
            left: componentRect.left,
            top: componentRect.top,
            width: componentRect.width,
            height: componentRect.height,
        } : {
            left: savedRect.current?.left,
            top: savedRect.current?.top,
            width: savedRect.current?.width,
            height: savedRect.current?.height,
        }}
    >
        <div className={cn(
            styles.componentHighlighterBadge,
            isEditing ? styles.componentHighlighterBadgeEditOn : styles.componentHighlighterBadgeEditOff
        )}>
            <div className={styles.componentHighlighterIcon}>
                {ComponentIcon ? <ComponentIcon size={16} /> : null}
            </div>
            {componentTitle}
        </div>
    </div>;
};

export {
    ComponentHighlighter,
    type TComponentHighlighterProps,
}