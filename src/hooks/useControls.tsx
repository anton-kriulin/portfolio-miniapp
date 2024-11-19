import { PhraseDto, IControls } from "@/lib/Types";
import { ArrowDownRightIcon, ArrowRightArrowLeftIcon, ArrowUpRightIcon, DeleteIcon, EditIcon } from "@/assets/icons";

export const useControls = (phrases: PhraseDto) => {
    const assetTypes: IControls = {
        userAssets: {
            id: 0,
            code: "user-assets",
            name: phrases.assets
        },
        crypto: {
            id: 1,
            code: "crypto",
            name: phrases.crypto
        },
        fiat: {
            id: 2,
            code: "fiat",
            name: phrases.fiat
        },
        favorites: {
            id: 4,
            code: "favorites",
            name: phrases.favorites
        },
        portfolio: {
            id: 5,
            code: "portfolio",
            name: phrases.portfolio
        },
    };

    const periods: IControls = {
        week: {
            id: 7,
            code: "week",
            name: "7d"
        },
        month: {
            id: 30,
            code: "month",
            name: "30d"
        },
        quarter: {
            id: 90,
            code: "quarter",
            name: "90d"
        },
        half_year: {
            id: 180,
            code: "half_year",
            name: "180d"
        },
        year: {
            id: 365,
            code: "year",
            name: "365d"
        }
    }

    const chartTypes: IControls = {
        line: {
            id: 1,
            code: "line",
            name: phrases.line
        },
        candle: {
            id: 2,
            code: "ohlc",
            name: phrases.candle
        }
    }

    const transactionTypes: IControls = {
        expense: {
            id: 1,
            code: "expense",
            name: phrases.expense,
            icon: <ArrowUpRightIcon size={26} />
        },
        income: {
            id: 2,
            code: "income",
            name: phrases.income,
            icon: <ArrowDownRightIcon size={26} />
        },
        transfer: {
            id: 3,
            code: "transfer",
            name: phrases.transfer,
            icon: <ArrowRightArrowLeftIcon size={26} />
        },
        deal: {
            id: 5,
            code: "deal",
            name: phrases.deal,
            icon: <ArrowRightArrowLeftIcon size={26} />
        },
        adjustment: {
            id: 6,
            code: "adjustment",
            name: phrases.addAsset,
            icon: <ArrowRightArrowLeftIcon size={26} />
        },
    }

    const languages: IControls = {
        en: {
            id: 1,
            code: "en",
            name: phrases.english
        },
        ru: {
            id: 2,
            code: "ru",
            name: phrases.russian
        }
    }

    const transactionControls: IControls = {
        edit: {
            id: 1,
            code: "edit",
            name: phrases.edit,
            icon: <EditIcon size={26} />
        },
        delete: {
            id: 2,
            code: "delete",
            name: phrases.delete,
            icon: <DeleteIcon size={26} />
        },
    }

    const userAssetControls: IControls = {
        edit: {
            id: 1,
            code: "edit",
            name: phrases.edit,
            icon: <EditIcon size={26} />
        },
        delete: {
            id: 2,
            code: "delete",
            name: phrases.delete,
            icon: <DeleteIcon size={26} />
        },
    }

    const dataTypes: IControls = {
        demo: {
            id: 1,
            code: "demo",
            name: phrases.demo,
        },
        user: {
            id: 2,
            code: "user",
            name: phrases.user,
        },
    }

    return {
        assetTypes, 
        periods, 
        chartTypes, 
        transactionTypes, 
        languages, 
        transactionControls,
        dataTypes,
        userAssetControls
    };
}