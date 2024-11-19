'use server'
import { validate } from '@telegram-apps/init-data-node';
import { createHash } from "crypto";
import { CustomError, 
    IParams, 
    ApiMethods, 
    ISession, 
    IBody, 
    AssetDto, 
    UserAssetDto,
    IUserAssetParams,
    IAssetParams,
    PriceDto, 
    BalanceHistoryDto,
    UserOptionsDto,
    TransactionDto,
    ITransactionFormData
 } from '@/lib/Types';

const ApiCall = async (
    method: ApiMethods, 
    accessToken: string = '',
    endpoint: string, 
    params: IParams | IUserAssetParams = {}, 
    body: IBody = {},
    entityId?: number) => {

    if(!process.env.APIKEY || !process.env.APIURL) { return { error: { status: 500 } } }
    const apikey: string = process.env.APIKEY;
    const apiurl: string = process.env.APIURL;

    /* const stringParams: { [key: string]: string } = {}; */

/*     for (const [key, value] of Object.entries(params)) {
        stringParams[key] = value ? value.toString() : null //value ? value.toString() : value == 0 ? '0' : '';
    } */
   /* new URLSearchParams(stringParams) */
        /* const stringParams =  */
    const paramsToString = (params: IParams | IUserAssetParams) => {
        return Object.entries(params).map(([key, value]) => 
            `${key}=${
                value === 0 ? 0 :
                Array.isArray(value) ? JSON.stringify(value) :
                !value ? '' : value.toString()
            }`).join('&');
    }

    try {
        const options: { [key: string]: any } = {
            method: method,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + accessToken,
                'apikey': apikey
            }
        }

        if(body && (method == ApiMethods.POST || method == ApiMethods.PATCH)) { options.body = JSON.stringify(body); }
        const response = await fetch(
            apiurl + 
            endpoint + 
            (entityId ? `/${entityId}/` : '') + 
            '?' + paramsToString(params), options);

        const data = await response.json();
        if(!response.ok) {
            return {error: data}
        }

        return { data };
    } catch(e) {
        const error = e as CustomError;
        return {error};
    }
}

export const ApiSignUp = async (telegramId: number, username: string, name: string, language: string) => {
    const { data: session, error } = await ApiCall(ApiMethods.POST, '', '/users/signup', {}, {
        email: telegramId+'@telegram.ton',
        password: ApiGetHashPassword(telegramId),
        username,
        name,
        language
    });
    if(error) { return {error} }

    return {session};
}

export const ApiSignIn = async (telegramId: number) => {
    const { data: session, error } = await ApiCall(ApiMethods.POST, '', '/users/signin', {}, {
        email: telegramId+'@telegram.ton',
        password: ApiGetHashPassword(telegramId)
    });
    if(error) { return {error} }

    return {session};
}

export const ApiRefreshToken = async (refreshToken: string) => {
    const { data: session, error } = await ApiCall(ApiMethods.POST, '', '/users/refresh_token', {}, {
        refresh_token: refreshToken
    });
    if(error) { return {error} }

    return {session};
}

export const ApiGetUserOptions = async (accessToken: string) => {

    const { data: userOptions, error } = await ApiCall(ApiMethods.GET, accessToken, `/users/options`);
    if(error) { throw {error} }

    return userOptions.data as UserOptionsDto;
}

export const ApiSetUserOptions = async (accessToken: string, params: IBody) => {
    
    const { data: options, error } = await ApiCall(ApiMethods.PATCH, accessToken, '/users/options', {}, {
        favorite_assets_id: params.favorite_assets_id,
        action: params.action,
        language: params.language,
        main_screen: params.main_screen,
        data_type: params.data_type
    });
    
    if(error) { throw {error} }

    return {options};
}

export const ApiGetAssets = async (accessToken: string, params: IParams) => {
    const { data, error } = await ApiCall(ApiMethods.GET, accessToken, '/assets/assets', params);
    if(error) { throw {error} }

    return data.items as AssetDto[];
}

export const ApiGetAsset = async (accessToken: string, id: number) => {

    const { data: asset, error } = await ApiCall(ApiMethods.GET, accessToken, `/assets/assets/${id}`);
    if(error) { throw {error} }

    return asset as AssetDto;
}

