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
			dayOfProcessing: z
				.int()
				.min(1)
				.max(31)
				.meta({ example: 3 })
				.describe('Day of the month the charge will be processed (1-31).'),
		})
		.describe('Billing frequency configuration.'),
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

/**
 * Result of `POST /subscriptions/change-plan`.
 *
 * https://docs.abacatepay.com/pages/subscriptions/change-plan
 */
export const APISubscriptionPlanChange = z.object({
	id: z
		.string()
		.describe('Unique identifier of this plan-change request.')
		.meta({ example: 'sub_change_123' }),
	subscriptionId: z
		.string()
		.describe('ID of the subscription being changed.')
		.meta({ example: 'subs_abc123xyz' }),
	status: StringEnum(
		['PENDING', 'APPLIED', 'CANCELLED'],
		'Status of the plan-change request.',
	).meta({ example: 'PENDING' }),
	productId: z
		.string()
		.describe('ID of the new product.')
		.meta({ example: 'prod_123' }),
	quantity: z
		.int()
		.describe('New quantity for the product.')
		.meta({ example: 1 }),
	newAmount: z
		.int()
		.describe(
			'Amount that will be charged once the change is applied, in cents.',
		)
		.meta({ example: 4000 }),
	requestedAt: z.coerce
		.date()
		.describe('When the change was requested.')
		.meta({ example: new Date() }),
});

/**
 * https://docs.abacatepay.com/pages/subscriptions/change-plan
 */
export type APISubscriptionPlanChange = z.infer<
	typeof APISubscriptionPlanChange
>;

/**
 * Result of `POST /subscriptions/record-usage`.
 *
 * https://docs.abacatepay.com/pages/subscriptions/record-usage
 */
export const APISubscriptionUsageRecord = z.object({
	id: z
		.string()
		.describe('Unique identifier of this usage record.')
		.meta({ example: 'usage_123' }),
	subscriptionId: z
		.string()
		.describe('ID of the subscription the usage was recorded against.')
		.meta({ example: 'subs_abc123xyz' }),
	productId: z
		.string()
		.describe('ID of the pay-as-you-go product the usage applies to.')
		.meta({ example: 'prod_123' }),
	units: z.int().describe('Number of units recorded.').meta({ example: 5 }),
	unitPrice: z
		.int()
		.describe('Price per unit, in cents.')
		.meta({ example: 100 }),
	action: StringEnum(
		['add', 'subtract'],
		'Whether the units were added to or subtracted from the current cycle.',
	).meta({ example: 'add' }),
	installmentNumber: z
		.int()
		.describe('The pending installment this usage record was attached to.')
		.meta({ example: 1 }),
	recordedAt: z.coerce
		.date()
		.describe('When the usage was recorded.')
		.meta({ example: new Date() }),
});

/**
 * https://docs.abacatepay.com/pages/subscriptions/record-usage
 */
export type APISubscriptionUsageRecord = z.infer<
	typeof APISubscriptionUsageRecord
>;
