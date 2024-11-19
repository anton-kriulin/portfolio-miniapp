'use client'
import { use, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useInView } from "react-intersection-observer";
import { UserAssetRow, PressableArea, VisibleSpinner, AddUserAssetModal, FetchError, EmptyError, ViewUserAssetModal } from "@/components";
import { ApiGetUserAssets, ApiGetUserAssetsAggregated } from "@/lib/ApiManager";
import { useSession, usePullToRefresh, usePhrases } from "@/hooks";
import { UserAssetDto } from "@/lib/Types";
import { Config } from '@/lib/Config';
import './styles.css'
import { ArrowDownIcon, ArrowUpIcon } from '@/assets/icons';
import { Divider } from '@nextui-org/react';

interface IUserAssetsListProps {
    type: 'select' | 'list' | 'aggregated-list'
    assetsId?: number
    compact?: boolean
    onSelect?: (userAsset: UserAssetDto) => void
    search?: string
    adjustment?: boolean
}

export const UserAssetsList = ({ onSelect, type, assetsId, compact, search, adjustment }: IUserAssetsListProps) => {
    const {accessToken, language, dataType} = useSession();
    const {phrases} = usePhrases(language);

    const [selectedUserAsset, setSelectedUserAsset] = useState<UserAssetDto | undefined>();
    const [showViewModal, setShowViewModal] = useState<boolean>(false);

    const [assetSearch, setAssetSearch] = useState<string>();
    const [showMoreUserAssets, setShowMoreUserAssets] = useState<number[]>([]);

    /* const router = useRouter(); */
    const queryClient = useQueryClient();

    const pullToRefreshRef = useRef<HTMLDivElement>(null);
    const { ref: pullToRefreshAreaRef, inView: pullToRefreshAreaInView } = useInView();

    const state = usePullToRefresh({ 
        pullToRefreshRef, 
        pullToRefreshAreaInView, 
        refreshAction: () => queryClient.invalidateQueries({ queryKey: ['userAssets'] }), 
        accessToken 
    });

    const fetchAction = async () => {
        if(!accessToken) { return }
        if(dataType !== "demo" && dataType !== "user") { return }

        return type == 'aggregated-list'
            ? await ApiGetUserAssetsAggregated(accessToken, dataType) 
            : await ApiGetUserAssets(accessToken, dataType, assetsId, search);
    }

    const { data: userAssets, error, isPending, isRefetching } = useQuery({
        queryKey: ['userAssets', assetSearch || "", type == 'aggregated-list' ? 'aggregated-list' : "", assetsId || ""],
        queryFn: fetchAction,
        enabled: Boolean(accessToken),
        staleTime: Config.assetsStaleTime,
    });

    const onSelectUserAssetDetails = ({userAsset}: {userAsset: UserAssetDto}) => {
        /* if(type == 'aggregated-list') {
            router.push(`/assets/detail/${userAsset.assets_id}`);
            return;
        } */
        setSelectedUserAsset(userAsset);
        setShowViewModal(true);
    }

    const onPressShowMoreUserAssets = ({userAsset, show}: {userAsset: UserAssetDto, show: boolean}) => {
        if(!userAsset || !userAsset.assets_id) { return }
        const moreUserAssetsList: number[] = 
            show
            ? showMoreUserAssets.concat(userAsset.assets_id)
            : showMoreUserAssets.filter(item => item !== userAsset.assets_id)

        setShowMoreUserAssets(moreUserAssetsList)
    }
    
    const onCloseViewModal = () => {
        setSelectedUserAsset(undefined);
        setShowViewModal(false);
    }

    useEffect(() => {
        setAssetSearch(search);
    }, [search]);

    if(isPending || isRefetching || !accessToken || !userAssets && !error) {
        return (
            <VisibleSpinner containerType={compact || type == "aggregated-list" ? "flex" : "center"} />
        );
    }

    if(!isPending && !isRefetching && userAssets && userAssets.length === 0) {
        return (<EmptyError phrases={phrases} />);
    }

    if(error) {
        //todo error handling
        console.error(error)
        return (
            <FetchError
                phrases={phrases}
                containerType="flex"
                refreshAction={() => queryClient.invalidateQueries({ queryKey: ['userAssets'] })}
            />
        );
    }

    if(userAssets)
    return (
        <div ref={(type === "list" || type === "aggregated-list" && !compact) ? pullToRefreshRef : null}>
            {
                !compact &&
                    <div className="assets-list-column">
                        <div ref={type == "list" || type == "aggregated-list" && !compact ? pullToRefreshAreaRef : null} key="0" className="assets-list-row">
                            <div className="assets-list-name">
                                <span>{phrases.asset}</span>
                            </div>
                            <div className="assets-list-pl">{phrases.pL}</div>
                            <div className="assets-list-valuation">{phrases.value}</div>
                        </div>
                        <hr />
                    </div>
            }
            {
                (type === "list" || type === "aggregated-list") &&
                    <div className="assets-list-column">
                        {
                            userAssets.map(userAsset => (
                                <div key={userAsset.id || userAsset.assets_id}>
                                    <div className="assets-list-aggregated-row">
                                        <div className="assets-list-show-more">
                                            {
                                                ((userAsset.user_assets && userAsset.user_assets.length > 1) 
                                                && !showMoreUserAssets.includes(userAsset.assets_id)) && 
                                                    
                                                        <PressableArea
                                                            className="assets-list-show-more"
                                                            onPress={onPressShowMoreUserAssets}
                                                            value={{userAsset, show: true}}
                                                        >
                                                            <ArrowDownIcon size={26} />
                                                        </PressableArea>
                                            }
                                            {
                                                ((userAsset.user_assets && userAsset.user_assets.length > 1) 
                                                && showMoreUserAssets.includes(userAsset.assets_id)) && 
                                                    
                                                        <PressableArea
                                                            className="assets-list-show-more"
                                                            onPress={onPressShowMoreUserAssets}
                                                            value={{userAsset, show: false}}
                                                        >
                                                            <ArrowUpIcon size={26} />
                                                        </PressableArea>
                                            }
                                        </div>
                                        
                                        
                                        <PressableArea
                                            className="assets-list-user-asset"
                                            onPress={
                                                (userAsset.user_assets && userAsset.user_assets.length > 1) 
                                                    ? onPressShowMoreUserAssets 
                                                    : onSelectUserAssetDetails
                                            }
                                            value={{
                                                userAsset: userAsset.user_assets?.length === 1 ? userAsset.user_assets.at(0) : userAsset, 
                                                show: !showMoreUserAssets.includes(userAsset.assets_id)
                                            }}
                                        >
                                            <UserAssetRow userAsset={userAsset} compact={false} />
                                        </PressableArea>
                                    </div>
                                    {
                                        (userAsset.user_assets && showMoreUserAssets.includes(userAsset.assets_id)) && 
                                            userAsset.user_assets.map(item => (
                                                <div className="assets-list-aggregated-row" key={item.id}>
                                                    <div className="assets-list-show-more"></div>
                                                    <PressableArea
                                                        className="assets-list-user-asset"
                                                        onPress={onSelectUserAssetDetails}
                                                        value={{userAsset: item}}
                                                    >
                                                        <UserAssetRow userAsset={item} compact={false} />
                                                    </PressableArea>
                                                </div>
                                               
                                            ))
                                    }
                                </div>
                            ))
                        }
                        
                        
                        <ViewUserAssetModal
                            userAsset={selectedUserAsset}
                            open={showViewModal}
                            onCloseModal={onCloseViewModal}
                            onUpdated={() => setShowMoreUserAssets([])}
                        />
                    </div>
            }
            {
                type === "select" &&
                    <div className="assets-list-column">
                        {
                            (userAssets).map((userAsset) => (
                                <PressableArea
                                    key={userAsset.id}
                                    onPress={onSelect ? onSelect : () => {}}
                                    value={userAsset}
                                >
                                    <UserAssetRow userAsset={userAsset} compact={false} />
                                </PressableArea>
                            ))
                        }
                    </div>
            }
        </div>
    );
}