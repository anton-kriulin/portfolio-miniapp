'use client'
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { AssetDetails, AssetDetailsHeader, NavBar, FetchError, VisibleSpinner } from "@/components";
import { ApiGetAsset } from "@/lib/ApiManager";
import { useSession } from "@/hooks";
import { IPage } from "@/lib/Types";

interface AssetDetailsPageProps {
	params: { id: string }
	/* searchParams: { [key: string]: string | string[] | undefined } */
}

export default function AssetDetailsPage({ params/* , searchParams */ }: AssetDetailsPageProps) {
	const queryClient = useQueryClient();
	const {accessToken, phrases} = useSession();

	const fetchAction = async () => {
		if(!accessToken) { return }
		return await ApiGetAsset(accessToken, Number(params.id))
	}

	const {data: asset, error} = useQuery({
		queryKey: ['asset', params.id],
		queryFn: fetchAction,
		enabled: Boolean(accessToken)
	});

	if(error) {
		return (
			<FetchError
				phrases={phrases}
				refreshAction={() => queryClient.resetQueries({ queryKey: ['asset', params.id] }) } 
			/>
		);
	}

	if(!asset) {
		return (
			<VisibleSpinner isVisible={true} containerType="center" />
		);
	}
		
	return (
		<>
			<AssetDetailsHeader asset={asset} />
			<AssetDetails asset={asset} />
			<NavBar currentPage={{ code: 'coins' } as IPage} />
		</>
	);
}

/* const getAssetFromSearchParams = (searchParams: { [key: string]: string | string[] | undefined }) => {
	if(searchParams.name && 
		searchParams.ticker && 
		searchParams.logo && 
		searchParams.name_full) {
			
		return {
			id: Number(searchParams.id),
			name: searchParams.name.toString(),
			name_full: searchParams.name_full.toString(),
			ticker: searchParams.ticker.toString(),
			symbol: searchParams.symbol ? searchParams.symbol.toString() : '',
			logo: searchParams.logo.toString(),
			price: Number(searchParams.price),
			rank: Number(searchParams.rank),
			delta_day: Number(searchParams.delta_day),
			market_cap: Number(searchParams.market_cap)
		} as AssetDto;
	}
} */

/* if(!searchParams || !searchParams.name || !searchParams.ticker || !searchParams.logo || !searchParams.name_full) {
	return (
			<div>Error. Asset is undefined</div>
	);
} */