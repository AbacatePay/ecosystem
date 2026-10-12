import type { APIBoletoFine, APIBoletoInterest } from './checkout';
import type { TransactionStatus } from './transaction';
import type { TransparentStatus } from './transparent';

/**
 * A transparent PIX QR Code charge (`pix_char_...`).
 *
 * https://docs.abacatepay.com/pages/transparents/reference
 */
export interface APIQRCodePIX {
	/**
	 * Unique QRCode PIX identifier (`pix_char_...`).
	 */
	id: string;
	/**
	 * Charge amount in cents (e.g. 4000 = R$40.00).
	 */
	amount: number;
	/**
	 * PIX status.
	 *
	 * @see {@link TransparentStatus}
	 */
	status: TransparentStatus;
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
	 * Payment receipt URL.
	 */
	receiptUrl: string | null;
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
	 * The metadata sent on creation (`{}` when none).
	 */
	metadata: Record<string, unknown>;
}

/**
 * A transparent Boleto charge (`bole_...`).
 *
 * https://docs.abacatepay.com/pages/transparents/boleto
 */
export interface APIBoleto {
	/**
	 * Unique Boleto identifier (`bole_...`).
	 */
	id: string;
	/**
	 * Charge amount in cents.
	 */
	amount: number;
	/**
	 * Boleto status.
	 *
	 * @see {@link TransparentStatus}
	 */
	status: TransparentStatus;
	/**
	 * Indicates whether the charge is in a testing (true) or production (false) environment.
	 */
	devMode: boolean;
	/**
	 * Boleto barcode.
	 */
	barCode: string;
	/**
	 * Typeable line ("linha digitável").
	 */
	identificationNumber: string;
	/**
	 * The provider's "nosso número".
	 */
	providerNumber: string;
	/**
	 * URL to view/print the Boleto (`https://app.abacatepay.com/pay/{id}/boleto`).
	 */
	url: string;
	/**
	 * PIX code (copy-and-paste) that also pays this Boleto.
	 */
	brCode: string;
	/**
	 * PIX QR Code of `brCode` in Base64 format.
	 */
	brCodeBase64: string;
	/**
	 * Platform fee in cents.
	 */
	platformFee: number;
	/**
	 * Late interest configuration.
	 *
	 * @remarks The API currently returns `{}` or omits the key when it is not configured.
	 */
	interest?: APIBoletoInterest | Record<string, never> | null;
	/**
	 * Late fine configuration.
	 *
	 * @remarks The API currently returns `{}` or omits the key when it is not configured.
	 */
	fine?: APIBoletoFine | Record<string, never> | null;
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
	 * The metadata sent on creation (`{}` when none).
	 */
	metadata: Record<string, unknown>;
}

/**
 * Outbound PIX transfer to a third-party PIX key (Sending money out).
 *
 * https://docs.abacatepay.com/pages/pix/reference
 */
export interface APIPixTransfer {
	/**
	 * Unique transfer identifier (`tran_...`).
	 */
	id: string;
	/**
	 * Transfer status. A transfer is `COMPLETE` when created and becomes `FAILED` if it is rejected afterwards.
	 *
	 * @see {@link PixTransferStatus}
	 */
	status: TransactionStatus;
	/**
	 * Indicates whether the transfer is in a testing (true) or production (false) environment.
	 */
	devMode: boolean;
	/**
	 * Transfer receipt URL (`https://app.abacatepay.com/receipt/{id}`).
	 */
	receiptUrl: string;
	/**
	 * Gross transfer amount in cents. The recipient receives `amount - platformFee`.
	 */
	amount: number;
	/**
	 * Platform fee in cents.
	 */
	platformFee: number;
	/**
	 * Unique transfer identifier in your system. Absent when the transaction has none.
	 */
	externalId?: string;
	/**
	 * Transfer creation date and time.
	 */
	createdAt: string;
	/**
	 * Transfer last updated date and time.
	 */
	updatedAt: string;
}

export {
	/**
	 * https://docs.abacatepay.com/pages/pix/reference
	 */
	TransactionStatus as PixTransferStatus,
} from './transaction';

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
