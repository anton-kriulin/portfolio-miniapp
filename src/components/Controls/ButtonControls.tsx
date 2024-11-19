'use client'
import { useSession, useControls } from "@/hooks";
import { PressableArea } from "@/components";
import { IControl, IControls } from "@/lib/Types";
import './styles.css'

interface ButtonControlsProps {
    onPress: (control: IControl) => void
    controls: IControls
}

export const ButtonControls = ({onPress, controls}: ButtonControlsProps) => {

    return (
        <div className="controls-row">
            {
                Object.keys(controls).map(control => (
                    <PressableArea
                    
                        key={controls[control].id}
                        onPress={() => onPress(controls[control])}
                        className="controls-button"
                    >
                        <div className="controls-button-icon">{controls[control].icon}</div>
                        <div className="controls-button-name">{controls[control].name}</div>
                    </PressableArea>
                ))
            }
        </div>
    );
}