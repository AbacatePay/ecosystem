import { z } from 'zod';
import { StringEnum } from '../utils';
import {
	APICustomer,
	APIProduct,
	APIWithdraw,
	PaymentFrequency,
	PaymentMethod,
} from '.';

/**
 * https://docs.abacatepay.com/pages/webhooks
 */
export const WebhookEventType = StringEnum(
	['withdraw.failed', 'withdraw.done', 'billing.paid'],
	'Webhook event type.',
).meta({ example: 'withdraw.done' });

/**
 * https://docs.abacatepay.com/pages/webhooks
 */
export type WebhookEventType = z.infer<typeof WebhookEventType>;

export const BaseWebhookEvent = <
	Type extends z.infer<typeof WebhookEventType>,
	Schema extends z.ZodTypeAny,
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
			.literal([type])
			.meta({ example: 'withdraw.done' })
			.describe('This field identifies the type of event received.'),
		devMode: z
			.boolean()
			.meta({ example: false })
			.describe(
				'Indicates whether the event occurred in the development environment.',
			),
	});

/**
 * https://docs.abacatepay.com/pages/webhooks#withdraw-failed
 */
export const WebhookWithdrawFailedEvent = BaseWebhookEvent(
	'withdraw.failed',
	z.object({
		transaction: z
			.intersection(
				APIWithdraw.omit({ status: true }),
				z.object({
					status: z
						.literal(['CANCELLED'])
						.describe('Status of the withdraw. Always `CANCELLED`.')
						.meta({ example: 'CANCELLED' }),
				}),
			)
			.describe('Transaction data.'),
	}),
);

/**
 * https://docs.abacatepay.com/pages/webhooks#withdraw-failed
 */
export type WebhookWithdrawFailedEvent = z.infer<
	typeof WebhookWithdrawFailedEvent
>;

/**
 * https://docs.abacatepay.com/pages/webhooks#withdraw-done
 */
export const WebhookWithdrawDoneEvent = BaseWebhookEvent(
	'withdraw.done',
	z.object({
		transaction: z
			.intersection(
				APIWithdraw.omit({ status: true }),
				z.object({
					status: z
						.literal(['COMPLETE'])
						.describe('Status of the withdraw. Always `COMPLETE`.')
						.meta({ example: 'COMPLETE' }),
				}),
			)
			.describe('Transaction data.'),
	}),
);

/**
 * https://docs.abacatepay.com/pages/webhooks#withdraw-done
 */
export type WebhookWithdrawDoneEvent = z.infer<typeof WebhookWithdrawDoneEvent>;

/**
 * https://docs.abacatepay.com/pages/webhooks#billing-paid
 */
export const WebhookBillingPaidEvent = BaseWebhookEvent(
	'billing.paid',
	z.object({
		payment: z.intersection(
			z
				.object({
					payment: z.object({
						amount: z
							.int()
							.describe('Charge amount in cents (e.g. 4000 = R$40.00).')
							.meta({ example: 4000 }),
						fee: z
							.int()
							.describe('The fee charged by AbacatePay.')
							.meta({ example: 80 }),
						method: PaymentMethod,
					}),
				})
				.describe('Payment data.'),
			z.union([
				z.object({
					pixQrCode: z.object({
						amount: z
							.int()
							.describe('Charge amount in cents (e.g. 4000 = R$40.00).')
							.meta({ example: 4000 }),
						id: z
							.string()
							.describe('Unique billing identifier.')
							.meta({ example: 'bill_123' }),
						kind: z
							.literal(['PIX'])
							.describe('Kind of the payment')
							.meta({ example: 'PIX' }),
						status: z
							.literal(['PAID'])
							.meta({ example: 'PAID' })
							.describe('Billing status, can only be `PAID` here'),
					}),
				}),
				z.object({
					billing: z.object({
						amount: z
							.int()
							.meta({ example: 4000 })
							.describe('Charge amount in cents (e.g. 4000 = R$40.00).'),
						id: z
							.string()
							.meta({ example: 'bill_123' })
							.describe('Unique billing identifier.'),
						status: z
							.literal(['PAID'])
							.meta({ example: 'PAID' })
							.describe('Status of the payment. Always `PAID`.'),
						couponsUsed: z
							.array(z.string())
							.meta({ example: ['SUMMER'] })
							.describe('Counpons used in the billing.'),
					}),
					customer: APICustomer,
					frequency: PaymentFrequency,
					kind: z
						.array(PaymentMethod)
						.meta({ example: 'PIX' })
						.describe('Payment methods.'),
					paidAmount: z
						.int()
						.describe('Charge amount in cents.')
						.meta({ example: 4000 }),
					products: z
						.intersection(
							APIProduct.pick({ quantity: true, externalId: true }),
							z.object({
								id: z.string().meta({ example: 'prod_abc' }),
							}),
						)
						.describe('Products used in the billing.'),
				}),
			]),
		),
	}),
);

/**
 * https://docs.abacatepay.com/pages/webhooks#billing-paid
 */
export type WebhookBillingPaidEvent = z.infer<typeof WebhookBillingPaidEvent>;

/**
 * https://docs.abacatepay.com/pages/webhooks
 */
export const WebhookEvent = z.union([
	WebhookWithdrawDoneEvent,
	WebhookBillingPaidEvent,
	WebhookWithdrawFailedEvent,
]);

/**
 * https://docs.abacatepay.com/pages/webhooks
 */
export type WebhookEvent = z.infer<typeof WebhookEvent>;
