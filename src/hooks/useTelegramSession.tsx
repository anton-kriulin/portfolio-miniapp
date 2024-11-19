/* import { useEffect, useState } from 'react';
import { initCloudStorage } from '@telegram-apps/sdk-react';
import { ISession } from "@/lib/Types";

export const useTelegramSession = () => {

    const [session, setSession] = useState<ISession>();

     useEffect(() => {
        const authorize = async () => {
            const cloudStorage = initCloudStorage();
            const {
                telegramId,
                language,
                accessToken,
                expiresAt,
                refreshToken,
                mainScreen
            } = await cloudStorage.get(['telegramId', 'language', 'accessToken', 'expiresAt', 'refreshToken','mainScreen']);

            const currentSession: ISession = {
                telegramId: Number(telegramId),
                language,
                accessToken,
                expiresAt: Number(expiresAt),
                refreshToken,
                mainScreen
            }

            setSession(currentSession);
        }
        authorize();
    }, []);
    
    return session;
} */