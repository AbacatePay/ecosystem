/**
 * https://docs.abacatepay.com/pages/payouts/reference
 */
export interface APIPayout {
	/**
	 * Unique transaction identifier.
	 */
	id: string;
	/**
	 * Current transaction status.
	 */
	status: PayoutStatus;
	/**
	 * Indicates whether the transaction was created in a testing environment.
	 */
	devMode: boolean;
	/**
	 * Transaction proof URL.
	 */
	receiptUrl: string | null;
	/**
	 * Payout value in cents.
	 */
	amount: number;
	/**
	 * Platform fee in cents.
	 */
	platformFee: number;
	/**
	 * External transaction identifier.
	 */
	externalId: string;
	/**
	 * Transaction creation date.
	 */
	createdAt: string;
	/**
	 * Transaction update date.
	 */
	updatedAt: string;
}

/**
 * https://docs.abacatepay.com/pages/payouts/reference#atributos
 */
export enum PayoutStatus {
	Pending = 'PENDING',
	Expired = 'EXPIRED',
	Cancelled = 'CANCELLED',
	Complete = 'COMPLETE',
	Refunded = 'REFUNDED',
}
