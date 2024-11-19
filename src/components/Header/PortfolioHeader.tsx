import { PremiumButton } from '@/components'
import { HeaderLogo } from './HeaderLogo';
import './styles.css';

export const PortfolioHeader = () => {
    
    return (
        <div className="header">
            <div className="header-row">
                <div className="header-row-left">
                </div>
                <div className="header-row-center">
                    <HeaderLogo />
                </div>
                
                <div className="header-row-right">
                    {/* <PremiumButton /> */}
                </div>
            </div>
        </div>
    )
}

