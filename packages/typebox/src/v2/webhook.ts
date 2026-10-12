import { type Static, type TSchema, Type as t } from '@sinclair/typebox';
import { StringEnum } from '../utils';

// Objects below allow additional properties (TypeBox default): fields AbacatePay
// adds to the payload in the future do not make the whole event fail validation.

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
	{
		examples: ['checkout.completed'],
		description:
			'Webhook event type. `checkout.lost` and `transparent.lost` can be subscribed to but are never sent.',
	},
);

/**
 * https://docs.abacatepay.com/pages/webhooks/reference
 */
export type WebhookEventType = Static<typeof WebhookEventType>;

/**
 * v1 event names that the API also accepts when subscribing a v2 webhook (Delivered with the v1 payload).
 */
export const WebhookV1EventName = StringEnum(
	['billing.paid', 'billing.disputed', 'withdraw.done', 'withdraw.failed'],
	{
		examples: ['billing.paid'],
		description: 'v1 event name, delivered with the v1 payload.',
	},
);

/**
 * v1 event names that the API also accepts when subscribing a v2 webhook (Delivered with the v1 payload).
 */
export type WebhookV1EventName = Static<typeof WebhookV1EventName>;

/**
 * The webhook resource itself, as returned by the `webhooks/*` endpoints.
 *
 * https://docs.abacatepay.com/pages/webhooks/reference
 */
export const APIWebhook = t.Object({
	id: t.String({
		examples: ['webh_prod_123'],
		description: 'Unique webhook identifier.',
	}),
	name: t.String({
		examples: ['Order fulfillment'],
		description: 'Webhook name.',
	}),
	endpoint: t.String({
		format: 'uri',
		examples: ['https://myshop.com/webhooks/abacatepay'],
		description: 'HTTPS endpoint that receives the events.',
	}),
	events: t.Array(t.Union([WebhookEventType, WebhookV1EventName]), {
		description: 'Event types this webhook is subscribed to.',
	}),
	devMode: t.Boolean({
		examples: [false],
		description:
			'Indicates whether the webhook was created in a testing environment.',
	}),
	v2: t.Boolean({
		examples: [true],
		description: 'Indicates whether this webhook targets the v2 API.',
	}),
	createdAt: t.Date({
		examples: ['2025-01-01T00:00:00Z'],
		description: 'Webhook creation date and time.',
	}),
	updatedAt: t.Date({
		examples: ['2025-01-01T00:00:00Z'],
		description: 'Webhook last updated date and time.',
	}),
});

/**
 * https://docs.abacatepay.com/pages/webhooks/reference
 */
export type APIWebhook = Static<typeof APIWebhook>;

const NullableString = (description: string) =>
	t.Union([t.String(), t.Null()], { description });

const NullableNumber = (description: string) =>
	t.Union([t.Number(), t.Null()], { description });

const DateString = (description: string) =>
	t.String({ description: `${description} (ISO 8601).` });

const EmptyObject = t.Object({}, { additionalProperties: false });

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
	{ examples: ['PAID'], description: 'Checkout status.' },
);

/**
 * Status of a checkout (billing).
 */
export type WebhookCheckoutStatus = Static<typeof WebhookCheckoutStatus>;

/**
 * Payment methods a checkout accepts.
 */
export const WebhookCheckoutMethod = StringEnum(
	['PIX', 'CRYPTO', 'CARD', 'BOLETO', 'GOOGLE_PAY', 'APPLE_PAY'],
	{ examples: ['PIX'], description: 'Payment method.' },
);

/**
 * Payment methods a checkout accepts.
 */
export type WebhookCheckoutMethod = Static<typeof WebhookCheckoutMethod>;

/**
 * Charge frequency.
 */
export const WebhookFrequency = StringEnum(
	['ONE_TIME', 'MULTIPLE_PAYMENTS', 'SUBSCRIPTION'],
	{ examples: ['ONE_TIME'], description: 'Charge frequency.' },
);

