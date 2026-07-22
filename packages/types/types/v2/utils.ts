import { type WebhookEvent, WebhookEventType } from './webhook';

/**
 * A type guard check for `payout.completed` webhook events.
 * @param event - The webhook event to check against.
 * @returns A boolean that indicates if the webhook is a payout completed webhook.
 */
export function isPayoutCompletedWebhookEvent(event: WebhookEvent) {
	return event.event === WebhookEventType.PayoutCompleted;
}

/**
 * A type guard check for `payout.failed` webhook events.
 * @param event - The webhook event to check against.
 * @returns A boolean that indicates if the webhook is a payout failed webhook.
 */
export function isPayoutFailedWebhookEvent(event: WebhookEvent) {
	return event.event === WebhookEventType.PayoutFailed;
}

/**
 * A type guard check for `checkout.completed` webhook events.
 * @param event - The webhook event to check against.
 * @returns A boolean that indicates if the webhook is a checkout completed webhook.
 */
export function isCheckoutCompletedWebhookEvent(event: WebhookEvent) {
	return event.event === WebhookEventType.CheckoutCompleted;
}

/**
 * A type guard check for `transparent.completed` webhook events.
 * @param event - The webhook event to check against.
 * @returns A boolean that indicates if the webhook is a transparent checkout completed webhook.
 */
export function isTransparentCompletedWebhookEvent(event: WebhookEvent) {
	return event.event === WebhookEventType.TransparentCompleted;
}
