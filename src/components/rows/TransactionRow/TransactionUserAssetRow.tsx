import { UserAssetDto } from "@/lib/Types";
import Image from "next/image";
import './styles.css'

interface TransactionUserAssetRowProps {
    userAsset: UserAssetDto
    amount?: string
}

export const TransactionUserAssetRow = ({userAsset, amount}: TransactionUserAssetRowProps) => {
    return (
        <>
            <div className="transaction-card-row-left">
                <div className="transaction-card-row-column-logo">
                    <Image
                        width={24}
                        height={24}
                        src={userAsset.asset.logo || ""}
                        alt={userAsset.name}
                    />
                </div>
                <div className="transaction-card-row-column-left">
                    <div className="transaction-card-user-asset-name">
                        {userAsset.name}
                    </div>
                </div>
            </div>
            <div className="transaction-card-row-right">
                <div className="transaction-card-user-asset-value">
                    {amount}
                </div>
            </div>
        </>
    );
}