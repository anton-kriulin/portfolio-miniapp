import { memo } from "react"

interface ViewProps {
    children?: React.ReactNode
    className?: string
}

export const View = memo(function ({children, className}: ViewProps) {
    return (
        <div className={className || ""}>{children || ""}</div>
    );
})

View.displayName = "View";