/**
 * Charge frequency.
 */
export type WebhookFrequency = Static<typeof WebhookFrequency>;

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
	{ examples: ['PAID'], description: 'Payment status.' },
);

/**
 * Status of a payment intent.
 */
export type WebhookPaymentStatus = Static<typeof WebhookPaymentStatus>;

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
	{ examples: ['COMPLETE'], description: 'Transaction status.' },
);

/**
 * Status of a withdrawal transaction.
 */
export type WebhookTransactionStatus = Static<typeof WebhookTransactionStatus>;

/**
 * Method of a withdrawal transaction.
 */
export const WebhookTransactionMethod = StringEnum(
	['PIX', 'CARD', 'PIX_QRCODE', 'BOLETO', 'INTERNAL', 'TED'],
	{ examples: ['PIX'], description: 'Transaction method.' },
);

/**
 * Method of a withdrawal transaction.
 */
export type WebhookTransactionMethod = Static<typeof WebhookTransactionMethod>;

/**
 * Customer block present in checkout, transparent and subscription events. Never `null`: `id` is `''` when there is no customer.
 */
export const WebhookCustomer = t.Object({
	id: t.String({
		examples: ['cust_123'],
		description: 'Customer ID, or an empty string when there is no customer.',
	}),
	name: NullableString("Customer's name."),
	email: NullableString("Customer's email."),
	taxId: NullableString('Masked CPF or CNPJ (e.g. `529.***.247-**`).'),
});

/**
 * Customer block present in checkout, transparent and subscription events.
 */
export type WebhookCustomer = Static<typeof WebhookCustomer>;

/**
 * UTM parameters captured with the payment.
 */
export const WebhookUtms = t.Object({
	source: NullableString('`utm_source`.'),
	medium: NullableString('`utm_medium`.'),
	campaign: NullableString('`utm_campaign`.'),
	term: NullableString('`utm_term`.'),
	content: NullableString('`utm_content`.'),
});

/**
 * UTM parameters captured with the payment.
 */
export type WebhookUtms = Static<typeof WebhookUtms>;

const WebhookPayerDocument = t.Object({
	name: NullableString("Customer's name."),
	taxId: NullableString("Customer's masked CPF or CNPJ."),
	isSameAsCustomer: t.Boolean({ description: 'Always `true`.' }),
});

const WebhookPayerCard = t.Object({
	number: NullableString('Last four digits of the card.'),
	brand: NullableString('Card brand (e.g. `VISA`).'),
});

/**
 * Payer block, keyed by the payment method. PIX QR Code payments report `method: 'PIX'`.
 */
export const WebhookPayerInformation = t.Union([
	t.Object({
		method: t.Literal('PIX'),
		utms: WebhookUtms,
		PIX: WebhookPayerDocument,
	}),
	t.Object({
		method: t.Literal('CARD'),
		utms: WebhookUtms,
		CARD: WebhookPayerCard,
	}),
	t.Object({
		method: t.Literal('BOLETO'),
		utms: WebhookUtms,
		BOLETO: WebhookPayerDocument,
	}),
]);

/**
 * Payer block, keyed by the payment method.
 */
export type WebhookPayerInformation = Static<typeof WebhookPayerInformation>;

const WebhookItem = t.Object({
	id: t.String({ examples: ['prod_123'], description: 'Product ID.' }),
	quantity: t.Number({ examples: [1], description: 'Item quantity.' }),
});

const WebhookCheckoutPayer = t.Object({
	name: NullableString('Payer name.'),
	taxId: NullableString('Masked CPF or CNPJ.'),
	bank: t.Union(
		[
			t.Object({
				ispb: NullableString('ISPB of the bank.'),
				ispbName: NullableString('Name of the bank.'),
				account: NullableString('Account number.'),
				accountDigit: NullableString('Account digit.'),
				accountType: NullableString('`CHECKING` or `SAVINGS`.'),
				agency: NullableString('Agency number.'),
				pixAddressKey: NullableString('PIX key of the payer.'),
				pixKeyType: NullableString('Type of the PIX key.'),
			}),
			t.Null(),
		],
		{ description: 'Payer bank account (PIX payments).' },
	),
	card: t.Union(
		[
			t.Object({
				number: NullableString('Last four digits of the card.'),
				brand: NullableString('Card brand.'),
			}),
			t.Null(),
		],
		{ description: 'Card used (Card payments).' },
	),
});

