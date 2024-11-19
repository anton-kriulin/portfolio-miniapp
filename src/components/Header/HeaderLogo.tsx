'use client'
import { useSession } from "@/hooks"
import { Config } from "@/lib/Config"
import './styles.css'

export const HeaderLogo = () => {
    return (
        <div className="header-logo">
            <span color={Config.colors.PrimaryGreen} className="portfolio-logo-green">P</span><span className="portfolio-logo">ortfolio</span>
        </div>
    )
}

export const MarketHeaderLogo = () => {
    const {phrases} = useSession();
    return (
        <div className="header-logo">
            <span className="logo">{phrases.market}</span>
        </div>
    )
}

export const TransactionsHeaderLogo = () => {
    const {phrases} = useSession();
    return (
        <div className="header-logo">
            <span className="logo">{phrases.transactions}</span>
        </div>
    )
}

export const AssetsHeaderLogo = () => {
    const {phrases} = useSession();
    return (
        <div className="header-logo">
            <span className="logo">{phrases.assets}</span>
        </div>
    )
}

export const MoreLogo = () => {
    const {phrases} = useSession();
    return (
        <div className="header-logo">
            <span className="logo">{phrases.more}</span>
        </div>
    )
}