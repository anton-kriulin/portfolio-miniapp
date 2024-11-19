'use client'
import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { CandleChart, LineChart, UserAssetsList, AddUserAssetModal, Controls } from "@/components"
import { ApiGetAssetPrices } from "@/lib/ApiManager"
import { useSession, useControls } from "@/hooks"
import { AssetDto, IControl } from "@/lib/Types"
import './styles.css'
import { numberToStringWithSymbol } from "@/lib/Utils"

export const AssetDetails = ({ asset }: { asset:  AssetDto}) => {

    const {accessToken, phrases} = useSession();
    const {periods, chartTypes} = useControls(phrases);

    const [chartType, setChartType] = useState<IControl>(chartTypes.line);
    const [chartPeriod, setChartPeriod] = useState<IControl>(periods.week);

    const price = numberToStringWithSymbol(
        asset.asset_types_id == 2 ? 1 / asset.price : asset.price, 
        asset.symbol || "$", 
        2, false);

    const deltaDay = numberToStringWithSymbol(
        asset.delta_day, 
        "percent", 
        2, true);
  
    const fetchAction = async (period: string) => {
        if(!accessToken) { return }

        return await ApiGetAssetPrices(accessToken, Number(asset.id), { period })
    }
  
    const { data: assetPrices, error } = useQuery({
        queryKey: ['assetPrices', asset.id, chartPeriod],
        queryFn: () => fetchAction(chartPeriod.code),
        enabled: Boolean(accessToken)
    });

    return (
        <div className="workarea">
            <div className="asset-details">
                <div className="asset-details-row">
                    <div className="asset-details-name">{asset.name}</div>
                    <div className="asset-details-rank">#{asset.rank}</div>
                </div>
                <div className="asset-details-row">
                    <div className="asset-details-price">{price}</div>
                    <div className="asset-details-delta-day">{deltaDay}</div>
                </div>
                <div className="asset-details-chart">
                    {
                        chartType.code == "ohlc" && <CandleChart />
                    }
                    {
                        chartType.code == "line" && <LineChart chartData={assetPrices} />
                    }
                </div>
                <div className="asset-details-row asset-details-chart-settings">
                    <Controls
                        /* className="asset-details-chart-type-controls" */
                        classNameContainer="asset-details-chart-controls"
                        currentControl={chartPeriod}
                        controlsList={periods}
                        onSelect={period => setChartPeriod(period)}
                    />
                    {/* <Controls
                        className="asset-details-chart-type-controls"
                        classNameContainer="asset-details-chart-type-controls"
                        currentControl={chartType}
                        controlsList={chartTypes}
                        onSelect={type => setChartType(type)}
                    /> */}
                </div>
                <div className="asset-details-balance">
                    <div className="asset-details-balance-title">
                        <h2>{phrases.balance}</h2>
                    </div>
                    <div className="asset-details-balance-user-assets">
                        <UserAssetsList type="list" assetsId={asset.id} compact={true} />
                    </div>
                    <div className="add-user-asset-modal">
                        <AddUserAssetModal trigger={<a>{phrases.addAsset}</a>} asset={asset} />
                    </div>
                </div>
            </div>
        </div>
    )
}