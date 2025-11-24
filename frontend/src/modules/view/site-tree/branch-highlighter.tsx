import React from "react";
import { cn } from "../../../lib/utils";
import styles from './branch-highlighter.module.scss';


type TBranchHighlighterProps = {
    branchRect: DOMRect | null;
    savedRect: React.MutableRefObject<DOMRect | null>;
    isEditing: boolean;
}

const BranchHighlighter = ({
    branchRect,
    savedRect,
    isEditing,
}: TBranchHighlighterProps) => {

    return <div
        data-branch-highlighter
        className={cn(
            styles.branchHighlighter,
            branchRect ? styles.branchHighlighterVisible : styles.branchHighlighterHidden,
            isEditing ? styles.branchHighlighterEditing : styles.branchHighlighterRegular
        )}
        style={branchRect ? {
            left: `calc(${branchRect.left}px - var(--spacing-8))`,
            top: `calc(${branchRect.top}px + var(--header-height) - var(--spacing-8))`,
            width: branchRect.width,
            height: branchRect.height,
        } : {
            left: savedRect.current?.left,
            top: savedRect.current?.top,
            width: savedRect.current?.width,
            height: savedRect.current?.height,
        }}
    />;
};

export {
    BranchHighlighter,
    type TBranchHighlighterProps,
}