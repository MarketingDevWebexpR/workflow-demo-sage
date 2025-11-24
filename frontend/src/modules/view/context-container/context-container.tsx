import React from "react";
import ComponentDetails from "./component-details/component-details";
import { cn } from "../../../lib/utils";
import { usePageStore } from "../store/page.store";
import styles from "./context-container.module.scss";


export default function ContextContainer(): React.ReactElement {

    const editedPageId = usePageStore( state => state.editedId );
    const editedComponentId = usePageStore( state => state.editedComponentId );

    return <div className={ cn(
        styles.contextContainer,
        !editedPageId && styles.contextContainerDisabled,
    )}>
    {
        editedComponentId && <ComponentDetails />
    }
    </div>;
}
