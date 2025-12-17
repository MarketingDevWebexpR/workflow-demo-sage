/**
 * ProgressionBar component stub.
 * TODO: Implement actual progression bar functionality.
 */

export interface ProgressionBarProps {
    /** Progress bar identifier */
    id?: number;
    /** Event namespaces to listen to for progress updates */
    expectedEventNamespaces?: readonly string[];
    /** Current progress value (0-100) */
    value?: number;
    /** Optional CSS class name */
    className?: string;
    /** Whether to show the percentage label */
    showLabel?: boolean;
}

/**
 * Displays a progress bar with an optional label.
 */
export function ProgressionBar({
    value = 0,
    className,
    showLabel = false,
}: ProgressionBarProps) {
    const clampedValue = Math.max(0, Math.min(100, value));

    return (
        <div className={className}>
            <div
                style={{
                    width: "100%",
                    height: "8px",
                    backgroundColor: "#e0e0e0",
                    borderRadius: "4px",
                    overflow: "hidden",
                }}
            >
                <div
                    style={{
                        width: `${clampedValue}%`,
                        height: "100%",
                        backgroundColor: "#3b82f6",
                        transition: "width 0.3s ease-in-out",
                    }}
                />
            </div>
            {showLabel && (
                <span style={{ fontSize: "12px", marginTop: "4px" }}>
                    {clampedValue}%
                </span>
            )}
        </div>
    );
}

export default ProgressionBar;
