'use client'
import { useSearchParams } from 'next/navigation';
import { EditTransaction, TransactionsHeader, NavBar } from '@/components';

export default function EditTransactionPage() {
	const searchParams = useSearchParams();
 	const transactionId = Number(searchParams.get('id'));
	const type = searchParams.get('type')?.toString();

	return (
		<>
			<TransactionsHeader />
			<div className="workarea">
				<EditTransaction transactionId={transactionId} type={type} />
			</div>
			<NavBar currentPage={{ code: 'editTransaction' }} />
		</>
	);
}
