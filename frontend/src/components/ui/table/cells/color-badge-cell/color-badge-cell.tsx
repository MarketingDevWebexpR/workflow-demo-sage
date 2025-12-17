import { ColorBadge, type TColorBadgeProps } from "../../../color-badge/color-badge";
import { COLOR_SCHEMES } from "@/models/misc/color.model";
import styles from "./color-badge-cell.module.scss";
import { Badge } from "../../../badge/badge";


type TColorBadgeCellProps = Partial<TColorBadgeProps>;

function ColorBadgeCell({
    colorScheme,
    label,
}: TColorBadgeCellProps) {

    const getRandomKey = (obj: Record<string, any>) => {
        return Object.keys(obj)[Math.floor(Math.random() * Object.keys(obj).length)];
    };

    const getRandomHardcodedValue = (obj: Record<string, any>) => {
        return obj[getRandomKey(obj)];
    };

    return label ? <ColorBadge
        className={styles.colorBadgeCell}
        colorScheme={colorScheme || getRandomHardcodedValue(COLOR_SCHEMES)}
        label={label}
    /> : <Badge
        className={styles.colorBadgeCell}
        text={undefined}
        fallbackText="No category"
    />;
}


export {
    ColorBadgeCell
};