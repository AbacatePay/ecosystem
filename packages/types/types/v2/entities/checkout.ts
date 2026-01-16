/**
 * https://docs.abacatepay.com/pages/checkouts/reference#estrutura
 */
export interface APICheckout {
	/**
	 * Unique billing identifier.
	 */
	id: string;
	/**
	 * Total amount to be paid in cents.
	 */
	amount: number;
	/**
	 * Amount already paid in cents.`null` if it has not yet been paid.
	 */
	paidAmount: number | null;
	/**
	 * Bill ID in your system.
	 */
	externalId: string | null;
	/**
	 * URL where the user can complete the payment.
	 */
	url: string;
	/**
	 * List of items in billing.
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
	 * Billing status. Can be `PENDING`, `EXPIRED`, `CANCELLED`, `PAID`, `REFUNDED`.
	 *
	 * @see {@link PaymentStatus}
	 */
	status: PaymentStatus;
	/**
	 * Indicates whether the charge was created in a development (true) or production (false) environment.
	 */
	devMode: boolean;
	/**
	 * Additial metadata for the charge.
	 */
	metadata?: Record<string, object>;
	/**
	 * URL that the customer will be redirected to when clicking the “back” button.
	 */
	returnUrl: string;
	/**
	 * URL that the customer will be redirected to when making payment.
	 */
	completionUrl: string;
	/**
	 * Payment receipt URL.
	 */
	receiptUrl: string | null;
	/**
	 * Coupons allowed in billing.
	 */
	coupons: string[];
	/**
	 * Customer ID associated with the charge.
	 */
	customerId: string | null;
	/**
	 * Charge creation date and time.
	 */
	createdAt: string;
	/**
	 * Charge last updated date and time.
	 */
	updatedAt: string;
}

/**
 * https://docs.abacatepay.com/pages/payment/reference#atributos
 */
export enum PaymentStatus {
	Pending = 'PENDING',
	Expired = 'EXPIRED',
	Cancelled = 'CANCELLED',
	Paid = 'PAID',
	Refunded = 'REFUNDED',
}

/**
 * https://docs.abacatepay.com/pages/payment/create#body-methods
 */
export enum PaymentMethod {
	Pix = 'PIX',
	Card = 'CARD',
}

/**
 * https://docs.abacatepay.com/pages/payment/create#body-frequency
 *
 * @deprecated
 */
export enum PaymentFrequency {
	OneTime = 'ONE_TIME',
	Multiple = 'MULTIPLE_PAYMENTS',
}
