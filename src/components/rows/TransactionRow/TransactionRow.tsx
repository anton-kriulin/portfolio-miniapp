import Image from "next/image";
import { numberToStringWithSymbol, getTransactionProfit } from "@/lib/Utils";
import { ArrowDownRightIcon, ArrowRightArrowLeftIcon, ArrowUpRightIcon, CommentIcon } from "@/assets/icons";
import { TransactionDto } from '@/lib/Types';
import { Config } from "@/lib/Config";
import './styles.css'
import { TransactionUserAssetRow } from "./TransactionUserAssetRow";

interface TransactionRowProps {
    transaction: TransactionDto
}

export const TransactionRow = ({transaction}: TransactionRowProps) => {
    if(!transaction) { return }
/*     const transactionProfitTo = getTransactionProfit(transaction.worth_to, transaction.value_to);
    const transactionProfitFrom = getTransactionProfit(transaction.worth_from, transaction.value_from);
    const dealProfit = getTransactionProfit(transaction.worth_from, transaction.value_from); */

    return (
        <div className="transaction-container">
            {
                (transaction.transaction_type.code === "income" && transaction.user_asset_to && !transaction.user_asset_from) &&
                    <div className="transaction-card">
                        <div className="transaction-card-row">
                            <div className="transaction-card-icon">
                                <ArrowDownRightIcon size={30}  color={Config.colors.PrimaryGreen} />
                            </div>
                            <div className="transaction-card-column">
                                <div className="transaction-card-row">
                                    <TransactionUserAssetRow
                                        userAsset={transaction.user_asset_to}
                                        amount={transaction.amount_to ? numberToStringWithSymbol(
                                            transaction.amount_to, 
                                            transaction.user_asset_to.asset.symbol, 
                                            2, true, "line", transaction.user_asset_to.asset.ticker) : ""}
                                    />
                                </div>
                            </div>
                        </div>
                        {
                            transaction.comment &&
                                <div className="transaction-card-row">
                                    <div className="transaction-card-comment-icon-box">
                                        <CommentIcon size={16} />
                                    </div>
                                    {transaction.comment}
                                </div>
                        }
                    </div>
            }
            {
                (transaction.transaction_type.code === "expense" && transaction.user_asset_from && !transaction.user_asset_to) &&
                    <div className="transaction-card">
                        <div className="transaction-card-row">
                            <div className="transaction-card-icon">
                                <ArrowUpRightIcon size={30}  color={Config.colors.PrimaryRed} />
                            </div>
                            <div className="transaction-card-column">
                                <div className="transaction-card-row">
                                    <TransactionUserAssetRow
                                        userAsset={transaction.user_asset_from}
                                        amount={transaction.amount_from ? numberToStringWithSymbol(
                                            -transaction.amount_from, 
                                            transaction.user_asset_from.asset.symbol, 
                                            2, true, "line", transaction.user_asset_from.asset.ticker): ""}
                                    />
                                </div>
                            </div>
                        </div>
                        {
                            transaction.comment &&
                                <div className="transaction-card-row">
                                    <div className="transaction-card-comment-icon-box">
                                        <CommentIcon size={24} />
                                    </div>
                                    {transaction.comment}
                                </div>
                        }
                    </div>
            }
            {
                ((transaction.transaction_type.code === "deal" || transaction.transaction_type.code === "transfer") 
                && transaction.user_asset_from && transaction.user_asset_to) &&
                    <div className="transaction-card">
                        <div className="transaction-card-row">
                            <div className="transaction-card-icon">
                                <ArrowRightArrowLeftIcon size={30}  color={Config.colors.PrimaryGreen} />
                            </div>
                            <div className="transaction-card-column">
                                <div className="transaction-card-row">
                                    <TransactionUserAssetRow
                                        userAsset={transaction.user_asset_to}
                                        amount={transaction.amount_to ? numberToStringWithSymbol(
                                            transaction.amount_to, 
                                            transaction.user_asset_to.asset.symbol, 
                                            2, true, "line", transaction.user_asset_to.asset.ticker): ""}
                                    />
                                </div>
                                <div className="transaction-card-row">
                                    <TransactionUserAssetRow
                                        userAsset={transaction.user_asset_from}
                                        amount={transaction.amount_from ? numberToStringWithSymbol(
                                            -transaction.amount_from, 
                                            transaction.user_asset_from.asset.symbol, 
                                            2, true, "line", transaction.user_asset_from.asset.ticker): ""}
                                    />
                                </div>
                            </div>
                        </div>
                        {
                            transaction.comment &&
                                <div className="transaction-card-row">
                                    <div className="transaction-card-comment-icon-box">
                                        <CommentIcon size={16} />
                                    </div>
                                    {transaction.comment}
                                </div>
                        }
                    </div>
            }
        </div>
    );
}