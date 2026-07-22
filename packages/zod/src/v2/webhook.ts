import { type _ZodType, z } from 'zod';
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
	'Webhook event type.',
).meta({ example: 'checkout.completed' });

/**
 * https://docs.abacatepay.com/pages/webhooks/reference
 */
export type WebhookEventType = z.infer<typeof WebhookEventType>;

/**
 * The webhook resource itself, as returned by the `webhooks/*` endpoints.
 *
 * https://docs.abacatepay.com/pages/webhooks/reference
 */
export const APIWebhook = z.object({
	id: z
		.string()
		.describe('Unique webhook identifier.')
		.meta({ example: 'webh_123' }),
	name: z
		.string()
		.describe('Webhook name.')
		.meta({ example: 'Order fulfillment' }),
	endpoint: z
		.url()
		.describe('HTTPS endpoint that receives the events.')
		.meta({ example: 'https://myshop.com/webhooks/abacatepay' }),
	events: z
		.array(WebhookEventType)
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

export const BaseWebhookEvent = <
	Type extends z.infer<typeof WebhookEventType>,
	Schema extends _ZodType,
>(
	type: Type,
	schema: Schema,
) =>
	z.object({
		data: schema,
		id: z
			.string()
			.describe('Unique identifier for the webhook.')
			.meta({ example: 'log_123' }),
		event: z
			.literal(type)
			.meta({ example: type })
			.describe('This field identifies the type of event received.'),
		devMode: z
			.boolean()
			.meta({ example: true })
			.describe(
				'Indicates whether the event occurred in the development environment.',
			),
	});

/**
 * https://docs.abacatepay.com/pages/webhooks#payout-failed
 */
export const WebhookPayoutFailedEvent = BaseWebhookEvent(
	'payout.failed',
	z.object({
		transaction: APIPayout.omit({ status: true })
			.extend({
				status: z
					.literal('CANCELLED')
					.meta({ example: 'CANCELLED' })
					.describe('Status of the payout. Always `CANCELLED`.'),
			})
			.describe('Transaction data.'),
	}),
);

/**
 * https://docs.abacatepay.com/pages/webhooks#payout-failed
 */
export type WebhookPayoutFailedEvent = z.infer<typeof WebhookPayoutFailedEvent>;

/**
 * https://docs.abacatepay.com/pages/webhooks#payout-completed
 */
export const WebhookPayoutCompletedEvent = BaseWebhookEvent(
	'payout.completed',
	z.object({
		transaction: APIPayout.omit({ status: true })
			.extend({
				status: z
					.literal('COMPLETE')
					.meta({ example: 'COMPLETE' })
					.describe('Status of the payout. Always `COMPLETE`.'),
			})
			.describe('Transaction data.'),
	}),
);

/**
 * https://docs.abacatepay.com/pages/webhooks#payout-completed
 */
export type WebhookPayoutCompletedEvent = z.infer<
	typeof WebhookPayoutCompletedEvent
>;

const paymentData = z.object({
	amount: z
		.int()
		.meta({ example: 4000 })
		.describe('Charge amount in cents (e.g. 4000 = R$40.00).'),
	fee: z
		.literal(80)
		.describe('The fee charged by AbacatePay.')
		.meta({ example: 80 }),
	method: PaymentMethod,
});

/**
 * https://docs.abacatepay.com/pages/webhooks#checkout-completed
 */
export const WebhookCheckoutCompletedEvent = BaseWebhookEvent(
	'checkout.completed',
	z.object({
		payment: paymentData.describe('Payment data.'),
		billing: z.object({
			amount: z
				.int()
				.describe('Charge amount in cents (e.g. 4000 = R$40.00).')
				.meta({ example: 4000 }),
			id: z
				.string()
				.describe('Unique billing identifier.')
				.meta({ example: 'bill_123' }),
			externalId: z
				.string()
				.describe('Bill ID in your system.')
				.meta({ example: 'order_123' }),
			status: z
				.literal('PAID')
				.meta({ example: 'PAID' })
				.describe('Status of the payment. Always `PAID`.'),
			url: z
				.url()
				.meta({ example: 'https://myshop.com/premium' })
				.describe('URL where the user can complete the payment.'),
		}),
	}),
);

/**
 * https://docs.abacatepay.com/pages/webhooks#checkout-completed
 */
export type WebhookCheckoutCompletedEvent = z.infer<
	typeof WebhookCheckoutCompletedEvent
>;

/**
 * https://docs.abacatepay.com/pages/webhooks#transparent-completed
 */
export const WebhookTransparentCompletedEvent = BaseWebhookEvent(
	'transparent.completed',
	z.object({
		payment: paymentData.describe('Payment data.'),
		pixQrCode: z.object({
			amount: z
				.int()
				.meta({ example: 4000 })
				.describe('Charge amount in cents (e.g. 4000 = R$40.00).'),
			id: z
				.string()
				.describe('Unique billing identifier.')
				.meta({ example: 'pix_char_123' }),
			kind: z
				.literal('PIX')
				.describe('Kind of the payment.')
				.meta({ example: 'PIX' }),
			status: z
				.literal('PAID')
				.meta({ example: 'PAID' })
				.describe('Billing status, can only be `PAID` here.'),
		}),
	}),
);

/**
 * https://docs.abacatepay.com/pages/webhooks#transparent-completed
 */
export type WebhookTransparentCompletedEvent = z.infer<
	typeof WebhookTransparentCompletedEvent
>;

/**
 * Event types whose payload AbacatePay does not document in detail yet.
 *
 * @unstable The `data` shape is a best-effort placeholder until AbacatePay documents it.
 */
export const WebhookUndocumentedEvent = z.object({
	data: z.record(z.string(), z.unknown()),
	id: z.string().describe('Unique identifier for the webhook.'),
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
		'This field identifies the type of event received.',
	),
	devMode: z
		.boolean()
		.describe(
			'Indicates whether the event occurred in the development environment.',
		),
});

/**
 * Event types whose payload AbacatePay does not document in detail yet.
 *
 * @unstable
 */
export type WebhookUndocumentedEvent = z.infer<typeof WebhookUndocumentedEvent>;

/**
 * https://docs.abacatepay.com/pages/webhooks
 *
 * Any field that contains the tag "@unstable" means that the field is an assumption, it is uncertain (Since AbacatePay does not provide any information about).
 */
export const WebhookEvent = z.discriminatedUnion('event', [
	WebhookPayoutCompletedEvent,
	WebhookPayoutFailedEvent,
	WebhookCheckoutCompletedEvent,
	WebhookTransparentCompletedEvent,
	WebhookUndocumentedEvent,
]);

/**
 * https://docs.abacatepay.com/pages/webhooks
 */
export type WebhookEvent = z.infer<typeof WebhookEvent>;
