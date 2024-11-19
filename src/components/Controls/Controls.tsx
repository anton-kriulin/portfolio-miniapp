import { SegmentedControl } from '@telegram-apps/telegram-ui';
import { IControl, IControls } from '@/lib/Types';
import './styles.css'

interface IControlsProps {
    className?: string
    classNameContainer?: string
    controlsList: IControls
    currentControl: IControl
    onSelect: (control: IControl) => void
}

export const Controls = ({controlsList, currentControl, onSelect, className,classNameContainer}: IControlsProps) => {

    return (
        <div 
            {
                ...classNameContainer ? {className: classNameContainer} : {className: "controls-container"}
            }
        >
            <SegmentedControl
                {
                    ...className ? {className: "controls " + className} : {className: "controls"}
                }
            >
                {
                    Object.keys(controlsList).map(control => (
                        <SegmentedControl.Item
                            key={controlsList[control].id}
                            type="button"
                            onClick={() => onSelect(controlsList[control])}
                            {
                                ...currentControl.id == controlsList[control].id ? {className: "selected-control"} : {className: "control"}
                            }
                    >
                            {controlsList[control].name}
                        </SegmentedControl.Item>
                    ))
                }
            </SegmentedControl>
        </div>
        
    );
}