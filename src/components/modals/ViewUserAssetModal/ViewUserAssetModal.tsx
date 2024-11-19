'use client'
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { postEvent, on } from "@telegram-apps/sdk-react";
import { Modal } from "@telegram-apps/telegram-ui";
import { ButtonControls, PressableArea, AddUserAssetModal, UserAssetRow} from "@/components";
import { CloseIcon, CommentIcon, SpinnerIcon } from "@/assets/icons";
import { IControl, UserAssetDto } from "@/lib/Types";
import { ApiDeleteUserAsset } from "@/lib/ApiManager";
import { useSession, useControls } from "@/hooks";
import { numberToStringWithSymbol } from "@/lib/Utils";
import './styles.css';
import Image from "next/image";

interface ViewUserAssetModalProps {
    userAsset?: UserAssetDto
    open?: boolean
    onCloseModal: () => void
    onUpdated: () => void
}

export const ViewUserAssetModal = ({ open, userAsset, onCloseModal, onUpdated }: ViewUserAssetModalProps) => {
    const {accessToken, phrases, language} = useSession();
    const {userAssetControls} = useControls(phrases);

    const [showModal, setShowModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState<boolean>(false);
    const [deletePressed, setDeletePressed] = useState<boolean>(false);

    /* const router = useRouter(); */
    const queryClient = useQueryClient();
    
    const deleteButtonListener = on("popup_closed",
        ({ button_id }) => {
            if(button_id && button_id === "delete") { setDeletePressed(true) }
        }, true
    );

    const handlePress = (control: IControl) => {
        if(!userAsset) { return }
        switch(control.code) {
            case "edit": {
                setShowEditModal(true);
                break;
            }
            case "delete": {
                postEvent("web_app_open_popup", {
                    title: phrases.deleteUserAssetConfirmationTitle,
                    message: phrases.deleteUserAssetConfirmationMessage,
                    buttons: [
                        {
                            id: "delete",
                            type: "destructive",
                            text: phrases.deleteUserAsset
                        },
                        {
                            id: "cancel",
                            type: "default",
                            text: phrases.cancel
                        }
                    ]
                });
                
                break;
            }
        }
    }

    const deleteAction = async () => {
        //todo: errorHandling
		if(!accessToken) { return }
        if(!userAsset || !userAsset.id) { return } 

		return await ApiDeleteUserAsset(accessToken, userAsset.id)
	}

    const deleteMutation = useMutation({
        mutationFn: deleteAction,
        onSuccess() {
            setShowModal(false);
            onCloseModal();
            queryClient.resetQueries({ queryKey: ["userAssets"] });
            queryClient.resetQueries({ queryKey: ["transactions"] });
            queryClient.resetQueries({ queryKey: ["balanceHistory"] });
            onUpdated();
        },
    });

    const onCloseEditModal = () => {
        setShowEditModal(false);
    }

    useEffect(() => {
        if(!deletePressed) { return }
        deleteMutation.mutate();
        setDeletePressed(false);
    }, [deletePressed]);

    useEffect(() => {
        if(open === undefined) { return }
        setShowModal(open)
    }, [open]);

    useEffect(() => {
        if(!onCloseModal || showModal) { return }
        onCloseModal() 
    }, [showModal]);

    if(userAsset)
    return (
        <>
            <Modal
                nested={true}
                open={showModal}
                dismissible={true}
                onOpenChange={setShowModal}
                header={
                    <div className="modal-header">
                        <div className="modal-header-row">
                            <div className="modal-header-row-close-button">
                                <PressableArea onPress={onCloseModal} className="pressable-icon">
                                    <CloseIcon size="26" />
                                </PressableArea>
                            </div>
                        </div>
                    </div>
                }
            >
                <div className="modal-workarea">
                    <div className="view-transaction-modal-column">
                        <div className="view-transaction-modal-row">
                            <div className="view-transaction-modal-card">
                                <UserAssetRow 
                                    userAsset={userAsset}
                                    compact={false}
                                />
                            </div>
                        </div>
                            
                        <div className="view-user-asset-modal-row">
                            <ButtonControls
                                controls={userAssetControls}
                                onPress={handlePress}
                            />
                        </div>
                    </div>
                </div>
            </Modal>
            <AddUserAssetModal userAsset={userAsset} open={showEditModal} onCloseModal={onCloseEditModal} />
        </>
        
    );
}