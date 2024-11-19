import { View, Text } from "@/components";
import { PhraseDto } from "@/lib/Types"
import './styles.css'

export const EmptyError = ({phrases}: {phrases: PhraseDto}) => {
    return (
        <>
            <View className="empty-error">
                <Text>{phrases.addNewAsset}</Text>
            </View>
        </>
    );
}