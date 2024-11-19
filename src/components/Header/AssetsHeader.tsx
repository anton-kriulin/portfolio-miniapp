'use client'
import { useRouter } from "next/navigation";
import { AssetsHeaderLogo } from './HeaderLogo';
import { postEvent, on } from "@telegram-apps/sdk-react";
import './styles.css';

export const AssetsHeader = () => {
    postEvent('web_app_setup_back_button', { is_visible: false });
    postEvent('web_app_setup_swipe_behavior', { allow_vertical_swipe: false });
    const router = useRouter();
    const backButtonListener = on('back_button_pressed', () => router.back());

    return (
        <div className="header">
            <div className="header-row">
                <div className="header-row-left">
                </div>
                <div className="header-row-center">
                    <AssetsHeaderLogo />
                </div>
                <div className="header-row-right">
                </div>
            </div>

        </div>
    )

}
