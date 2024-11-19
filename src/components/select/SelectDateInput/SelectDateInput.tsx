'use client'
import { useState, forwardRef, RefObject } from "react";
import { Dayjs } from 'dayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { PhraseDto } from "@/lib/Types";
import { CalendarIcon } from "@/assets/icons";
import { PressableArea } from "@/components/primitives/PressableArea/PressableArea";
import './styles.css'

interface SelectDateInputProps {
    language?: string
    phrases: PhraseDto
    onDatePicked: (value: Dayjs | null) => void
}
export const SelectDateInput = forwardRef<HTMLInputElement, SelectDateInputProps>((
    {language, phrases, onDatePicked}, ref
) => {
    const [showDatePicker, setShowDatePicker] = useState(false);

    const handleClick = () => {
        setShowDatePicker(true)
    }

    const DateInput = () => {
        return (
            <div className="date-input-container">
                <input
                    ref={ref}
                    className="primary-input"
                    type="text"
                    placeholder={phrases.date}
                    defaultValue={new Date().toLocaleDateString(language, {
                        year: "numeric",
                        month: "2-digit",
                        day: "2-digit",
                    })}
                    onClick={handleClick}
                />
                <PressableArea
                    className="date-input-right-block pressable-icon"
                    onPress={handleClick}
                >
                    <CalendarIcon size={26} />
                </PressableArea>
            </div>
        )
    }

    return (
        <DatePicker
            format={language == "ru" ? "DD.MM.YYYY" : "MM/DD/YYYY"}
            open={showDatePicker}
            onAccept={(value) => onDatePicked(value)}
            onClose={() => setShowDatePicker(false)}
            slots={{textField: DateInput}}
            closeOnSelect
            slotProps={{
                    /* textField: {
                        ref,
                        InputProps: {
                            inputProps: {
                                component: DateInput,
                                ref,
                                language,
                                phrases,
                                handleClick,
                            }
                        }
                    }, */
                    layout: {
                        sx: { pointerEvents: "auto" }
                    },
                    actionBar: {
                        actions: ['today'],
                    },
                    /* textField: {
                        sx :{
                        }
                    }, */
            }}
        />
    );
})
SelectDateInput.displayName = "SelectDateInput";

/* export const DateInput = ({language, phrases, handleClick, ref}: DateInputProps) => {
    if(phrases)
    return (
        <div className="date-input-container">
            <input
                ref={ref}
                className="primary-input"
                type="text"
                placeholder={phrases.date}
                defaultValue={new Date().toLocaleDateString(language, {
                    year: "numeric",
                    month: "2-digit",
                    day: "2-digit",
                })}
                onClick={handleClick}
            />
            <PressableArea
                className="date-input-right-block pressable-icon"
                onPress={handleClick}
            >
                <CalendarIcon size={26} />
            </PressableArea>
        </div>
    )
}

interface DateInputProps {
    language?: string
    phrases?: PhraseDto
    handleClick?: () => void
    ref?: RefObject<HTMLInputElement>
} */

/*     function DateInput () {
        return (
            <div className="date-input-container">
                <input
                    ref={ref}
                    className="primary-input"
                    type="text"
                    placeholder={phrases.date}
                    defaultValue={new Date().toLocaleDateString(language, {
                        year: "numeric",
                        month: "2-digit",
                        day: "2-digit",
                    })}
                    onClick={handleClick}
                />
                <PressableArea
                    className="date-input-right-block pressable-icon"
                    onPress={handleClick}
                >
                    <CalendarIcon size={26} />
                </PressableArea>
            </div>
        )
    }
    DateInput.displayName = "DateInput"; */