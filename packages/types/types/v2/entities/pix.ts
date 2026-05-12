import type { PaymentStatus } from './checkout';

/**
 * https://docs.abacatepay.com/pages/transparents/reference
 */
export interface APIQRCodePIX {
	/**
	 * Unique QRCode PIX identifier.
	 */
	id: string;
	/**
	 * Charge amount in cents (e.g. 4000 = R$40.00).
	 */
	amount: number;
	/**
	 * PIX status. Can be `PENDING`, `EXPIRED`, `CANCELLED`, `PAID`, `REFUNDED`.
	 *
	 * @see {@link PaymentStatus}
	 */
	status: PaymentStatus;
	/**
	 * Indicates whether the charge is in a testing (true) or production (false) environment.
	 */
	devMode: boolean;
	/**
	 * PIX code (copy-and-paste) for payment.
	 */
	brCode: string;
	/**
	 * PIX code in Base64 format (Useful for displaying in images).
	 */
	brCodeBase64: string;
	/**
	 * Platform fee in cents. Example: 80 means R$0.80.
	 */
	platformFee: number;
	/**
	 * QRCode PIX creation date and time.
	 */
	createdAt: string;
	/**
	 * QRCode PIX last updated date and time.
	 */
	updatedAt: string;
	/**
	 * QRCode expiration date and time.
	 */
	expiresAt: string;
	/**
	 * Optional metadata attached to the charge.
	 */
	metadata?: Record<string, unknown>;
}

/**
 * Late interest configuration for boleto transparent checkout charges.
 *
 * https://docs.abacatepay.com/pages/transparents/boleto
 */
export interface APIBoletoInterest {
	/**
	 * Monthly late-interest rate in hundredths of a percent.
	 * For example, `100` means 1% per month.
	 */
	value: number;
}

/**
 * Late fine configuration for boleto transparent checkout charges.
 *
 * https://docs.abacatepay.com/pages/transparents/boleto
 */
export interface APIBoletoFine {
	/**
	 * Fine amount. With `PERCENTAGE`, value is in hundredths of a percent.
	 * With `FIXED`, value is in cents.
	 */
	value: number;
	/**
	 * Fine calculation mode.
	 */
	type: 'PERCENTAGE' | 'FIXED';
}

/**
 * Checkout Transparente charge returned by `/v2/transparents/*`.
 *
 * https://docs.abacatepay.com/pages/transparents/reference
 */
export interface APITransparentCheckout extends APIQRCodePIX {
	/**
	 * Boleto digitable line. Returned for boleto charges.
	 */
	barCode?: string;
	/**
	 * URL to view or print the boleto. Returned for boleto charges.
	 */
	url?: string;
	/**
	 * Late interest configured for boleto charges.
	 */
	interest?: APIBoletoInterest | null;
	/**
	 * Late fine configured for boleto charges.
	 */
	fine?: APIBoletoFine | null;
}
