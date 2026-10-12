import type { TransactionStatus } from './transaction';

/**
 * A refund created by `POST /checkouts/refund`, `POST /payment-links/refund` or `POST /transparents/refund`.
 * Refunds are always of the full amount.
 *
 * https://docs.abacatepay.com/pages/payment/refund
 */
export interface APIRefund {
	/**
	 * Refund transaction ID (`tran_...`).
	 */
	id: string;
	/**
	 * Refund status: `COMPLETE` when created; may later become `FAILED`.
	 *
	 * @see {@link TransactionStatus}
	 */
	status: TransactionStatus;
	/**
	 * Refunded amount in cents.
	 */
	amount: number;
	/**
	 * The reason sent in the request.
	 */
	reason: string | null;
	/**
	 * The ID sent in the request.
	 */
	originalId: string;
	/**
	 * Refund creation date and time.
	 */
	createdAt: string;
}
