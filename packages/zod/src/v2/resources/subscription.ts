import { z } from 'zod';
import { StringEnum } from '../../utils';
import { PaymentMethod } from './checkout';

/**
 * https://docs.abacatepay.com/pages/subscriptions/reference#estrutura
 */
export const APISubscriptionEvent = z.object({
	event: z.string().describe('Event type.').meta({ example: 'event_123' }),
	description: z
		.string()
		.describe('Event description.')
		.meta({ example: 'Subscription created.' }),
	createdAt: z.coerce
		.date()
		.describe('Event cretion date.')
		.meta({ example: new Date() }),
});

/**
 * https://docs.abacatepay.com/pages/subscriptions/reference#estrutura
 */
export type APISubscriptionEvent = z.infer<typeof APISubscriptionEvent>;

/**
 * https://docs.abacatepay.com/pages/subscriptions/reference#atributos
 */
export const SubscriptionStatus = StringEnum(
	['ACTIVE', 'PENDING', 'CANCELLED', 'EXPIRED', 'FAILED'],
	'Subscription status.',
).meta({ example: 'ACTIVE' });

/**
 * https://docs.abacatepay.com/pages/subscriptions/reference#atributos
 */
export type SubscriptionStatus = z.infer<typeof SubscriptionStatus>;

/**
 * https://docs.abacatepay.com/pages/subscriptions/reference#estrutura
 */
export const APISubscription = z.object({
	id: z
		.string()
		.describe('The ID of the subscription.')
		.meta({ example: 'sub_123' }),
	amount: z
		.int()
		.describe('The subscription value in cents.')
		.meta({ example: 4000 }),
	currency: z
		.string()
		.describe('Subscription currency.')
		.meta({ example: 'BRL' }),
	name: z
		.string()
		.describe('Subscription name.')
		.meta({ example: 'One-Time premium' }),
	description: z
		.string()
		.describe('Subscription description.')
		.meta({ example: 'Premium for one-time payment' }),
	externalId: z
		.string()
		.meta({ example: 'my_sub_123' })
		.describe('Unique identifier of the subscription on your system.'),
	devMode: z
		.boolean()
		.meta({ example: false })
		.describe(
			'Indicates whether the signature was created in a testing environment.',
		),
	createdAt: z.coerce
		.date()
		.meta({ example: new Date() })
		.describe('Subscription creation date.'),
	updatedAt: z.coerce
		.date()
		.meta({ example: new Date() })
		.describe('Subscription update date.'),
	method: PaymentMethod,
	status: SubscriptionStatus,
	frequency: z
		.object({
			cycle: StringEnum(
				['MONTHLY', 'YEARLY', 'WEEKLY', 'DAILY'],
				'Subscription billing cycle.',
			).meta({ example: 'MONTHLY' }),
		})
		.describe('Billing frequency configuration.'),
	dayOfProcessing: z
		.int()
		.min(1)
		.max(31)
		.meta({ example: 3 })
		.describe('Day of the month the charge will be processed (1-31).'),
	customerId: z
		.string()
		.meta({ example: 'cust_123' })
		.describe('Identifier of the customer who will have the signature.'),
	retryPolicy: z
		.object({
			maxRetry: z
				.int()
				.meta({ example: 2 })
				.describe('Maximum number of billing attempts.'),
			retryEvery: z
				.int()
				.meta({ example: 5 })
				.describe('Interval in days between charging attempts.'),
		})
		.describe('Retry policy in case of payment failure.'),
	events: z
		.array(APISubscriptionEvent)
		.meta({
			example: [
				{
					id: 'event_123',
					description: 'Subscription created.',
					createdAt: new Date(),
				},
			],
		})
		.describe('Array of events related to the subscription.'),
});

/**
 * https://docs.abacatepay.com/pages/subscriptions/reference#estrutura
 */
export type APISubscription = z.infer<typeof APISubscription>;
