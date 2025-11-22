import React from "react";
import * as Portal from '@radix-ui/react-portal';
import { Toaster } from "../../../components/ui/sonner/sonner";
import styles from "./main.module.scss";
import { cn } from "../../../lib/utils";


interface IMain {
    children: React.ReactNode,
    className?: string,
}

const Main = ({
    children,
    className,
}: IMain): React.ReactElement => {

    return <main className={cn(styles.main, className)}>
        { children }
        <Portal.Root>
            <Toaster />
        </Portal.Root>
    </main>
};


export {
    Main,
};
