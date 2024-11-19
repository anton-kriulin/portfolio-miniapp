import { ReactNode } from "react"

export interface ITransactionFormData {
    transactionTypesId: number
    assetBuyId?: number
    userAssetToId?: number
    userAssetFromId?: number
    userAssetFeeId?: number
    assetBuyNetworkId?: number
    amountFrom?: number
    priceFrom?: number
    worthFrom?: number
    amountTo?: number
    priceTo?: number
    worthTo?: number
    amountFee?: number
    name?: string
    date?: string
    dateTimestamp: number
    comment: string
}

export interface IOnSelectAssetProps {
    asset?: AssetDto
    userAsset?: UserAssetDto
    network?: NetworkDto
}

export interface IUserOptionsFormData {
    favorite_assets_id?: number
    action?: string
    language?: string
    main_screen?: string
    data_type?: string
}

export interface ISession {
    telegramId: number
    accessToken: string
    expiresAt: number
    refreshToken: string
    language: string
    mainScreen: string
    setLanguage?: (newLanguage: string) => void
    dataType: string
    setDataType?: (newDataType: "demo" | "user") => void
}

export interface IStorage {
    assetSearch?: string
    refreshUserAssets: boolean
}

export interface ITelegramUser {
    id: number
    username?: string
    photo_url?: string
    last_name?: string
    first_name: string
    is_bot?: boolean
    is_premium?: boolean
    language_code?: string
    allows_to_write_to_pm?: boolean
    added_to_attachment_menu?: boolean
}

export class CustomError {
    status: number = 200;
    error?: IExternalError;

    constructor(status: number, error?: IExternalError, message?: string) {
        this.status = status;
        this.error = error;
    }
}

export interface IExternalError {
    __isAuthError: boolean
    name: string
    status: number
    code: string
}

export interface AssetDto {
    id: number
    active: boolean
    asset_types_id: number
    name: string
    name_full: string
    ticker: string
    logo: string
    price: number
    symbol: string
    rank: number
    delta_day: number
    market_cap: number
    networks: NetworkDto[]
}

export interface PriceDto {
    x: number
    y: number
}

export interface BalanceHistoryDto {
    period: number
    x: number
    y: number
}

export interface NetworkDto {
    id: number
    logo: string | null
    name: string
}

export interface IPage {
    code: string
    url?: string
    icon?: ReactNode
}

export interface IBody {
    [key: string]: number | string | boolean | undefined | Array<any>
}

export interface ISearchFormData {
    search: string
}

export interface UserAssetDto {
    id?: number
    assets_id: number
    name: string
    amount?: number
    asset: AssetDto
    asset_types_id?: number
    user_accounts_id?: number
    network?: NetworkDto
    value: number
    worth: number
    user_assets?: UserAssetDto[]
}

export interface TransactionDto {
    id: number
    user_asset_from?: UserAssetDto
    amount_from?: number
    worth_from?: number
    value_from?: number
    user_asset_to?: UserAssetDto
    amount_to?: number
    worth_to?: number
    value_to?: number
    user_asset_fee?: UserAssetDto
    amount_fee?: number
    transaction_type: TransactionTypeDto
    date_timestamp: number
    show_date: boolean
    comment: string
}

export interface TransactionTypeDto {
    id: number
    name: string
    code: string
    logo: string
}

export interface IUserAssetParams {
    accessToken: string
    user_assets_id: number
    networks_id: number | undefined
    amount: number
    price: number
    date_timestamp: number
    name: string
}

export interface IAssetParams {
    accessToken: string
    assets_id: number
    networks_id: number | undefined
    amount: number
    price: number
    date_timestamp: number
    name: string
}

export interface UserAssetsAggregatedDto {
    assets_id: number
    asset: AssetDto
    total_amount: number
    total_valuation: number
    total_worth: number
}

export interface UserOptionsDto {
    favorite_assets_id: number[]
    main_screen: string
}

export interface IParams {
    [key: string]: number | string | boolean | undefined | Array<any>
}

export enum ApiMethods {
    GET = 'GET',
    POST = 'POST',
    PATCH = 'PATCH',
    DELETE = 'DELETE'
}

export interface PhraseDto {
    [key: string]: string
}

export interface IControl {
    id: number
    name: string
    code: string
    icon?: ReactNode
}

export interface IControls {
    [key: string]: IControl
}
