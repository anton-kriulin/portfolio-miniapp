import { ReactNode, memo } from "react";
import { Button } from "@telegram-apps/telegram-ui";
import './styles.css'

interface PressableAreaProps {
    onPress?: (value: any) => void
    value?: any
    children: ReactNode
    className?: string
}

export const PressableArea = memo(function ({ onPress, className, value, children }: PressableAreaProps) {
    const handleClick = () => {
        onPress && onPress(value)
    }

    return (
        <Button
            className={className ? "pressable-area " + className : "pressable-area"}
            mode="plain"
            onClick={handleClick}
        >
            {children}
        </Button>
    );
})

PressableArea.displayName = "PressableArea";