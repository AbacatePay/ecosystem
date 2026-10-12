import type { TransactionKind, TransactionMethod } from './transaction';

/**
 * Kind of a bank statement movement. Refunds are reported as `WITHDRAW` and undone refunds as `DEPOSIT`.
 */
export type BankStatementKind = Exclude<
	TransactionKind,
	'REFUND' | 'UNDO_REFUND'
>;

/**
 * One movement of a bank statement entry.
 */
export interface APIBankStatementMovement {
	/**
	 * Amount in cents.
	 */
	amount: number;
	/**
	 * Transaction kind (`REFUND` is reported as `WITHDRAW`, `UNDO_REFUND` as `DEPOSIT`; fees as `WITHDRAW`).
	 */
	kind: BankStatementKind;
	/**
	 * Transaction method (`INTERNAL` for fees).
	 */
	method: TransactionMethod;
	/**
	 * Human description, in Portuguese. Absent for kinds without a label.
	 */
	description?: string;
	/**
	 * Movement category.
	 */
	category: 'transaction' | 'withdrawal' | 'refund' | 'fee' | 'reversal';
	/**
	 * Effect on the available balance.
	 */
	balanceEffect: 'credit' | 'debit' | 'none';
}

/**
 * An entry of your bank statement: one transaction and, when a fee was charged, the fee.
 *
 * https://docs.abacatepay.com/pages/bank-statement/reference
 */
export interface APIBankStatementItem {
	/**
	 * Transaction ID. Also the pagination cursor.
	 */
	id: string;
	/**
	 * The transaction and, when charged, its fee.
	 */
	movements: APIBankStatementMovement[];
	/**
	 * Currency.
	 */
	currency: 'BRL';
	/**
	 * Transaction creation date.
	 */
	createdAt: string;
	/**
	 * Related checkout (`bill_...`). `null` for withdrawals.
	 */
	checkoutId: string | null;
	/**
	 * Related charge. `null` for withdrawals.
	 */
	paymentIntentId: string | null;
	/**
	 * The transaction `externalId`.
	 */
	referenceId: string | null;
	/**
	 * Customer or payer of the transaction, when known. `taxId` is not masked.
	 */
	customer: {
		publicId?: string;
		name?: string;
		email?: string;
		taxId?: string;
		cellphone?: string;
		zipCode?: string;
	} | null;
}
