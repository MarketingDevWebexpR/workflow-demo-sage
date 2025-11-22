import { Loader, Trash } from "lucide-react";
import React from "react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "../alert-dialog/alert-dialog";
import { Button, buttonVariants } from "../button/button";
import styles from '../form/form/form.module.scss';
import { cn } from "../../../lib/utils";
import { useTranslation } from "../../../../../i18n/react";


interface IDeleteItemDialogProps {
    isDeleting: boolean;
    title: string;
    description: string;
    onDelete: () => void;
    isDisabled?: boolean;
    deletingText?: string;
    deleteText?: string;
    deleteIconSize?: number;
    triggerVariant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
    triggerSize?: 'default' | 'sm' | 'lg' | 'icon';
    triggerClassName?: string;
}

const DeleteItemDialog = ({
    isDeleting,
    title,
    description,
    onDelete,
    isDisabled = isDeleting,
    deletingText,
    deleteText,
    deleteIconSize = 18,
    triggerVariant = 'destructive',
    triggerSize = 'default',
    triggerClassName,
}: IDeleteItemDialogProps) => {
    const { t } = useTranslation();
    const finalDeletingText = deletingText || t("general.actions.deleting");
    const finalDeleteText = deleteText || t("general.actions.delete");

    return <AlertDialog>
        <AlertDialogTrigger asChild>
            <Button
                variant={triggerVariant}
                size={triggerSize}
                className={triggerClassName}
                disabled={isDisabled}
            >{
                    isDeleting
                        ? <><Loader size={deleteIconSize} className={cn(styles.buttonIconLeft, styles.buttonIconLoading)} />{finalDeletingText}</>
                        : <><Trash size={deleteIconSize} className={styles.buttonIconLeft} />{finalDeleteText}</>
                }</Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
            <AlertDialogHeader>
                <AlertDialogTitle>{title}</AlertDialogTitle>
                <AlertDialogDescription>{description}</AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
                <AlertDialogCancel>{t("general.actions.cancel")}</AlertDialogCancel>
                <AlertDialogAction
                    className={buttonVariants({
                        variant: 'destructive',
                    })}
                    onClick={onDelete}
                >{t("general.actions.delete")}</AlertDialogAction>
            </AlertDialogFooter>
        </AlertDialogContent>
    </AlertDialog>;
}

export default DeleteItemDialog;
