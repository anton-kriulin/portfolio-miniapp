'use client'
import { useState } from 'react';
import { useRouter } from "next/navigation";
import { postEvent, on } from "@telegram-apps/sdk-react";
import { TransactionsHeaderLogo } from './HeaderLogo';
import { SearchInput, AddUserAssetModal, PressableArea, ViewTransactionModal } from '@/components';
import { ISearchFormData } from '@/lib/Types';
import { Config } from '@/lib/Config';
import { AddIcon } from '@/assets/icons';
import './styles.css';

export const TransactionsHeader = () => {
    postEvent('web_app_setup_back_button', { is_visible: false });
    postEvent('web_app_setup_swipe_behavior', { allow_vertical_swipe: false });

    const router = useRouter();
    const [showSearch, setShowSearch] = useState(false);

    const onSubmit = (data: ISearchFormData) => {
    }

    const onClear = () => {
        setShowSearch(false);
    }

    if(showSearch) {
        return (
            <div className="header">
                <div className="header-row">
                    <SearchInput onSubmit={onSubmit} onClear={onClear} />
                </div>
            </div>
        );
    }

    return (
        <div className="header">
            <div className="header-row">
                <div className="header-row-left">
                </div>
                <div className="header-row-center">
                    <TransactionsHeaderLogo />
                </div>
                
                <div className="header-row-right">
                </div>
            </div>
        </div>
    )
}