import ProgressionBar from "../../../../modules/document-library/components/document-library/components/files-to-upload-progress-tracker/progression-bar/progression-bar";
import React from "react";
import styles from './progress-bar-toast.module.scss';


type TProgressBarToastProps = {
    description?: string;
    progressBarId: number;
    progressBarExpectedEventNamespaces: readonly string[];
};

const ProgressBarToast = ({
    description,
    progressBarId,
    progressBarExpectedEventNamespaces,
}: TProgressBarToastProps) => {

    return <div className={styles.progressBarToast}>
        {description && <div>{description}</div>}
        <ProgressionBar
            id={progressBarId}
            expectedEventNamespaces={progressBarExpectedEventNamespaces}
        />
    </div>;
};


export {
    ProgressBarToast,
};