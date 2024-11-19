'use client'
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useInfiniteQuery, useQueryClient, useQuery } from "@tanstack/react-query";
import { useInView } from "react-intersection-observer";
import { List} from "@telegram-apps/telegram-ui"
import { ApiGetUserTransactions } from "@/lib/ApiManager";
import { IParams, IControl, TransactionDto } from '@/lib/Types';
import { PressableArea, VisibleSpinner, FetchError, TransactionRow, ViewTransactionModal, EmptyError } from '@/components';
import { useSession, useControls } from '@/hooks';
import { Config } from '@/lib/Config';
import './styles.css'

interface ITransactionsListProps {
    
}

export const TransactionsList = ({  }: ITransactionsListProps) => {
    const {accessToken, phrases, language, dataType} = useSession();
    /* const transactionTypesList: string[] = ["income", "expense", "deal"]; */
    
    const [showModal, setShowModal] = useState<boolean>(false);
    const [selectedTransaction, setSelectedTransaction] = useState<TransactionDto>();

    const router = useRouter();
    const queryClient = useQueryClient();
    const {ref, inView, entry} = useInView();

    const fetchAction = async ({ pageParam = 0 }: { pageParam: number }) => {
        if(!accessToken) { return }

        const params: IParams = {
            page: pageParam,
            per_page: Config.perPage,
            data_type: dataType
        }

        return await ApiGetUserTransactions(accessToken, params);
    }

    const {data: transactions, error, isPending, isFetching, isRefetching, fetchNextPage, hasNextPage} = useInfiniteQuery({
        queryKey: ['transactions'],
        queryFn: fetchAction,
        enabled: Boolean(accessToken),
        initialPageParam: 0,
        staleTime: Config.transactionsStaleTime,
        getNextPageParam: (lastPage, allPages, lastPageParam) => {
            if(lastPage && lastPage.length === 0) {
              return undefined
            }
            if(lastPage && lastPage.length < Config.perPage) {
                return undefined
            }

            return lastPageParam + 1
        },
        getPreviousPageParam: (firstPage, allPages, firstPageParam) => {
            if(firstPageParam <= 1) {
              return undefined
            }
            return firstPageParam - 1
        }
    });

    const onSelect = (transaction: TransactionDto) => {
        setShowModal(true)
        setSelectedTransaction(transaction)
        /* router.push("/transactions/edit/?id=" + transaction.id) */
    }

    const handleClose = () => {
        setShowModal(false)
    }

    useEffect(() => {
        if(inView && !isFetching) { fetchNextPage() }
    }, [inView, isFetching, fetchNextPage]);

    if(isPending || isRefetching || !transactions || !accessToken && !error) {
        return (
            <VisibleSpinner containerType="center" />
        );
    }

    if(error) {
        return (
            <FetchError
                phrases={phrases}
                refreshAction={() => queryClient.resetQueries({ queryKey: ['transactions'] })}
            />
        );
    }
    if(transactions && 
        transactions.pages && 
        transactions.pages.at(0) && 
        transactions.pages.at(0)?.length === 0) {
        return <EmptyError phrases={phrases} />
    }

    if(transactions)
    return (
        <div>
            <ViewTransactionModal
                open={showModal}
                onCloseModal={handleClose}
                transaction={selectedTransaction}
            />
            <div className="transactions-list-column">
                {
                    transactions.pages.map((group, i) => (
                        group?.map((transaction) => (
                            /* transactionTypesList.includes(transaction.transaction_type.code) &&  */
                            <div key={transaction.id}>
                                {
                                    transaction.show_date && new Date(transaction.date_timestamp).toLocaleDateString(language)
                                }
                                <PressableArea
                                    onPress={onSelect}
                                    value={transaction}
                                >
                                    <TransactionRow transaction={transaction} />
                                </PressableArea>
                            </div>
                        ))
                    ))
                }
                <div ref={ref}>
                    <VisibleSpinner isVisible={hasNextPage} containerType="flex" />
                </div>
            </div>
        </div>
    );
}


