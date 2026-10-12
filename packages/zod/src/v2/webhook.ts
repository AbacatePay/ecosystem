import { type _ZodType, z } from 'zod';
import { StringEnum } from '../utils';

// Every object below is a `looseObject`: fields AbacatePay adds to the payload
// in the future are kept instead of making the whole event fail to parse.

/**
 * https://docs.abacatepay.com/pages/webhooks/reference
 */
export const WebhookEventType = StringEnum(
	[
		'checkout.completed',
		'checkout.refunded',
		'checkout.disputed',
		'checkout.lost',
		'transparent.completed',
		'transparent.refunded',
		'transparent.disputed',
		'transparent.lost',
		'subscription.completed',
		'subscription.cancelled',
		'subscription.renewed',
		'subscription.trial_started',
		'subscription.plan_changed',
		'subscription.payment_failed',
		'payout.completed',
		'payout.failed',
		'transfer.completed',
		'transfer.failed',
	],
	'Webhook event type. `checkout.lost` and `transparent.lost` can be subscribed to but are never sent.',
).meta({ example: 'checkout.completed' });

/**
 * https://docs.abacatepay.com/pages/webhooks/reference
 */
export type WebhookEventType = z.infer<typeof WebhookEventType>;

/**
 * v1 event names that the API also accepts when subscribing a v2 webhook (Delivered with the v1 payload).
 */
export const WebhookV1EventName = StringEnum(
	['billing.paid', 'billing.disputed', 'withdraw.done', 'withdraw.failed'],
	'v1 event name, delivered with the v1 payload.',
).meta({ example: 'billing.paid' });

/**
 * v1 event names that the API also accepts when subscribing a v2 webhook (Delivered with the v1 payload).
 */
export type WebhookV1EventName = z.infer<typeof WebhookV1EventName>;

/**
 * The webhook resource itself, as returned by the `webhooks/*` endpoints.
 *
 * https://docs.abacatepay.com/pages/webhooks/reference
 */
export const APIWebhook = z.object({
	id: z
		.string()
		.describe('Unique webhook identifier.')
		.meta({ example: 'webh_prod_123' }),
	name: z
		.string()
		.describe('Webhook name.')
		.meta({ example: 'Order fulfillment' }),
	endpoint: z
		.url()
		.describe('HTTPS endpoint that receives the events.')
		.meta({ example: 'https://myshop.com/webhooks/abacatepay' }),
	events: z
		.array(z.union([WebhookEventType, WebhookV1EventName]))
		.describe('Event types this webhook is subscribed to.'),
	devMode: z
		.boolean()
		.meta({ example: false })
		.describe(
			'Indicates whether the webhook was created in a testing environment.',
		),
	v2: z
		.boolean()
		.meta({ example: true })
		.describe('Indicates whether this webhook targets the v2 API.'),
	createdAt: z.coerce
		.date()
		.describe('Webhook creation date and time.')
		.meta({ example: new Date() }),
	updatedAt: z.coerce
		.date()
		.describe('Webhook last updated date and time.')
		.meta({ example: new Date() }),
});

/**
 * https://docs.abacatepay.com/pages/webhooks/reference
 */
export type APIWebhook = z.infer<typeof APIWebhook>;

const nullableString = (description: string) =>
	z.string().nullable().describe(description);

const dateString = (description: string) =>
	z.string().describe(`${description} (ISO 8601).`);

/**
 * Status of a checkout (billing).
 */
export const WebhookCheckoutStatus = StringEnum(
	[
		'PENDING',
		'EXPIRED',
		'CANCELLED',
		'PAID',
		'UNDER_DISPUTE',
		'REFUNDED',
		'ACTIVE',
		'REDEEMED',
	],
	'Checkout status.',
).meta({ example: 'PAID' });

/**
 * Status of a checkout (billing).
 */
export type WebhookCheckoutStatus = z.infer<typeof WebhookCheckoutStatus>;

/**
 * Payment methods a checkout accepts.
 */
export const WebhookCheckoutMethod = StringEnum(
	['PIX', 'CRYPTO', 'CARD', 'BOLETO', 'GOOGLE_PAY', 'APPLE_PAY'],
	'Payment method.',
).meta({ example: 'PIX' });

/**
 * Payment methods a checkout accepts.
 */
export type WebhookCheckoutMethod = z.infer<typeof WebhookCheckoutMethod>;

/**
 * Charge frequency.
 */
export const WebhookFrequency = StringEnum(
	['ONE_TIME', 'MULTIPLE_PAYMENTS', 'SUBSCRIPTION'],
	'Charge frequency.',
).meta({ example: 'ONE_TIME' });

/**
 * Charge frequency.
 */
