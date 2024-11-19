'use client'
import { TransactionsHeader, NavBar, TransactionsList, ActionMenu, MockDataControl } from '@/components';

export default function AssetsListPage() {

	return (
		<>
			<TransactionsHeader />
			<MockDataControl />
			<div className="workarea">
				<TransactionsList />
			</div>
			<ActionMenu />
			<NavBar currentPage={{ code: 'transactions' }} />
		</>

	);
}