export const ApiGetAssetPrices = async (accessToken: string, id: number, params: IParams) => {

    const { data: assetPrices, error } = await ApiCall(ApiMethods.GET, accessToken, `/assets/asset-prices/${id}`, {
        period: params.period
    }, {});
    if(error) { throw {error} }

    return assetPrices as PriceDto[];
}

export const ApiGetUserAssets = async (accessToken: string, dataType: 'demo' | 'user' = 'user', assetsId?: number, search?: string) => {
    const params: IParams = {
        data_type: dataType,
        assets_id: assetsId
    }
    if(search) { params.search = search }

    const { data: userAssets, error } = await ApiCall(ApiMethods.GET, accessToken, '/accounts/user_assets', params);
    if(error) { throw {error} }

    return userAssets as UserAssetDto[];
}

export const ApiAddUserAsset = async (accessToken: string, params: IAssetParams) => {

    const body: IBody = { 
        assets_id: params.assets_id, 
        amount: params.amount, 
        price: params.price, 
        date_timestamp: params.date_timestamp,
        name: params.name
    }

    if(params.networks_id) { body.networks_id = params.networks_id }

    const { data: userAsset, error } = await ApiCall(
        ApiMethods.POST, accessToken, '/accounts/user_assets', 
        {}, body);

    if(error) { throw {error} }

    return {userAsset};
}

export const ApiEditUserAsset = async (accessToken: string, params: IUserAssetParams) => {

    const body: IBody = { 
        user_assets_id: params.user_assets_id, 
        amount: params.amount, 
        price: params.price, 
        date_timestamp: params.date_timestamp,
        name: params.name
    }

    if(params.networks_id) { body.networks_id = params.networks_id }
        
    const { data: userAsset, error } = await ApiCall(
        ApiMethods.PATCH, accessToken, '/accounts/user_assets', {}, 
        body, 
        params.user_assets_id);

    if(error) { throw {error} }

    return {userAsset};
}

export const ApiDeleteUserAsset = async (accessToken: string, id: number) => {
    const { data: deletedUserAsset, error } = await ApiCall(ApiMethods.DELETE, 
        accessToken, `/accounts/user_assets`, {}, {}, id);
    if(error) { throw {error} }

    return deletedUserAsset as boolean;
}

export const ApiGetUserAssetsAggregated = async (accessToken: string, dataType: 'demo' | 'user' = 'user') => {

    const { data: userAssets, error } = await ApiCall(ApiMethods.GET, accessToken, '/accounts/user_assets_aggregated', {  data_type: dataType });
    if(error) { throw {error} }

    return userAssets as UserAssetDto[];
}

export const ApiGetBalanceHistory = async (accessToken: string, dataType: 'demo' | 'user' = 'user', period: string) => {

    const { data: balanceHistory, error } = await ApiCall(ApiMethods.GET, accessToken, '/accounts/balance_history', {
        data_type: dataType,
        period
    });
    if(error) { throw {error} }

    return balanceHistory as BalanceHistoryDto[];
}

export const ApiGetUserTransactions = async (accessToken: string, params: IParams) => {

    const { data: userTransactions, error } = await ApiCall(ApiMethods.GET, accessToken, '/transactions/user_transactions', params);
    if(error) { throw {error} }

    return userTransactions.items as TransactionDto[];
}

export const ApiGetUserTransaction = async (accessToken: string, id: number) => {

    const { data: userTransaction, error } = await ApiCall(ApiMethods.GET, accessToken, `/transactions/user_transactions/${id}`);
    if(error) { throw {error} }

    return userTransaction as TransactionDto;
}

export const ApiAddUserTransaction = async (accessToken: string, params: ITransactionFormData) => {

    const body: IBody = { 
        transaction_types_id: Number(params.transactionTypesId),
        asset_buy_id: Number(params.assetBuyId),
        asset_buy_network_id: Number(params.assetBuyNetworkId),
        user_asset_from_id: Number(params.userAssetFromId),
        amount_from: params.amountFrom && Number(params.amountFrom),
        user_asset_to_id: Number(params.userAssetToId),
        amount_to: params.amountTo && Number(params.amountTo),
        user_asset_fee_id: params.userAssetFeeId && Number(params.userAssetFeeId),
        amount_fee: params.amountFee && Number(params.amountFee),
        date_timestamp: Number(params.dateTimestamp),
        worth_from: params.worthFrom && Number(params.worthFrom),
        worth_to: params.worthTo && Number(params.worthTo),
        comment: params.comment ? params.comment.toString() : ""
    }

    const { data: userTransaction, error } = await ApiCall(
        ApiMethods.POST, accessToken, '/transactions/user_transactions', {}, body);

    if(error) { throw {error} }

    return {userTransaction};
}