/**
 * Checkout object sent in `checkout.*` events: the `/v2/checkouts/get` shape plus `utms`.
 */
export const WebhookCheckout = t.Object({
	id: t.String({
		examples: ['bill_123'],
		description: 'Unique checkout identifier.',
	}),
	externalId: NullableString('Checkout ID in your system.'),
	url: t.String({ description: 'URL where the customer pays.' }),
	amount: t.Number({
		description:
			'Amount in cents of the payment (The total of the sale for card installments).',
	}),
	paidAmount: NullableNumber('Amount already paid in cents.'),
	platformFee: NullableNumber('AbacatePay fee in cents.'),
	items: t.Array(WebhookItem, { description: 'Products in the checkout.' }),
	status: WebhookCheckoutStatus,
	methods: t.Array(WebhookCheckoutMethod),
	frequency: WebhookFrequency,
	coupons: t.Array(t.String(), {
		description: 'Coupons allowed in the checkout.',
	}),
	devMode: t.Boolean({
		description: 'Whether the checkout was created in dev mode.',
	}),
	customerId: NullableString('Customer ID associated with the checkout.'),
	returnUrl: NullableString('URL used by the "Back" button.'),
	completionUrl: NullableString('URL the customer is sent to after paying.'),
	receiptUrl: NullableString('Payment receipt URL.'),
	metadata: t.Union([t.Record(t.String(), t.Unknown()), t.Null()], {
		description: 'Metadata you sent when creating the checkout.',
	}),
	createdAt: DateString('Checkout creation date and time'),
	updatedAt: DateString('Checkout last updated date and time'),
	trialDays: NullableNumber('Trial length in days.'),
	trialEndsAt: NullableString('End of the trial.'),
	nextChargeAt: NullableString('First charge date.'),
	card: t.Object({
		maxInstallments: t.Number({
			description: 'Maximum number of card installments allowed.',
		}),
	}),
	interest: t.Optional(
		t.Union([t.Object({ value: t.Number() }), EmptyObject, t.Null()], {
			description:
				'Late interest configuration (Boleto). `{}` when not configured.',
		}),
	),
	fine: t.Optional(
		t.Union(
			[
				t.Object({
					value: t.Number(),
					type: StringEnum(['PERCENTAGE', 'FIXED'], {
						description: 'Type of fine.',
					}),
				}),
				EmptyObject,
				t.Null(),
			],
			{
				description:
					'Late fine configuration (Boleto). `{}` when not configured.',
			},
		),
	),
	dueDate: NullableString('Boleto due date (`YYYY-MM-DD`).'),
	upSellProductId: NullableString('ID of the product offered as an upsell.'),
	installmentsCount: NullableNumber(
		'Number of card installments, `null` when not paid in installments.',
	),
	payerInformation: t.Union([WebhookCheckoutPayer, t.Null()], {
		description: 'Who actually paid, as reported by the provider.',
	}),
	utms: t.Union([WebhookUtms, EmptyObject], {
		description: 'UTM parameters of the payment, `{}` when none were captured.',
	}),
});

/**
 * Checkout object sent in `checkout.*` events.
 */
export type WebhookCheckout = Static<typeof WebhookCheckout>;

/**
 * `data` of the `checkout.*` events.
 */
export const WebhookCheckoutEventData = t.Object({
	checkout: WebhookCheckout,
	customer: WebhookCustomer,
	payerInformation: t.Optional(WebhookPayerInformation),
});

/**
 * `data` of the `checkout.*` events.
 */
