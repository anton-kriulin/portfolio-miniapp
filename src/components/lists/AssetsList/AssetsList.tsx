'use client'
import { useEffect, useRef, useState } from 'react';
import { useSelector, shallowEqual } from 'react-redux';
import { useInfiniteQuery, useQueryClient, useQuery } from "@tanstack/react-query";
import { useInView } from "react-intersection-observer";
import { Modal, List} from "@telegram-apps/telegram-ui"
import { initHapticFeedback } from '@telegram-apps/sdk-react';
import { ApiGetAssets, ApiGetUserOptions } from "@/lib/ApiManager";
import { RootState } from '@/lib/Redux';
import { IStorage, AssetDto, IParams, IControl } from '@/lib/Types';
import { AssetRow, PressableArea, VisibleSpinner, FetchError } from '@/components';
import { usePullToRefresh, useSession, useControls, useUserOptions } from '@/hooks';
import { Config } from '@/lib/Config';
import './styles.css'

interface IAssetsListProps {
    assetsType: IControl
    type: "list" | "select"
    onSelect: (asset: AssetDto) => void
    assets_id?: number[]
    search: string
}

export const AssetsList = ({ assetsType, type, onSelect, search }: IAssetsListProps) => {
    const {accessToken, phrases, dataType} = useSession();
    const {assetTypes} = useControls(phrases);

    const {favoriteAssetsIds} = useUserOptions(assetsType.id == assetTypes.favorites.id);
    const [assetSearch, setAssetSearch] = useState<string>();

    const {ref, inView, entry} = useInView(/* { skip: Boolean(page) } */);
    const queryClient = useQueryClient();

    const pullToRefreshRef = useRef<HTMLDivElement>(null);
    const {ref: pullToRefreshAreaRef, inView: pullToRefreshAreaInView} = useInView();

    const refreshAction = () => {
        queryClient.refetchQueries({ queryKey: ['assets'] })
    }

    const state = usePullToRefresh({ 
        pullToRefreshRef, 
        pullToRefreshAreaInView, 
        refreshAction,
        accessToken 
    });

    const fetchAction = async ({ pageParam = 0 }: { pageParam: number }) => {
        if(!accessToken) { return }

        const params: IParams = {
            page: pageParam,
            per_page: Config.perPage,
            asset_types_id: assetsType.id ?? 1,
        }

        if(favoriteAssetsIds) {
            params.assets_id = JSON.stringify(favoriteAssetsIds)
        }

        if(assetsType.code === "favorites") {
            params.data_type = dataType;
        }

        if(search) {
            params.search = search;
            params.page = 0;
        }

        return await ApiGetAssets(accessToken, params);
    }

    const {data: assets, error, isPending, isFetching, isRefetching, fetchNextPage, hasNextPage} = useInfiniteQuery({
        queryKey: ['assets' , assetsType.id, favoriteAssetsIds, assetSearch],
        queryFn: fetchAction,
        enabled: Boolean(accessToken),
        initialPageParam: 0,
        staleTime: Config.assetsStaleTime,
        getNextPageParam: (lastPage, allPages, lastPageParam) => {
            if(lastPage && lastPage.length === 0) {
              return undefined
            }
            if(lastPage && lastPage.length < Config.perPage) {
                return undefined
            }

            return lastPageParam + 1
        },
        getPreviousPageParam: (firstPage, allPages, firstPageParam) => {
            if(firstPageParam <= 1) {
              return undefined
            }
            return firstPageParam - 1
        }
    });
    
    useEffect(() => {
        setAssetSearch(search);
    }, [search]);

    useEffect(() => {
        if(inView && !isFetching) { fetchNextPage() }
    }, [inView, isFetching, fetchNextPage]);

    if(isPending || isRefetching || !assets || !accessToken && !error) {
        return (
            <VisibleSpinner containerType="center" />
        );
    }

    if(error) {
        return (
            <FetchError
                phrases={phrases}
                refreshAction={() => queryClient.resetQueries({ queryKey: ['assets', assetsType, favoriteAssetsIds, assetSearch] })}
            />
        );
    }

    if(assets)
    return (
        <div ref={type === "list" ? pullToRefreshRef : null}>
            <div className="assets-list-column">
                <div ref={type === "list" ? pullToRefreshAreaRef : null} key="0" className="assets-list-row">
                    {
                        (type === "list" && assetsType.code === "crypto") && <div className="assets-list-cell assets-list-rank">#</div>
                    }
                    <div className="assets-list-cell assets-list-name">{phrases.asset}</div>
                    {
                        type === "list" && <div className="assets-list-cell assets-list-delta">{phrases.deltaDay}</div>
                    }
                    <div className="assets-list-cell assets-list-price">{phrases.price}</div>
                </div>
                <hr />
                {
                    assets.pages.map((group, i) => (
                        group?.map((asset) => (
                            <PressableArea
                                key={asset.id}
                                onPress={onSelect}
                                value={asset}
                            >
                                <AssetRow
                                    asset={asset}
                                    compact={type !== "list"}
                                    assetsType={assetsType}
                                />
                            </PressableArea>
                        ))
                    ))
                }
                <div ref={ref}>
                    <VisibleSpinner isVisible={hasNextPage} containerType="flex" />
                </div>
            </div>
        </div>
    );
}


