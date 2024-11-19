'use client'
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { SelectAssetModal, PressableArea, SelectNetworkModal } from "@/components";
import { ApiGetUserAssets } from "@/lib/ApiManager";
import { AssetDto, UserAssetDto, NetworkDto, IOnSelectAssetProps, IControls } from "@/lib/Types";
import { ArrowDownIcon, CloseIcon } from "@/assets/icons";
import { useControls, useSession } from "@/hooks";
import { Config } from "@/lib/Config";
import './styles.css'

interface SelectAssetConrolProps {
    onSelect: ({asset, userAsset}: IOnSelectAssetProps) => void
    onSelectNetwork?: (network: NetworkDto) => void
    onClear: () => void
    onClearNetwork?: () => void
    selectedAsset?: AssetDto
    selectedUserAsset?: UserAssetDto
    selectedNetwork?: NetworkDto
    formError?: string
    allowNewAsset: boolean
    allowChangeNetwork: boolean
}

export const SelectAssetControl = ({
    onSelect, 
    onSelectNetwork, 
    onClear,
    onClearNetwork,
    selectedAsset, 
    selectedUserAsset, 
    selectedNetwork, 
    formError,
    allowNewAsset,
    allowChangeNetwork
}: SelectAssetConrolProps) => {
    const {phrases, dataType, accessToken} = useSession();
    const {assetTypes} = useControls(phrases);

    const [showAssetModal, setShowAssetModal] = useState<boolean>(false);
    const [showNetworkModal, setShowNetworkModal] = useState<boolean>(false);

    const fetchAction = async () => {
        if(!accessToken) { return }
        if(dataType !== "demo" && dataType !== "user") { return }

        return await ApiGetUserAssets(accessToken, dataType);
    }

    const { data: userAssets, error, isPending, isRefetching } = useQuery({
        queryKey: ['userAssets'],
        queryFn: fetchAction,
        enabled: Boolean(accessToken),
        staleTime: Config.assetsStaleTime,
    });

    let controlsList: IControls = (userAssets && userAssets.length > 0) ? { userAssets: assetTypes.userAssets } : {};

    if(allowNewAsset === true) {
        controlsList = {...controlsList, crypto: assetTypes.crypto, fiat: assetTypes.fiat};
    }

    const showNetwork = 
        (allowNewAsset === true && onSelectNetwork && onClearNetwork) && 
        (
            (selectedAsset?.networks && selectedAsset?.networks.length > 0 ) || 
            (selectedUserAsset?.asset?.networks && selectedUserAsset?.asset?.networks.length > 0)
        );

    const handleSelectAsset = ({asset, userAsset}: IOnSelectAssetProps) => {
        setShowAssetModal(false)
        onSelect({asset, userAsset})
    }
    const handleSelectNetwork = (network: NetworkDto) => {
        if(!onSelectNetwork) { return }
        
        setShowNetworkModal(false)
        onSelectNetwork(network)
    }

    const handleShowAssetModal = () => {
        setShowAssetModal(true)
    }

    const handleShowNetworkModal = () => {
        setShowNetworkModal(true)
    }

    const onOpenChange = (open: boolean) => {
        if(!open) { 
            setShowNetworkModal(open)
        }
    }

    return (
        <div className="select-asset-control-container">
            <div className="select-asset-control-row select-asset-control-select">
                <div
                    className="pressable-area"
                    onClick={handleShowAssetModal}
                >
                    <SelectAssetModal
                        open={showAssetModal}
                        controlsList={controlsList}
                        onSelect={handleSelectAsset}
                        asset={selectedAsset}
                        userAsset={selectedUserAsset}
                    />
                </div>
                {
                    (selectedAsset || selectedUserAsset) &&
                        <div className="select-asset-control-right-block">
                            <PressableArea
                                className="select-asset-control-icon-button pressable-icon"
                                onPress={onClear}
                            >
                                <CloseIcon size={26} />
                            </PressableArea>
                        </div>
                }
            </div>
            {formError && <div className="message-error">{formError}</div>}
            {
                (
                    (allowChangeNetwork && showNetwork) 
                    || (selectedAsset?.networks && selectedAsset?.networks.length > 0 && !selectedUserAsset)
                ) &&
                    <div className="select-asset-control-row select-asset-control-select">
                        <div
                            className="pressable-area"
                            onClick={handleShowNetworkModal}
                        >
                            <SelectNetworkModal
                                onOpenChange={onOpenChange}
                                open={showNetworkModal}
                                onSelect={handleSelectNetwork}
                                selectedNetwork={selectedNetwork}
                                networks={selectedAsset?.networks ?? selectedUserAsset?.asset?.networks} 
                            />
                        </div>
                        {
                            selectedNetwork &&
                                <div className="select-asset-control-right-block">
                                    <PressableArea
                                        className="select-asset-control-icon-button pressable-icon"
                                        onPress={onClearNetwork}
                                    >
                                        <CloseIcon size={26} />
                                    </PressableArea>
                                </div>
                        }
                        
                    </div>
            }
        </div>
    );
}