export type WebhookCheckoutEventData = Static<typeof WebhookCheckoutEventData>;

const reason = t.String({
	description:
		'Refund reason (Or `Refund completed`), or the dispute reason (Or `Dispute created`).',
});

/**
 * Transparent payment object sent in `transparent.*` events. The installment fields are only
 * present on card sales split in 2 or more installments.
 */
export const WebhookTransparent = t.Object({
	id: t.String({
		examples: ['card_123'],
		description: 'Payment ID (`pix_char_...`, `card_...` or `bole_...`).',
	}),
	externalId: NullableString('Payment ID in your system.'),
	amount: t.Number({
		description:
			'Amount in cents. For card installments, the total of the sale.',
	}),
	paidAmount: NullableNumber('Always `null` for transparent payments.'),
	platformFee: NullableNumber(
		'AbacatePay fee in cents of this payment intent (For card installments, of this installment).',
	),
	status: WebhookPaymentStatus,
	items: t.Array(WebhookItem, {
		description: 'Always empty for transparent payments.',
	}),
	methods: t.Array(WebhookCheckoutMethod, {
		description: 'Always empty for transparent payments.',
	}),
	frequency: WebhookFrequency,
	coupons: t.Array(t.String(), {
		description: 'Always empty for transparent payments.',
	}),
	devMode: t.Boolean({
		description: 'Whether the payment was created in dev mode.',
	}),
	customerId: NullableString('Customer ID associated with the payment.'),
	createdAt: DateString('Payment creation date and time'),
	updatedAt: DateString('Payment last updated date and time'),
	receiptUrl: NullableString('Payment receipt URL.'),
	metadata: t.Record(t.String(), t.Unknown(), {
		description:
			'Metadata you sent when creating the payment (`{}` when none).',
	}),
	installmentCount: t.Optional(
		t.Number({ description: 'Number of installments of the sale.' }),
	),
	installmentAmount: t.Optional(
		t.Number({ description: 'Amount in cents of this installment.' }),
	),
	installmentNumber: t.Optional(
		t.Number({
			description: 'Which installment this payment intent is (1-based).',
		}),
	),
	installmentGroupId: t.Optional(
		NullableString('Installment group ID (`cinst_...`).'),
	),
});

/**
 * Transparent payment object sent in `transparent.*` events.
 */
export type WebhookTransparent = Static<typeof WebhookTransparent>;

/**
 * `data` of the `transparent.*` events.
 */
export const WebhookTransparentEventData = t.Object({
	transparent: WebhookTransparent,
	customer: WebhookCustomer,
	payerInformation: WebhookPayerInformation,
});

/**
 * `data` of the `transparent.*` events.
 */
export type WebhookTransparentEventData = Static<
	typeof WebhookTransparentEventData
>;

/**
 * Subscription object sent in `subscription.*` events.
 */
export const WebhookSubscription = t.Object({
	id: t.String({
		examples: ['subs_123'],
		description: 'Unique subscription identifier.',
	}),
	amount: t.Number({ description: 'Subscription amount in cents.' }),
	currency: t.Literal('BRL', { description: 'Subscription currency.' }),
	method: StringEnum(['PIX', 'CARD'], {
		description: 'Payment method of the subscription.',
	}),
	status: StringEnum(['PENDING', 'ACTIVE', 'CANCELLED'], {
		description: 'Subscription status.',
	}),
	frequency: StringEnum(
		['DAILY', 'WEEKLY', 'MONTHLY', 'QUARTERLY', 'SEMIANNUALLY', 'ANNUALLY'],
		{ description: 'Billing cycle.' },
	),
	createdAt: DateString('Subscription creation date and time'),
	updatedAt: DateString('Subscription last updated date and time'),
	canceledAt: NullableString('When the subscription was cancelled.'),
	cancelPolicy: t.Union([StringEnum(['NOW', 'NEXT_CYCLE'], {}), t.Null()], {
		description: 'How the cancellation applies.',
	}),
	cancelledDueTo: NullableString('Why it was cancelled (Free text).'),
});

