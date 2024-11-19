import Image from 'next/image';
import { NetworkDto } from '@/lib/Types';
import './styles.css'

interface NetworkRowProps {
    network: NetworkDto
}

export const NetworkRow = ({ network, }: NetworkRowProps) => {

    return (
        <div className="network-row">
            <div className="network-row-cell asset-row-cell-titleblock">
                <div className="network-row-cell-titleblock-logo">
                    {
                        network.logo &&
                            <Image 
                                src={network.logo || ""} 
                                alt={network.name}
                                width="30"
                                height="30"
                            />
                    }
                </div>
                <div className="network-row-cell-titleblock-name">
                    <div className="network-row-cell-titleblock-name-text">{network.name}</div>
                </div>
            </div>
        </div>
    );
}
