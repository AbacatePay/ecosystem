import { createHmac, timingSafeEqual } from 'node:crypto';
import { type WebhookEvent, WebhookEventType } from './webhook';

/**
 * A type guard check for `payout.done` webhook events.
 * @param event - The webhook event to check against.
 * @returns A boolean that indicates if the webhook is a payout done webhook.
 */
export function isPayoutDoneWebhookEvent(event: WebhookEvent) {
	return event.event === WebhookEventType.PayoutDone;
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
 * A type guard check for `billing.paid` webhook events.
 * @param event - The webhook event to check against.
 * @returns A boolean that indicates if the webhook is a billing paid webhook.
 */
export function isBillingPaidWebhookEvent(event: WebhookEvent) {
	return event.event === WebhookEventType.BillingPaid;
}

const ABACATEPAY_PUBLIC_KEY =
	't9dXRhHHo3yDEj5pVDYz0frf7q6bMKyMRmxxCPIPp3RCplBfXRxqlC6ZpiWmOqj4L63qEaeUOtrCI8P0VMUgo6iIga2ri9ogaHFs0WIIywSMg0q7RmBfybe1E5XJcfC4IW3alNqym0tXoAKkzvfEjZxV6bE0oG2zJrNNYmUCKZyV0KZ3JS8Votf9EAWWYdiDkMkpbMdPggfh1EqHlVkMiTady6jOR3hyzGEHrIz2Ret0xHKMbiqkr9HS1JhNHDX9';

/**
 * Verify whether the signature is valid or not.
 * @param raw Raw body response (string).
 * @param signature The content of the`X-Webhook-Signature` header.
 * @returns A boolean that indicates if the signature is valid.
 */
export const verifyWebhookSignature = (raw: string, signature: string) => {
	const bodyBuffer = Buffer.from(raw, 'utf8');

	const expectedSig = createHmac('sha256', ABACATEPAY_PUBLIC_KEY)
		.update(bodyBuffer)
		.digest('base64');

	const A = Buffer.from(expectedSig);
	const B = Buffer.from(signature);

	return A.length === B.length && timingSafeEqual(A, B);
};