/**
 * Subscription object sent in `subscription.*` events.
 */
export type WebhookSubscription = Static<typeof WebhookSubscription>;

/**
 * Checkout of the subscription, as sent in `subscription.*` events.
 */
export const WebhookSubscriptionCheckout = t.Object({
	id: WebhookCheckout.properties.id,
	externalId: WebhookCheckout.properties.externalId,
	url: WebhookCheckout.properties.url,
	amount: WebhookCheckout.properties.amount,
	paidAmount: WebhookCheckout.properties.paidAmount,
	platformFee: WebhookCheckout.properties.platformFee,
	frequency: WebhookCheckout.properties.frequency,
	items: WebhookCheckout.properties.items,
	status: WebhookCheckout.properties.status,
	methods: WebhookCheckout.properties.methods,
	customerId: WebhookCheckout.properties.customerId,
	receiptUrl: WebhookCheckout.properties.receiptUrl,
	metadata: WebhookCheckout.properties.metadata,
	createdAt: WebhookCheckout.properties.createdAt,
	updatedAt: WebhookCheckout.properties.updatedAt,
	utms: t.Optional(WebhookUtms),
});

/**
 * Checkout of the subscription, as sent in `subscription.*` events.
 */
export type WebhookSubscriptionCheckout = Static<
	typeof WebhookSubscriptionCheckout
>;

/**
 * Latest payment intent of the subscription's checkout.
 */
export const WebhookSubscriptionPayment = t.Object({
	id: t.String({ description: 'Payment ID.' }),
	externalId: NullableString('`externalId` of the subscription checkout.'),
	amount: t.Number({ description: 'Amount in cents.' }),
	paidAmount: NullableNumber('Amount already paid in the checkout, in cents.'),
	platformFee: t.Optional(
		t.Number({
			description:
				'AbacatePay fee in cents. Missing when the payment has no transaction.',
		}),
	),
	status: WebhookPaymentStatus,
	methods: t.Array(WebhookCheckoutMethod),
	receiptUrl: NullableString('Payment receipt URL.'),
	createdAt: DateString('Payment creation date and time'),
	updatedAt: DateString('Payment last updated date and time'),
	metadata: t.Record(t.String(), t.Unknown(), {
		description: 'Metadata of the payment (`{}` when none).',
	}),
});

/**
 * Latest payment intent of the subscription's checkout.
 */
export type WebhookSubscriptionPayment = Static<
	typeof WebhookSubscriptionPayment
>;

/**
 * `data` of the `subscription.*` events.
 */
export const WebhookSubscriptionEventData = t.Object({
	subscription: WebhookSubscription,
	customer: WebhookCustomer,
	checkout: t.Optional(WebhookSubscriptionCheckout),
	payment: t.Optional(WebhookSubscriptionPayment),
	payerInformation: t.Optional(WebhookPayerInformation),
});

/**
 * `data` of the `subscription.*` events.
 */
export type WebhookSubscriptionEventData = Static<
	typeof WebhookSubscriptionEventData
>;

/**
 * `data` of `subscription.plan_changed`. The change fields are only sent when the event is
 * triggered by `POST /subscriptions/change-plan`; the event is sent again without them when the
 * change is applied on the next renewal.
 */
export const WebhookSubscriptionPlanChangedEventData = t.Object({
	...WebhookSubscriptionEventData.properties,
	changeSource: t.Optional(
		t.Literal('API_CHANGE_PLAN', { description: 'Origin of the change.' }),
	),
	pendingUpdateId: t.Optional(
		t.String({ description: 'ID of the pending plan change.' }),
	),
	items: t.Optional(
		t.Array(
			t.Object({
				productId: t.String(),
				quantity: t.Number(),
				newAmount: t.Number(),
			}),
			{ description: 'New products of the subscription.' },
		),
	),
	productId: t.Optional(
		t.String({ description: 'Same as `items[0].productId`.' }),
	),
	quantity: t.Optional(
		t.Number({ description: 'Same as `items[0].quantity`.' }),
	),
	newAmount: t.Optional(
		t.Number({
			description: 'Amount charged once the change is applied, in cents.',
		}),
	),
	status: t.Optional(
		StringEnum(['PENDING', 'APPLIED', 'CANCELLED'], {
			description: 'Status of the plan change.',
		}),
	),
	requestedAt: t.Optional(
		t.String({ description: 'When the change was requested.' }),
	),
});

