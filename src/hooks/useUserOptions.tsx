import { useEffect, useState } from 'react';
import { useQuery } from "@tanstack/react-query";
import { ApiGetUserOptions } from "@/lib/ApiManager";
import { useSession } from './useSession';
import { Config } from '@/lib/Config';

export const useUserOptions = (enabled: boolean = true) => {

    const {accessToken, telegramId} = useSession();
    const [favoriteAssetsIds, setFavoriteAssetsIds] = useState<number[] | undefined>();
    const [mainScreen, setMainScreen] = useState<string>();

    const fetchOptionsAction = async () => {
		if(!accessToken) { return }
		return await ApiGetUserOptions(accessToken)
	}
    
    const {data: userOptions, error: optionsError} = useQuery({
		queryKey: ["userOptions", telegramId],
		queryFn: fetchOptionsAction,
		enabled: Boolean(accessToken) && Boolean(telegramId) && enabled,
		staleTime: Config.userOptionsStaleTime
	});

    useEffect(() => {
        if(enabled && userOptions) {
            setFavoriteAssetsIds(userOptions.favorite_assets_id);
            setMainScreen(userOptions.main_screen)
            return;
        }
        setFavoriteAssetsIds(undefined);
    }, [enabled, userOptions]);

    return {favoriteAssetsIds, mainScreen}
}