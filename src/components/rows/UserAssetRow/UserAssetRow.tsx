import Image from 'next/image'
import { UserAssetDto } from '@/lib/Types'
import { numberToStringWithSymbol } from '@/lib/Utils'
import './styles.css'

export const UserAssetRow = ({ userAsset, compact }: { userAsset: UserAssetDto, compact: boolean }) => {
    if(!userAsset || !userAsset.asset) { return }
    const userAssetProfit = userAsset.value - userAsset.worth;
    const userAssetProfitPerCent = userAsset.worth > 0 ? userAssetProfit / Math.abs(userAsset.worth) * 100 : Infinity;

    return (
        <div className="user-asset-row">
            <div className="user-asset-row-cell user-asset-row-block">
                <div className="user-asset-row-logo">
                    <Image 
                        src={userAsset.asset.logo || ""} 
                        alt={userAsset.asset.name}
                        width="30"
                        height="30"
                    />
                </div>
                <div className="user-asset-row-title">
                    <div className="user-asset-row-title-name">{userAsset.name || userAsset.asset.name}</div>
                    <div className="user-asset-row-title-ticker">{userAsset.amount} {userAsset.asset.ticker}</div>
                </div>
            </div>
            {
                (!compact && userAssetProfit != 0) &&
                    <div className="user-asset-row-cell user-asset-row-pl">
                        <div className="user-asset-row-pl-profit">
                            <span className={userAssetProfit && userAssetProfit > 0 ? "text-emerald-600" : "text-red-400"}>
                                { numberToStringWithSymbol(userAssetProfit, "$", 0, false) }
                            </span>
                        </div>
                        <div className="user-asset-row-pl-profit-per-cent">
                            <span className={userAssetProfitPerCent && userAssetProfit  > 0 ? "text-emerald-600" : "text-red-400"}>
                                { numberToStringWithSymbol(userAssetProfitPerCent, "percent", 2, true, "arrow") }
                            </span>
                        </div>
                    </div>
            }
            <div className="user-asset-row-cell user-asset-row-value">
                <div>{numberToStringWithSymbol(userAsset.value, "$", 2, false)}</div>
            </div>
        </div>
    )
}