/**
 * `data` of `subscription.plan_changed`.
 */
export type WebhookSubscriptionPlanChangedEventData = Static<
	typeof WebhookSubscriptionPlanChangedEventData
>;

/**
 * `data` of `subscription.payment_failed`: `retryNumber` after the last card/PIX retry fails,
 * `rejectCode` when an automatic PIX charge is rejected.
 */
export const WebhookSubscriptionPaymentFailedEventData = t.Object({
	...WebhookSubscriptionEventData.properties,
	installmentId: t.String({ description: 'Installment ID (`intl_...`).' }),
	installmentNumber: t.Number({
		description: 'Number of the installment (cycle) that failed.',
	}),
	retryNumber: t.Optional(
		t.Number({ description: 'How many charge attempts failed.' }),
	),
	rejectCode: t.Optional(
		t.String({ description: 'Rejection code of an automatic PIX charge.' }),
	),
});

/**
 * `data` of `subscription.payment_failed`.
 */
export type WebhookSubscriptionPaymentFailedEventData = Static<
	typeof WebhookSubscriptionPaymentFailedEventData
>;

/**
 * Withdrawal object sent in `payout.*` events.
 */
export const WebhookPayout = t.Object({
	id: t.String({
		examples: ['tran_123'],
		description: 'Unique transaction identifier.',
	}),
	amount: t.Number({ description: 'Amount in cents.' }),
	status: WebhookTransactionStatus,
	method: WebhookTransactionMethod,
	platformFee: t.Number({ description: 'Fee in cents.' }),
	receiptUrl: NullableString('Receipt URL.'),
	externalId: NullableString(
		'Currently always `null`: withdrawals with an `externalId` are sent as `transfer.*`.',
	),
	createdAt: DateString('Withdrawal creation date and time'),
	updatedAt: DateString('Withdrawal last updated date and time'),
	endToEndIdentifier: NullableString('PIX end-to-end identifier.'),
});

/**
 * Withdrawal object sent in `payout.*` events.
 */
export type WebhookPayout = Static<typeof WebhookPayout>;

/**
 * Transfer object sent in `transfer.*` events: a withdrawal created with an `externalId`.
 */
export const WebhookTransfer = t.Object({
	...WebhookPayout.properties,
	externalId: t.String({ description: 'Transfer ID in your system.' }),
});

/**
 * Transfer object sent in `transfer.*` events.
 */
export type WebhookTransfer = Static<typeof WebhookTransfer>;

const WebhookPayoutEventData = t.Object({ withdraw: WebhookPayout });
const WebhookTransferEventData = t.Object({ transfer: WebhookTransfer });

/**
 * Body of a webhook delivered with the legacy scheme (`X-Webhook-Signature` header and
 * `?webhookSecret=` in the URL).
 *
 * https://docs.abacatepay.com/pages/webhooks
 */
export const BaseWebhookEvent = <
	Type extends Static<typeof WebhookEventType>,
	Schema extends TSchema,
>(
	type: Type,
	schema: Schema,
) =>
	t.Object({
		data: schema,
		id: t.String({
			examples: ['log_1234567890abcdef'],
			description:
				'Delivery identifier. Automatic retries reuse it, so it works as an idempotency key.',
		}),
		event: t.Literal(type, {
			examples: [type],
			description: 'This field identifies the type of event received.',
		}),
		apiVersion: t.Literal(2, { description: 'Payload version. Always `2`.' }),
		devMode: t.Boolean({
			examples: [false],
			description:
				'Indicates whether the event occurred in the development environment.',
		}),
	});

