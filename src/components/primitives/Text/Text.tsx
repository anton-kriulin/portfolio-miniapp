import { memo } from "react"
interface TextProps {
    children?: React.ReactNode
    className?: string
}

export const Text = memo(function ({children, className}: TextProps) {
    return (
        <span className={className || ""}>{children || ""}</span>
    );
})

Text.displayName = "Text";