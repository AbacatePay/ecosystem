import type {
	APIProduct,
	PaymentFrequency,
	PaymentMethod,
	PaymentStatus,
} from './entities/checkout';
import type { APICustomer } from './entities/customer';
import type { APIWithdraw, WithdrawStatus } from './entities/payouts';

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
 * https://docs.abacatepay.com/pages/webhooks#withdraw-failed
 */
export type WebhookWithdrawFailedEvent = BaseWebhookEvent<
	WebhookEventType.WithdrawFailed,
	{
		/**
		 * Transaction data.
		 */
		transaction: Omit<APIWithdraw, 'status'> & {
			/**
			 * Status of the withdraw. Always `WithdrawStatus.Cancelled`.
			 *
			 * @see {@link WithdrawStatus.Cancelled}
			 */
			status: WithdrawStatus.Cancelled;
		};
	}
>;

/**
 * https://docs.abacatepay.com/pages/webhooks#withdraw-done
 */
export type WebhookWithdrawDoneEvent = BaseWebhookEvent<
	WebhookEventType.WithdrawDone,
	{
		/**
		 * Transaction data.
		 */
		transaction: Omit<APIWithdraw, 'status'> & {
			/**
			 * Status of the withdraw. Always `WithdrawStatus.Complete`.
			 *
			 * @see {@link WithdrawStatus.Complete}
			 */
			status: WithdrawStatus.Complete;
		};
	}
>;

/**
 * https://docs.abacatepay.com/pages/webhooks#billing-paid
 */
export type WebhookBillingPaidEvent = BaseWebhookEvent<
	WebhookEventType.BillingPaid,
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
	} & (
		| {
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
					 * Kind of the payment
					 */
					kind: 'PIX';
					/**
					 * Billing status, can only be `PAID` here
					 *
					 * @see {@link PaymentStatus.Paid}
					 */
					status: PaymentStatus.Paid;
				};
		  }
		| {
				billing: {
					/**
					 * Charge amount in cents (e.g. 4000 = R$40.00).
					 */
					amount: number;
					/**
					 * Counpons used in the billing.
					 */
					couponsUsed: string[];
					/**
					 * Customer of the charge.
					 */
					customer: APICustomer;
					/**
					 * Payment frequency.
					 *
					 * @see {@link PaymentFrequency}
					 */
					frequency: PaymentFrequency;
					/**
					 * Unique billing identifier.
					 */
					id: string;
					/**
					 * Payment methods?
					 *
					 * @unstable
					 */
					kind: PaymentMethod[];
					/**
					 * Charge amount in cents.
					 *
					 * @unstable
					 */
					paidAmount: number;
					/**
					 * Products used in the billing.
					 */
					products: (Pick<APIProduct, 'quantity' | 'externalId'> & {
						id: string;
					})[];
					/**
					 * Status of the payment. Always `PaymentStatus.Paid`.
					 *
					 * @see {@link PaymentStatus.Paid}
					 */
					status: PaymentStatus.Paid;
				};
		  }
	)
>;

/**
 * https://docs.abacatepay.com/pages/webhooks
 *
 * Any field that contains the tag "@unstable" means that the field is an assumption, it is uncertain (Since AbacatePay does not provide any information about).
 */
export type WebhookEvent =
	| WebhookWithdrawDoneEvent
	| WebhookWithdrawFailedEvent
	| WebhookBillingPaidEvent;

/**
 * https://docs.abacatepay.com/pages/webhooks
 */
export enum WebhookEventType {
	WithdrawFailed = 'withdraw.failed',
	WithdrawDone = 'withdraw.done',
	BillingPaid = 'billing.paid',
}
