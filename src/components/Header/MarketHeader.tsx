'use client'
import { useState, useRef, FormEvent } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from "next/navigation";
import { postEvent, on } from "@telegram-apps/sdk-react";
import { RootState, setAssetSearch } from '@/lib/Redux';
import { FaSearch } from "react-icons/fa";
import { MarketHeaderLogo } from './HeaderLogo';
import { IconButton, SearchInput } from '@/components';
import { Config } from '@/lib/Config';
import { ISearchFormData } from '@/lib/Types';
import './styles.css';

interface MarketHeaderProps {
    onSearch: (search: string) => void
}

export const MarketHeader = ({onSearch}: MarketHeaderProps) => {
    postEvent('web_app_setup_back_button', { is_visible: false });
    postEvent('web_app_setup_swipe_behavior', { allow_vertical_swipe: false });
    const router = useRouter();

/*     const dispatch = useDispatch(); */
    const [ showSearch, setShowSearch ] = useState(false);

    const onSubmit = (data: ISearchFormData) => {
        onSearch(data.search);
/*         dispatch(setAssetSearch(data.search)); */
    }

    const onClear = () => {
/*         dispatch(setAssetSearch('')); */
        onSearch('');
        setShowSearch(false);
    }

    if(!showSearch) {
        return (
            <div className="header">
                <div className="header-row">
                    <div className="header-row-left">
                    </div>
                    <div className="header-row-center">
                        <MarketHeaderLogo />
                    </div>
                    
                    <div className="header-row-right">
                        <IconButton
                            onPress={() => setShowSearch(true) } 
                        >  
                            <FaSearch color={Config.colors.SecondaryText} size={26} />
                        </IconButton>
                    </div>
                </div>

            </div>
        )
    }

    return (
        <div className="header">
            <div className="header-row">
                <SearchInput onSubmit={onSubmit} onClear={onClear} />
            </div>
        </div>
    );
}