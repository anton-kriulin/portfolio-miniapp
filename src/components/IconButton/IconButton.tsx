import { Button } from "@nextui-org/button";

interface IconButtonProps {
    children: React.ReactNode
    type?: 'button' | 'submit' | 'reset'
    size?: string
    className?: string
    onPress?: () => void
}

export const IconButton = ( { children, onPress, type = 'button', size = "26", className}: IconButtonProps ) => {
    return (
        <Button
            onPress={() => {
                if(onPress) { onPress() }
            }}
            fullWidth={false} 
            type={type}
            isIconOnly 
            className="primary-icon-button" 
            disableRipple={true}
        >
                {children}
        </Button>
    );
}