import Image from 'next/image';
import { AssetDto, IControl } from '@/lib/Types';
import { numberToStringWithSymbol } from '@/lib/Utils';
import './styles.css'

interface AssetRowProps {
    asset: AssetDto
    compact: boolean
    assetsType?: IControl
}

export const AssetRow = ({ asset, compact, assetsType }: AssetRowProps) => {

    return (
        <div className="asset-row">
            {
                (!compact && assetsType && assetsType.code === "crypto") && <div className="asset-row-cell asset-row-cell-rank">{asset.rank}</div>
            }
            
            <div className="asset-row-cell asset-row-cell-titleblock">
                <div className="asset-row-cell-titleblock-logo">
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
                <div className="asset-row-cell-titleblock-name">
                    <div className="asset-row-cell-titleblock-name-text">{asset.name}</div>
                    <div>{asset.ticker}</div>
                </div>
            </div>
            {
                (!compact && asset.delta_day) ? 
                    <div className="asset-row-cell asset-row-cell-delta">
                        <span className={asset.delta_day && asset.delta_day > 0 ? "text-emerald-600" : "text-red-400"}>
                            {numberToStringWithSymbol(asset.delta_day, "percent", 2, true, "arrow")}
                        </span>
                    </div>
                : ""
            }
            
            <div className="asset-row-cell asset-row-cell-price">
                <div>
                    {
                        asset.asset_types_id == 2 
                        ? numberToStringWithSymbol(1 / asset.price, asset.symbol, 2, false)
                        : numberToStringWithSymbol(asset.price, "$", 2, false)
                    }
                </div>
            </div>
        </div>
    );
}
