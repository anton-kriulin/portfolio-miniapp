import { MoreLogo } from './HeaderLogo';
import './styles.css';

export const MoreHeader = () => {

    return (
        <div className="header">
            <div className="header-row">
                <div className="header-row-left">
                </div>
                <div className="header-row-center">
                    <MoreLogo />
                </div>
                <div className="header-row-right">
                </div>
            </div>
        </div>
    )
}

