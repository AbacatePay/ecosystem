/**
 * The webhook resource itself, as returned by the `webhooks/*` endpoints.
 *
 * https://docs.abacatepay.com/pages/webhooks/reference
 */
export interface APIWebhook {
	/**
	 * Unique webhook identifier.
	 */
	id: string;
	/**
	 * Webhook name.
	 */
	name: string;
	/**
	 * HTTPS endpoint that receives the events.
	 */
	endpoint: string;
	/**
	 * Event types this webhook is subscribed to.
	 *
	 * @remarks The API also accepts the v1 event names on a v2 webhook. Those
	 * events are delivered with the v1 payload, not with the shapes below.
	 *
	 * @see {@link WebhookEventType}
	 */
	events: (WebhookEventType | WebhookV1EventName)[];
	/**
	 * Indicates whether the webhook was created in a testing environment.
	 */
	devMode: boolean;
	/**
	 * Indicates whether this webhook targets the v2 API.
	 */
	v2: boolean;
	/**
	 * Webhook creation date and time.
	 */
	createdAt: string;
	/**
	 * Webhook last updated date and time.
	 */
	updatedAt: string;
}

/**
 * v1 event names that the API also accepts when subscribing a webhook.
 */
export type WebhookV1EventName =
	| 'billing.paid'
	| 'billing.disputed'
	| 'withdraw.done'
	| 'withdraw.failed';

/**
 * Body of a webhook delivered with the legacy scheme: `X-Webhook-Signature`
 * header and `?webhookSecret=` in the URL. Every endpoint created before the
 * Standard Webhooks cutoff receives events in this format.
 *
 * https://docs.abacatepay.com/pages/webhooks
 */
export interface BaseWebhookEvent<
	Type extends WebhookEventType,
	Data extends object,
> {
	/**
	 * The data received in the event.
	 */
	data: Data;
	/**
	 * Delivery identifier (`log_…`). Automatic retries reuse it, so it works
	 * as an idempotency key; a manual resend from the dashboard gets a new one.
	 */
	id: string;
	/**
	 * This field identifies the type of event received.
	 */
	event: Type;
	/**
	 * Payload version. Always `2`.
	 */
	apiVersion: 2;
	/**
	 * Indicates whether the event occurred in the development environment.
	 */
	devMode: boolean;
}

/**
 * Body of a webhook delivered with Standard Webhooks
 * (https://www.standardwebhooks.com), used by endpoints created on or after
 * the cutoff. Same `apiVersion`, `devMode` and `data` as the legacy body, but
 * the event name is in `type` and there is no `id`: the delivery identifier
 * is the `webhook-id` header.
 */
export type StandardWebhookEvent<Event extends WebhookEvent = WebhookEvent> =
	Event extends WebhookEvent
		? Omit<Event, 'id' | 'event'> & {
				/**
				 * Event type. Same values as `event` in the legacy body.
				 */
				type: Event['event'];
				/**
				 * Time of the first delivery attempt (ISO 8601). Retries and
				 * manual resends keep the original value.
				 */
				timestamp: string;
			}
		: never;

/**
 * Status of a checkout (billing).
 */
export type WebhookCheckoutStatus =
	| 'PENDING'
	| 'EXPIRED'
	| 'CANCELLED'
	| 'PAID'
	| 'UNDER_DISPUTE'
	| 'REFUNDED'
	| 'ACTIVE'
	| 'REDEEMED';

/**
 * Payment methods a checkout accepts.
 */
export type WebhookCheckoutMethod =
	| 'PIX'
	| 'CRYPTO'
	| 'CARD'
	| 'BOLETO'
	| 'GOOGLE_PAY'
	| 'APPLE_PAY';

/**
 * Charge frequency.
 */
export type WebhookFrequency =
	| 'ONE_TIME'
	| 'MULTIPLE_PAYMENTS'
	| 'SUBSCRIPTION';

