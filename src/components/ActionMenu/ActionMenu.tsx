'use client'
import { Modal } from "@telegram-apps/telegram-ui";
import { Button } from "@nextui-org/button";
import { AddUserAssetModal, PressableArea } from '@/components';
import { AddIcon, CloseIcon } from '@/assets/icons';
import { Config } from '@/lib/Config';
import { useControls, useSession } from '@/hooks';
import './styles.css'
import { IControl } from "@/lib/Types";
import { useRouter } from "next/navigation";
import { useState } from "react";

export const ActionMenu = () => {
    const {phrases} = useSession()
    const {transactionTypes} = useControls(phrases);
    const router = useRouter();

    const [showActionModal, setShowActionModal] = useState<boolean>(false);
    const [showAdjustmentModal, setShowAdjustmentModal] = useState<boolean>(false);

    const onPress = (type: IControl) => {
        if(!type) { return }

        if(type.code === "adjustment") {
            setShowActionModal(false);
            setShowAdjustmentModal(true);
        } else {
            router.push(`/transactions/edit?type=${type.code}`)
        }
    }

    const handleShowActionModal = () => {
        setShowActionModal(true);
    }

    return (
        <div className="action-menu">
            <Modal
                open={showActionModal}
                onOpenChange={setShowActionModal}
                header={
                    <div className="modal-header">
                        <div className="modal-header-row">
                            <div className="modal-header-row-close-button">
                                <Modal.Close>
                                    <Button className="pressable-icon">
                                        <CloseIcon size="26" />
                                    </Button>
                                </Modal.Close>
                            </div>
                        </div>
                    </div>
                }
                nested={true}
                trigger={
                    <div className="action-button">
                        <PressableArea onPress={handleShowActionModal} className="pressable-area">
                            <AddIcon className="primary-icon-button" color={Config.colors.PrimaryText} />
                        </PressableArea>
                    </div>
                }
            >
                <div className="action-menu-container">
                    <div className="action-menu-list">
                        {
                            Object.keys(transactionTypes).map(type => (
                                <div key={type} >
                                    <PressableArea
                                        onPress={() => onPress(transactionTypes[type])}
                                    >
                                        <div className="action-menu-row">
                                            <div className="action-menu-row-logo">
                                                {transactionTypes[type].icon}
                                            </div>
                                            <div className="action-menu-row-name">
                                                {transactionTypes[type].name}
                                            </div>
                                        </div>
                                    </PressableArea>
                                </div>
                            ))
                        }
                    </div>
                </div>
            </Modal>
            <AddUserAssetModal
                onCloseModal={() => setShowAdjustmentModal(false)}
                open={showAdjustmentModal}
            />
        </div>
    );
}