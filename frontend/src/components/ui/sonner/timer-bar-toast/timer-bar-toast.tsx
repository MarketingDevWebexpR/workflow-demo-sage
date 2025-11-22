import React, { useEffect, useRef } from "react";
import styles from './timer-bar-toast.module.scss';


type TProgressBarToastProps = {
    description?: React.ReactNode | string;
    duration: number;
    dismissToast: () => void;
};

const TimerBarToast = ({
    description,
    duration,
    dismissToast,
}: TProgressBarToastProps) => {

    const timerBarRef = useRef<HTMLDivElement>(null);

    useEffect(() => {

        const millisecondsIntervalStep = 20;
        let millisecondsSpent = 0;

        const updateDurationBar = setInterval(() => {

            const progressBarPercent = 100 - ((millisecondsSpent * 100) || 1) / duration;

            if (progressBarPercent > 0) {

                timerBarRef.current?.style.setProperty('--toast-remaining-progress-bar', progressBarPercent + '%');
                millisecondsSpent += millisecondsIntervalStep;
            } else {

                clearInterval(updateDurationBar);
                dismissToast();
            }
        }, millisecondsIntervalStep);
    }, []);

    return <div
        className={styles.timerBarToast}
    >
        {description && <div>{description}</div>}
        <div
            className={styles.timerBar}
            ref={timerBarRef}
        />
    </div>;
};


export {
    TimerBarToast,
};