export type WebhookFrequency = z.infer<typeof WebhookFrequency>;

/**
 * Status of a payment intent. Card payments are `APPROVED` when confirmed; PIX and Boleto are `PAID`.
 */
export const WebhookPaymentStatus = StringEnum(
	[
		'PENDING',
		'EXPIRED',
		'CANCELLED',
		'PAID',
		'UNDER_DISPUTE',
		'REFUNDED',
		'REDEEMED',
		'APPROVED',
		'FAILED',
	],
	'Payment status.',
).meta({ example: 'PAID' });

/**
 * Status of a payment intent. Card payments are `APPROVED` when confirmed; PIX and Boleto are `PAID`.
 */
export type WebhookPaymentStatus = z.infer<typeof WebhookPaymentStatus>;

/**
 * Status of a withdrawal transaction.
 */
export const WebhookTransactionStatus = StringEnum(
	[
		'PENDING',
		'APPROVED',
		'EXPIRED',
		'CANCELLED',
		'COMPLETE',
		'REFUNDED',
		'REDEEMED',
		'UNDER_DISPUTE',
		'FAILED',
	],
	'Transaction status.',
).meta({ example: 'COMPLETE' });

/**
 * Status of a withdrawal transaction.
 */
export type WebhookTransactionStatus = z.infer<typeof WebhookTransactionStatus>;

/**
 * Method of a withdrawal transaction.
 */
export const WebhookTransactionMethod = StringEnum(
	['PIX', 'CARD', 'PIX_QRCODE', 'BOLETO', 'INTERNAL', 'TED'],
	'Transaction method.',
).meta({ example: 'PIX' });

/**
 * Method of a withdrawal transaction.
 */
export type WebhookTransactionMethod = z.infer<typeof WebhookTransactionMethod>;

/**
 * Customer block present in checkout, transparent and subscription events. Never `null`: `id` is `''` when there is no customer.
 */
export const WebhookCustomer = z.looseObject({
	id: z
		.string()
		.describe('Customer ID, or an empty string when there is no customer.')
		.meta({ example: 'cust_123' }),
	name: nullableString("Customer's name."),
	email: nullableString("Customer's email."),
	taxId: nullableString('Masked CPF or CNPJ (e.g. `529.***.247-**`).'),
});

/**
 * Customer block present in checkout, transparent and subscription events.
 */
export type WebhookCustomer = z.infer<typeof WebhookCustomer>;

/**
 * UTM parameters captured with the payment.
 */
export const WebhookUtms = z.looseObject({
	source: nullableString('`utm_source`.'),
	medium: nullableString('`utm_medium`.'),
	campaign: nullableString('`utm_campaign`.'),
	term: nullableString('`utm_term`.'),
	content: nullableString('`utm_content`.'),
});

/**
 * UTM parameters captured with the payment.
 */
export type WebhookUtms = z.infer<typeof WebhookUtms>;

const WebhookPayerDocument = z.looseObject({
	name: nullableString("Customer's name."),
	taxId: nullableString("Customer's masked CPF or CNPJ."),
	isSameAsCustomer: z.boolean().describe('Always `true`.'),
});

const WebhookPayerCard = z.looseObject({
	number: nullableString('Last four digits of the card.'),
	brand: nullableString('Card brand (e.g. `VISA`).'),
});

/**
 * Payer block, keyed by the payment method. PIX QR Code payments report `method: 'PIX'`.
 */
export const WebhookPayerInformation = z.discriminatedUnion('method', [
	z.looseObject({
		method: z.literal('PIX'),
		utms: WebhookUtms,
		PIX: WebhookPayerDocument,
	}),
	z.looseObject({
		method: z.literal('CARD'),
		utms: WebhookUtms,
		CARD: WebhookPayerCard,
	}),
	z.looseObject({
		method: z.literal('BOLETO'),
		utms: WebhookUtms,
		BOLETO: WebhookPayerDocument,
	}),
]);

/**
 * Payer block, keyed by the payment method.
 */
export type WebhookPayerInformation = z.infer<typeof WebhookPayerInformation>;

const WebhookItem = z.looseObject({
	id: z.string().describe('Product ID.').meta({ example: 'prod_123' }),
	quantity: z.number().describe('Item quantity.').meta({ example: 1 }),
});

