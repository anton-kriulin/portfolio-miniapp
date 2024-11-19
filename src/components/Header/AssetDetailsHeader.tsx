'use client'
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import Image from 'next/image';
import { postEvent, on } from "@telegram-apps/sdk-react";
import { FaStar, FaRegStar } from "react-icons/fa";
import { AssetDto, IParams, IUserOptionsFormData } from '@/lib/Types';
import { IconButton } from "@/components";
import { useSession, useUserOptions } from "@/hooks";
import { Config } from "@/lib/Config";
import { ApiSetUserOptions } from "@/lib/ApiManager";
import './styles.css';

export const AssetDetailsHeader = ({ asset }: { asset:  AssetDto}) => {
    postEvent('web_app_setup_back_button', { is_visible: true });
    postEvent('web_app_setup_swipe_behavior', { allow_vertical_swipe: false });
    const backButtonListener = on('back_button_pressed', () => router.push('/'));

    const {accessToken, telegramId } = useSession();
    const {favoriteAssetsIds} = useUserOptions(true);

    const router = useRouter();
    const queryClient = useQueryClient();
    const [isFavorite, setIsFavorite] = useState<boolean>();

    const addAction = async (data: IUserOptionsFormData) => {
        if(!accessToken) { return }
        return await ApiSetUserOptions(accessToken, data as IParams)
    }

    const addMutation = useMutation({
        mutationFn: (data: IUserOptionsFormData) => addAction(data),
        onSuccess() {
            queryClient.invalidateQueries({ queryKey: ["userOptions", telegramId] });
        },
        onError(error, variables) {
            if(variables.action == "add-favorite") {
                setIsFavorite(false)
            }
            if(variables.action == "remove-favorite") {
                setIsFavorite(true)
            }
        }
    });

    const handleFavoritePress = () => {
        if(favoriteAssetsIds && favoriteAssetsIds.includes(asset.id)) {
            setIsFavorite(false);
            addMutation.mutate({ favorite_assets_id: asset.id, action: "remove-favorite"})
        } else {
            setIsFavorite(true);
            addMutation.mutate({ favorite_assets_id: asset.id, action: "add-favorite"})
        }
    }

    useEffect(() => {
        if(favoriteAssetsIds && 
            favoriteAssetsIds.includes(asset.id)) {
            setIsFavorite(true)
        }
    }, [favoriteAssetsIds, asset.id]);

    return (
        <div className="header">
            <div className="header-row">
                <div className="header-row-left">

                </div>
                <div className="header-row-center">
                    <div className="header-coin">
                        <div className="header-coin-logo">
                            {
                                asset.logo
                                ?
                                    <Image 
                                        src={asset.logo || ""} 
                                        alt={asset.name}
                                        width="30"
                                        height="30"
                                    />
                                :   asset.symbol
                            }
                        </div>
                        <div className="header-coin-ticker">{asset.ticker}</div>
                    </div>
                </div>
                <div className="header-row-right">
                    <IconButton
                        onPress={handleFavoritePress}
                    >
                        {
                            isFavorite 
                            ?   <FaStar size={26} color={Config.colors.SecondaryText} /> 
                            :   <FaRegStar size={26} color={Config.colors.SecondaryText} />
                        }
                    </IconButton>
                </div>
            </div>
        </div>
    );
}