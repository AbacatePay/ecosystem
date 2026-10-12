import type { APIBoleto, APIQRCodePIX } from './pix';

/**
 * Status of a transparent charge (PIX, Boleto or card).
 *
 * https://docs.abacatepay.com/pages/transparents/reference
 */
export enum TransparentStatus {
	Pending = 'PENDING',
	Expired = 'EXPIRED',
	Cancelled = 'CANCELLED',
	Paid = 'PAID',
	UnderDispute = 'UNDER_DISPUTE',
	Refunded = 'REFUNDED',
	Redeemed = 'REDEEMED',
	/**
	 * Card charges are `APPROVED` once authorized.
	 */
	Approved = 'APPROVED',
	Failed = 'FAILED',
}

/**
 * Method filter of `GET /transparents/list`.
 *
 * https://docs.abacatepay.com/pages/transparents/list
 */
export enum TransparentMethod {
	/**
	 * PIX charges of hosted checkouts and payment links (`char_...`).
	 */
	Pix = 'PIX',
	/**
	 * Transparent PIX QR Codes (`pix_char_...`).
	 */
	PixQRCode = 'PIX_QRCODE',
	/**
	 * Card charges (`card_...`).
	 */
	Card = 'CARD',
	/**
	 * Boletos (`bole_...`).
	 */
	Boleto = 'BOLETO',
}

/**
 * UTM parameters attached to a transparent charge.
 */
export interface APITransparentUTM {
	source?: string;
	medium?: string;
	campaign?: string;
	term?: string;
	content?: string;
}

/**
 * Fields of a card charge that are always present.
 */
export interface APICardTransparentBase {
	/**
	 * Unique card charge identifier (`card_...`). For installment sales, the ID of the installment described here (the first one on creation).
	 */
	id: string;
	/**
	 * Total of the sale in cents (Not the installment amount).
	 */
	amount: number;
	/**
	 * Charge status. `APPROVED` when authorized (and always in dev mode), `PENDING` while the provider has not settled it.
	 *
	 * @see {@link TransparentStatus}
	 */
	status: TransparentStatus;
	/**
	 * Indicates whether the charge is in a testing (true) or production (false) environment.
	 */
	devMode: boolean;
	/**
	 * Permanent card token. Send it as `cardToken` to charge the same card again without a new tokenization.
	 */
	cardToken: string | null;
	/**
	 * Card brand (e.g. `VISA`).
	 */
	brand: string | null;
	/**
	 * Last four digits of the card.
	 */
	lastFour: string | null;
	/**
	 * Payment receipt URL.
	 */
	receiptUrl: string | null;
	/**
	 * Charge creation date and time.
	 */
	createdAt: string;
	/**
	 * Charge last updated date and time.
	 */
	updatedAt: string;
	/**
	 * Not meaningful for card charges.
	 */
	expiresAt: string;
	/**
	 * The metadata sent on creation (`{}` when none).
	 */
	metadata: Record<string, unknown>;
}

/**
 * Fields present only on card sales split in 2 or more installments.
 */
export interface APICardTransparentInstallment {
	/**
	 * Number of installments of the sale (2-12).
	 */
	installmentCount: number;
	/**
	 * Amount of this installment in cents.
	 */
	installmentAmount: number;
	/**
	 * Which installment this charge is (1-based).
	 */
	installmentNumber: number;
	/**
	 * ID shared by every installment of the sale (`cinst_...`).
	 */
	installmentGroupId: string | null;
}

/**
 * A card charge (`card_...`). The installment fields are present together, and only on sales
 * split in 2 or more installments.
 *
 * https://docs.abacatepay.com/pages/transparents/reference
 */
export type APICardTransparent = APICardTransparentBase &
	(
		| APICardTransparentInstallment
		| { [Key in keyof APICardTransparentInstallment]?: never }
	);

/**
 * A PIX charge of a hosted checkout or payment link (`char_...`). `GET /transparents/list` and
 * `GET /transparents/get` currently return these too: `brCodeBase64` is never present and
 * `brCode` may be missing.
 */
export interface APICheckoutPixCharge
	extends Omit<APIQRCodePIX, 'brCode' | 'brCodeBase64'> {
	/**
	 * PIX code (copy-and-paste) for payment, when available.
	 */
	brCode?: string;
}

/**
 * Any item returned by `GET /transparents/list` or `GET /transparents/get`. There is no `method`
 * field: use the ID prefix (`pix_char_`, `bole_`, `card_`, `char_`) or the `isPixTransparent`,
 * `isBoletoTransparent` and `isCardTransparent` type guards.
 *
 * https://docs.abacatepay.com/pages/transparents/reference
 */
export type APITransparent =
	| APIQRCodePIX
	| APIBoleto
	| APICardTransparent
	| APICheckoutPixCharge;