const WebhookCheckoutPayer = z.looseObject({
	name: nullableString('Payer name.'),
	taxId: nullableString('Masked CPF or CNPJ.'),
	bank: z
		.looseObject({
			ispb: nullableString('ISPB of the bank.'),
			ispbName: nullableString('Name of the bank.'),
			account: nullableString('Account number.'),
			accountDigit: nullableString('Account digit.'),
			accountType: nullableString('`CHECKING` or `SAVINGS`.'),
			agency: nullableString('Agency number.'),
			pixAddressKey: nullableString('PIX key of the payer.'),
			pixKeyType: nullableString('Type of the PIX key.'),
		})
		.nullable()
		.describe('Payer bank account (PIX payments).'),
	card: z
		.looseObject({
			number: nullableString('Last four digits of the card.'),
			brand: nullableString('Card brand.'),
		})
		.nullable()
		.describe('Card used (Card payments).'),
});

const EmptyObject = z.strictObject({});

/**
 * Checkout object sent in `checkout.*` events: the `/v2/checkouts/get` shape plus `utms`.
 */
export const WebhookCheckout = z.looseObject({
	id: z
		.string()
		.describe('Unique checkout identifier.')
		.meta({ example: 'bill_123' }),
	externalId: nullableString('Checkout ID in your system.'),
	url: z.string().describe('URL where the customer pays.'),
	amount: z
		.number()
		.describe(
			'Amount in cents of the payment (The total of the sale for card installments).',
		),
	paidAmount: z.number().nullable().describe('Amount already paid in cents.'),
	platformFee: z.number().nullable().describe('AbacatePay fee in cents.'),
	items: z.array(WebhookItem).describe('Products in the checkout.'),
	status: WebhookCheckoutStatus,
	methods: z.array(WebhookCheckoutMethod),
	frequency: WebhookFrequency,
	coupons: z.array(z.string()).describe('Coupons allowed in the checkout.'),
	devMode: z
		.boolean()
		.describe('Whether the checkout was created in dev mode.'),
	customerId: nullableString('Customer ID associated with the checkout.'),
	returnUrl: nullableString('URL used by the "Back" button.'),
	completionUrl: nullableString('URL the customer is sent to after paying.'),
	receiptUrl: nullableString('Payment receipt URL.'),
	metadata: z
		.record(z.string(), z.unknown())
		.nullable()
		.describe('Metadata you sent when creating the checkout.'),
	createdAt: dateString('Checkout creation date and time'),
	updatedAt: dateString('Checkout last updated date and time'),
	trialDays: z.number().nullable().describe('Trial length in days.'),
	trialEndsAt: nullableString('End of the trial.'),
	nextChargeAt: nullableString('First charge date.'),
	card: z.looseObject({
		maxInstallments: z
			.number()
			.describe('Maximum number of card installments allowed.'),
	}),
	interest: z
		.union([z.looseObject({ value: z.number() }), EmptyObject, z.null()])
		.optional()
		.describe(
			'Late interest configuration (Boleto). `{}` when not configured.',
		),
	fine: z
		.union([
			z.looseObject({
				value: z.number(),
				type: StringEnum(['PERCENTAGE', 'FIXED'], 'Type of fine.'),
			}),
			EmptyObject,
			z.null(),
		])
		.optional()
		.describe('Late fine configuration (Boleto). `{}` when not configured.'),
	dueDate: nullableString('Boleto due date (`YYYY-MM-DD`).'),
	upSellProductId: nullableString('ID of the product offered as an upsell.'),
	installmentsCount: z
		.number()
		.nullable()
		.describe(
			'Number of card installments, `null` when not paid in installments.',
		),
	payerInformation: WebhookCheckoutPayer.nullable().describe(
		'Who actually paid, as reported by the provider.',
	),
	utms: z
		.union([WebhookUtms, EmptyObject])
		.describe('UTM parameters of the payment, `{}` when none were captured.'),
});

/**
 * Checkout object sent in `checkout.*` events.
 */
export type WebhookCheckout = z.infer<typeof WebhookCheckout>;

/**
 * `data` of the `checkout.*` events.
 */
export const WebhookCheckoutEventData = z.looseObject({
	checkout: WebhookCheckout,
	customer: WebhookCustomer,
	payerInformation: WebhookPayerInformation.optional(),
});

/**
 * `data` of the `checkout.*` events.
 */
export type WebhookCheckoutEventData = z.infer<typeof WebhookCheckoutEventData>;

const reason = z
	.string()
	.describe(
		'Refund reason (Or `Refund completed`), or the dispute reason (Or `Dispute created`).',
	);

/**
 * Transparent payment object sent in `transparent.*` events. The installment fields are only
 * present on card sales split in 2 or more installments.
 */
