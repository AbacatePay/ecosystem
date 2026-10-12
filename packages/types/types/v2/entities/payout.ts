import type { TransactionStatus } from './transaction';

/**
 * https://docs.abacatepay.com/pages/payouts/reference
 */
export interface APIPayout {
	/**
	 * Unique transaction identifier (`tran_...`).
	 */
	id: string;
	/**
	 * Current transaction status. A payout is `COMPLETE` when created and becomes `FAILED` if it is rejected afterwards.
	 *
	 * @see {@link PayoutStatus}
	 */
	status: TransactionStatus;
	/**
	 * Indicates whether the transaction was created in a testing environment.
	 */
	devMode: boolean;
	/**
	 * Transaction receipt URL (`https://app.abacatepay.com/receipt/{id}`).
	 */
	receiptUrl: string;
	/**
	 * Payout value in cents.
	 */
	amount: number;
	/**
	 * Platform fee in cents.
	 */
	platformFee: number;
	/**
	 * External transaction identifier. Absent when none was sent.
	 */
	externalId?: string;
	/**
	 * Transaction creation date.
	 */
	createdAt: string;
	/**
	 * Transaction update date.
	 */
	updatedAt: string;
}

export {
	/**
	 * https://docs.abacatepay.com/pages/payouts/reference#atributos
	 */
	TransactionStatus as PayoutStatus,
} from './transaction';
