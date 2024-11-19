import { memo } from 'react';
import { PressableArea, Text } from '@/components';
import { PhraseDto } from '@/lib/Types';
import './styles.css'

interface FetchErrorProps {
    containerType?: "center" | "flex" | "flex-center",
    phrases: PhraseDto
    refreshAction: () => void 
}

export const FetchError = memo(({ phrases, containerType = "center", refreshAction }: FetchErrorProps) => {
    if(containerType == "center") {
        return (
            <div className="fetch-error-container-fixed-center">
                <Text>{phrases.somethingWrong}</Text>
                <PressableArea onPress={refreshAction}>
                    <Text>{phrases.refresh}</Text>
                </PressableArea>
            </div>
        );
    }
    if(containerType == "flex") {
        return (
            <div className="fetch-error-container-flex">
                <Text>{phrases.somethingWrong}</Text>
                <PressableArea onPress={refreshAction}>
                    <Text>{phrases.refresh}</Text>
                </PressableArea>
            </div>
        );
    }
})

FetchError.displayName = "FetchError";