/**
 * Status of a payment intent (the charge behind a transparent payment).
 * Card payments are `APPROVED` when confirmed; Pix and boleto are `PAID`.
 */
export type WebhookPaymentStatus =
	| 'PENDING'
	| 'EXPIRED'
	| 'CANCELLED'
	| 'PAID'
	| 'UNDER_DISPUTE'
	| 'REFUNDED'
	| 'REDEEMED'
	| 'APPROVED'
	| 'FAILED';

/**
 * Status of a withdrawal transaction.
 */
export type WebhookTransactionStatus =
	| 'PENDING'
	| 'APPROVED'
	| 'EXPIRED'
	| 'CANCELLED'
	| 'COMPLETE'
	| 'REFUNDED'
	| 'REDEEMED'
	| 'UNDER_DISPUTE'
	| 'FAILED';

/**
 * Method of a withdrawal transaction.
 */
export type WebhookTransactionMethod =
	| 'PIX'
	| 'CARD'
	| 'PIX_QRCODE'
	| 'BOLETO'
	| 'INTERNAL'
	| 'TED';

/**
 * Customer block present in checkout, transparent and subscription events.
 */
export interface WebhookCustomer {
	/**
	 * Customer ID. An empty string when the resource has no customer: the
	 * block itself is never `null`.
	 */
	id: string;
	/**
	 * Customer's name.
	 */
	name: string | null;
	/**
	 * Customer's email (`''` when the customer has none, `null` when there is no customer).
	 */
	email: string | null;
	/**
	 * Masked CPF or CNPJ (e.g. `529.***.247-**`, `12.***.678/0001-**`).
	 */
	taxId: string | null;
}

/**
 * UTM parameters captured with the payment.
 */
export interface WebhookUtms {
	/**
	 * `utm_source`.
	 */
	source: string | null;
	/**
	 * `utm_medium`.
	 */
	medium: string | null;
	/**
	 * `utm_campaign`.
	 */
	campaign: string | null;
	/**
	 * `utm_term`.
	 */
	term: string | null;
	/**
	 * `utm_content`.
	 */
	content: string | null;
}

/**
 * Name and document shown for Pix and boleto payments. It comes from the
 * customer of the charge, so `isSameAsCustomer` is always `true`.
 */
export interface WebhookPayerDocument {
	/**
	 * Customer's name.
	 */
	name: string | null;
	/**
	 * Customer's masked CPF or CNPJ.
	 */
	taxId: string | null;
	/**
	 * Always `true`.
	 */
	isSameAsCustomer: true;
}

/**
 * Card used in the payment.
 */
export interface WebhookPayerCard {
	/**
	 * Last four digits of the card.
	 */
	number: string | null;
	/**
	 * Card brand (e.g. `VISA`).
	 */
	brand: string | null;
}

/**
 * Payer block, keyed by the payment method. Pix QR Code payments report
 * `method: 'PIX'`.
 */
export type WebhookPayerInformation =
	| {
			/**
			 * Payment method.
			 */
			method: 'PIX';
			/**
			 * UTM parameters of the payment.
			 */
			utms: WebhookUtms;
			/**
			 * Payer of the PIX payment.
			 */
			PIX: WebhookPayerDocument;
	  }
	| {
			/**
			 * Payment method.
			 */
			method: 'CARD';
			/**
			 * UTM parameters of the payment.
			 */
			utms: WebhookUtms;
			/**
			 * Card used in the payment.
			 */
			CARD: WebhookPayerCard;
	  }
	| {
			/**
			 * Payment method.
			 */
			method: 'BOLETO';
			/**
			 * UTM parameters of the payment.
			 */
			utms: WebhookUtms;
			/**
			 * Payer of the Boleto.
			 */
			BOLETO: WebhookPayerDocument;
	  };

/**
 * Who actually paid a checkout, as reported by the payment provider. Only
 * resolved while the checkout is `PAID` or `REFUNDED`; `null` otherwise.
 */
