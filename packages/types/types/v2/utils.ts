import type { APIBoleto, APIQRCodePIX } from './entities/pix';
import type {
	APICardTransparent,
	APITransparent,
} from './entities/transparent';
import {
	type WebhookCheckoutCompletedEvent,
	type WebhookEvent,
	WebhookEventType,
	type WebhookPayoutCompletedEvent,
	type WebhookPayoutFailedEvent,
	type WebhookTransparentCompletedEvent,
} from './webhook';

/**
 * A type guard check for `payout.completed` webhook events.
 * @param event - The webhook event to check against.
 * @returns A boolean that indicates if the webhook is a payout completed webhook.
 */
export function isPayoutCompletedWebhookEvent(
	event: WebhookEvent,
): event is WebhookPayoutCompletedEvent {
	return event.event === WebhookEventType.PayoutCompleted;
}

/**
 * A type guard check for `payout.failed` webhook events.
 * @param event - The webhook event to check against.
 * @returns A boolean that indicates if the webhook is a payout failed webhook.
 */
export function isPayoutFailedWebhookEvent(
	event: WebhookEvent,
): event is WebhookPayoutFailedEvent {
	return event.event === WebhookEventType.PayoutFailed;
}

/**
 * A type guard check for `checkout.completed` webhook events.
 * @param event - The webhook event to check against.
 * @returns A boolean that indicates if the webhook is a checkout completed webhook.
 */
export function isCheckoutCompletedWebhookEvent(
	event: WebhookEvent,
): event is WebhookCheckoutCompletedEvent {
	return event.event === WebhookEventType.CheckoutCompleted;
}

/**
 * A type guard check for `transparent.completed` webhook events.
 * @param event - The webhook event to check against.
 * @returns A boolean that indicates if the webhook is a transparent checkout completed webhook.
 */
export function isTransparentCompletedWebhookEvent(
	event: WebhookEvent,
): event is WebhookTransparentCompletedEvent {
	return event.event === WebhookEventType.TransparentCompleted;
}

/**
 * A type guard check for transparent PIX QR Codes (`pix_char_...`).
 * @param transparent - An item returned by `GET /transparents/list` or `GET /transparents/get`.
 * @returns A boolean that indicates if the item is a transparent PIX QR Code.
 */
export function isPixTransparent(
	transparent: APITransparent,
): transparent is APIQRCodePIX {
	return transparent.id.startsWith('pix_char_');
}

/**
 * A type guard check for Boleto transparents (`bole_...`).
 * @param transparent - An item returned by `GET /transparents/list` or `GET /transparents/get`.
 * @returns A boolean that indicates if the item is a Boleto.
 */
export function isBoletoTransparent(
	transparent: APITransparent,
): transparent is APIBoleto {
	return transparent.id.startsWith('bole_');
}

/**
 * A type guard check for card transparents (`card_...`).
 * @param transparent - An item returned by `GET /transparents/list` or `GET /transparents/get`.
 * @returns A boolean that indicates if the item is a card charge.
 */
export function isCardTransparent(
	transparent: APITransparent,
): transparent is APICardTransparent {
	return transparent.id.startsWith('card_');
}
