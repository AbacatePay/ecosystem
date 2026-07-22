import type { PaymentMethod } from './checkout';

/**
 * https://docs.abacatepay.com/pages/subscriptions/reference#estrutura
 */
export interface APISubscription {
	/**
	 * The ID of the subscription.
	 */
	id: string;
	/**
	 * The subscription value in cents.
	 */
	amount: number;
	/**
	 * Subscription currency.
	 */
	currency: string;
	/**
	 * Subscription name.
	 */
	name: string;
	/**
	 * Subscription description.
	 */
	description: string;
	/**
	 * Unique identifier of the subscription on your system.
	 */
	externalId: string;
	/**
	 * Indicates whether the signature was created in a testing environment.
	 */
	devMode: boolean;
	/**
	 * Subscription creation date.
	 */
	createdAt: string;
	/**
	 * Subscription update date.
	 */
	updatedAt: string;
	/**
	 * Payment method for the subscription.
	 */
	method: PaymentMethod;
	/**
	 * Status of the subscription.
	 */
	status: SubscriptionStatus;
	/**
	 * Billing frequency configuration.
	 */
	frequency: {
		/**
		 * Subscription billing cycle.
		 */
		cycle: 'MONTHLY' | 'YEARLY' | 'WEEKLY' | 'DAILY';
		/**
		 * Day of the month the charge will be processed (1-31).
		 */
		dayOfProcessing: number;
	};
	/**
	 * Identifier of the customer who will have the signature.
	 */
	customerId: string;
	/**
	 * Retry policy in case of payment failure.
	 */
	retryPolicy: {
		/**
		 * Maximum number of billing attempts.
		 */
		maxRetry: number;
		/**
		 * Interval in days between charging attempts.
		 */
		retryEvery: number;
	};
	/**
	 * Array of events related to the subscription.
	 */
	events: APISubscriptionEvent[];
}

export enum SubscriptionStatus {
	Pending = 'PENDING',
	Active = 'ACTIVE',
	Cancelled = 'CANCELLED',
	Expired = 'EXPIRED',
	Failed = 'FAILED',
}

/**
 * Result of `POST /subscriptions/change-plan`.
 *
 * https://docs.abacatepay.com/pages/subscriptions/change-plan
 */
export interface APISubscriptionPlanChange {
	/**
	 * Unique identifier of this plan-change request.
	 */
	id: string;
	/**
	 * ID of the subscription being changed.
	 */
	subscriptionId: string;
	/**
	 * Status of the plan-change request.
	 */
	status: 'PENDING' | 'APPLIED' | 'CANCELLED';
	/**
	 * ID of the new product.
	 */
	productId: string;
	/**
	 * New quantity for the product.
	 */
	quantity: number;
	/**
	 * Amount that will be charged once the change is applied, in cents.
	 */
	newAmount: number;
	/**
	 * When the change was requested.
	 */
	requestedAt: string;
}

/**
 * Result of `POST /subscriptions/record-usage`.
 *
 * https://docs.abacatepay.com/pages/subscriptions/record-usage
 */
export interface APISubscriptionUsageRecord {
	/**
	 * Unique identifier of this usage record.
	 */
	id: string;
	/**
	 * ID of the subscription the usage was recorded against.
	 */
	subscriptionId: string;
	/**
	 * ID of the pay-as-you-go product the usage applies to.
	 */
	productId: string;
	/**
	 * Number of units recorded.
	 */
	units: number;
	/**
	 * Price per unit, in cents.
	 */
	unitPrice: number;
	/**
	 * Whether the units were added to or subtracted from the current cycle.
	 */
	action: 'add' | 'subtract';
	/**
	 * The pending installment this usage record was attached to.
	 */
	installmentNumber: number;
	/**
	 * When the usage was recorded.
	 */
	recordedAt: string;
}

/**
 * https://docs.abacatepay.com/pages/subscriptions/reference#estrutura
 */
export interface APISubscriptionEvent {
	/**
	 * Event type.
	 *
	 * @remarks We need to use `(string & {})` because we don't know exactly all possible values.
	 */
	event: 'CREATED' | (string & {});
	/**
	 * Event description.
	 */
	description: string;
	/**
	 * Event creation date.
	 */
	createdAt: string;
}
