'use client'
import { useSession } from '@/hooks'
import './styles.css'

interface SelectCategoryTabsProps {
    category: 'buy' | 'sell'
    onCategoryChange: (category: 'buy' | 'sell') => void
}

export const SelectCategoryTabs = ({ category, onCategoryChange }: SelectCategoryTabsProps) => {

    const {phrases} = useSession();
    return (
        <div className="select-category-tabs-container">
            <div
                onClick={() => onCategoryChange('buy')}
                className={"select-category-tab select-category-tab-buy" + (category == 'buy' ? " select-category-tab-active" : '')}
            >
                {phrases.buy}
            </div>
            <div
                onClick={() => onCategoryChange('sell')}
                className={"select-category-tab select-category-tab-sell" + (category == 'sell' ? " select-category-tab-active" : '')}
            >
                {phrases.sell}
            </div>
        </div>
    );
}