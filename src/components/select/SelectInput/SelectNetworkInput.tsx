'use client'
import { NetworkDto } from '@/lib/Types';
import './styles.css'
import { NetworkRow } from '@/components';
import { useSession } from '@/hooks';

export const SelectNetworkInput = ({ selectedNetwork }: { selectedNetwork?: NetworkDto }) => {
    const {phrases} = useSession();
    if(selectedNetwork) {
        return (
            <div className="select-input">
                <div className="select-input-container">
                    <div className="select-input-container-asset-row">
                        <NetworkRow network={selectedNetwork}/>
                    </div>
                </div>
        </div>
        );
    }
    return (
        <div className="select-input">
            <div className="select-input-container">
                <div className="select-input-container-empty">{phrases.selectNetwork}</div>
            </div>
        </div>
    );
}