import type {
	WebhookCheckoutCompletedEvent,
	WebhookCheckoutDisputedEvent,
	WebhookCheckoutRefundedEvent,
	WebhookEvent,
	WebhookPayoutCompletedEvent,
	WebhookPayoutFailedEvent,
	WebhookSubscriptionCancelledEvent,
	WebhookSubscriptionCompletedEvent,
	WebhookSubscriptionPaymentFailedEvent,
	WebhookSubscriptionPlanChangedEvent,
	WebhookSubscriptionRenewedEvent,
	WebhookSubscriptionTrialStartedEvent,
	WebhookTransferCompletedEvent,
	WebhookTransferFailedEvent,
	WebhookTransparentCompletedEvent,
	WebhookTransparentDisputedEvent,
	WebhookTransparentRefundedEvent,
	WebhookUndocumentedEvent,
} from '@abacatepay/zod/v2';

/**
 * Options to use in Webhooks
 */
export interface WebhookOptions {
	/**
	 * The webhook secret to use in the validation
	 */
	secret: string;
	/**
	 * Catch-all function for all Webhook events
	 */
	onPayload?(data: WebhookEvent): unknown;
	/**
	 * Function to execute when a `payout.completed` event is triggered
	 */
	onPayoutCompleted?(data: WebhookPayoutCompletedEvent): unknown;
	/**
	 * Function to execute when a `payout.failed` event is triggered
	 */
	onPayoutFailed?(data: WebhookPayoutFailedEvent): unknown;
	/**
	 * Function to execute when a `checkout.completed` event is triggered
	 */
	onCheckoutCompleted?(data: WebhookCheckoutCompletedEvent): unknown;
	/**
	 * Function to execute when a `transparent.completed` event is triggered
	 */
	onTransparentCompleted?(data: WebhookTransparentCompletedEvent): unknown;
	/**
	 * Function to execute when a `checkout.refunded` event is triggered
	 */
	onCheckoutRefunded?(data: WebhookCheckoutRefundedEvent): unknown;
	/**
	 * Function to execute when a `checkout.disputed` event is triggered (When a dispute is
	 * opened and again when it is resolved)
	 */
	onCheckoutDisputed?(data: WebhookCheckoutDisputedEvent): unknown;
	/**
	 * Function to execute when a `checkout.lost` event is triggered
	 *
	 * @deprecated AbacatePay never sends `checkout.lost`: a lost dispute arrives as `checkout.disputed` with `status: 'REFUNDED'`.
	 */
	onCheckoutLost?(data: WebhookUndocumentedEvent): unknown;
	/**
	 * Function to execute when a `transparent.refunded` event is triggered
	 */
	onTransparentRefunded?(data: WebhookTransparentRefundedEvent): unknown;
	/**
	 * Function to execute when a `transparent.disputed` event is triggered (When a dispute is
	 * opened and again when it is resolved)
	 */
	onTransparentDisputed?(data: WebhookTransparentDisputedEvent): unknown;
	/**
	 * Function to execute when a `transparent.lost` event is triggered
	 *
	 * @deprecated AbacatePay never sends `transparent.lost`: a lost dispute arrives as `transparent.disputed` with `status: 'REFUNDED'`.
	 */
	onTransparentLost?(data: WebhookUndocumentedEvent): unknown;
	/**
	 * Function to execute when a `subscription.completed` event is triggered
	 */
	onSubscriptionCompleted?(data: WebhookSubscriptionCompletedEvent): unknown;
	/**
	 * Function to execute when a `subscription.cancelled` event is triggered
	 */
	onSubscriptionCancelled?(data: WebhookSubscriptionCancelledEvent): unknown;
	/**
	 * Function to execute when a `subscription.renewed` event is triggered
	 */
	onSubscriptionRenewed?(data: WebhookSubscriptionRenewedEvent): unknown;
	/**
	 * Function to execute when a `subscription.trial_started` event is triggered
	 */
	onSubscriptionTrialStarted?(
		data: WebhookSubscriptionTrialStartedEvent,
	): unknown;
	/**
	 * Function to execute when a `subscription.plan_changed` event is triggered (When the change
	 * is requested and again when it is applied)
	 */
	onSubscriptionPlanChanged?(
		data: WebhookSubscriptionPlanChangedEvent,
	): unknown;
	/**
	 * Function to execute when a `subscription.payment_failed` event is triggered
	 */
	onSubscriptionPaymentFailed?(
		data: WebhookSubscriptionPaymentFailedEvent,
	): unknown;
	/**
	 * Function to execute when a `transfer.completed` event is triggered
	 */
	onTransferCompleted?(data: WebhookTransferCompletedEvent): unknown;
	/**
	 * Function to execute when a `transfer.failed` event is triggered
	 */
	onTransferFailed?(data: WebhookTransferFailedEvent): unknown;
}
