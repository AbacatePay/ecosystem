import { type Static, Type as t } from '@sinclair/typebox';
import { StringEnum } from '../../utils';
import { PaymentMethod } from './checkout';

/**
 * https://docs.abacatepay.com/pages/subscriptions/reference#estrutura
 */
export const APISubscriptionEvent = t.Object({
	event: t.String({
		examples: ['CREATED'],
		description: 'Event type.',
	}),
	description: t.String({
		examples: ['Subscription was created.'],
		description: 'Event description.',
	}),
	createdAt: t.Date({
		examples: ['2025-01-01T00:00:00Z'],
		description: 'Event creation date.',
	}),
});

/**
 * https://docs.abacatepay.com/pages/subscriptions/reference#estrutura
 */
export type APISubscriptionEvent = Static<typeof APISubscriptionEvent>;

export const SubscriptionStatus = StringEnum(
	['ACTIVE', 'PENDING', 'CANCELLED', 'EXPIRED', 'FAILED'],
	{ examples: ['ACTIVE'], description: 'Subscription status.' },
);

export type SubscriptionStatus = Static<typeof SubscriptionStatus>;

/**
 * https://docs.abacatepay.com/pages/subscriptions/reference#estrutura
 */
export const APISubscription = t.Object({
	id: t.String({
		examples: ['subs_abc123xyz'],
		description: 'The ID of the subscription.',
	}),
	amount: t.Integer({
		examples: [5000],
		description: 'The subscription value in cents.',
	}),
	currency: t.String({
		examples: ['USD'],
		description: 'Subscription currency.',
	}),
	name: t.String({
		examples: ['Premium Plan'],
		description: 'Subscription name.',
	}),
	description: t.String({
		examples: ['Access to all premium features.'],
		description: 'Subscription description.',
	}),
	externalId: t.String({
		examples: ['subscr_internal_123'],
		description: 'Unique identifier of the subscription on your system.',
	}),
	devMode: t.Boolean({
		examples: [true],
		description:
			'Indicates whether the signature was created in a testing environment.',
	}),
	createdAt: t.Date({
		examples: ['2025-01-01T00:00:00Z'],
		description: 'Subscription creation date.',
	}),
	updatedAt: t.Date({
		examples: ['2025-01-15T00:00:00Z'],
		description: 'Subscription update date.',
	}),
	method: PaymentMethod,
	status: SubscriptionStatus,
	frequency: t.Object(
		{
			cycle: StringEnum(['MONTHLY', 'YEARLY', 'WEEKLY', 'DAILY'], {
				examples: ['MONTHLY'],
				description: 'Subscription billing cycle.',
			}),
			dayOfProcessing: t.Integer({
				minimum: 1,
				maximum: 31,
				examples: [15],
				description: 'Day of the month the charge will be processed (1-31).',
			}),
		},
		{
			description: 'Billing frequency configuration.',
		},
	),
	customerId: t.String({
		examples: ['cust_abc123xyz'],
		description: 'Identifier of the customer who will have the signature.',
	}),
	retryPolicy: t.Object(
		{
			maxRetry: t.Integer({
				examples: [3],
				description: 'Maximum number of billing attempts.',
			}),
			retryEvery: t.Integer({
				examples: [5],
				description: 'Interval in days between charging attempts.',
			}),
		},
		{
			description: 'Retry policy in case of payment failure.',
		},
	),
	events: t.Array(APISubscriptionEvent, {
		description: 'Array of events related to the subscription.',
	}),
});

/**
 * https://docs.abacatepay.com/pages/subscriptions/reference#estrutura
 */
export type APISubscription = Static<typeof APISubscription>;

/**
 * Result of `POST /subscriptions/change-plan`.
 *
 * https://docs.abacatepay.com/pages/subscriptions/change-plan
 */
export const APISubscriptionPlanChange = t.Object({
	id: t.String({
		examples: ['sub_change_123'],
		description: 'Unique identifier of this plan-change request.',
	}),
	subscriptionId: t.String({
		examples: ['subs_abc123xyz'],
		description: 'ID of the subscription being changed.',
	}),
	status: StringEnum(['PENDING', 'APPLIED', 'CANCELLED'], {
		examples: ['PENDING'],
		description: 'Status of the plan-change request.',
	}),
	productId: t.String({
		examples: ['prod_123'],
		description: 'ID of the new product.',
	}),
	quantity: t.Integer({
		examples: [1],
		description: 'New quantity for the product.',
	}),
	newAmount: t.Integer({
		examples: [4000],
		description:
			'Amount that will be charged once the change is applied, in cents.',
	}),
	requestedAt: t.Date({
		examples: ['2025-01-01T00:00:00Z'],
		description: 'When the change was requested.',
	}),
});

/**
 * https://docs.abacatepay.com/pages/subscriptions/change-plan
 */
export type APISubscriptionPlanChange = Static<
	typeof APISubscriptionPlanChange
>;

/**
 * Result of `POST /subscriptions/record-usage`.
 *
 * https://docs.abacatepay.com/pages/subscriptions/record-usage
 */
export const APISubscriptionUsageRecord = t.Object({
	id: t.String({
		examples: ['usage_123'],
		description: 'Unique identifier of this usage record.',
	}),
	subscriptionId: t.String({
		examples: ['subs_abc123xyz'],
		description: 'ID of the subscription the usage was recorded against.',
	}),
	productId: t.String({
		examples: ['prod_123'],
		description: 'ID of the pay-as-you-go product the usage applies to.',
	}),
	units: t.Integer({ examples: [5], description: 'Number of units recorded.' }),
	unitPrice: t.Integer({
		examples: [100],
		description: 'Price per unit, in cents.',
	}),
	action: StringEnum(['add', 'subtract'], {
		examples: ['add'],
		description:
			'Whether the units were added to or subtracted from the current cycle.',
	}),
	installmentNumber: t.Integer({
		examples: [1],
		description: 'The pending installment this usage record was attached to.',
	}),
	recordedAt: t.Date({
		examples: ['2025-01-01T00:00:00Z'],
		description: 'When the usage was recorded.',
	}),
});

/**
 * https://docs.abacatepay.com/pages/subscriptions/record-usage
 */
export type APISubscriptionUsageRecord = Static<
	typeof APISubscriptionUsageRecord
>;
