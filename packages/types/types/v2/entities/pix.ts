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
	 * Additional metadata attached to the charge.
	 */
	metadata?: Record<string, object>;
}

/**
 * https://docs.abacatepay.com/pages/transparents/boleto
 */
export interface APIBoleto {
	/**
	 * Unique Boleto identifier.
	 */
	id: string;
	/**
	 * Charge amount in cents.
	 */
	amount: number;
	/**
	 * Boleto status.
	 *
	 * @see {@link PaymentStatus}
	 */
	status: PaymentStatus;
	/**
	 * Indicates whether the charge is in a testing (true) or production (false) environment.
	 */
	devMode: boolean;
	/**
	 * Boleto barcode.
	 */
	barCode: string;
	/**
	 * URL to view/print the Boleto.
	 */
	url: string;
	/**
	 * PIX alternative for paying the same Boleto.
	 */
	pix: {
		/**
		 * PIX code (copy-and-paste) for payment.
		 */
		brCode: string;
		/**
		 * PIX code in Base64 format (Useful for displaying in images).
		 */
		brCodeBase64: string;
	};
	/**
	 * Platform fee in cents.
	 */
	platformFee: number;
	/**
	 * Payment receipt URL.
	 */
	receiptUrl: string | null;
	/**
	 * Boleto creation date and time.
	 */
	createdAt: string;
	/**
	 * Boleto last updated date and time.
	 */
	updatedAt: string;
	/**
	 * Boleto expiration date and time.
	 */
	expiresAt: string;
	/**
	 * Additional metadata attached to the charge.
	 */
	metadata?: Record<string, object>;
}

/**
 * Outbound PIX transfer to a third-party PIX key (Sending money out).
 *
 * https://docs.abacatepay.com/pages/pix/reference
 */
export interface APIPixTransfer {
	/**
	 * Unique transfer identifier.
	 */
	id: string;
	/**
	 * Transfer status.
	 *
	 * @see {@link PixTransferStatus}
	 */
	status: PixTransferStatus;
	/**
	 * Indicates whether the transfer is in a testing (true) or production (false) environment.
	 */
	devMode: boolean;
	/**
	 * Proof-of-transfer URL, available once completed.
	 */
	receiptUrl: string | null;
	/**
	 * Transfer amount in cents.
	 */
	amount: number;
	/**
	 * Platform fee in cents.
	 */
	platformFee: number;
	/**
	 * Unique transfer identifier in your system.
	 */
	externalId: string | null;
	/**
	 * Transfer creation date and time.
	 */
	createdAt: string;
	/**
	 * Transfer last updated date and time.
	 */
	updatedAt: string;
}

/**
 * https://docs.abacatepay.com/pages/pix/reference
 */
export enum PixTransferStatus {
	Pending = 'PENDING',
	Expired = 'EXPIRED',
	Cancelled = 'CANCELLED',
	Complete = 'COMPLETE',
	Refunded = 'REFUNDED',
}

/**
 * https://docs.abacatepay.com/pages/pix/create
 */
export enum PixKeyType {
	CPF = 'CPF',
	CNPJ = 'CNPJ',
	Phone = 'PHONE',
	Email = 'EMAIL',
	Random = 'RANDOM',
	BRCode = 'BR_CODE',
}
