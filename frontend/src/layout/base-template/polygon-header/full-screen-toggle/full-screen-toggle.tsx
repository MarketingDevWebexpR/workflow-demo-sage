import React, { useContext } from "react";
import { Expand, Shrink } from "lucide-react";
import { Button } from "../../../../components/ui/button/button";
import { AppFullScreenContext, type AppFullScreenContextType } from "../../../../contexts/app-full-screen-context";
import { cn } from "../../../../lib/utils";
import styles from "./full-screen-toggle.module.scss";


const FullScreenToggle = React.forwardRef<HTMLButtonElement, React.ComponentPropsWithoutRef<typeof Button>>(({ className, ...props }, ref) => {

    const [isFullScreen, setIsFullScreen] = useContext(AppFullScreenContext) as AppFullScreenContextType;

    return <Button
        variant="outline"
        size="icon"
        title={isFullScreen ? 'Exit fullscreen' : 'Enter fullscreen'}
        className={cn(className)}
        onClick={() => {
            setIsFullScreen(!isFullScreen);
        }}
        {...props}
        ref={ref}
    >
        {isFullScreen
            ? <Shrink className={styles.fullScreenToggleIcon} />
            : <Expand className={styles.fullScreenToggleIcon} />
        }
        <span className={styles.screenReaderOnly}>
            {isFullScreen ? 'Exit fullscreen' : 'Enter fullscreen'}
        </span>
    </Button>;
});


export {
    FullScreenToggle,
};
