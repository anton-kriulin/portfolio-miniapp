import { useMemo, useEffect, useState } from 'react';
import {
    useLaunchParams,
    useInitData, 
    initCloudStorage,
    type User
  } from '@telegram-apps/sdk-react';
import { AuthUser } from '@/lib/ApiManager';
import { ISession, ITelegramUser } from "@/lib/Types";

export const useTelegramAuth = () => {

    const initDataRaw = useLaunchParams().initDataRaw;
    const initData = useInitData();
    const [session, setSession] = useState<ISession>();

    const userRows = useMemo<ITelegramUser | undefined>(() => {
        return initData && initData.user ? getUserRows(initData.user) : undefined;
    }, [initData]);

    if(!userRows || !userRows.id || !initDataRaw) {
        throw { error: 403 };
    }

    const nowTimestamp = Math.floor(Date.now() / 1000);
    useEffect(() => {
        const authorize = async () => {
            const cloudStorage = initCloudStorage();
            /* Promise.all([
                cloudStorage.set('telegramId', ""),
                cloudStorage.set('accessToken', ""),
                cloudStorage.set('expiresAt', ""),
                cloudStorage.set('refreshToken', ""),
                cloudStorage.set('isActivated', ""),
                cloudStorage.set('mainScreen', ""),
                cloudStorage.set('dataType', "")
            ]); */

            const {
                telegramId,
                language,
                accessToken,
                expiresAt,
                refreshToken,
                mainScreen,
                dataType
            } = await cloudStorage.get(
                [
                    'telegramId', 
                    'language', 
                    'accessToken', 
                    'expiresAt', 
                    'refreshToken', 
                    'mainScreen', 
                    'dataType'
                ]
            );

            const currentSession: ISession = {
                telegramId: Number(telegramId),
                language,
                accessToken,
                expiresAt: Number(expiresAt),
                refreshToken,
                mainScreen,
                dataType
            }
            
            if(currentSession && 
                currentSession.accessToken &&
                currentSession.refreshToken && 
                currentSession.language && 
                currentSession.mainScreen &&
                currentSession.expiresAt > (nowTimestamp + 84600)) {
                console.log('session is valid')
                setSession(currentSession);
            } else {
                console.log('session is invalid. Lets get a new one')
                /* .then(async ({session: newSession, error}) => { */
                const {session: newSession, error} = await AuthUser({
                    initDataRaw, 
                    telegramId: userRows.id,
                    username: userRows.username,
                    name: userRows.first_name + (userRows.last_name && (" " + userRows.last_name)),
                    language: userRows.language_code,
                    currentSession 
                });/* .then(async ({session: newSession, error}) => { */

                if(error) { console.error(error) }
                if(newSession) {
                    await cloudStorage.set('telegramId', newSession.telegramId.toString());
                    await cloudStorage.set('language', newSession.language.toString());
                    await cloudStorage.set('accessToken', newSession.accessToken.toString());
                    await cloudStorage.set('expiresAt', newSession.expiresAt.toString());
                    await cloudStorage.set('refreshToken', newSession.refreshToken.toString());
                    await cloudStorage.set('mainScreen', newSession.mainScreen.toString());
                    await cloudStorage.set('dataType', newSession.dataType.toString());
                    setSession(newSession);
                }
                /* }); */
            }
        }
        authorize();
    }, []);

    return session as ISession;
}

function getUserRows(user: User): ITelegramUser | undefined {
    return {
        id: user.id,
        username: user.username,
        photo_url: user.photoUrl,
        last_name: user.lastName,
        first_name: user.firstName,
        is_bot: user.isBot,
        is_premium: user.isPremium,
        language_code: user.languageCode,
        allows_to_write_to_pm: user.allowsWriteToPm,
        added_to_attachment_menu: user.addedToAttachmentMenu,
    };
}

            /* await cloudStorage.set('telegram_id', "");
            await cloudStorage.set('language', "");
            await cloudStorage.set('access_token', "");
            await cloudStorage.set('expires_at', "");
            await cloudStorage.set('refresh_token', ""); */

/*             await cloudStorage.delete('telegram_id');
            await cloudStorage.delete('language');
            await cloudStorage.delete('access_token');
            await cloudStorage.delete('expires_at');
            await cloudStorage.delete('refresh_token'); */

                        /* await cloudStorage.set('telegramId', "");
            await cloudStorage.set('language', "");
            await cloudStorage.set('accessToken', "");
            await cloudStorage.set('expiresAt', "");
            await cloudStorage.set('refreshToken', "");
            await cloudStorage.set('isActivated', "");
            await cloudStorage.set('mainScreen', "");
            await cloudStorage.set('dataType', ""); */