export const WebhookTransparent = z.looseObject({
	id: z
		.string()
		.describe('Payment ID (`pix_char_...`, `card_...` or `bole_...`).')
		.meta({ example: 'card_123' }),
	externalId: nullableString('Payment ID in your system.'),
	amount: z
		.number()
		.describe('Amount in cents. For card installments, the total of the sale.'),
	paidAmount: z
		.number()
		.nullable()
		.describe('Always `null` for transparent payments.'),
	platformFee: z
		.number()
		.nullable()
		.describe(
			'AbacatePay fee in cents of this payment intent (For card installments, of this installment).',
		),
	status: WebhookPaymentStatus,
	items: z
		.array(WebhookItem)
		.describe('Always empty for transparent payments.'),
	methods: z
		.array(WebhookCheckoutMethod)
		.describe('Always empty for transparent payments.'),
	frequency: WebhookFrequency,
	coupons: z
		.array(z.string())
		.describe('Always empty for transparent payments.'),
	devMode: z.boolean().describe('Whether the payment was created in dev mode.'),
	customerId: nullableString('Customer ID associated with the payment.'),
	createdAt: dateString('Payment creation date and time'),
	updatedAt: dateString('Payment last updated date and time'),
	receiptUrl: nullableString('Payment receipt URL.'),
	metadata: z
		.record(z.string(), z.unknown())
		.describe('Metadata you sent when creating the payment (`{}` when none).'),
	installmentCount: z
		.number()
		.optional()
		.describe('Number of installments of the sale.'),
	installmentAmount: z
		.number()
		.optional()
		.describe('Amount in cents of this installment.'),
	installmentNumber: z
		.number()
		.optional()
		.describe('Which installment this payment intent is (1-based).'),
	installmentGroupId: z
		.string()
		.nullable()
		.optional()
		.describe('Installment group ID (`cinst_...`).'),
});

/**
 * Transparent payment object sent in `transparent.*` events.
 */
export type WebhookTransparent = z.infer<typeof WebhookTransparent>;

/**
 * `data` of the `transparent.*` events.
 */
export const WebhookTransparentEventData = z.looseObject({
	transparent: WebhookTransparent,
	customer: WebhookCustomer,
	payerInformation: WebhookPayerInformation,
});

/**
 * `data` of the `transparent.*` events.
 */
export type WebhookTransparentEventData = z.infer<
	typeof WebhookTransparentEventData
>;

/**
 * Subscription object sent in `subscription.*` events.
 */
export const WebhookSubscription = z.looseObject({
	id: z
		.string()
		.describe('Unique subscription identifier.')
		.meta({ example: 'subs_123' }),
	amount: z.number().describe('Subscription amount in cents.'),
	currency: z.literal('BRL').describe('Subscription currency.'),
	method: StringEnum(['PIX', 'CARD'], 'Payment method of the subscription.'),
	status: StringEnum(
		['PENDING', 'ACTIVE', 'CANCELLED'],
		'Subscription status.',
	),
	frequency: StringEnum(
		['DAILY', 'WEEKLY', 'MONTHLY', 'QUARTERLY', 'SEMIANNUALLY', 'ANNUALLY'],
		'Billing cycle.',
	),
	createdAt: dateString('Subscription creation date and time'),
	updatedAt: dateString('Subscription last updated date and time'),
	canceledAt: nullableString('When the subscription was cancelled.'),
	cancelPolicy: StringEnum(['NOW', 'NEXT_CYCLE'], 'Cancellation policy.')
		.nullable()
		.describe('How the cancellation applies.'),
	cancelledDueTo: nullableString('Why it was cancelled (Free text).'),
});

/**
 * Subscription object sent in `subscription.*` events.
 */
export type WebhookSubscription = z.infer<typeof WebhookSubscription>;

/**
 * Checkout of the subscription, as sent in `subscription.*` events.
 */
export const WebhookSubscriptionCheckout = WebhookCheckout.pick({
	id: true,
	externalId: true,
	url: true,
	amount: true,
	paidAmount: true,
	platformFee: true,
	frequency: true,
	items: true,
	status: true,
	methods: true,
	customerId: true,
	receiptUrl: true,
	metadata: true,
	createdAt: true,
	updatedAt: true,
}).extend({
	utms: WebhookUtms.optional().describe(
		'Only present when UTM parameters were captured.',
	),
});

/**
 * Checkout of the subscription, as sent in `subscription.*` events.
 */
export type WebhookSubscriptionCheckout = z.infer<
	typeof WebhookSubscriptionCheckout
>;

/**
 * Latest payment intent of the subscription's checkout.
 */
