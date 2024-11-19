'use client'
import { PortfolioHeader, NavBar, UserAssetsList, PortfolioChart, ActionMenu, MockDataControl } from "@/components";
import { useSession } from '@/hooks';
import './styles.css'

export default function PortfolioPage() {
    return (
        <>
            <PortfolioHeader />
            <MockDataControl />
            <div className="workarea">
                <PortfolioChart />
                <UserAssetsList type="aggregated-list" />
            </div>
            <ActionMenu />
            <NavBar currentPage={{ code: 'portfolio' }} />
        </>
    );
}