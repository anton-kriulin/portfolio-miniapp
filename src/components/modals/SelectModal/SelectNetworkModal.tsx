'use client'
import { useEffect, useState } from "react";
import { Modal } from "@telegram-apps/telegram-ui";
import { SelectNetworkInput, NetworksList, PressableArea } from "@/components";
import { NetworkDto } from "@/lib/Types";
import { ArrowDownIcon, CloseIcon } from "@/assets/icons";
import './styles.css';

interface ISelectNetworkModalProps {
    networks?: NetworkDto[]
    selectedNetwork?: NetworkDto
    onSelect: (network: NetworkDto) => void
    open: boolean
    onOpenChange: (open: boolean) => void
}

export const SelectNetworkModal = ({ networks, selectedNetwork, onSelect, open, onOpenChange }: ISelectNetworkModalProps) => {
    

    const [showModal, setShowModal] = useState<boolean>(false);

    const handleShowModal = () => {
        setShowModal(true)
    }

    const handleCloseModal = () => {
        setShowModal(false)
    }

    const handleSelectNetwork = (network: NetworkDto) => {
        setShowModal(false)
        onSelect(network)
    }

    useEffect(() => {
        if(open === undefined) { return }
        setShowModal(open)
    }, [open]);
    
    if(!networks) { return }

    return (
        <Modal
            onOpenChange={onOpenChange}
            header={
                <div className="modal-header">
                    <div className="modal-header-row">
                        <div className="modal-header-row-close-button">
                            <PressableArea
                                onPress={handleCloseModal}
                                className="pressable-icon"
                            >
                                <CloseIcon size="26" />
                            </PressableArea>
                        </div>
                    </div>
                </div>
            }
            open={showModal}
            nested={true}
            trigger={
                <a className="pressable-area">
                    <div className="select-modal-input">
                        <PressableArea
                            onPress={handleShowModal}
                        >
                            <SelectNetworkInput selectedNetwork={selectedNetwork} />
                            {
                                !selectedNetwork &&
                                    <div className="select-modal-input-right-block pressable-icon">
                                        <ArrowDownIcon size={26} />
                                    </div>
                            }
                        </PressableArea>
                    </div>
                </a>
            }
        >
            <div className="select-network-modal-workarea">
                <div className="select-network-modal-container-assets-list">
                    <NetworksList networks={networks} onSelect={handleSelectNetwork} />
                </div>
            </div>
        </Modal>
    );
}