export const WebhookSubscriptionPayment = z.looseObject({
	id: z.string().describe('Payment ID.'),
	externalId: nullableString('`externalId` of the subscription checkout.'),
	amount: z.number().describe('Amount in cents.'),
	paidAmount: z
		.number()
		.nullable()
		.describe('Amount already paid in the checkout, in cents.'),
	platformFee: z
		.number()
		.optional()
		.describe(
			'AbacatePay fee in cents. Missing when the payment has no transaction.',
		),
	status: WebhookPaymentStatus,
	methods: z.array(WebhookCheckoutMethod),
	receiptUrl: nullableString('Payment receipt URL.'),
	createdAt: dateString('Payment creation date and time'),
	updatedAt: dateString('Payment last updated date and time'),
	metadata: z
		.record(z.string(), z.unknown())
		.describe('Metadata of the payment (`{}` when none).'),
});

/**
 * Latest payment intent of the subscription's checkout.
 */
export type WebhookSubscriptionPayment = z.infer<
	typeof WebhookSubscriptionPayment
>;

/**
 * `data` of the `subscription.*` events.
 */
export const WebhookSubscriptionEventData = z.looseObject({
	subscription: WebhookSubscription,
	customer: WebhookCustomer,
	checkout: WebhookSubscriptionCheckout.optional(),
	payment: WebhookSubscriptionPayment.optional(),
	payerInformation: WebhookPayerInformation.optional(),
});

/**
 * `data` of the `subscription.*` events.
 */
export type WebhookSubscriptionEventData = z.infer<
	typeof WebhookSubscriptionEventData
>;

/**
 * `data` of `subscription.plan_changed`. The change fields are only sent when the event is
 * triggered by `POST /subscriptions/change-plan`; the event is sent again without them when the
 * change is applied on the next renewal.
 */
export const WebhookSubscriptionPlanChangedEventData =
	WebhookSubscriptionEventData.extend({
		changeSource: z
			.literal('API_CHANGE_PLAN')
			.optional()
			.describe('Origin of the change.'),
		pendingUpdateId: z
			.string()
			.optional()
			.describe('ID of the pending plan change.'),
		items: z
			.array(
				z.looseObject({
					productId: z.string(),
					quantity: z.number(),
					newAmount: z.number(),
				}),
			)
			.optional()
			.describe('New products of the subscription.'),
		productId: z.string().optional().describe('Same as `items[0].productId`.'),
		quantity: z.number().optional().describe('Same as `items[0].quantity`.'),
		newAmount: z
			.number()
			.optional()
			.describe('Amount charged once the change is applied, in cents.'),
		status: StringEnum(
			['PENDING', 'APPLIED', 'CANCELLED'],
			'Status of the plan change.',
		).optional(),
		requestedAt: z
			.string()
			.optional()
			.describe('When the change was requested.'),
	});

/**
 * `data` of `subscription.plan_changed`.
 */
export type WebhookSubscriptionPlanChangedEventData = z.infer<
	typeof WebhookSubscriptionPlanChangedEventData
>;

/**
 * `data` of `subscription.payment_failed`: `retryNumber` after the last card/PIX retry fails,
 * `rejectCode` when an automatic PIX charge is rejected.
 */
export const WebhookSubscriptionPaymentFailedEventData =
	WebhookSubscriptionEventData.extend({
		installmentId: z.string().describe('Installment ID (`intl_...`).'),
		installmentNumber: z
			.number()
			.describe('Number of the installment (cycle) that failed.'),
		retryNumber: z
			.number()
			.optional()
			.describe('How many charge attempts failed.'),
		rejectCode: z
			.string()
			.optional()
			.describe('Rejection code of an automatic PIX charge.'),
	});

/**
 * `data` of `subscription.payment_failed`.
 */
export type WebhookSubscriptionPaymentFailedEventData = z.infer<
	typeof WebhookSubscriptionPaymentFailedEventData
>;

/**
 * Withdrawal object sent in `payout.*` events.
 */
export const WebhookPayout = z.looseObject({
	id: z
		.string()
		.describe('Unique transaction identifier.')
		.meta({ example: 'tran_123' }),
	amount: z.number().describe('Amount in cents.'),
	status: WebhookTransactionStatus,
	method: WebhookTransactionMethod,
	platformFee: z.number().describe('Fee in cents.'),
	receiptUrl: nullableString('Receipt URL.'),
	externalId: nullableString(
		'Currently always `null`: withdrawals with an `externalId` are sent as `transfer.*`.',
	),
	createdAt: dateString('Withdrawal creation date and time'),
	updatedAt: dateString('Withdrawal last updated date and time'),
	endToEndIdentifier: nullableString('PIX end-to-end identifier.'),
});

/**
 * Withdrawal object sent in `payout.*` events.
 */
export type WebhookPayout = z.infer<typeof WebhookPayout>;

/**
 * Transfer object sent in `transfer.*` events: a withdrawal created with an `externalId`.
 */
export const WebhookTransfer = WebhookPayout.extend({
	externalId: z.string().describe('Transfer ID in your system.'),
});

