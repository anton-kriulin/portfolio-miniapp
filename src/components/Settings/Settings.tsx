'use client'
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { initCloudStorage } from '@telegram-apps/sdk-react';
import Select from '@mui/joy/Select';
import Option from '@mui/joy/Option';
import { useControls, useSession } from '@/hooks';
import { IParams, IUserOptionsFormData } from '@/lib/Types';
import { Config } from '@/lib/Config';
import { ApiSetUserOptions } from '@/lib/ApiManager';
import { VisibleSpinner } from '@/components';
import './styles.css'

export const Settings = () => {
    const {accessToken, telegramId, language, mainScreen, phrases, setLanguage, dataType, setDataType} = useSession();
    const {assetTypes, languages, dataTypes} = useControls(phrases);

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
                if(variables.language) { await cloudStorage.set('language', variables.language) }
                if(variables.main_screen) { await cloudStorage.set('mainScreen', variables.main_screen) }
                if(variables.data_type) { await cloudStorage.set('dataType', variables.data_type) }
            }
            setCloudOptions();
            queryClient.invalidateQueries({ queryKey: ["userOptions", telegramId] })
            if(variables.data_type) {
                queryClient.resetQueries({ queryKey: ["transactions"] })
                queryClient.resetQueries({ queryKey: ["userAssets"] })
                queryClient.resetQueries({ queryKey: ["assets"] })
            }
        },
        onError(error, variables) {
            //todo: error handling
            alert(error)
            if(variables.action == "set-language") {
                /* setSelectedLanguage(variables.language) */
            }
            if(variables.action == "set-mainscreen") {
                /* setSelectedMainScreen() */
            }
        }
    });

    const handleLanguageChange = async (
        event: React.SyntheticEvent | null,
        newValue: string | null,
    ) => {
        if(!newValue || !setLanguage) { return }
        setLanguage(newValue);
        editOptionsMutation.mutate({language: newValue, action: "set-language"});
    };

    const handleMainScreenChange = async (
        event: React.SyntheticEvent | null,
        newValue: string | null,
    ) => {
        if(!newValue) { return }
        editOptionsMutation.mutate({main_screen: newValue, action: "set-main-screen"});
    };

    const handleDataTypeChange = async (
        event: React.SyntheticEvent | null,
        newValue: string | null,
    ) => {
        if(!newValue || !setDataType) { return }
        if(newValue !== "demo" && newValue !== "user") { return }
        
        setDataType(newValue);
        editOptionsMutation.mutate({data_type: newValue, action: "set-data-type"});
    };

    if(!language || !mainScreen) { return (<VisibleSpinner containerType="center" />) }

    return (
        <div className="workarea settings-container">
            <div className="settings-row">
                <div className="settings-row-title">{phrases.language}</div>
                <div className="settings-row-dropdown">
                    <Select
                        className="primary-dropdown"
                        defaultValue={language}
                        variant="soft"
                        color="neutral"
                        slotProps={Config.slots.Select}
                        onChange={handleLanguageChange}
                    >
                        {
                            Object.keys(languages).map(item => (
                                <Option
                                    key={languages[item].id}
                                    value={languages[item].code}
                                >
                                    {languages[item].name}
                                </Option>
                            ))
                        }
                    </Select>
                </div>
            </div>
            <div className="settings-row">
                <div className="settings-row-title">{phrases.mainScreen}</div>
                <div className="settings-row-dropdown">
                    <Select
                        className="primary-dropdown"
                        defaultValue={mainScreen}
                        variant="soft"
                        color="neutral"
                        slotProps={Config.slots.Select}
                        onChange={handleMainScreenChange}
                    >
                        {
                            Object.keys(assetTypes).map(type => (
                                <Option
                                    key={assetTypes[type].id}
                                    value={assetTypes[type].code}
                                >
                                    {assetTypes[type].name}
                                </Option>
                            ))
                        }
                    </Select>
                </div>
            </div>
            <div className="settings-row">
                <div className="settings-row-title">{phrases.data}</div>
                <div className="settings-row-dropdown">
                    <Select
                        className="primary-dropdown"
                        defaultValue={dataType}
                        variant="soft"
                        color="neutral"
                        slotProps={Config.slots.Select}
                        onChange={handleDataTypeChange}
                    >
                        {
                            Object.keys(dataTypes).map(type => (
                                <Option
                                    key={dataTypes[type].id}
                                    value={dataTypes[type].code}
                                >
                                    {dataTypes[type].name}
                                </Option>
                            ))
                        }
                    </Select>
                </div>
            </div>
        </div>
    );
}