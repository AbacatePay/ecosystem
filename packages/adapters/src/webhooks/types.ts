import type {
	WebhookCheckoutCompletedEvent,
	WebhookEvent,
	WebhookEventType,
	WebhookPayoutCompletedEvent,
	WebhookPayoutFailedEvent,
	WebhookTransparentCompletedEvent,
	WebhookUndocumentedEvent,
} from '@abacatepay/zod/v2';

/**
 * Narrows the generic `WebhookUndocumentedEvent` payload to a single event
 * type, for events whose `data` shape AbacatePay hasn't documented yet.
 *
 * @unstable
 */
type UndocumentedEventPayload<Type extends WebhookEventType> = Omit<
	WebhookUndocumentedEvent,
	'event'
> & { event: Type };

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
	 *
	 * @unstable
	 */
	onCheckoutRefunded?(
		data: UndocumentedEventPayload<'checkout.refunded'>,
	): unknown;
	/**
	 * Function to execute when a `checkout.disputed` event is triggered
	 *
	 * @unstable
	 */
	onCheckoutDisputed?(
		data: UndocumentedEventPayload<'checkout.disputed'>,
	): unknown;
	/**
	 * Function to execute when a `checkout.lost` event is triggered
	 *
	 * @unstable
	 */
	onCheckoutLost?(data: UndocumentedEventPayload<'checkout.lost'>): unknown;
	/**
	 * Function to execute when a `transparent.refunded` event is triggered
	 *
	 * @unstable
	 */
	onTransparentRefunded?(
		data: UndocumentedEventPayload<'transparent.refunded'>,
	): unknown;
	/**
	 * Function to execute when a `transparent.disputed` event is triggered
	 *
	 * @unstable
	 */
	onTransparentDisputed?(
		data: UndocumentedEventPayload<'transparent.disputed'>,
	): unknown;
	/**
	 * Function to execute when a `transparent.lost` event is triggered
	 *
	 * @unstable
	 */
	onTransparentLost?(
		data: UndocumentedEventPayload<'transparent.lost'>,
	): unknown;
	/**
	 * Function to execute when a `subscription.completed` event is triggered
	 *
	 * @unstable
	 */
	onSubscriptionCompleted?(
		data: UndocumentedEventPayload<'subscription.completed'>,
	): unknown;
	/**
	 * Function to execute when a `subscription.cancelled` event is triggered
	 *
	 * @unstable
	 */
	onSubscriptionCancelled?(
		data: UndocumentedEventPayload<'subscription.cancelled'>,
	): unknown;
	/**
	 * Function to execute when a `subscription.renewed` event is triggered
	 *
	 * @unstable
	 */
	onSubscriptionRenewed?(
		data: UndocumentedEventPayload<'subscription.renewed'>,
	): unknown;
	/**
	 * Function to execute when a `subscription.trial_started` event is triggered
	 *
	 * @unstable
	 */
	onSubscriptionTrialStarted?(
		data: UndocumentedEventPayload<'subscription.trial_started'>,
	): unknown;
	/**
	 * Function to execute when a `transfer.completed` event is triggered
	 *
	 * @unstable
	 */
	onTransferCompleted?(
		data: UndocumentedEventPayload<'transfer.completed'>,
	): unknown;
	/**
	 * Function to execute when a `transfer.failed` event is triggered
	 *
	 * @unstable
	 */
	onTransferFailed?(data: UndocumentedEventPayload<'transfer.failed'>): unknown;
}
