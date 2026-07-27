import type { PaymentStatus } from './checkout';

/**
 * A reusable payment link — unlike a Checkout, the same link can be paid by
 * multiple customers instead of being tied to a single transaction.
 *
 * https://docs.abacatepay.com/pages/payment-links/reference
 */
export interface APIPaymentLink {
	/**
	 * Unique payment link identifier.
	 */
	id: string;
	/**
	 * Shareable checkout URL.
	 */
	url: string;
	/**
	 * Total amount in cents.
	 */
	amount: number;
	/**
	 * Amount paid in cents. `null` if it has not yet been paid.
	 */
	paidAmount: number | null;
	/**
	 * Payment link status.
	 *
	 * @see {@link PaymentStatus}
	 */
	status: PaymentStatus;
	/**
	 * Always `MULTIPLE_PAYMENTS` for payment links.
	 */
	frequency: 'MULTIPLE_PAYMENTS';
	/**
	 * List of items included in the payment link.
	 */
	items: {
		/**
		 * Product ID.
		 */
		id: string;
		/**
		 * Item quantity.
		 */
		quantity: number;
	}[];
	/**
	 * Reference ID in your system.
	 */
	externalId: string | null;
	/**
	 * Payment link creation date and time.
	 */
	createdAt: string;
	/**
	 * Payment link last updated date and time.
	 */
	updatedAt: string;
}
