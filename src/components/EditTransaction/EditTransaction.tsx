'use client'
import { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from 'next/navigation';
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { Button } from "@nextui-org/button";
import { Dayjs } from 'dayjs';
import { SelectCategoryTabs, SelectAssetControl, FetchError, VisibleSpinner, Controls, SelectDateInput, PressableArea } from "@/components";
import { SpinnerIcon, ArrowDownIcon, ArrowUpIcon } from "@/assets/icons";
import { AssetDto,NetworkDto, UserAssetDto, IOnSelectAssetProps, ITransactionFormData, IControl, IControls } from "@/lib/Types";
import { ApiAddUserTransaction, ApiGetUserTransaction, ApiEditUserTransaction } from "@/lib/ApiManager";
import { useControls, useSession } from "@/hooks";
import { numberToFixed } from "@/lib/Utils";
import './styles.css';

interface EditTransactionProps {
    transactionId?: number
    type?: string
}

export const EditTransaction = ({transactionId, type}: EditTransactionProps) => {
    const {accessToken, phrases, language} = useSession();
    const {transactionTypes} = useControls(phrases);

    const router = useRouter();
    const queryClient = useQueryClient();
    const {
        register,
        formState: { errors },
        handleSubmit,
        setValue,
        resetField,
        getValues,
        watch
    } = useForm<ITransactionFormData>();

    const [showAdditional, setShowAdditional] = useState<boolean>(false);
    const [selectedAsset, setSelectedAsset] = useState<AssetDto | undefined>();
    const [selectedNetwork, setSelectedNetwork] = useState<NetworkDto | undefined>();
    const [selectedUserAssetTo, setSelectedUserAssetTo] = useState<UserAssetDto | undefined>();
    const [selectedUserAssetFrom, setSelectedUserAssetFrom] = useState<UserAssetDto | undefined>();
    const [selectedUserAssetFee, setSelectedUserAssetFee] = useState<UserAssetDto | undefined>();

    const [formErrorTo, setFormErrorTo] = useState<string>();
    const [formErrorFrom, setFormErrorFrom] = useState<string>();
    const [currentCategory, setCurrentCategory] = useState<"buy" | "sell">("buy");
    const [transactionType, setTransactionType] = useState<IControl>(type ? transactionTypes[type] : transactionTypes[Object.keys(transactionTypes)[0]]);
    const refBlockTo = useRef<HTMLDivElement>(null);
    const refBlockFrom = useRef<HTMLDivElement>(null);

    const controlsList: IControls = {
        expense: transactionTypes.expense, 
        income: transactionTypes.income,
        transfer: transactionTypes.transfer,
        deal: transactionTypes.deal,
    };

    const watchTo = watch(["amountTo", "priceTo"]);
    const watchFrom = watch(["amountFrom", "priceFrom"]);

    const addAction = async (data: ITransactionFormData) => {
        if(!accessToken) { return }

        if(!transactionType) { return }
        data.transactionTypesId = transactionType.id;

        return await ApiAddUserTransaction(accessToken, data as ITransactionFormData);
    }

    const editAction = async (data: ITransactionFormData) => {
        if(!accessToken) { return }

        if(!transactionId || !transactionType) { return }
        data.transactionTypesId = transactionType.id;

        return await ApiEditUserTransaction(transactionId, accessToken, data as ITransactionFormData);
    }

	const fetchAction = async () => {
		if(!accessToken) { return }
		return await ApiGetUserTransaction(accessToken, Number(transactionId))
	}

	const {data: transaction, error} = useQuery({
		queryKey: ['transaction', transactionId],
		queryFn: fetchAction,
		enabled: (Boolean(accessToken) && Boolean(transactionId))
	});

    const addMutation = useMutation({
        mutationFn: (data: ITransactionFormData) => addAction(data),
        onSuccess(data, variables, context) {
            /* if((!data?.userAssetTo || !data?.assetBuyId)) { return } */
            router.replace("/transactions")
            queryClient.resetQueries({ queryKey: ['userAssets'] });
            queryClient.resetQueries({ queryKey: ['transactions'] });
            setFormFieldsTo({}, true);
            setFormFieldsFrom({}, true);
        },
    });

    const editMutation = useMutation({
        mutationFn: (data: ITransactionFormData) => editAction(data),
        onSuccess(data, variables, context) {
           /*  if(!data?.userAsset) { return } */
            router.replace("/transactions")
            queryClient.resetQueries({ queryKey: ['userAssets'] });
            queryClient.resetQueries({ queryKey: ['transactions'] });
            queryClient.resetQueries({ queryKey: ['transaction', transactionId] });
            setFormFieldsTo({}, true);
            setFormFieldsFrom({}, true);
        },
    });

    const setFormFieldsTo = ({ asset, userAssetTo, network }: ISetFormFieldsProps, clear?: boolean) => {
        if(asset) {
            setValue("priceTo", numberToFixed(asset.price));
            setValue("assetBuyId", asset.id);
            setValue("assetBuyNetworkId", network?.id);
            setSelectedUserAssetTo(undefined);
        }
        if(userAssetTo) {
            setValue("userAssetToId", userAssetTo.id);
            setValue("priceTo", numberToFixed(userAssetTo.asset?.price));
            setSelectedAsset(undefined);
            setSelectedNetwork(userAssetTo.network);
        }

        if(asset || userAssetTo) { setFormErrorTo(undefined) }
        if(clear) {
            resetField("assetBuyId");
            resetField("assetBuyNetworkId");
            resetField("userAssetToId");
            resetField("amountTo");
            resetField("priceTo");
            resetField("worthTo");
            /* resetField("dateTimestamp"); */
            setSelectedAsset(undefined);
            setSelectedNetwork(undefined);
            setSelectedUserAssetTo(undefined);
        }
    }

    const setFormFieldsFrom = ({ userAssetFrom }: ISetFormFieldsProps, clear?: boolean) => {
        if(userAssetFrom) {
            setValue("userAssetFromId", userAssetFrom.id);
            setValue("priceFrom", numberToFixed(userAssetFrom.asset?.price));
            setFormErrorFrom(undefined)
        }
        if(clear) {
            resetField("userAssetFromId");
            resetField("amountFrom");
            resetField("priceFrom");
            resetField("worthFrom");
            /* resetField("dateTimestamp"); */
            setSelectedAsset(undefined);
            setSelectedUserAssetFrom(undefined);
            setSelectedNetwork(undefined);
        }
    }

    const setFormFieldsFee = ({ userAssetFrom }: ISetFormFieldsProps, clear?: boolean) => {
        if(userAssetFrom) {
            setValue("userAssetFeeId", userAssetFrom.id);
        }
        if(clear) {
            resetField("userAssetFeeId");
            resetField("amountFee");
            setSelectedUserAssetFee(undefined);
        }
    }

    const onSubmit = async (data: ITransactionFormData) => {
        switch(transactionType.code) {
            case "income": {
                if(!data.userAssetToId && !data.assetBuyId) { setFormErrorTo(phrases.selectAsset); return }
                break
            }
            case "expense": {
                if(!data.userAssetFromId) { setFormErrorFrom(phrases.selectAsset); return }
                break
            }
            case "deal": {
                if(!data.userAssetFromId || !(data.assetBuyId || data.userAssetToId)) { setFormErrorFrom(phrases.selectAsset); return }
                break
            }
        }
        
        if(!transactionId) {
            addMutation.mutate(data);
            return;
        }
        if(transactionId) {
            editMutation.mutate(data);
            return;
        }
    }

    const handleSelectTo = ({ asset, userAsset }: IOnSelectAssetProps) => {
        if(asset) { 
            setSelectedAsset(asset);
            setSelectedNetwork(undefined);
            setSelectedUserAssetTo(undefined);
            setFormFieldsTo({ asset });
        }
        if(userAsset) {
            setSelectedUserAssetTo(userAsset);
            setSelectedNetwork(userAsset.network);
            setFormFieldsTo({ userAssetTo: userAsset, network: userAsset.network });
        }
    }

    const handleSelectFrom = ({ userAsset }: IOnSelectAssetProps) => {
        if(!userAsset) { return }
        setSelectedUserAssetFrom(userAsset);
        setFormFieldsFrom({ userAssetFrom: userAsset });
    }

    const handleSelectFee = ({ userAsset }: IOnSelectAssetProps) => {
        if(!userAsset) { return }
        setSelectedUserAssetFee(userAsset);
        setFormFieldsFee({ userAssetFrom: userAsset });
    }

    const handleControlSelected = (transactionType: IControl) => {
        setFormFieldsTo({}, true);
        setFormFieldsFrom({}, true);
        setTransactionType(transactionType)
    }

    const onDatePicked = (value: Dayjs | null) => {
        if(!value) { return }
        setValue("date", value.format(language == "ru" ? "DD.MM.YYYY" : "MM/DD/YYYY"));
        setValue("dateTimestamp", Number(value));
    }

    const onCategoryChange = (category: "buy" | "sell") => {
        if(!refBlockTo.current || !refBlockFrom.current) { return }
        if(category === "buy" ) {
            refBlockTo.current.style.order = "-4";
            refBlockFrom.current.style.order = "-1";
        }
        if(category === "sell" ) {
            refBlockTo.current.style.order = "-1";
            refBlockFrom.current.style.order = "-2";
        }
        setCurrentCategory(category);
    }

    useEffect(() => {
        setValue("worthTo", Number(Number((watchTo[0] || 0) * (watchTo[1] || 0)).toFixed(2)) || undefined);
    }, [watchTo])

    useEffect(() => {
        setValue("worthFrom", Number(Number((watchFrom[0] || 0) * (watchFrom[1] || 0)).toFixed(2)) || undefined);
    }, [watchFrom])

    useEffect(() => {
        if(!transaction) { return }
        setTransactionType(transactionTypes[transaction?.transaction_type.code]);
        setValue("date", new Date(transaction?.date_timestamp).toLocaleDateString(language));
        setSelectedUserAssetFrom(transaction.user_asset_from);
        setSelectedUserAssetTo(transaction.user_asset_to);
    }, [transaction])

    if(error) {
		return (
            <FetchError
                phrases={phrases}
                refreshAction={() => queryClient.resetQueries({ queryKey: ['transaction', transactionId] }) } 
            />
        );
	}

	if(transactionId && !transaction) {
		return (
			<VisibleSpinner containerType="center" />
		);
	}

    return (
        <div className="edit-transaction">
            <form className="edit-transaction-container" onSubmit={handleSubmit(onSubmit)}>
                <input
                    hidden
                    {...register("assetBuyId", { required: false })}
                />
                <input
                    hidden
                    {...register("assetBuyNetworkId", { required: false })}
                />
                <input
                    hidden
                    defaultValue={transaction?.user_asset_to?.id}
                    {...register("userAssetToId", { required: false })}
                />
                <input
                    hidden
                    defaultValue={transaction?.user_asset_from?.id}
                    {...register("userAssetFromId", { required: false })}
                />
                <input
                    hidden
                    defaultValue={transaction?.user_asset_fee?.id}
                    {...register("userAssetFeeId", { required: false })}
                />
                <input
                    hidden
                    defaultValue={transaction?.date_timestamp || Date.now()}
                    {...register("dateTimestamp", { required: false })}
                />
                <Controls
                    controlsList={controlsList}
                    currentControl={transactionType}
                    onSelect={handleControlSelected}
                />
                {
                    transactionType.code === "deal" &&
                        <SelectCategoryTabs category={currentCategory} onCategoryChange={onCategoryChange} />
                }
                <div className="edit-transaction-block-select-asset">
                    {
                        (transactionType.code === "income" || transactionType.code === "deal" || transactionType.code === "transfer") &&
                            <div className="edit-transaction-block" ref={refBlockTo}>
                                <div>To</div>
                                <div className="edit-transaction-select">
                                    <SelectAssetControl
                                        allowNewAsset={true}
                                        allowChangeNetwork={false}
                                        selectedAsset={selectedAsset}
                                        selectedUserAsset={selectedUserAssetTo}
                                        selectedNetwork={selectedNetwork}
                                        onSelect={handleSelectTo}
                                        onSelectNetwork={(network: NetworkDto) => {
                                            if(!network) { return }

                                            setSelectedNetwork(network);
                                            setFormFieldsTo({ asset: selectedAsset, userAssetTo: selectedUserAssetTo, network });
                                            
                                        }}
                                        onClear={() => {
                                            setSelectedUserAssetTo(undefined);
                                            setSelectedNetwork(undefined);
                                            setFormFieldsTo({}, true);
                                        }}
                                        onClearNetwork={() => {
                                            setFormFieldsTo({ asset: selectedAsset, userAssetTo: selectedUserAssetTo, network: undefined });
                                            setSelectedNetwork(undefined);
                                        }}
                                        formError={formErrorTo}
                                    />
                                </div>
                                <div className="edit-transaction-row">
                                    <div className="edit-transaction-row-amount">
                                        <input
                                            type="number"
                                            step="any"
                                            className="primary-input add-user-asset-input-amount"
                                            placeholder={phrases.amount}
                                            defaultValue={transaction?.amount_to}
                                            {...register("amountTo", { required: false })}
                                        />
                                        <div className="edit-transaction-row-sign">
                                            {phrases.plus}
                                        </div>
                                    </div>
                                    <div className="edit-transaction-row-price">
                                        <input
                                            type="number"
                                            step="any"
                                            className="primary-input add-user-asset-input-price"
                                            placeholder={phrases.price}
                                            defaultValue={numberToFixed((transaction?.worth_to || 0) / (transaction?.amount_to || 1)) || ""}
                                            {...register("priceTo", { required: false })}
                                        />
                                        <div className="edit-transaction-row-price-label">{phrases.usd}</div>
                                    </div>
                                    <div className="edit-transaction-row-price">
                                        <input
                                            type="number"
                                            step="any"
                                            className="primary-input add-user-asset-input-price"
                                            placeholder={phrases.worth}
                                            defaultValue={transaction?.worth_to}
                                            {...register("worthTo", { required: false })}
                                        />
                                        <div className="edit-transaction-row-price-label">{phrases.usd}</div>
                                    </div>
                                </div>
                            </div>
                    }
                    
                    {
                        (transactionType.code === "expense" || 
                            transactionType.code === "deal" || 
                            transactionType.code === "transfer") &&
                            <div className="edit-transaction-block" ref={refBlockFrom}>
                                <div>From</div>
                                <div className="edit-transaction-select">
                                    <SelectAssetControl
                                        allowNewAsset={false}
                                        allowChangeNetwork={false}
                                        selectedUserAsset={selectedUserAssetFrom}
                                        onSelect={handleSelectFrom}
                                        onClear={() => {
                                            setSelectedUserAssetFrom(undefined);
                                            setFormFieldsFrom({}, true);
                                        }}
                                        formError={formErrorFrom}
                                    />
                                </div>
                                <div className="edit-transaction-row">
                                    <div className="edit-transaction-row-amount">
                                        <input
                                            type="number"
                                            step="any"
                                            className="primary-input add-user-asset-input-amount"
                                            placeholder={phrases.amount}
                                            defaultValue={transaction?.amount_from}
                                            {...register("amountFrom", { required: false })}
                                        />
                                        <div className="edit-transaction-row-sign">
                                            {phrases.minus}
                                        </div>
                                    </div>
                                    <div className="edit-transaction-row-price">
                                        <input
                                            type="number"
                                            step="any"
                                            className="primary-input add-user-asset-input-price"
                                            placeholder={phrases.price}
                                            defaultValue={numberToFixed((transaction?.worth_from || 0) / (transaction?.amount_from || 1)) || ""}
                                            {...register("priceFrom", { required: false })}
                                        />
                                        <div className="edit-transaction-row-price-label">{phrases.usd}</div>
                                    </div>
                                    <div className="edit-transaction-row-price">
                                        <input
                                            type="number"
                                            step="any"
                                            className="primary-input add-user-asset-input-price"
                                            placeholder={phrases.worth}
                                            defaultValue={transaction?.worth_from}
                                            {...register("worthFrom", { required: false })}
                                        />
                                        <div className="edit-transaction-row-price-label">{phrases.usd}</div>
                                    </div>
                                </div>
                            </div>
                    }
                </div>
                
                {
                    <div className="edit-transaction-block">
                        <PressableArea onPress={() => setShowAdditional(!showAdditional)}>
                            <div className="edit-transaction-row">
                                <div className="edit-transaction-additional">
                                    {showAdditional ? <ArrowUpIcon size={16} /> : <ArrowDownIcon size={16} /> }
                                </div>
                                <div className="edit-transaction-additional">
                                    {phrases.additional}
                                </div>
                            </div>
                        </PressableArea>
                        {
                            showAdditional &&
                                <>
                                    <div className="edit-transaction-select">
                                        <SelectAssetControl
                                            allowNewAsset={false}
                                            allowChangeNetwork={false}
                                            selectedUserAsset={selectedUserAssetFee}
                                            onSelect={handleSelectFee}
                                            onClear={() => {
                                                setSelectedUserAssetFee(undefined);
                                                setFormFieldsFee({}, true);
                                            }}
                                            /* formError={formErrorFrom} */
                                        />
                                    </div>
                                    <div className="edit-transaction-row">
                                        <div className="edit-transaction-row-amount">
                                            <input
                                                type="number"
                                                step="any"
                                                className="primary-input add-user-asset-input-amount"
                                                placeholder={phrases.amount}
                                                defaultValue={transaction?.amount_from}
                                                {...register("amountFee", { required: false })}
                                            />
                                            <div className="edit-transaction-row-sign">
                                                {phrases.minus}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="edit-transaction-row">
                                        <div className="edit-transaction-row-date">
                                            <SelectDateInput 
                                                language={language}
                                                phrases={phrases}
                                                onDatePicked={onDatePicked}
                                                {...register("date")}
                                            />
                                        </div>
                                    </div>
                                    <div className="edit-transaction-row">
                                        <div className="edit-transaction-row-comment">
                                            <input
                                                className="primary-input"
                                                type="text"
                                                placeholder={phrases.comment}
                                                defaultValue={transaction?.comment}
                                                {...register("comment")}
                                            />
                                        </div>
                                    </div>
                                </>
                        }
                    </div>
                }
                <div className="edit-transaction-row edit-transaction-submit-button">
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
    );
}

interface ISetFormFieldsProps {
    asset?: AssetDto
    userAssetTo?: UserAssetDto
    userAssetFrom?: UserAssetDto
    network?: NetworkDto
}