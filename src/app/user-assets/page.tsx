'use client'
import { AssetsHeader, NavBar, UserAssetsList, ActionMenu, MockDataControl} from "@/components";

interface PortfolioPageProps {
}

export default function PortfolioPage({}: PortfolioPageProps) {
    return (
        <>
            <AssetsHeader />
            <MockDataControl />
            <div className="workarea">
                <UserAssetsList type="list" />
            </div>
            <ActionMenu />
            <NavBar currentPage={{ code: 'userAssets' }} />
        </>
    );
}