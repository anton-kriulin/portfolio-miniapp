'use client'
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AssetsList, MarketHeader, NavBar, Controls, VisibleSpinner, MockDataControl } from '@/components';
import { AssetDto, IControl } from '@/lib/Types';
import { useSession, useControls, useUserOptions } from '@/hooks';

interface AssetsListPageProps {
	params: {slug: string}
}

export default function AssetsListPage({params}: AssetsListPageProps) {

	const {phrases, dataType} = useSession();
	const {assetTypes} = useControls(phrases);
	
	const [assetType, setAssetType] = useState<IControl>(assetTypes[params.slug || "crypto"]);
	const [search, setSearch] = useState<string>('');

	const router = useRouter();

	const onSelect = (asset: AssetDto) => {
		router.push(`/assets/detail/${asset.id}`);
	}

	return (
		<>
			<MarketHeader onSearch={setSearch} />
			{
				(dataType === "demo" && assetType.code === "favorites") &&
					<MockDataControl />
			}
			<div className="workarea" >
				<Controls 
					controlsList={{ crypto: assetTypes.crypto, fiat: assetTypes.fiat, favorites: assetTypes.favorites }}
					currentControl={assetType}
					onSelect={type => setAssetType(type)}
				/>
				<AssetsList
					onSelect={asset => onSelect(asset)}
					assetsType={assetType}
					type="list"
					search={search}
				/>
			</div>
			<NavBar currentPage={{ code: 'market' }} />
		</>

	);
}

