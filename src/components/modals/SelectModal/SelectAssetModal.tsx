'use client'
import { useState, useEffect } from "react";
import { Button } from "@nextui-org/button";
import { Modal } from "@telegram-apps/telegram-ui";
import { SelectAssetInput, AssetsList, UserAssetsList, SearchInput, Controls, PressableArea } from "@/components";
import { AssetDto, IControl, IControls, ISearchFormData, UserAssetDto } from "@/lib/Types";
import { useSession, useControls } from "@/hooks";
import { ArrowDownIcon, CloseIcon } from "@/assets/icons";
import './styles.css';

interface ISelectAssetModalProps {
    asset?: AssetDto,
    userAsset?: UserAssetDto
    onSelect: ({ asset, userAsset }: IonSelectProps) => void
    controlsList: IControls
    open: boolean
}

interface IonSelectProps {
    asset?: AssetDto
    userAsset?: UserAssetDto
}

export const SelectAssetModal = ({ asset, userAsset, onSelect, controlsList, open }: ISelectAssetModalProps) => {
    const {phrases} = useSession();
    const {assetTypes} = useControls(phrases);

    const [assetType, setAssetType] = useState<IControl>(controlsList[Object.keys(controlsList)[0]]);
    const [search, setSearch] = useState<string>("");
    const [showModal, setShowModal] = useState<boolean>(false);
    
    const onOpenChange = (open: boolean) => {
        if(!open) { 
            setShowModal(open)
            onClearSearch() 
        }
    }

    const onClearSearch = () => {
        setSearch("");
    }

    const onSubmit = (data: ISearchFormData) => {
        setSearch(data.search);
    }

    const handleSelectUserAsset = (userAsset: UserAssetDto) => {
        setShowModal(false);
        onSelect({ userAsset });
    }

    const handleSelectAsset = (asset: AssetDto) => {
        setShowModal(false);
        onSelect({ asset })
    }

    const handleShowModal = () => {
        setShowModal(true)
    }

    const handleCloseModal = () => {
        setShowModal(false)
    }

    useEffect(() => {
        if(open === undefined) { return }
        setShowModal(open)
    }, [open]);

    return (
        <Modal
            onOpenChange={onOpenChange}
            open={showModal}
            header={
                <div className="modal-header">
                    <div className="modal-header-row">
                        <Controls
                            className="select-asset-modal-controls"
                            controlsList={controlsList}
                            currentControl={assetType}
                            onSelect={type => setAssetType(type)}
                        />
                        <div className="modal-header-row-close-button">
                            <PressableArea
                                onPress={handleCloseModal}
                                className="pressable-icon"
                            >
                                <CloseIcon size="26" />
                            </PressableArea>
                        </div>
                    </div>
                    <div className="modal-header-row">
                        <SearchInput onSubmit={onSubmit} onClear={onClearSearch} />
                    </div>
                </div>
            }
            nested={true}
            trigger={
                <a className="pressable-area">
                    <div className="select-modal-input">
                        <PressableArea
                            onPress={handleShowModal}
                        >
                            <SelectAssetInput selectedAsset={asset} selectedUserAsset={userAsset} />
                            {
                                (!userAsset && !asset) &&
                                    <div className="select-modal-input-right-block pressable-icon">
                                        <ArrowDownIcon size={26} />
                                    </div>
                            }
                        </PressableArea>
                        
                    </div>
                    
                </a>
            }
        >
            <div className="select-asset-modal-workarea">
                {
                    (assetType && assetType.id === assetTypes.userAssets.id) &&
                        <div className="select-asset-modal-container-assets-list">
                            <UserAssetsList 
                                onSelect={handleSelectUserAsset} 
                                type="select" 
                                search={search}
                            />
                        </div>
                }
                {
                    (assetType && (assetType.id === assetTypes.crypto.id || assetType.id === assetTypes.fiat.id)) &&
                        <div className="select-asset-modal-container-assets-list">
                            <AssetsList
                                onSelect={handleSelectAsset}
                                assetsType={assetType}
                                type="select"
                                search={search}
                            />
                        </div>
                }
            </div>
        </Modal>
    );
}