/**
 * Transfer object sent in `transfer.*` events.
 */
export type WebhookTransfer = z.infer<typeof WebhookTransfer>;

const WebhookPayoutEventData = z.looseObject({ withdraw: WebhookPayout });
const WebhookTransferEventData = z.looseObject({ transfer: WebhookTransfer });

/**
 * Body of a webhook delivered with the legacy scheme (`X-Webhook-Signature` header and
 * `?webhookSecret=` in the URL).
 *
 * https://docs.abacatepay.com/pages/webhooks
 */
export const BaseWebhookEvent = <
	Type extends z.infer<typeof WebhookEventType>,
	Schema extends _ZodType,
>(
	type: Type,
	schema: Schema,
) =>
	z.looseObject({
		data: schema,
		id: z
			.string()
			.describe(
				'Delivery identifier. Automatic retries reuse it, so it works as an idempotency key.',
			)
			.meta({ example: 'log_123' }),
		event: z
			.literal(type)
			.meta({ example: type })
			.describe('This field identifies the type of event received.'),
		apiVersion: z.literal(2).describe('Payload version. Always `2`.'),
		devMode: z
			.boolean()
			.meta({ example: true })
			.describe(
				'Indicates whether the event occurred in the development environment.',
			),
	});

/**
 * Body of a webhook delivered with Standard Webhooks (https://www.standardwebhooks.com): no `id`
 * (Use the `webhook-id` header) and the event name in `type`.
 */
export const BaseStandardWebhookEvent = <
	Type extends z.infer<typeof WebhookEventType>,
	Schema extends _ZodType,
>(
	type: Type,
	schema: Schema,
) =>
	z.looseObject({
		data: schema,
		type: z
			.literal(type)
			.meta({ example: type })
			.describe('This field identifies the type of event received.'),
		timestamp: dateString('Time of the first delivery attempt'),
		apiVersion: z.literal(2).describe('Payload version. Always `2`.'),
		devMode: z
			.boolean()
			.meta({ example: true })
			.describe(
				'Indicates whether the event occurred in the development environment.',
			),
	});

const checkoutReasonData = WebhookCheckoutEventData.extend({ reason });
const transparentReasonData = WebhookTransparentEventData.extend({ reason });

/**
 * https://docs.abacatepay.com/pages/webhooks/events/checkout
 */
export const WebhookCheckoutCompletedEvent = BaseWebhookEvent(
	'checkout.completed',
	WebhookCheckoutEventData,
);

/**
 * https://docs.abacatepay.com/pages/webhooks/events/checkout
 */
export type WebhookCheckoutCompletedEvent = z.infer<
	typeof WebhookCheckoutCompletedEvent
>;

/**
 * https://docs.abacatepay.com/pages/webhooks/events/checkout
 */
export const WebhookCheckoutRefundedEvent = BaseWebhookEvent(
	'checkout.refunded',
	checkoutReasonData,
);

/**
 * https://docs.abacatepay.com/pages/webhooks/events/checkout
 */
export type WebhookCheckoutRefundedEvent = z.infer<
	typeof WebhookCheckoutRefundedEvent
>;

/**
 * Sent when a dispute is opened and again when it is resolved (`REFUNDED` when lost).
 *
 * https://docs.abacatepay.com/pages/webhooks/events/checkout
 */
export const WebhookCheckoutDisputedEvent = BaseWebhookEvent(
	'checkout.disputed',
	checkoutReasonData,
);

/**
 * https://docs.abacatepay.com/pages/webhooks/events/checkout
 */
export type WebhookCheckoutDisputedEvent = z.infer<
	typeof WebhookCheckoutDisputedEvent
>;

/**
 * https://docs.abacatepay.com/pages/webhooks/events/transparent
 */
export const WebhookTransparentCompletedEvent = BaseWebhookEvent(
	'transparent.completed',
	WebhookTransparentEventData,
);

/**
 * https://docs.abacatepay.com/pages/webhooks/events/transparent
 */
export type WebhookTransparentCompletedEvent = z.infer<
	typeof WebhookTransparentCompletedEvent
>;

/**
 * https://docs.abacatepay.com/pages/webhooks/events/transparent
 */
export const WebhookTransparentRefundedEvent = BaseWebhookEvent(
	'transparent.refunded',
	transparentReasonData,
);

/**
 * https://docs.abacatepay.com/pages/webhooks/events/transparent
 */
export type WebhookTransparentRefundedEvent = z.infer<
	typeof WebhookTransparentRefundedEvent
>;

/**
 * Sent when a dispute is opened and again when it is resolved (`REFUNDED` when lost).
 *
 * https://docs.abacatepay.com/pages/webhooks/events/transparent
 */
