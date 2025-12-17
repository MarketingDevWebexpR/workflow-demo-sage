import React, { forwardRef } from "react";
import { extractErrorMessage } from "@/utils/error.utils";
import { AlertTriangleIcon } from "lucide-react";
import { cn } from "../../../lib/utils";
import styles from './error-message.module.scss';
import { useTranslation } from "../../../../i18n/react";


type TErrorProps = {
    error: Error,
    className?: string,
}

const ErrorMessage = forwardRef<HTMLDivElement, TErrorProps>(({
    error,
    className,
}, ref): React.ReactElement => {
    const { t } = useTranslation();

    return <div 
        ref={ref}
        className={cn(
            styles.errorMessage,
            className
        )}
    >
        <AlertTriangleIcon size={60} className={styles.errorMessageIcon} />
        <div className={styles.errorMessageContent}>
            <p className={styles.errorMessageTitle}>{t("general.messages.errorOccurred")}</p>
            <p className={styles.errorMessageDescription}>{extractErrorMessage(error)}</p>
        </div>
    </div>;
});

ErrorMessage.displayName = "ErrorMessage";

export {
    ErrorMessage,
};