/**
 * Body of a webhook delivered with Standard Webhooks (https://www.standardwebhooks.com): no `id`
 * (Use the `webhook-id` header) and the event name in `type`.
 */
export const BaseStandardWebhookEvent = <
	Type extends Static<typeof WebhookEventType>,
	Schema extends TSchema,
>(
	type: Type,
	schema: Schema,
) =>
	t.Object({
		data: schema,
		type: t.Literal(type, {
			examples: [type],
			description: 'This field identifies the type of event received.',
		}),
		timestamp: DateString('Time of the first delivery attempt'),
		apiVersion: t.Literal(2, { description: 'Payload version. Always `2`.' }),
		devMode: t.Boolean({
			examples: [false],
			description:
				'Indicates whether the event occurred in the development environment.',
		}),
	});

const checkoutReasonData = t.Object({
	...WebhookCheckoutEventData.properties,
	reason,
});

const transparentReasonData = t.Object({
	...WebhookTransparentEventData.properties,
	reason,
});

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
export type WebhookCheckoutCompletedEvent = Static<
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
export type WebhookCheckoutRefundedEvent = Static<
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
export type WebhookCheckoutDisputedEvent = Static<
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
export type WebhookTransparentCompletedEvent = Static<
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
export type WebhookTransparentRefundedEvent = Static<
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
export type WebhookTransparentDisputedEvent = Static<
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
export type WebhookSubscriptionCompletedEvent = Static<
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
export type WebhookSubscriptionTrialStartedEvent = Static<
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
export type WebhookSubscriptionCancelledEvent = Static<
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
export type WebhookSubscriptionRenewedEvent = Static<
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
export type WebhookSubscriptionPlanChangedEvent = Static<
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
export type WebhookSubscriptionPaymentFailedEvent = Static<
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
export type WebhookPayoutCompletedEvent = Static<
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
export type WebhookPayoutFailedEvent = Static<typeof WebhookPayoutFailedEvent>;

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
export type WebhookTransferCompletedEvent = Static<
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
export type WebhookTransferFailedEvent = Static<
	typeof WebhookTransferFailedEvent
>;

/**
 * Events that can be subscribed to but are never sent.
 *
 * @deprecated AbacatePay does not send `checkout.lost` or `transparent.lost`: a lost dispute
 * arrives as `checkout.disputed` / `transparent.disputed` with `status: 'REFUNDED'`.
 */
export const WebhookUndocumentedEvent = t.Object({
	data: t.Record(t.String(), t.Unknown()),
	id: t.String({ description: 'Delivery identifier.' }),
	event: StringEnum(['checkout.lost', 'transparent.lost'], {
		description: 'This field identifies the type of event received.',
	}),
	apiVersion: t.Literal(2, { description: 'Payload version. Always `2`.' }),
	devMode: t.Boolean({
		description:
			'Indicates whether the event occurred in the development environment.',
	}),
});

/**
 * Events that can be subscribed to but are never sent.
 *
 * @deprecated AbacatePay does not send `checkout.lost` or `transparent.lost`.
 */
export type WebhookUndocumentedEvent = Static<typeof WebhookUndocumentedEvent>;

/**
 * Any v2 webhook body, in the legacy format.
 *
 * https://docs.abacatepay.com/pages/webhooks
 */
export const WebhookEvent = t.Union([
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
export type WebhookEvent = Static<typeof WebhookEvent>;

/**
 * Any v2 webhook body delivered with Standard Webhooks (https://www.standardwebhooks.com).
 * Verify it with `verifyStandardWebhookSignature` from `@abacatepay/types`.
 *
 * https://docs.abacatepay.com/pages/webhooks
 */
export const StandardWebhookEvent = t.Union([
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
export type StandardWebhookEvent = Static<typeof StandardWebhookEvent>;