export const WebhookTransparentDisputedEvent = BaseWebhookEvent(
	'transparent.disputed',
	transparentReasonData,
);

/**
 * https://docs.abacatepay.com/pages/webhooks/events/transparent
 */
export type WebhookTransparentDisputedEvent = z.infer<
	typeof WebhookTransparentDisputedEvent
>;

/**
 * https://docs.abacatepay.com/pages/webhooks/events/subscriptions
 */
export const WebhookSubscriptionCompletedEvent = BaseWebhookEvent(
	'subscription.completed',
	WebhookSubscriptionEventData,
);

/**
 * https://docs.abacatepay.com/pages/webhooks/events/subscriptions
 */
export type WebhookSubscriptionCompletedEvent = z.infer<
	typeof WebhookSubscriptionCompletedEvent
>;

/**
 * https://docs.abacatepay.com/pages/webhooks/events/subscriptions
 */
export const WebhookSubscriptionTrialStartedEvent = BaseWebhookEvent(
	'subscription.trial_started',
	WebhookSubscriptionEventData,
);

/**
 * https://docs.abacatepay.com/pages/webhooks/events/subscriptions
 */
export type WebhookSubscriptionTrialStartedEvent = z.infer<
	typeof WebhookSubscriptionTrialStartedEvent
>;

/**
 * https://docs.abacatepay.com/pages/webhooks/events/subscriptions
 */
export const WebhookSubscriptionCancelledEvent = BaseWebhookEvent(
	'subscription.cancelled',
	WebhookSubscriptionEventData,
);

/**
 * https://docs.abacatepay.com/pages/webhooks/events/subscriptions
 */
export type WebhookSubscriptionCancelledEvent = z.infer<
	typeof WebhookSubscriptionCancelledEvent
>;

/**
 * Sent for every paid cycle after the first one.
 *
 * https://docs.abacatepay.com/pages/webhooks/events/subscriptions
 */
export const WebhookSubscriptionRenewedEvent = BaseWebhookEvent(
	'subscription.renewed',
	WebhookSubscriptionEventData,
);

/**
 * https://docs.abacatepay.com/pages/webhooks/events/subscriptions
 */
export type WebhookSubscriptionRenewedEvent = z.infer<
	typeof WebhookSubscriptionRenewedEvent
>;

/**
 * https://docs.abacatepay.com/pages/webhooks/events/subscriptions
 */
export const WebhookSubscriptionPlanChangedEvent = BaseWebhookEvent(
	'subscription.plan_changed',
	WebhookSubscriptionPlanChangedEventData,
);

/**
 * https://docs.abacatepay.com/pages/webhooks/events/subscriptions
 */
export type WebhookSubscriptionPlanChangedEvent = z.infer<
	typeof WebhookSubscriptionPlanChangedEvent
>;

/**
 * https://docs.abacatepay.com/pages/webhooks/events/subscriptions
 */
export const WebhookSubscriptionPaymentFailedEvent = BaseWebhookEvent(
	'subscription.payment_failed',
	WebhookSubscriptionPaymentFailedEventData,
);

/**
 * https://docs.abacatepay.com/pages/webhooks/events/subscriptions
 */
export type WebhookSubscriptionPaymentFailedEvent = z.infer<
	typeof WebhookSubscriptionPaymentFailedEvent
>;

/**
 * https://docs.abacatepay.com/pages/webhooks/events/payouts
 */
export const WebhookPayoutCompletedEvent = BaseWebhookEvent(
	'payout.completed',
	WebhookPayoutEventData,
);

/**
 * https://docs.abacatepay.com/pages/webhooks/events/payouts
 */
export type WebhookPayoutCompletedEvent = z.infer<
	typeof WebhookPayoutCompletedEvent
>;

/**
 * https://docs.abacatepay.com/pages/webhooks/events/payouts
 */
export const WebhookPayoutFailedEvent = BaseWebhookEvent(
	'payout.failed',
	WebhookPayoutEventData,
);

/**
 * https://docs.abacatepay.com/pages/webhooks/events/payouts
 */
export type WebhookPayoutFailedEvent = z.infer<typeof WebhookPayoutFailedEvent>;

/**
 * https://docs.abacatepay.com/pages/webhooks/events/transfers
 */
export const WebhookTransferCompletedEvent = BaseWebhookEvent(
	'transfer.completed',
	WebhookTransferEventData,
);

/**
 * https://docs.abacatepay.com/pages/webhooks/events/transfers
 */
export type WebhookTransferCompletedEvent = z.infer<
	typeof WebhookTransferCompletedEvent
>;

/**
 * https://docs.abacatepay.com/pages/webhooks/events/transfers
 */
