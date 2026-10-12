/**
 * A product inside a checkout, payment link or subscription checkout.
 */
export interface APICheckoutItem {
	/**
	 * Product ID (`prod_...`). On creation you may send the product `externalId` instead.
	 */
	id: string;
	/**
	 * Item quantity (Integer >= 1).
	 */
	quantity: number;
}

/**
 * Late interest configuration of a Boleto.
 */
export interface APIBoletoInterest {
	/**
	 * Integer monthly interest, in hundredths of a percent (100 = 1% a month).
	 */
	value: number;
}

/**
 * Late fine configuration of a Boleto.
 */
export interface APIBoletoFine {
	/**
	 * Integer value: cents when `type` is `FIXED`, hundredths of a percent when `PERCENTAGE`.
	 */
	value: number;
	/**
	 * Type of fine applied.
	 */
	type: 'FIXED' | 'PERCENTAGE';
}

/**
 * Who actually paid a checkout, as reported by the payment provider.
 */
export interface APIPayerInformation {
	/**
	 * Payer name.
	 */
	name: string | null;
	/**
	 * Payer CPF/CNPJ, masked.
	 */
	taxId: string | null;
	/**
	 * Payer bank account (PIX payments).
	 */
	bank: {
		ispb: string | null;
		ispbName: string | null;
		account: string | null;
		accountDigit: string | null;
		accountType: 'CHECKING' | 'SAVINGS' | null;
		agency: string | null;
		pixAddressKey: string | null;
		pixKeyType: string | null;
	} | null;
	/**
	 * Card used (Card payments).
	 */
	card: {
		/**
		 * Last four digits of the card.
		 */
		number: string | null;
		/**
		 * Card brand.
		 */
		brand: string | null;
	} | null;
}

/**
 * A checkout (`bill_...`). Payment links and subscription checkouts have the same shape.
 *
 * https://docs.abacatepay.com/pages/payment/reference#estrutura
 */
export interface APICheckout {
	/**
	 * Unique billing identifier (`bill_...`).
	 */
	id: string;
	/**
	 * Bill ID in your system.
	 */
	externalId: string | null;
	/**
	 * URL where the customer completes the payment (`https://app.abacatepay.com/pay/{id}`).
	 */
	url: string;
	/**
	 * Total amount in cents.
	 */
	amount: number;
	/**
	 * Amount already paid in cents. `null` while nothing was paid.
	 */
	paidAmount: number | null;
	/**
	 * Platform fee in cents.
	 */
	platformFee: number | null;
	/**
	 * Billing frequency.
	 *
	 * @see {@link PaymentFrequency}
	 */
	frequency: PaymentFrequency;
	/**
	 * Products of the billing. `id` is always the product ID, even when the checkout was created with the product `externalId`.
	 */
	items: APICheckoutItem[];
	/**
	 * Billing status.
	 *
	 * @see {@link CheckoutStatus}
	 */
	status: CheckoutStatus;
	/**
	 * Payment methods currently available to the buyer, already filtered by the methods enabled for your store. Legacy checkouts may contain `CRYPTO`.
	 */
	methods: (PaymentMethod | 'CRYPTO')[];
	/**
	 * Coupons allowed in the billing.
	 */
	coupons: string[];
	/**
	 * Indicates whether the billing was created in a testing environment.
	 */
	devMode: boolean;
	/**
	 * ID of the customer associated with the billing (`cust_...`).
	 */
	customerId: string | null;
	/**
	 * URL used by the "Back" button.
	 */
	returnUrl: string | null;
	/**
	 * URL the customer is sent to after paying.
	 */
	completionUrl: string | null;
	/**
	 * Payment receipt URL.
	 */
	receiptUrl: string | null;
	/**
	 * The `metadata` sent on creation.
	 */
	metadata: Record<string, unknown> | null;
	/**
	 * Billing creation date and time.
	 */
	createdAt: string;
	/**
	 * Billing last updated date and time.
	 */
	updatedAt: string;
	/**
	 * Trial length in days (Subscription checkouts only).
	 */
	trialDays: number | null;
	/**
	 * End of the trial, counted from the checkout creation (Subscription checkouts only).
	 */
	trialEndsAt: string | null;
	/**
	 * First charge date (Subscription checkouts only).
	 */
	nextChargeAt: string | null;
	/**
	 * Card configuration.
	 */
	card: {
		/**
		 * Maximum number of card installments offered (1-12).
		 */
		maxInstallments: number;
	};
	/**
	 * Boleto late interest.
	 *
	 * @remarks The API currently returns `{}` (get, list and delete) or omits the key (create) when it is not configured.
	 */
	interest?: APIBoletoInterest | Record<string, never> | null;
	/**
	 * Boleto late fine.
	 *
	 * @remarks The API currently returns `{}` (get, list and delete) or omits the key (create) when it is not configured.
	 */
	fine?: APIBoletoFine | Record<string, never> | null;
	/**
	 * Boleto due date (`YYYY-MM-DD`).
	 */
	dueDate: string | null;
	/**
	 * ID of the product offered as an upsell.
	 */
	upSellProductId: string | null;
	/**
	 * Number of card installments of the sale (> 1), `null` otherwise. Always `null` on create and delete responses.
	 */
	installmentsCount: number | null;
	/**
	 * Who paid. Only for `PAID`/`REFUNDED` checkouts; always `null` on create and delete responses.
	 */
	payerInformation: APIPayerInformation | null;
}

/**
 * A subscription checkout (`bill_...` with `frequency: SUBSCRIPTION`), the link customers pay to subscribe.
 *
 * https://docs.abacatepay.com/pages/subscriptions/reference
 */
export type APISubscriptionCheckout = APICheckout;

/**
 * Status of a checkout, payment link or subscription checkout.
 *
 * https://docs.abacatepay.com/pages/payment/reference#atributos
 */
export enum CheckoutStatus {
	Pending = 'PENDING',
	Expired = 'EXPIRED',
	Cancelled = 'CANCELLED',
	Paid = 'PAID',
	UnderDispute = 'UNDER_DISPUTE',
	Refunded = 'REFUNDED',
	/**
	 * Payment links are `ACTIVE` while they accept payments.
	 */
	Active = 'ACTIVE',
	Redeemed = 'REDEEMED',
}

/**
 * https://docs.abacatepay.com/pages/payment/reference#atributos
 *
 * @deprecated Use {@link CheckoutStatus} for checkouts and payment links and {@link TransparentStatus} for transparent charges. This enum lacks statuses the API returns.
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
	Boleto = 'BOLETO',
	/**
	 * One-time checkouts only.
	 */
	GooglePay = 'GOOGLE_PAY',
	/**
	 * One-time checkouts only.
	 */
	ApplePay = 'APPLE_PAY',
}

/**
 * https://docs.abacatepay.com/pages/payment/create#body-frequency
 */
export enum PaymentFrequency {
	OneTime = 'ONE_TIME',
	Multiple = 'MULTIPLE_PAYMENTS',
	Subscription = 'SUBSCRIPTION',
}
