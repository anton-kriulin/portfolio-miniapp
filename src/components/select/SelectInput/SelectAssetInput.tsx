'use client'
import { AssetRow, UserAssetRow } from '@/components';
import { AssetDto, UserAssetDto } from '@/lib/Types';
import { useControls, useSession } from '@/hooks';
import './styles.css'

interface SelectAssetInputProps {
    selectedAsset?: AssetDto
    selectedUserAsset?: UserAssetDto
}

export const SelectAssetInput = ({selectedAsset, selectedUserAsset}: SelectAssetInputProps) => {
    const {phrases} = useSession();

    if(!selectedAsset && !selectedUserAsset) { 
        return (
            <div className="select-input">
                <div className="select-input-container">
                    <div className="select-input-container-empty">{phrases.selectAsset}</div>
                </div>
            </div>
        );
    }
    return (
        <div className="select-input">
            <div className="select-input-container">
                <div className="select-input-container-asset-row">
                    {
                        selectedAsset && <AssetRow asset={selectedAsset} compact={true} />
                    }
                    {
                        selectedUserAsset && <UserAssetRow userAsset={selectedUserAsset} compact={true} />
                    }
                </div>
            </div>
        </div>
    );
}