export const WebhookTransferFailedEvent = BaseWebhookEvent(
	'transfer.failed',
	WebhookTransferEventData,
);

/**
 * https://docs.abacatepay.com/pages/webhooks/events/transfers
 */
export type WebhookTransferFailedEvent = z.infer<
	typeof WebhookTransferFailedEvent
>;

/**
 * Events that can be subscribed to but are never sent.
 *
 * @deprecated AbacatePay does not send `checkout.lost` or `transparent.lost`: a lost dispute
 * arrives as `checkout.disputed` / `transparent.disputed` with `status: 'REFUNDED'`.
 */
export const WebhookUndocumentedEvent = z.looseObject({
	data: z.record(z.string(), z.unknown()),
	id: z.string().describe('Delivery identifier.'),
	event: StringEnum(
		['checkout.lost', 'transparent.lost'],
		'This field identifies the type of event received.',
	),
	apiVersion: z.literal(2).describe('Payload version. Always `2`.'),
	devMode: z
		.boolean()
		.describe(
			'Indicates whether the event occurred in the development environment.',
		),
});

/**
 * Events that can be subscribed to but are never sent.
 *
 * @deprecated AbacatePay does not send `checkout.lost` or `transparent.lost`.
 */
export type WebhookUndocumentedEvent = z.infer<typeof WebhookUndocumentedEvent>;

/**
 * Any v2 webhook body, in the legacy format.
 *
 * https://docs.abacatepay.com/pages/webhooks
 */
export const WebhookEvent = z.discriminatedUnion('event', [
	WebhookCheckoutCompletedEvent,
	WebhookCheckoutRefundedEvent,
	WebhookCheckoutDisputedEvent,
	WebhookTransparentCompletedEvent,
	WebhookTransparentRefundedEvent,
	WebhookTransparentDisputedEvent,
	WebhookSubscriptionCompletedEvent,
	WebhookSubscriptionTrialStartedEvent,
	WebhookSubscriptionCancelledEvent,
	WebhookSubscriptionRenewedEvent,
	WebhookSubscriptionPlanChangedEvent,
	WebhookSubscriptionPaymentFailedEvent,
	WebhookPayoutCompletedEvent,
	WebhookPayoutFailedEvent,
	WebhookTransferCompletedEvent,
	WebhookTransferFailedEvent,
	WebhookUndocumentedEvent,
]);

/**
 * Any v2 webhook body, in the legacy format.
 *
 * https://docs.abacatepay.com/pages/webhooks
 */
export type WebhookEvent = z.infer<typeof WebhookEvent>;

/**
 * Any v2 webhook body delivered with Standard Webhooks (https://www.standardwebhooks.com).
 * Verify it with `verifyStandardWebhookSignature` from `@abacatepay/types`.
 *
 * https://docs.abacatepay.com/pages/webhooks
 */
export const StandardWebhookEvent = z.discriminatedUnion('type', [
	BaseStandardWebhookEvent('checkout.completed', WebhookCheckoutEventData),
	BaseStandardWebhookEvent('checkout.refunded', checkoutReasonData),
	BaseStandardWebhookEvent('checkout.disputed', checkoutReasonData),
	BaseStandardWebhookEvent(
		'transparent.completed',
		WebhookTransparentEventData,
	),
	BaseStandardWebhookEvent('transparent.refunded', transparentReasonData),
	BaseStandardWebhookEvent('transparent.disputed', transparentReasonData),
	BaseStandardWebhookEvent(
		'subscription.completed',
		WebhookSubscriptionEventData,
	),
	BaseStandardWebhookEvent(
		'subscription.trial_started',
		WebhookSubscriptionEventData,
	),
	BaseStandardWebhookEvent(
		'subscription.cancelled',
		WebhookSubscriptionEventData,
	),
	BaseStandardWebhookEvent(
		'subscription.renewed',
		WebhookSubscriptionEventData,
	),
	BaseStandardWebhookEvent(
		'subscription.plan_changed',
		WebhookSubscriptionPlanChangedEventData,
	),
	BaseStandardWebhookEvent(
		'subscription.payment_failed',
		WebhookSubscriptionPaymentFailedEventData,
	),
	BaseStandardWebhookEvent('payout.completed', WebhookPayoutEventData),
	BaseStandardWebhookEvent('payout.failed', WebhookPayoutEventData),
	BaseStandardWebhookEvent('transfer.completed', WebhookTransferEventData),
	BaseStandardWebhookEvent('transfer.failed', WebhookTransferEventData),
]);

/**
 * Any v2 webhook body delivered with Standard Webhooks.
 */
export type StandardWebhookEvent = z.infer<typeof StandardWebhookEvent>;