export const ApiEditUserTransaction = async (id: number, accessToken: string, params: ITransactionFormData) => {

    const body: IBody = { 
        transaction_types_id: Number(params.transactionTypesId),
        asset_buy_id: Number(params.assetBuyId),
        asset_buy_network_id: Number(params.assetBuyNetworkId),
        user_asset_from_id: Number(params.userAssetFromId),
        amount_from: Number(params.amountFrom),
        user_asset_to_id: Number(params.userAssetToId),
        amount_to: Number(params.amountTo),
        user_asset_fee_id: params.userAssetFeeId && Number(params.userAssetFeeId),
        amount_fee: params.amountFee && Number(params.amountFee),
        date_timestamp: Number(params.dateTimestamp),
        worth_from: Number(params.worthFrom),
        worth_to: Number(params.worthTo),
        comment: params.comment ? params.comment.toString() : ""
    }

    const { data: userTransaction, error } = await ApiCall(
        ApiMethods.PATCH, accessToken, `/transactions/user_transactions/${id}`, 
        {}, 
        body);

    if(error) { throw {error} }

    return {userTransaction};
}

export const ApiDeleteUserTransactions = async (accessToken: string, ids: number[]) => {
    
    const { data: deletedTransactionsCount, error } = await ApiCall(ApiMethods.DELETE, accessToken, `/transactions/user_transactions`, {
        transactions_ids: ids
    });
    if(error) { throw {error} }

    return deletedTransactionsCount as number;
}

const ApiGetHashPassword = (telegramId: number) => {
    if(!process.env.USERPASSWORD) { throw 'Create account error'}

    const passhash = createHash("sha256")
        .update(process.env.USERPASSWORD)
        .update(createHash("sha256").update(telegramId.toString(), "utf8").digest("hex"))
        .digest("hex");

    return passhash;
}

export const AuthUser = async ({ initDataRaw, telegramId, username, name, language = "en", currentSession }: AuthUserProps) => {
    try {
        if(!process.env.TGAPIKEY) { throw Error('Auth error') }
        validate(initDataRaw, process.env.TGAPIKEY);
    } catch (error) {
        return { error };
    }

    if(currentSession && 
        currentSession.accessToken && 
        currentSession.refreshToken && 
        currentSession.language && 
        currentSession.mainScreen &&
        currentSession.dataType != undefined &&
        currentSession.expiresAt > Math.floor(Date.now() / 1000)) {
        return { session: currentSession };
    }

    if(currentSession.refreshToken && currentSession.expiresAt <= Date.now()) {
        const { session: refreshedSession, error } = await ApiRefreshToken(currentSession.refreshToken);
        if(!error) {
            const session: ISession = { 
                telegramId: telegramId,
                language: refreshedSession.language,
                accessToken: refreshedSession.access_token,
                expiresAt: refreshedSession.expires_at,
                refreshToken: refreshedSession.refresh_token,
                mainScreen: refreshedSession.main_screen,
                dataType: refreshedSession.data_type
            }
            
            console.log("refreshed")
            return {session};
        }
    }

    let {session: newSession, error} = await ApiSignIn(telegramId);

    if(error) {
        ({session: newSession, error}  = await ApiSignUp(telegramId, username || '', name || '', language));
        console.log(error)
        console.log("signedUp")
    } else {
        console.log("signedIn")
    }
    
    if(!error && newSession) { 
        const session: ISession = { 
            telegramId: telegramId,
            language: newSession.language,
            accessToken: newSession.access_token,
            expiresAt: newSession.expires_at,
            refreshToken: newSession.refresh_token,
            mainScreen: newSession.main_screen,
            dataType: newSession.data_type
        }

        return { session };
    }

    return {error};
}

interface AuthUserProps {
    initDataRaw: string
    telegramId: number
    username?: string
    name?: string
    language?: string
    currentSession: ISession
}