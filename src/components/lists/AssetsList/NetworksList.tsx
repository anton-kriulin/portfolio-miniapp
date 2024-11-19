'use client'
import { List, Modal } from "@telegram-apps/telegram-ui"
import { NetworkDto } from '@/lib/Types';
import { NetworkRow, PressableArea } from '@/components';
import './styles.css'

interface INetworksListProps {
    networks: NetworkDto[]
    onSelect: (network: NetworkDto) => void
}

export const NetworksList = ({ networks, onSelect }: INetworksListProps) => {

    return (
        <div className="modal-workarea">
            <div className="select-assets-row">
                {
                    networks.map((network) => (
                        <PressableArea
                            key={network.id}
                            onPress={onSelect}
                            value={network}
                        >
                            <Modal.Close>
                                <div>
                                    <NetworkRow network={network} />
                                </div>
                            </Modal.Close>
                        </PressableArea>
                    ))
                }
            </div>
        </div>
    );
}


