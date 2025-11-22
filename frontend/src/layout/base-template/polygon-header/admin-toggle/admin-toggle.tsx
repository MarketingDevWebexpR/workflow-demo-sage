import React from "react";
import { Cog } from "lucide-react";
import { Button } from "../../../../components/ui/button/button";
import { useAdminSidebarStore } from "../../../../stores/admin-sidebar/store";
import { cn } from "../../../../lib/utils";
import styles from "./admin-toggle.module.scss";


const AdminToggle = React.forwardRef<HTMLButtonElement, React.ComponentPropsWithoutRef<typeof Button>>(({ className, ...props }, ref) => {

    const dispatch = useAdminSidebarStore((state) => state.dispatch);
    const isAdminSidebarOpened = useAdminSidebarStore((state) => state.isAdminSidebarOpened);

    return <Button 
        variant="outline" 
        size="icon" 
        title="Toggle admin panel"
        className={cn(className)} 
        onClick={() => {
            dispatch({
                type: 'SET_IS_ADMIN_SIDEBAR_OPENED',
                payload: !isAdminSidebarOpened,
            });
        }}
        {...props} 
        ref={ref}
    >
        <Cog 
            className={cn(
                styles.adminToggleIcon,
                isAdminSidebarOpened && styles.adminToggleIconOpened
            )} 
        />
        <span className={styles.screenReaderOnly}>Toggle admin panel</span>
    </Button>;
});


export {
    AdminToggle,
};
