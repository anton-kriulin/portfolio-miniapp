import { Text } from "@telegram-apps/telegram-ui";
import { ArrowRightArrowLeftIcon, BarsIcon, ChartLineIcon, CoinsIcon } from "@/assets/icons";
import { IPage, IControl } from "@/lib/Types"
import { user } from "@nextui-org/react";


export const Config: IConfig = {
    userOptionsStaleTime: 100000,
    assetsStaleTime: 100000,
    transactionsStaleTime: 86400000,
    perPage: 25,
    phrases: {
        crypto: {
            en: "Crypto",
            ru: "Крипто"
        },
        fiat: {
            en: "Fiat",
            ru: "Фиат"
        },
        save: {
            en: "Save",
            ru: "Сохранить"
        },
        market: {
            en: "Market",
            ru: "Рынок"
        },
        favorites: {
            en: "Favorites",
            ru: "Избранное"
        },
        line: {
            en: "Line",
            ru: "Линейный график"
        },
        candle: {
            en: "Candle",
            ru: "Свечи"
        },
        addAsset: {
            en: "Add an asset",
            ru: "Добавить актив"
        },
        balance: {
            en: "Balance",
            ru: "Баланс"
        },
        assets: {
            en: "Assets",
            ru: "Активы"
        },
        asset: {
            en: "Asset",
            ru: "Актив"
        },
        assetName: {
            en: "Asset's name",
            ru: "Название актива"
        },
        userAssets: {
            en: "Assets",
            ru: "Активы"
        },
        transactions: {
            en: "Transactions",
            ru: "Транзакции"
        },
        portfolio: {
            en: "Portfolio",
            ru: "Портфель"
        },
        more: {
            en: "More",
            ru: "Ещё"
        },
        selectAsset: {
            en: "Select asset",
            ru: "Выберите актив"
        },
        selectNetwork: {
            en: "Select network",
            ru: "Выберите сеть"
        },
        loading: {
            en: "Loading",
            ru: "Загрузка"
        },
        language: {
            en: "Language",
            ru: "Язык"
        },
        english: {
            en: "English",
            ru: "Английский"
        },
        russian: {
            en: "Russian",
            ru: "Русский"
        },
        mainScreen: {
            en: "Main screen",
            ru: "Главный экран"
        },
        addNewAsset: {
            en: "Let's add a new asset",
            ru: "Добавьте новый актив"
        },
        pL: {
            en: "P&L",
            ru: "Прибыль"
        },
        value: {
            en: "Value",
            ru: "Стоимость"
        },
        date: {
            en: "Date",
            ru: "Дата"
        },
        amount: {
            en: "Amount",
            ru: "Количество"
        },
        price: {
            en: "Price",
            ru: "Цена"
        },
        buy: {
            en: "Buy",
            ru: "Купить"
        },
        sell: {
            en: "Sell",
            ru: "Продать"
        },
        deltaDay: {
            en: "24h",
            ru: "24 часа"
        },
        search: {
            en: "Search",
            ru: "Поиск"
        },
        worth: {
            en: "Worth",
            ru: "Стоимость"
        },
        usd: {
            en: "USD",
            ru: "USD"
        },
        comment: {
            en: "Comment",
            ru: "Комментарий"
        },
        income: {
            en: "Income",
            ru: "Доход"
        },
        expense: {
            en: "Expense",
            ru: "Расход"
        },
        transfer: {
            en: "Transfer",
            ru: "Перевод"
        },
        deal: {
            en: "Deal",
            ru: "Сделка"
        },
        adjustment: {
            en: "Adjustment",
            ru: "Корректировка"
        },
        plus: {
            en: "+",
            ru: "+"
        },
        minus: {
            en: "—",
            ru: "—"
        },
        premium: {
            en: "Premium",
            ru: "Premium"
        },
        edit: {
            en: "Edit",
            ru: "Изменить"
        },
        delete: {
            en: "Delete",
            ru: "Удалить"
        },
        data: {
            en: "Data",
            ru: "Данные"
        },
        demo: {
            en: "Demo",
            ru: "Демо"
        },
        user: {
            en: "User",
            ru: "Пользовательские"
        },
        additional: {
            en: "Additional",
            ru: "Дополнительно"
        },
        hideDemoData: {
            en: "Demo data",
            ru: "Демонстрационные данные"
        },
        hide: {
            en: "Hide",
            ru: "Скрыть"
        },
        somethingWrong: {
            en: "Something went wrong",
            ru: "Что-то пошло не так"
        },
        refresh: {
            en: "Refresh",
            ru: "Повторить"
        },
        deleteUserAsset: {
            en: "Delete asset and all related transactions",
            ru: "Удалить актив и все связанные транзакции"
        },
        cancel: {
            en: "Cancel",
            ru: "Отмена"
        },
        deleteUserAssetConfirmationTitle: {
            en: "Delete asset",
            ru: "Удаление актива"
        },
        deleteUserAssetConfirmationMessage: {
            en: "Deleting an asset will delete all transactions associated with the asset. Are you sure you want to continue?",
            ru: "При удалении актива будут удалены все связанные с активом транзакции. Вы уверены что хотите продолжить?"
        },
    },
    pages: [
        {
            code: 'market',
            url: '/assets/crypto',
            icon: <ChartLineIcon size={24} />,
        },
        {
            code: 'transactions',
            url: '/transactions',
            icon: <ArrowRightArrowLeftIcon size={24} />,
        },
        {
            code: 'portfolio',
            url: '/portfolio',
            icon: <Text className="navbar-portfolio">P</Text>,
        },
        {
            code: 'userAssets',
            url: '/user-assets',
            icon: <CoinsIcon size={24} />,
        },
        {
            code: 'more',
            url: '/more',
            icon: <BarsIcon size={24} />,
        }
    ],
    colors: {
        PrimaryText: '#fff',
        SecondaryText: '#2F4F4F',
        /* PrimaryBackground: 'var(--tg-theme-bg-color)', */
        PrimaryGreen: '#39D2C0',
        PrimaryRed: '#F23645',
    },
    
    slots: {
        Select: {
            button: {
                sx: {
                    color: "var(--tg-theme-text-color)",
                    backgroundColor: "var(--tg-theme-bg-color)"
                },
            },
            indicator: {
                sx: {
                    color: "var(--tg-theme-text-color)",
                    backgroundColor: "var(--tg-theme-bg-color)"
                }
            },
            root: {
                sx: {
                    backgroundColor: "var(--tg-theme-bg-color)",
                    "&:hover": {
                        backgroundColor: 'var(--tg-theme-bg-color)',
                    },
                }
            },
            listbox: {
                sx: {
                    position: "fixed !important",
                    /* backgroundColor: "var(--tg-theme-bg-color)",
                    "&:hover": {
                        backgroundColor: 'var(--tg-theme-secondary-bg-color)',
                    }, */
                }
            },
        },
        Option: {
            backgroundColor: "var(--tg-theme-bg-color)",
            "&:hover": {
                backgroundColor: "var(--tg-theme-secondary-bg-color)",
            },
            "&:active": {
                backgroundColor: "var(--tg-theme-accent-text-color)",
            },
        }
    }
}

interface IConfig {
    pages: IPage[]
    userOptionsStaleTime: number
    assetsStaleTime: number
    transactionsStaleTime: number
    perPage: number
    phrases: IPhrase
    colors: IColor
    slots: ISlot
}

interface IPhrase {
    [key: string]: ILocale
}

interface ILocale {
    [key: string]: string
}

interface IColor {
    [key: string]: string
}

interface ISlot {
    [key: string]: any
}