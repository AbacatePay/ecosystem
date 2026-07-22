import type { APIPayout, PaymentMethod, PaymentStatus, PayoutStatus } from '.';

/**
 * The webhook resource itself, as returned by the `webhooks/*` endpoints.
 *
 * https://docs.abacatepay.com/pages/webhooks/reference
 */
export interface APIWebhook {
	/**
	 * Unique webhook identifier.
	 */
	id: string;
	/**
	 * Webhook name.
	 */
	name: string;
	/**
	 * HTTPS endpoint that receives the events.
	 */
	endpoint: string;
	/**
	 * Event types this webhook is subscribed to.
	 *
	 * @see {@link WebhookEventType}
	 */
	events: WebhookEventType[];
	/**
	 * Indicates whether the webhook was created in a testing environment.
	 */
	devMode: boolean;
	/**
	 * Indicates whether this webhook targets the v2 API.
	 */
	v2: boolean;
	/**
	 * Webhook creation date and time.
	 */
	createdAt: string;
	/**
	 * Webhook last updated date and time.
	 */
	updatedAt: string;
}

export interface BaseWebhookEvent<
	Type extends WebhookEventType,
	Data extends object,
> {
	/**
	 * The data received in the event.
	 */
	data: Data;
	/**
	 * Unique identifier for the webhook.
	 */
	id: string;
	/**
	 * This field identifies the type of event received.
	 */
	event: Type;
	/**
	 * Indicates whether the event occurred in the development environment.
	 */
	devMode: boolean;
}

/**
 * https://docs.abacatepay.com/pages/webhooks#payout-failed
 */
export type WebhookPayoutFailedEvent = BaseWebhookEvent<
	WebhookEventType.PayoutFailed,
	{
		/**
		 * Transaction data.
		 */
		transaction: Omit<APIPayout, 'status'> & {
			/**
			 * Status of the payout. Always `PayoutStatus.Cancelled`.
			 *
			 * @see {@link PayoutStatus.Cancelled}
			 */
			status: PayoutStatus.Cancelled;
		};
	}
>;

/**
 * https://docs.abacatepay.com/pages/webhooks#payout-completed
 */
export type WebhookPayoutCompletedEvent = BaseWebhookEvent<
	WebhookEventType.PayoutCompleted,
	{
		/**
		 * Transaction data.
		 */
		transaction: Omit<APIPayout, 'status'> & {
			/**
			 * Status of the payout. Always `PayoutStatus.Complete`.
			 *
			 * @see {@link PayoutStatus.Complete}
			 */
			status: PayoutStatus.Complete;
		};
	}
>;

/**
 * https://docs.abacatepay.com/pages/webhooks#checkout-completed
 */
export type WebhookCheckoutCompletedEvent = BaseWebhookEvent<
	WebhookEventType.CheckoutCompleted,
	{
		/**
		 * Payment data.
		 */
		payment: {
			/**
			 * Charge amount in cents (e.g. 4000 = R$40.00).
			 */
			amount: number;
			/**
			 * The fee charged by AbacatePay.
			 */
			fee: 80;
			/**
			 * Payment method.
			 *
			 * @see {@link PaymentMethod}
			 */
			method: PaymentMethod;
		};
		billing: {
			/**
			 * Charge amount in cents (e.g. 4000 = R$40.00).
			 */
			amount: number;
			/**
			 * Unique billing identifier.
			 */
			id: string;
			/**
			 * Bill ID in your system.
			 */
			externalId: string;
			/**
			 * Status of the payment. Always `PaymentStatus.Paid`.
			 *
			 * @see {@link PaymentStatus.Paid}
			 */
			status: PaymentStatus.Paid;
			/**
			 * URL where the user can complete the payment.
			 */
			url: string;
		};
	}
>;

/**
 * https://docs.abacatepay.com/pages/webhooks#transparent-completed
 */
export type WebhookTransparentCompletedEvent = BaseWebhookEvent<
	WebhookEventType.TransparentCompleted,
	{
		/**
		 * Payment data.
		 */
		payment: {
			/**
			 * Charge amount in cents (e.g. 4000 = R$40.00).
			 */
			amount: number;
			/**
			 * The fee charged by AbacatePay.
			 */
			fee: 80;
			/**
			 * Payment method.
			 *
			 * @see {@link PaymentMethod}
			 */
			method: PaymentMethod;
		};
		pixQrCode: {
			/**
			 * Charge amount in cents (e.g. 4000 = R$40.00).
			 */
			amount: number;
			/**
			 * Unique billing identifier.
			 */
			id: string;
			/**
			 * Kind of the payment.
			 */
			kind: 'PIX';
			/**
			 * Billing status, can only be `PAID` here.
			 *
			 * @see {@link PaymentStatus.Paid}
			 */
			status: PaymentStatus.Paid;
		};
	}
>;

/**
 * Event types whose payload AbacatePay does not document in detail yet.
 *
 * @unstable The `data` shape is a best-effort placeholder until AbacatePay documents it.
 */
export type WebhookUndocumentedEvent = BaseWebhookEvent<
	Exclude<
		WebhookEventType,
		| WebhookEventType.PayoutFailed
		| WebhookEventType.PayoutCompleted
		| WebhookEventType.CheckoutCompleted
		| WebhookEventType.TransparentCompleted
	>,
	Record<string, unknown>
>;

/**
 * https://docs.abacatepay.com/pages/webhooks
 *
 * Any field that contains the tag "@unstable" means that the field is an assumption, it is uncertain (Since AbacatePay does not provide any information about).
 */
export type WebhookEvent =
	| WebhookPayoutCompletedEvent
	| WebhookPayoutFailedEvent
	| WebhookCheckoutCompletedEvent
	| WebhookTransparentCompletedEvent
	| WebhookUndocumentedEvent;

/**
 * https://docs.abacatepay.com/pages/webhooks/reference
 */
export enum WebhookEventType {
	CheckoutCompleted = 'checkout.completed',
	CheckoutRefunded = 'checkout.refunded',
	CheckoutDisputed = 'checkout.disputed',
	CheckoutLost = 'checkout.lost',
	TransparentCompleted = 'transparent.completed',
	TransparentRefunded = 'transparent.refunded',
	TransparentDisputed = 'transparent.disputed',
	TransparentLost = 'transparent.lost',
	SubscriptionCompleted = 'subscription.completed',
	SubscriptionCancelled = 'subscription.cancelled',
	SubscriptionRenewed = 'subscription.renewed',
	SubscriptionTrialStarted = 'subscription.trial_started',
	PayoutCompleted = 'payout.completed',
	PayoutFailed = 'payout.failed',
	TransferCompleted = 'transfer.completed',
	TransferFailed = 'transfer.failed',
}