export interface WebhookCheckoutPayer {
	/**
	 * Payer name.
	 */
	name: string | null;
	/**
	 * Masked CPF or CNPJ.
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
 * Checkout object sent in `checkout.*` events: the `/v2/checkouts/get` shape
 * plus the fields below.
 */
export interface WebhookCheckout {
	/**
	 * Unique checkout identifier (`bill_…`).
	 */
	id: string;
	/**
	 * Checkout ID in your system.
	 */
	externalId: string | null;
	/**
	 * URL where the customer pays.
	 */
	url: string;
	/**
	 * Amount in cents. In `checkout.*` events, the amount of the checkout's
	 * payment (the total of the sale for card installments); in
	 * `subscription.*` events, the checkout amount.
	 */
	amount: number;
	/**
	 * Amount already paid in cents. `null` when nothing (or zero) was paid.
	 */
	paidAmount: number | null;
	/**
	 * AbacatePay fee in cents.
	 */
	platformFee: number | null;
	/**
	 * Products in the checkout.
	 */
	items: {
		/**
		 * Product ID (`prod_…`).
		 */
		id: string;
		/**
		 * Item quantity.
		 */
		quantity: number;
	}[];
	/**
	 * Checkout status.
	 */
	status: WebhookCheckoutStatus;
	/**
	 * Payment methods the checkout accepts.
	 */
	methods: WebhookCheckoutMethod[];
	/**
	 * Checkout frequency.
	 */
	frequency: WebhookFrequency;
	/**
	 * Coupons allowed in the checkout.
	 */
	coupons: string[];
	/**
	 * Whether the checkout was created in dev mode.
	 */
	devMode: boolean;
	/**
	 * Customer ID associated with the checkout.
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
	 * Metadata you sent when creating the checkout.
	 */
	metadata: Record<string, unknown> | null;
	/**
	 * Checkout creation date and time.
	 */
	createdAt: string;
	/**
	 * Checkout last updated date and time.
	 */
	updatedAt: string;
	/**
	 * Trial length in days, for subscription checkouts.
	 */
	trialDays: number | null;
	/**
	 * End of the trial, for subscription checkouts.
	 */
	trialEndsAt: string | null;
	/**
	 * First charge date, for subscription checkouts.
	 */
	nextChargeAt: string | null;
	/**
	 * Card configuration.
	 */
	card: {
		/**
		 * Maximum number of card installments allowed.
		 */
		maxInstallments: number;
	};
	/**
	 * Late interest configuration (boleto). `{}` when it is not configured.
	 */
	interest?:
		| {
				/**
				 * Monthly interest, in hundredths of a percent.
				 */
				value: number;
		  }
		| Record<string, never>
		| null;
	/**
	 * Late fine configuration (boleto). `{}` when it is not configured.
	 */
	fine?:
		| {
				/**
				 * Cents when `type` is `FIXED`, hundredths of a percent when `PERCENTAGE`.
				 */
				value: number;
				/**
				 * Type of fine.
				 */
				type: 'PERCENTAGE' | 'FIXED';
		  }
		| Record<string, never>
		| null;
	/**
	 * Boleto due date (`YYYY-MM-DD`).
	 */
	dueDate: string | null;
	/**
	 * ID of the product offered as an upsell.
	 */
	upSellProductId: string | null;
	/**
	 * Number of card installments, or `null` when not paid in installments.
	 */
	installmentsCount: number | null;
	/**
	 * Who actually paid, as reported by the provider.
	 */
	payerInformation: WebhookCheckoutPayer | null;
	/**
	 * UTM parameters of the payment. An empty object when none were captured.
	 */
	utms: WebhookUtms | Record<string, never>;
}

/**
 * `data` of the `checkout.*` events.
 */
export interface WebhookCheckoutEventData {
	/**
	 * The checkout.
	 */
	checkout: WebhookCheckout;
	/**
	 * Customer of the checkout.
	 */
	customer: WebhookCustomer;
	/**
	 * Built from the latest payment intent of the checkout. Only missing if
	 * the checkout has no payment intent.
	 */
	payerInformation?: WebhookPayerInformation;
}

/**
 * Extra field of refund and dispute events.
 */
export interface WebhookReasonData {
	/**
	 * Free text. Refunds: the refund reason, or `Refund completed`. Disputes:
	 * the reason reported for the dispute, or `Dispute created`.
	 */
	reason: string;
}

/**
 * Fields shared by every transparent payment.
 */
export interface WebhookTransparentBase {
	/**
	 * Payment ID: `pix_char_…` (Pix QR Code), `card_…` (card) or `bole_…`
	 * (boleto).
	 */
	id: string;
	/**
	 * Payment ID in your system.
	 */
	externalId: string | null;
	/**
	 * Amount in cents. For card installments, the total of the sale (see
	 * `installmentAmount` for the installment).
	 */
	amount: number;
	/**
	 * Always `null` for transparent payments (there is no checkout behind
	 * them).
	 */
	paidAmount: number | null;
	/**
	 * AbacatePay fee in cents of this payment intent. For card installments,
	 * the share of the installment in `installmentNumber`, not of the sale.
	 */
	platformFee: number | null;
	/**
	 * Payment status: `APPROVED` for card payments, `PAID` for PIX and Boleto when completed.
	 */
	status: WebhookPaymentStatus;
	/**
	 * Always empty for transparent payments.
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
	 * Always empty for transparent payments.
	 */
	methods: WebhookCheckoutMethod[];
	/**
	 * Payment frequency.
	 */
	frequency: WebhookFrequency;
	/**
	 * Always empty for transparent payments.
	 */
	coupons: string[];
	/**
	 * Whether the payment was created in dev mode.
	 */
	devMode: boolean;
	/**
	 * Customer ID associated with the payment.
	 */
	customerId: string | null;
	/**
	 * Payment creation date and time.
	 */
	createdAt: string;
	/**
	 * Payment last updated date and time.
	 */
	updatedAt: string;
	/**
	 * Payment receipt URL.
	 */
	receiptUrl: string | null;
	/**
	 * Metadata you sent when creating the payment. An empty object when none.
	 */
	metadata: Record<string, unknown>;
}

/**
 * Installment fields, present only on card payments split in 2 or more
 * installments.
 */
export interface WebhookTransparentInstallment {
	/**
	 * Number of installments of the sale.
	 */
	installmentCount: number;
	/**
	 * Amount in cents of this installment.
	 */
	installmentAmount: number;
	/**
	 * Which installment this payment intent is (1-based).
	 */
	installmentNumber: number;
	/**
	 * Installment group ID (`cinst_…`).
	 */
	installmentGroupId: string | null;
}

/**
 * Transparent payment object sent in `transparent.*` events. The card token,
 * brand and last four digits are not part of it: brand and last four digits
 * are in `payerInformation.CARD`.
 */
export type WebhookTransparent = WebhookTransparentBase &
	(
		| WebhookTransparentInstallment
		| { [Key in keyof WebhookTransparentInstallment]?: never }
	);

/**
 * `data` of the `transparent.*` events.
 */
export interface WebhookTransparentEventData {
	/**
	 * The transparent payment.
	 */
	transparent: WebhookTransparent;
	/**
	 * Customer of the payment.
	 */
	customer: WebhookCustomer;
	/**
	 * Payer of the payment, keyed by the payment method.
	 */
	payerInformation: WebhookPayerInformation;
}

/**
 * Subscription object sent in `subscription.*` events.
 */
export interface WebhookSubscription {
	/**
	 * Unique subscription identifier (`subs_…`).
	 */
	id: string;
	/**
	 * Subscription amount in cents.
	 */
	amount: number;
	/**
	 * Subscription currency.
	 */
	currency: 'BRL';
	/**
	 * Payment method of the subscription.
	 */
	method: 'PIX' | 'CARD';
	/**
	 * Subscription status.
	 */
	status: 'PENDING' | 'ACTIVE' | 'CANCELLED';
	/**
	 * Billing cycle.
	 */
	frequency:
		| 'DAILY'
		| 'WEEKLY'
		| 'MONTHLY'
		| 'QUARTERLY'
		| 'SEMIANNUALLY'
		| 'ANNUALLY';
	/**
	 * Subscription creation date and time.
	 */
	createdAt: string;
	/**
	 * Subscription last updated date and time.
	 */
	updatedAt: string;
	/**
	 * When the subscription was cancelled.
	 */
	canceledAt: string | null;
	/**
	 * How the cancellation applies: right away (`NOW`) or at the end of the cycle (`NEXT_CYCLE`).
	 */
	cancelPolicy: 'NOW' | 'NEXT_CYCLE' | null;
	/**
	 * Why it was cancelled, e.g. `max_payment_retries_exceeded` or
	 * `dispute_opened`. Free text.
	 */
	cancelledDueTo: string | null;
}

/**
 * Checkout of the subscription, as sent in `subscription.*` events.
 */
export type WebhookSubscriptionCheckout = Pick<
	WebhookCheckout,
	| 'id'
	| 'externalId'
	| 'url'
	| 'amount'
	| 'paidAmount'
	| 'platformFee'
	| 'frequency'
	| 'items'
	| 'status'
	| 'methods'
	| 'customerId'
	| 'receiptUrl'
	| 'metadata'
	| 'createdAt'
	| 'updatedAt'
> & {
	/**
	 * Only present when UTM parameters were captured.
	 */
	utms?: WebhookUtms;
};

/**
 * Latest payment intent of the subscription's checkout.
 */
export interface WebhookSubscriptionPayment {
	/**
	 * Payment ID (`char_…`, `pix_char_…` or `card_…`).
	 */
	id: string;
	/**
	 * `externalId` of the subscription checkout.
	 */
	externalId: string | null;
	/**
	 * Amount in cents.
	 */
	amount: number;
	/**
	 * Amount already paid in the checkout, in cents.
	 */
	paidAmount: number | null;
	/**
	 * AbacatePay fee in cents. Missing when the payment has no transaction.
	 */
	platformFee?: number;
	/**
	 * Payment status.
	 */
	status: WebhookPaymentStatus;
	/**
	 * Payment methods of the checkout.
	 */
	methods: WebhookCheckoutMethod[];
	/**
	 * Payment receipt URL.
	 */
	receiptUrl: string | null;
	/**
	 * Payment creation date and time.
	 */
	createdAt: string;
	/**
	 * Payment last updated date and time.
	 */
	updatedAt: string;
	/**
	 * Metadata of the payment (`{}` when none).
	 */
	metadata: Record<string, unknown>;
}

/**
 * `data` of the `subscription.*` events.
 */
export interface WebhookSubscriptionEventData {
	/**
	 * The subscription.
	 */
	subscription: WebhookSubscription;
	/**
	 * Subscribed customer.
	 */
	customer: WebhookCustomer;
	/**
	 * Missing only if the subscription's checkout can't be loaded.
	 */
	checkout?: WebhookSubscriptionCheckout;
	/**
	 * Missing only if the subscription's checkout has no payment intent.
	 */
	payment?: WebhookSubscriptionPayment;
	/**
	 * Missing only if the subscription's checkout has no payment intent.
	 */
	payerInformation?: WebhookPayerInformation;
}

/**
 * Extra fields of `subscription.plan_changed` when it is sent at the request
 * (`POST /subscriptions/change-plan`). The event is sent again, without
 * these fields, when the change is applied on the next renewal.
 */
export interface WebhookSubscriptionPlanChangeRequest {
	/**
	 * Origin of the change.
	 */
	changeSource: 'API_CHANGE_PLAN';
	/**
	 * ID of the pending plan change.
	 */
	pendingUpdateId: string;
	/**
	 * New products of the subscription.
	 */
	items: {
		/**
		 * Product ID (`prod_…`).
		 */
		productId: string;
		/**
		 * Quantity.
		 */
		quantity: number;
		/**
		 * New amount of this item in cents.
		 */
		newAmount: number;
	}[];
	/**
	 * Same as `items[0].productId`.
	 */
	productId: string;
	/**
	 * Same as `items[0].quantity`.
	 */
	quantity: number;
	/**
	 * Amount that will be charged once the change is applied, in cents.
	 */
	newAmount: number;
	/**
	 * Status of the plan change.
	 */
	status: 'PENDING' | 'APPLIED' | 'CANCELLED';
	/**
	 * When the change was requested.
	 */
	requestedAt: string;
}

/**
 * Extra fields of `subscription.payment_failed`.
 */
export type WebhookSubscriptionPaymentFailure =
	| {
			/**
			 * Installment ID (`intl_…`).
			 */
			installmentId: string;
			/**
			 * Number of the installment (cycle) that failed.
			 */
			installmentNumber: number;
			/**
			 * How many charge attempts failed. Sent when the last retry fails.
			 */
			retryNumber: number;
	  }
	| {
			/**
			 * Installment ID (`intl_…`).
			 */
			installmentId: string;
			/**
			 * Number of the installment (cycle) that failed.
			 */
			installmentNumber: number;
			/**
			 * Rejection code of an automatic Pix charge, when the bank sent one.
			 */
			rejectCode?: string;
	  };

/**
 * Withdrawal object sent in `payout.*` events.
 */
export interface WebhookPayout {
	/**
	 * Unique transaction identifier (`tran_…`).
	 */
	id: string;
	/**
	 * Amount in cents.
	 */
	amount: number;
	/**
	 * `COMPLETE` in `payout.completed`, `FAILED` in `payout.failed`.
	 */
	status: WebhookTransactionStatus;
	/**
	 * Transaction method.
	 */
	method: WebhookTransactionMethod;
	/**
	 * Fee in cents.
	 */
	platformFee: number;
	/**
	 * Receipt URL (Currently always `null` in webhooks).
	 */
	receiptUrl: string | null;
	/**
	 * Currently always `null`: withdrawals with an `externalId` are sent as
	 * `transfer.*`.
	 */
	externalId: string | null;
	/**
	 * Withdrawal creation date and time.
	 */
	createdAt: string;
	/**
	 * Withdrawal last updated date and time.
	 */
	updatedAt: string;
	/**
	 * PIX end-to-end identifier (Currently always `null` in webhooks).
	 */
	endToEndIdentifier: string | null;
}

/**
 * Transfer object sent in `transfer.*` events: a withdrawal created with an
 * `externalId`.
 */
export interface WebhookTransfer {
	/**
	 * Unique transaction identifier (`tran_…`).
	 */
	id: string;
	/**
	 * Transfer ID in your system.
	 */
	externalId: string;
	/**
	 * Amount in cents.
	 */
	amount: number;
	/**
	 * `COMPLETE` in `transfer.completed`, `FAILED` in `transfer.failed`.
	 */
	status: WebhookTransactionStatus;
	/**
	 * Transaction method.
	 */
	method: WebhookTransactionMethod;
	/**
	 * Fee in cents.
	 */
	platformFee: number;
	/**
	 * Receipt URL (Currently always `null` in webhooks).
	 */
	receiptUrl: string | null;
	/**
	 * Transfer creation date and time.
	 */
	createdAt: string;
	/**
	 * Transfer last updated date and time.
	 */
	updatedAt: string;
	/**
	 * PIX end-to-end identifier (Currently always `null` in webhooks).
	 */
	endToEndIdentifier: string | null;
}

/**
 * https://docs.abacatepay.com/pages/webhooks/events/checkout
 */
export type WebhookCheckoutCompletedEvent = BaseWebhookEvent<
	WebhookEventType.CheckoutCompleted,
	WebhookCheckoutEventData
>;

/**
 * https://docs.abacatepay.com/pages/webhooks/events/checkout
 */
export type WebhookCheckoutRefundedEvent = BaseWebhookEvent<
	WebhookEventType.CheckoutRefunded,
	WebhookCheckoutEventData & WebhookReasonData
>;

/**
 * Sent when a dispute is opened and again when it is resolved: `status` is
 * `UNDER_DISPUTE` while open, back to `PAID` (or `ACTIVE`) when won and
 * `REFUNDED` when lost.
 *
 * https://docs.abacatepay.com/pages/webhooks/events/checkout
 */
export type WebhookCheckoutDisputedEvent = BaseWebhookEvent<
	WebhookEventType.CheckoutDisputed,
	WebhookCheckoutEventData & WebhookReasonData
>;

/**
 * https://docs.abacatepay.com/pages/webhooks/events/transparent
 */
export type WebhookTransparentCompletedEvent = BaseWebhookEvent<
	WebhookEventType.TransparentCompleted,
	WebhookTransparentEventData
>;

/**
 * https://docs.abacatepay.com/pages/webhooks/events/transparent
 */
export type WebhookTransparentRefundedEvent = BaseWebhookEvent<
	WebhookEventType.TransparentRefunded,
	WebhookTransparentEventData & WebhookReasonData
>;

/**
 * Sent when a dispute is opened and again when it is resolved: `status` is
 * `UNDER_DISPUTE` while open, `PAID` when won and `REFUNDED` when lost.
 *
 * https://docs.abacatepay.com/pages/webhooks/events/transparent
 */
export type WebhookTransparentDisputedEvent = BaseWebhookEvent<
	WebhookEventType.TransparentDisputed,
	WebhookTransparentEventData & WebhookReasonData
>;

/**
 * https://docs.abacatepay.com/pages/webhooks/events/subscriptions
 */
export type WebhookSubscriptionCompletedEvent = BaseWebhookEvent<
	WebhookEventType.SubscriptionCompleted,
	WebhookSubscriptionEventData
>;

/**
 * https://docs.abacatepay.com/pages/webhooks/events/subscriptions
 */
export type WebhookSubscriptionTrialStartedEvent = BaseWebhookEvent<
	WebhookEventType.SubscriptionTrialStarted,
	WebhookSubscriptionEventData
>;

/**
 * https://docs.abacatepay.com/pages/webhooks/events/subscriptions
 */
export type WebhookSubscriptionCancelledEvent = BaseWebhookEvent<
	WebhookEventType.SubscriptionCancelled,
	WebhookSubscriptionEventData
>;

/**
 * Sent for every paid installment after the first one. For a subscription
 * with a trial, the first real charge also arrives as `subscription.renewed`.
 *
 * https://docs.abacatepay.com/pages/webhooks/events/subscriptions
 */
export type WebhookSubscriptionRenewedEvent = BaseWebhookEvent<
	WebhookEventType.SubscriptionRenewed,
	WebhookSubscriptionEventData
>;

/**
 * https://docs.abacatepay.com/pages/webhooks/events/subscriptions
 */
export type WebhookSubscriptionPlanChangedEvent = BaseWebhookEvent<
	WebhookEventType.SubscriptionPlanChanged,
	WebhookSubscriptionEventData &
		(
			| WebhookSubscriptionPlanChangeRequest
			| { [Key in keyof WebhookSubscriptionPlanChangeRequest]?: never }
		)
>;

/**
 * https://docs.abacatepay.com/pages/webhooks/events/subscriptions
 */
export type WebhookSubscriptionPaymentFailedEvent = BaseWebhookEvent<
	WebhookEventType.SubscriptionPaymentFailed,
	WebhookSubscriptionEventData & WebhookSubscriptionPaymentFailure
>;

/**
 * https://docs.abacatepay.com/pages/webhooks/events/payouts
 */
export type WebhookPayoutCompletedEvent = BaseWebhookEvent<
	WebhookEventType.PayoutCompleted,
	{
		/**
		 * Withdrawal data.
		 */
		withdraw: WebhookPayout;
	}
>;

/**
 * https://docs.abacatepay.com/pages/webhooks/events/payouts
 */
export type WebhookPayoutFailedEvent = BaseWebhookEvent<
	WebhookEventType.PayoutFailed,
	{
		/**
		 * Withdrawal data.
		 */
		withdraw: WebhookPayout;
	}
>;

/**
 * https://docs.abacatepay.com/pages/webhooks/events/transfers
 */
export type WebhookTransferCompletedEvent = BaseWebhookEvent<
	WebhookEventType.TransferCompleted,
	{
		/**
		 * Transfer data.
		 */
		transfer: WebhookTransfer;
	}
>;

/**
 * https://docs.abacatepay.com/pages/webhooks/events/transfers
 */
export type WebhookTransferFailedEvent = BaseWebhookEvent<
	WebhookEventType.TransferFailed,
	{
		/**
		 * Transfer data.
		 */
		transfer: WebhookTransfer;
	}
>;

/**
 * Events that can be subscribed to but are never sent.
 *
 * @deprecated AbacatePay does not send `checkout.lost` or `transparent.lost`:
 * a lost dispute arrives as `checkout.disputed` / `transparent.disputed` with
 * `status: 'REFUNDED'`.
 */
export type WebhookUndocumentedEvent = BaseWebhookEvent<
	WebhookEventType.CheckoutLost | WebhookEventType.TransparentLost,
	Record<string, unknown>
>;

/**
 * Any v2 webhook body, in the legacy format.
 *
 * https://docs.abacatepay.com/pages/webhooks
 */
export type WebhookEvent =
	| WebhookCheckoutCompletedEvent
	| WebhookCheckoutRefundedEvent
	| WebhookCheckoutDisputedEvent
	| WebhookTransparentCompletedEvent
	| WebhookTransparentRefundedEvent
	| WebhookTransparentDisputedEvent
	| WebhookSubscriptionCompletedEvent
	| WebhookSubscriptionTrialStartedEvent
	| WebhookSubscriptionCancelledEvent
	| WebhookSubscriptionRenewedEvent
	| WebhookSubscriptionPlanChangedEvent
	| WebhookSubscriptionPaymentFailedEvent
	| WebhookPayoutCompletedEvent
	| WebhookPayoutFailedEvent
	| WebhookTransferCompletedEvent
	| WebhookTransferFailedEvent
	| WebhookUndocumentedEvent;

/**
 * https://docs.abacatepay.com/pages/webhooks/reference
 */
export enum WebhookEventType {
	CheckoutCompleted = 'checkout.completed',
	CheckoutRefunded = 'checkout.refunded',
	CheckoutDisputed = 'checkout.disputed',
	/**
	 * @deprecated Accepted when subscribing, never sent.
	 */
	CheckoutLost = 'checkout.lost',
	TransparentCompleted = 'transparent.completed',
	TransparentRefunded = 'transparent.refunded',
	TransparentDisputed = 'transparent.disputed',
	/**
	 * @deprecated Accepted when subscribing, never sent.
	 */
	TransparentLost = 'transparent.lost',
	SubscriptionCompleted = 'subscription.completed',
	SubscriptionCancelled = 'subscription.cancelled',
	SubscriptionRenewed = 'subscription.renewed',
	SubscriptionTrialStarted = 'subscription.trial_started',
	SubscriptionPlanChanged = 'subscription.plan_changed',
	SubscriptionPaymentFailed = 'subscription.payment_failed',
	PayoutCompleted = 'payout.completed',
	PayoutFailed = 'payout.failed',
	TransferCompleted = 'transfer.completed',
	TransferFailed = 'transfer.failed',
}
