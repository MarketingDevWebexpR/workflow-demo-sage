import React from "react";
import { Toaster as Sonner } from "sonner";
import styles from './sonner.module.scss';
import { AlertCircleIcon, CheckCircle2, InfoIcon, LoaderIcon, } from "lucide-react";


type ToasterProps = React.ComponentProps<typeof Sonner>

const Toaster = ({ ...props }: ToasterProps) => {

    return <Sonner
        className="toaster group"
        position="bottom-center"
        expand={true}
        visibleToasts={20}
        icons={{
            success: <CheckCircle2 size={16} />,
            error: <AlertCircleIcon size={16} />,
            loading: <LoaderIcon size={16} />,
            info: <InfoIcon size={16} />,
        }}
        closeButton={true}
        toastOptions={{
            classNames: {
                closeButton: styles.closeButton,
                error: styles.error,
                success: styles.success,
                loading: styles.loading,
                toast: styles.toast,
                title: styles.title,
                description: styles.description,
                content: styles.content,
                icon: styles.icon,
            },
        }}
        duration={Number.POSITIVE_INFINITY}
        {...props}
    />;
}

export { Toaster }