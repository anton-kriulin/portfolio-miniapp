'use client'
import { useState, useEffect, ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { Button } from "@nextui-org/button";
import { Modal } from "@telegram-apps/telegram-ui";
import { ButtonControls, PressableArea, TransactionUserAssetRow } from "@/components";
import { CloseIcon, CommentIcon, SpinnerIcon } from "@/assets/icons";
import { TransactionDto, IControl } from "@/lib/Types";
import { ApiDeleteUserTransactions } from "@/lib/ApiManager";
import { useSession, useControls } from "@/hooks";
import { numberToStringWithSymbol } from "@/lib/Utils";
import './styles.css';

interface ViewTransactionModalProps {
    transaction?: TransactionDto
    open?: boolean
    onCloseModal: () => void
    onUpdated?: () => void
}

export const ViewTransactionModal = ({ open, transaction, onCloseModal, onUpdated }: ViewTransactionModalProps) => {
    const {accessToken, phrases, language} = useSession();
    const {transactionControls, transactionTypes} = useControls(phrases);

    const router = useRouter();
    const queryClient = useQueryClient();

    const [showModal, setShowModal] = useState(false);

    const handlePress = (control: IControl) => {
        if(!transaction) { return }
        switch(control.code) {
            case "edit": {
                router.push(`/transactions/edit?id=${transaction.id}`)
                break;
            }
            case "delete": {
                deleteMutation.mutate();
                break;
            }
        }
    }

    const deleteAction = async () => {
        //todo: errorHandling
		if(!accessToken) { return }
        if(!transaction) { return } 

		return await ApiDeleteUserTransactions(accessToken, [Number(transaction.id)])
	}

    const deleteMutation = useMutation({
        mutationFn: deleteAction,
        onSuccess() {
            setShowModal(false);
            onCloseModal();
            queryClient.resetQueries({ queryKey: ['userAssets'] });
            queryClient.resetQueries({ queryKey: ['transactions'] });
        },
    });
    //console.log(transactionControls['income'].code,transaction?.transaction_type?.code)

    useEffect(() => {
        if(open === undefined) { return }
        setShowModal(open)
    }, [open]);

    useEffect(() => {
        if(!onCloseModal || showModal) { return }
        onCloseModal() 
    }, [showModal]);

    if(transaction)
    return (
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
                            <div className="view-transaction-modal-row">
                                {transactionTypes[transaction.transaction_type.code].icon}
                            </div>
                            <div className="view-transaction-modal-row">
                                {new Date(transaction.date_timestamp).toLocaleDateString(language)}
                            </div>
                        </div>
                    </div>
                    
                            {
                                transaction.user_asset_to &&
                                    <div className="view-transaction-modal-row">
                                        <div className="view-transaction-modal-card">
                                            <TransactionUserAssetRow
                                                userAsset={transaction.user_asset_to}
                                                amount={transaction.amount_to ? numberToStringWithSymbol(
                                                    transaction.amount_to, 
                                                    transaction.user_asset_to.asset.symbol, 
                                                    2, true, "line", transaction.user_asset_to.asset.ticker): ""}
                                            />
                                        </div>
                                    </div>
                            }
                            {
                                transaction.user_asset_from &&
                                    <div className="view-transaction-modal-row">
                                        <div className="view-transaction-modal-card">
                                            <TransactionUserAssetRow
                                                userAsset={transaction.user_asset_from}
                                                amount={transaction.amount_from ? numberToStringWithSymbol(
                                                    -transaction.amount_from, 
                                                    transaction.user_asset_from.asset.symbol, 
                                                    2, true, "line", transaction.user_asset_from.asset.ticker): ""}
                                            />
                                        </div>
                                    </div>
                            }
                            {
                                transaction.user_asset_fee &&
                                    <div className="view-transaction-modal-row">
                                        <div className="view-transaction-modal-card">
                                            <TransactionUserAssetRow
                                                userAsset={transaction.user_asset_fee}
                                                amount={transaction.amount_fee ? numberToStringWithSymbol(
                                                    -transaction.amount_fee, 
                                                    transaction.user_asset_fee.asset.symbol, 
                                                    2, true, "line", transaction.user_asset_fee.asset.ticker): ""}
                                            />
                                        </div>
                                    </div>
                            }
                            {
                                transaction.comment &&
                                    <div className="view-transaction-modal-row">
                                        <div className="view-transaction-modal-card">
                                            <CommentIcon /> <span>{transaction.comment}</span>
                                        </div>
                                    </div>
                            }
                        
                    <div className="view-transaction-modal-row">
                        <ButtonControls
                            controls={transactionControls}
                            onPress={handlePress}
                        />
                    </div>
                </div>
            </div>
        </Modal>
    );
}