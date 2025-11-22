export const complexCSSPositioning = `[class*="workflowTooltip_"][data-position="LEFT"] {

    left: calc((var(--hovered-map-point-x) + (2 - (1 - var(--axis-offset)))) * (1px * var(--x-coefficient)) -
                    /* + devient - */
                    var(--tooltip-connector-border-width-base) -
                    /* + devient - */
                    2.07107px - 1px * var(--x-coefficient) / 2 + 1px * (var(--hovered-map-point-x) * 2 + (3 - (2 * (1 - var(--axis-offset))))) * var(--y-axis-thickness) / 2 -
                    /* + devient - */
                    1px * var(--item-width) / 2 -
                    /* + devient - */
                    1px * var(--distance-between-item-and-tooltip) - min(1px * var(--tooltip-width-based-on-ghost) +
                        /* nouveau */
                        2 * var(--interspace, var(--spacing-4))
                        /* nouveau */
                        ,
                        var(--tooltip-max-width)));
}

[class*="workflowFormBox_"][data-position="LEFT"] {

    left: calc((var(--hovered-map-point-x) + (2 - (1 - var(--axis-offset)))) * (1px * var(--x-coefficient)) -
                    /* + devient - */
                    var(--tooltip-connector-border-width-base) -
                    /* + devient - */
                    2.07107px - 1px * var(--x-coefficient) / 2 + 1px * (var(--hovered-map-point-x) * 2 + (3 - (2 * (1 - var(--axis-offset))))) * var(--y-axis-thickness) / 2 -
                    /* + devient - */
                    1px * var(--item-width) / 2 -
                    /* + devient - */
                    1px * var(--distance-between-item-and-tooltip) - min(1px * var(--tooltip-width-based-on-ghost) +
                        /* nouveau */
                        2 * var(--interspace, var(--spacing-4))
                        /* nouveau */
                        ,
                        var(--tooltip-max-width)));
}`;
