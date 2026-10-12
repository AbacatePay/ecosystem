import type { PaymentMethod } from './checkout';

/**
 * A subscription (`subs_...`). It is created when a customer pays a subscription checkout.
 *
 * https://docs.abacatepay.com/pages/subscriptions/reference#estrutura
 */
export interface APISubscription {
	/**
	 * Unique subscription identifier (`subs_...`).
	 */
	id: string;
	/**
	 * ID of the subscription checkout (`bill_...`) that originated this subscription.
	 * One checkout can originate several subscriptions, one per paying customer.
	 */
	checkoutId: string | null;
	/**
	 * ID of the subscribed customer (`cust_...`).
	 */
	customerId: string;
	/**
	 * Amount charged every cycle, in cents.
	 */
	amount: number;
	/**
	 * Status of the subscription.
	 *
	 * @see {@link SubscriptionStatus}
	 */
	status: SubscriptionStatus;
	/**
	 * Payment method of the subscription.
	 */
	method: PaymentMethod.Card | PaymentMethod.Pix;
	/**
	 * Coupons applied to the subscription (Currently always empty).
	 */
	coupons: string[];
	/**
	 * Indicates whether the subscription was created in a testing environment.
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
	 * Trial length in days. `null` when the subscription has no trial.
	 */
	trialDays: number | null;
	/**
	 * End of the trial. `null` when the subscription has no trial.
	 */
	trialEndsAt: string | null;
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
}

/**
 * https://docs.abacatepay.com/pages/subscriptions/reference#atributos
 */
export enum SubscriptionStatus {
	Pending = 'PENDING',
	Active = 'ACTIVE',
	Cancelled = 'CANCELLED',
}

/**
 * Result of `POST /subscriptions/change-plan`.
 *
 * https://docs.abacatepay.com/pages/subscriptions/change-plan
 */
export interface APISubscriptionPlanChange {
	/**
	 * Unique identifier of this plan-change request (`subu_...`). A new ID is generated on every call.
	 */
	id: string;
	/**
	 * ID of the subscription being changed.
	 */
	subscriptionId: string;
	/**
	 * Status of the plan-change request (`PENDING` in this response).
	 */
	status: 'PENDING' | 'APPLIED' | 'CANCELLED';
	/**
	 * New products of the subscription.
	 */
	items: {
		/**
		 * Product ID.
		 */
		productId: string;
		/**
		 * Quantity.
		 */
		quantity: number;
		/**
		 * `price * quantity` of this product, in cents.
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
	 * Unique identifier of this usage record (`usgr_...`).
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
