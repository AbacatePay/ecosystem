import { type Static, type TAnySchema, Type as t } from '@sinclair/typebox';
import { StringEnum } from '../utils';
import { APIPayout, PaymentMethod } from '.';

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
		'payout.completed',
		'payout.failed',
		'transfer.completed',
		'transfer.failed',
	],
	{ examples: ['checkout.completed'], description: 'Webhook event type.' },
);

/**
 * https://docs.abacatepay.com/pages/webhooks/reference
 */
export type WebhookEventType = Static<typeof WebhookEventType>;

/**
 * The webhook resource itself, as returned by the `webhooks/*` endpoints.
 *
 * https://docs.abacatepay.com/pages/webhooks/reference
 */
export const APIWebhook = t.Object({
	id: t.String({
		examples: ['webh_123'],
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
	events: t.Array(WebhookEventType, {
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

export const BaseWebhookEvent = <
	Type extends Static<typeof WebhookEventType>,
	Schema extends TAnySchema,
>(
	type: Type,
	schema: Schema,
) =>
	t.Object({
		data: schema,
		id: t.String({
			examples: ['log_1234567890abcdef'],
			description: 'Unique identifier for the webhook.',
		}),
		event: t.Literal(type, {
			examples: [type],
			description: 'This field identifies the type of event received.',
		}),
		devMode: t.Boolean({
			examples: [false],
			description:
				'Indicates whether the event occurred in the development environment.',
		}),
	});

/**
 * https://docs.abacatepay.com/pages/webhooks#payout-failed
 */
export const WebhookPayoutFailedEvent = BaseWebhookEvent(
	'payout.failed',
	t.Object({
		transaction: t.Intersect(
			[
				t.Omit(APIPayout, ['status']),
				t.Object({
					status: t.Literal('CANCELLED', {
						examples: ['CANCELLED'],
						description: 'Status of the payout. Always `CANCELLED`.',
					}),
				}),
			],
			{
				description: 'Transaction data.',
			},
		),
	}),
);

/**
 * https://docs.abacatepay.com/pages/webhooks#payout-failed
 */
export type WebhookPayoutFailedEvent = Static<typeof WebhookPayoutFailedEvent>;

/**
 * https://docs.abacatepay.com/pages/webhooks#payout-completed
 */
export const WebhookPayoutCompletedEvent = BaseWebhookEvent(
	'payout.completed',
	t.Object({
		transaction: t.Intersect(
			[
				t.Omit(APIPayout, ['status']),
				t.Object({
					status: t.Literal('COMPLETE', {
						examples: ['COMPLETE'],
						description: 'Status of the payout. Always `COMPLETE`.',
					}),
				}),
			],
			{
				description: 'Transaction data.',
			},
		),
	}),
);

/**
 * https://docs.abacatepay.com/pages/webhooks#payout-completed
 */
export type WebhookPayoutCompletedEvent = Static<
	typeof WebhookPayoutCompletedEvent
>;

const paymentData = t.Object({
	amount: t.Integer({
		examples: [4000],
		description: 'Charge amount in cents (e.g. 4000 = R$40.00).',
	}),
	fee: t.Literal(80, {
		examples: [80],
		description: 'The fee charged by AbacatePay.',
	}),
	method: PaymentMethod,
});

/**
 * https://docs.abacatepay.com/pages/webhooks#checkout-completed
 */
export const WebhookCheckoutCompletedEvent = BaseWebhookEvent(
	'checkout.completed',
	t.Object({
		payment: t.Object(paymentData.properties, { description: 'Payment data.' }),
		billing: t.Object({
			amount: t.Integer({
				examples: [4000],
				description: 'Charge amount in cents (e.g. 4000 = R$40.00).',
			}),
			id: t.String({
				examples: ['bill_1234567890abcdef'],
				description: 'Unique billing identifier.',
			}),
			externalId: t.String({
				examples: ['my-invoice-0001'],
				description: 'Bill ID in your system.',
			}),
			status: t.Literal('PAID', {
				examples: ['PAID'],
				description: 'Status of the payment. Always `PAID`.',
			}),
			url: t.String({
				format: 'uri',
				examples: ['https://abacatepay.com/pay/bill_1234567890abcdef'],
				description: 'URL where the user can complete the payment.',
			}),
		}),
	}),
);

/**
 * https://docs.abacatepay.com/pages/webhooks#checkout-completed
 */
export type WebhookCheckoutCompletedEvent = Static<
	typeof WebhookCheckoutCompletedEvent
>;

/**
 * https://docs.abacatepay.com/pages/webhooks#transparent-completed
 */
export const WebhookTransparentCompletedEvent = BaseWebhookEvent(
	'transparent.completed',
	t.Object({
		payment: t.Object(paymentData.properties, { description: 'Payment data.' }),
		pixQrCode: t.Object({
			amount: t.Integer({
				examples: [4000],
				description: 'Charge amount in cents (e.g. 4000 = R$40.00).',
			}),
			id: t.String({
				examples: ['pix_char_1234567890abcdef'],
				description: 'Unique billing identifier.',
			}),
			kind: t.Literal('PIX', {
				examples: ['PIX'],
				description: 'Kind of the payment.',
			}),
			status: t.Literal('PAID', {
				examples: ['PAID'],
				description: 'Billing status, can only be `PAID` here.',
			}),
		}),
	}),
);

/**
 * https://docs.abacatepay.com/pages/webhooks#transparent-completed
 */
export type WebhookTransparentCompletedEvent = Static<
	typeof WebhookTransparentCompletedEvent
>;

/**
 * Event types whose payload AbacatePay does not document in detail yet.
 *
 * @unstable The `data` shape is a best-effort placeholder until AbacatePay documents it.
 */
export const WebhookUndocumentedEvent = t.Object({
	data: t.Record(t.String(), t.Unknown()),
	id: t.String({ description: 'Unique identifier for the webhook.' }),
	event: StringEnum(
		[
			'checkout.refunded',
			'checkout.disputed',
			'checkout.lost',
			'transparent.refunded',
			'transparent.disputed',
			'transparent.lost',
			'subscription.completed',
			'subscription.cancelled',
			'subscription.renewed',
			'subscription.trial_started',
			'transfer.completed',
			'transfer.failed',
		],
		{ description: 'This field identifies the type of event received.' },
	),
	devMode: t.Boolean({
		description:
			'Indicates whether the event occurred in the development environment.',
	}),
});

/**
 * Event types whose payload AbacatePay does not document in detail yet.
 *
 * @unstable
 */
export type WebhookUndocumentedEvent = Static<typeof WebhookUndocumentedEvent>;

/**
 * https://docs.abacatepay.com/pages/webhooks
 *
 * Any field that contains the tag "@unstable" means that the field is an assumption, it is uncertain (Since AbacatePay does not provide any information about).
 */
export const WebhookEvent = t.Union([
	WebhookPayoutCompletedEvent,
	WebhookPayoutFailedEvent,
	WebhookCheckoutCompletedEvent,
	WebhookTransparentCompletedEvent,
	WebhookUndocumentedEvent,
]);

/**
 * https://docs.abacatepay.com/pages/webhooks
 */
export type WebhookEvent = Static<typeof WebhookEvent>;
