'use client'
import { useState, useEffect, ReactNode } from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Dayjs } from 'dayjs';
import { Button } from "@nextui-org/button";
import { Modal } from "@telegram-apps/telegram-ui";
import { PressableArea,SelectDateInput, SelectAssetControl } from "@/components";
import { CloseIcon, SpinnerIcon } from "@/assets/icons";
import { AssetDto, IUserAssetParams, IAssetParams, NetworkDto, UserAssetDto } from "@/lib/Types";
import { ApiAddUserAsset, ApiEditUserAsset } from "@/lib/ApiManager";
import { useSession } from "@/hooks";
import { numberToFixed } from "@/lib/Utils";
import './styles.css';

export const AddUserAssetModal = ({ asset, trigger, userAsset, open, onCloseModal, onUpdated }: AddUserAssetModalProps) => {
    const {accessToken, phrases, language} = useSession();
    const queryClient = useQueryClient();

    const [selectedAsset, setSelectedAsset] = useState<AssetDto | undefined>();
    const [selectedUserAsset, setSelectedUserAsset] = useState<UserAssetDto | undefined>();
    const [selectedNetwork, setSelectedNetwork] = useState<NetworkDto | undefined>();

    const [formError, setFormError] = useState<string>();
    const [showModal, setShowModal] = useState(false);

    /* const [currentCategory, setCurrentCategory] = useState<"buy" | "sell">("buy"); */

    const {
        register,
        formState: { errors },
        handleSubmit,
        setValue,
        resetField
    } = useForm<IFormData>();

/*     const {assetTypes} = useControls(phrases);
    const controlsList: IControls = { crypto: assetTypes.crypto, fiat: assetTypes.fiat, userAssets: assetTypes.userAssets } */
    

    const addAction = async (data: IFormData) => {
        if(!accessToken) { return }
        if(!data.assets_id) { throw Error("assets_id is empty") }

        return await ApiAddUserAsset(accessToken,  data as IAssetParams);
    }

    const editAction = async (data: IFormData) => {
        if(!accessToken) { return }
        if(!data.user_assets_id) { throw Error("user_assets_id is empty") }

        return await ApiEditUserAsset(accessToken, data as IUserAssetParams);
    }

    const addMutation = useMutation({
        mutationFn: (data: IFormData) => addAction(data),
        onSuccess(data, variables, context) {
            if(!data?.userAsset) { return }

            setFormFields({}, true);
            setShowModal(false);
            queryClient.resetQueries({ queryKey: ['userAssets'] });
            queryClient.resetQueries({ queryKey: ['transactions'] });
            queryClient.resetQueries({ queryKey: ['balanceHistory'] });
            onCloseModal && onCloseModal()
        },
    });

    const editMutation = useMutation({
        mutationFn: (data: IFormData) => editAction(data),
        onSuccess(data, variables, context) {
            if(!data?.userAsset) { return }

            setFormFields({}, true);
            setShowModal(false);
            queryClient.resetQueries({ queryKey: ['userAssets'] });
            queryClient.resetQueries({ queryKey: ['transactions'] });
            queryClient.resetQueries({ queryKey: ['balanceHistory'] });
            onCloseModal && onCloseModal()
        },
    });
    
    const setFormFields = ({ asset, userAsset, network }: ISetFormFieldsProps, clear?: boolean) => {
        if(asset) {
            setValue("assets_id", asset?.id);
            setValue("price", numberToFixed(asset.price));
            setValue("name", asset.name + (network ? " (" + network.name + ")" : ""));
            setSelectedUserAsset(undefined);
        }
        if(userAsset) {
            setValue("user_assets_id", userAsset?.id);
            if(userAsset.network?.id != network?.id && userAsset.asset?.name_full) {
                setValue("name", userAsset.asset.name + (network ? ' (' + network.name + ')' : ''));
            } else {
                setValue("name", userAsset.name);
            }
            setValue("price", numberToFixed(userAsset.asset?.price));
            setValue("amount", userAsset.amount);
            setSelectedAsset(undefined);
            setSelectedNetwork(userAsset.network);
        }
        if(network && (selectedAsset || selectedUserAsset)) {
            setSelectedNetwork(network);
            setValue("networks_id", network?.id);
            setValue("name", (selectedAsset?.name || selectedUserAsset?.asset.name) + (network ? " (" + network.name + ")" : ""));
        }
        
        if(asset || userAsset) { setFormError(undefined); }
        if(clear) {
            resetField("amount");
            resetField("price");
            resetField("name");
            resetField("date_timestamp");
            setSelectedAsset(undefined);
            setSelectedUserAsset(undefined);
            setSelectedNetwork(undefined);
        }
    }

    const onSubmit = async (data: IFormData) => {

        /* data.amount = (currentCategory == "sell") ? -Math.abs(data.amount || 0) : Math.abs(data.amount || 0); */

        if(selectedAsset) {
            addMutation.mutate(data);
            return;
        }
        if(selectedUserAsset) {
            editMutation.mutate(data);
            return;
        }

        setFormError(phrases.selectAsset);
    }

    const onDatePicked = (value: Dayjs | null) => {
        if(!value) { return }
        setValue("date", value.format(language == "ru" ? "DD.MM.YYYY" : "MM/DD/YYYY"));
        setValue("date_timestamp", Number(value));
    }

/*     const onCategoryChange = (category: 'buy' | 'sell') => {
        setCurrentCategory(category);
    } */

    const handleSelectAsset = ({asset, userAsset}: IonSelectProps) => {
        if(asset) { 
            setSelectedAsset(asset);
            setSelectedNetwork(undefined);
            setFormFields({ asset });
        }
        if(userAsset) {
            setSelectedUserAsset(userAsset);
            setSelectedNetwork(userAsset.network);
            setFormFields({ userAsset, network: userAsset.network });
        }
    }

    const handleSelectNetwork = (network: NetworkDto) => {
        if(!network) { return }
        
        setSelectedNetwork(network);
        setFormFields({network});
    }

    const handleClearAsset = () => {
        setFormFields({}, true);
    }

    const handleClearNetwork = () => {
        setFormFields({ asset: selectedAsset, userAsset: selectedUserAsset, network: undefined });
        setSelectedNetwork(undefined);
    }

    useEffect(() => {
        if(asset) {
            setSelectedAsset(asset);
            setFormFields({ asset });
        }
    }, []);

    useEffect(() => {
        if(userAsset) {
            setSelectedUserAsset(userAsset);
            setFormFields({ userAsset, network: userAsset.network });
        }
    }, [userAsset]);

    useEffect(() => {
        if(open === undefined) { return }
        setShowModal(open)
    }, [open]);

    useEffect(() => {
        if(onCloseModal && !showModal) {
            onCloseModal() 
        }
    }, [showModal]);

    return (
        <>
            {
                trigger && <PressableArea onPress={() => setShowModal(true)}>{trigger}</PressableArea>
            }
            <Modal
                nested={true}
                open={showModal}
                dismissible={true}
                onOpenChange={setShowModal}
                header={
                    <div className="modal-header">
                        <div className="modal-header-row">
                            <div className="modal-header-row-close-button">
                                <PressableArea
                                    onPress={() => setShowModal(false)}
                                    className="pressable-icon"
                                >
                                    <CloseIcon size="26" />
                                </PressableArea>
                            </div>
                        </div>
                    </div>
                }
            >
                <div className="add-user-asset-modal-container">
                    
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <input
                            hidden
                            {...register("assets_id", { required: false })}
                        />
                        <input
                            hidden
                            {...register("user_assets_id", { required: false })}
                        />
                        <input
                            hidden
                            {...register("networks_id", { required: false })}
                        />
                        <input
                            hidden
                            defaultValue={Date.now()}
                            {...register("date_timestamp", { required: false })}
                        />
                        <div className="add-user-asset-modal-container-row add-user-asset-modal-container-select">
                            <SelectAssetControl
                                allowNewAsset={true}
                                allowChangeNetwork={true}
                                selectedAsset={selectedAsset}
                                selectedUserAsset={selectedUserAsset}
                                selectedNetwork={selectedNetwork}
                                onSelect={handleSelectAsset}
                                onSelectNetwork={handleSelectNetwork}
                                onClear={handleClearAsset}
                                onClearNetwork={handleClearNetwork}
                                formError={formError}
                            />
                        </div>
                        {formError && <div className="message-error">{formError}</div>}
                        <div className="add-user-asset-modal-container-row">
                            <div className="add-user-asset-modal-container-row-amount">
                                <input
                                    type="number"
                                    step="any"
                                    className="primary-input add-user-asset-input-amount"
                                    placeholder={phrases.amount}
                                    {...register("amount", { required: false })}
                                />
                            </div>
                            <div className="add-user-asset-modal-container-row-price">
                                <input
                                    type="number"
                                    step="any"
                                    className="primary-input add-user-asset-input-price"
                                    placeholder={phrases.price}
                                    {...register("price", { required: false })}
                                />
                                <div className="add-user-asset-modal-container-row-price-label">USD</div>
                            </div>
                        </div>
                        <div className="add-user-asset-modal-container-row">
                            <div className="add-user-asset-modal-container-row-name">
                                <input
                                    className="primary-input"
                                    type="text"
                                    placeholder={phrases.assetName}
                                    {...register("name")}
                                />
                            </div>
                            
                            <div className="add-user-asset-modal-container-row-date">
                                <SelectDateInput 
                                    language={language}
                                    phrases={phrases}
                                    onDatePicked={onDatePicked}
                                    {...register("date")}
                                />
                            </div>
                            
                        </div>
                        
                        <div className="add-user-asset-modal-container-row add-user-asset-modal-container-submit-button">
                            <Button 
                                type="submit" 
                                className={addMutation.isPending || editMutation.isPending ? "primary-button primary-button-disabled" : "primary-button"}
                                isLoading={addMutation.isPending || editMutation.isPending}
                                disabled={addMutation.isPending || editMutation.isPending}
                                disableAnimation={true}
                                spinner={
                                    <div className="primary-button-spinner">
                                        <SpinnerIcon />
                                    </div>
                                }
                            >
                                {addMutation.isPending || editMutation.isPending ? phrases.loading : phrases.save}
                            </Button>
                        </div>
                    </form>
                </div>
            </Modal>
        </>
    );
}

interface IonSelectProps {
    asset?: AssetDto
    userAsset?: UserAssetDto
    network?: NetworkDto
}

interface IFormData {
    assets_id?: number
    user_assets_id?: number
    networks_id?: number
    amount?: number
    price?: number
    name?: string
    date?: string
    date_timestamp: number
}

interface ISetFormFieldsProps {
    asset?: AssetDto
    userAsset?: UserAssetDto
    network?: NetworkDto
}

interface AddUserAssetModalProps {
    asset?: AssetDto
    trigger?: ReactNode
    userAsset?: UserAssetDto
    open?: boolean
    onCloseModal?: () => void
    onUpdated?: () => void
}