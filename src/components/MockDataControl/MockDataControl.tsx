'use client'
import { PressableArea, Text, View } from '@/components';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { initCloudStorage } from '@telegram-apps/sdk-react';
import { IParams, IUserOptionsFormData } from '@/lib/Types';
import { ApiSetUserOptions } from '@/lib/ApiManager';
import { useSession } from '@/hooks';
/* import { styles } from './styles'; */
import './styles.css'

interface MockDataControlProps {
    dataType?: string
}

export const MockDataControl = ({}: MockDataControlProps) => {
    const {phrases, accessToken, telegramId, dataType, setDataType} = useSession();
    const queryClient = useQueryClient();

    const editOptionsAction = async (data: IUserOptionsFormData) => {
        if(!accessToken) { return }

        return await ApiSetUserOptions(accessToken, data as IParams)
    }

    const editOptionsMutation = useMutation({
        mutationFn: (data: IUserOptionsFormData) => editOptionsAction(data),
        onSuccess(data, variables) {
            const cloudStorage = initCloudStorage();
            const setCloudOptions = async () => {
                if(variables.data_type) { await cloudStorage.set('dataType', variables.data_type) }
            }
            setCloudOptions();
            
            if(variables.data_type) {
                queryClient.invalidateQueries({ queryKey: ["userOptions", telegramId] })
                queryClient.resetQueries({ queryKey: ["transactions"] })
                queryClient.resetQueries({ queryKey: ["userAssets"] })
                queryClient.resetQueries({ queryKey: ["assets"] })
                queryClient.resetQueries({ queryKey: ["balanceHistory"] })
            }
        },
        onError(error, variables) {
            //todo: error handling
            alert(error)
        }
    });

    const handleDataTypeChange = async () => {
        if(!setDataType) { return }
        setDataType("user");
        editOptionsMutation.mutate({data_type: "user", action: "set-data-type"});
    };

    if(dataType === "demo")
    return (
        <>
            {/* <style jsx>{styles}</style> */}
            <View className="mock-data-control">
                <View className="mock-data-control-row">
                    <Text>{phrases.hideDemoData}</Text>
                    <PressableArea
                        onPress={handleDataTypeChange}
                        className="mock-data-control-button"
                    >
                        <Text>{phrases.hide}</Text>
                    </PressableArea>
                </View>
            </View>
        </>
        
    );
}



