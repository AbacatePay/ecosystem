export { API_VERSION, version } from './version';

import { createHmac, timingSafeEqual } from 'node:crypto';

/**
 * Base URL for the AbacatePay API (Version not included).
 *
 * @see {@link https://docs.abacatepay.com/}
 */
export const API_BASE_URL = 'https://api.abacatepay.com/';

/**
 * Official URL for the AbacatePay API Documentation
 */
export const ABACATEPAY_DOCS_URL = 'https://docs.abacatepay.com/';

/**
 * Public key AbacatePay uses to sign legacy webhook deliveries (`X-Webhook-Signature`).
 */
export const ABACATEPAY_SHARED_KEY =
	't9dXRhHHo3yDEj5pVDYz0frf7q6bMKyMRmxxCPIPp3RCplBfXRxqlC6ZpiWmOqj4L63qEaeUOtrCI8P0VMUgo6iIga2ri9ogaHFs0WIIywSMg0q7RmBfybe1E5XJcfC4IW3alNqym0tXoAKkzvfEjZxV6bE0oG2zJrNNYmUCKZyV0KZ3JS8Votf9EAWWYdiDkMkpbMdPggfh1EqHlVkMiTady6jOR3hyzGEHrIz2Ret0xHKMbiqkr9HS1JhNHDX9';

/**
 * Verify whether the signature of a legacy webhook delivery is valid or not.
 *
 * Legacy deliveries carry the `X-Webhook-Signature` header and your secret in the
 * `?webhookSecret=` query parameter (Compare it with your secret too). Endpoints that
 * receive Standard Webhooks deliveries (`webhook-id`, `webhook-timestamp` and
 * `webhook-signature` headers) must use {@link verifyStandardWebhookSignature} instead.
 *
 * @reference https://docs.abacatepay.com/pages/webhooks/security
 *
 * @param raw Raw body response (string).
 * @param signature The content of the`X-Webhook-Signature` header.
 * @returns A boolean that indicates if the signature is valid.
 */
export const verifyWebhookSignature = (raw: string, signature: string) => {
	const bodyBuffer = Buffer.from(raw, 'utf8');

	const expectedSig = createHmac('sha256', ABACATEPAY_SHARED_KEY)
		.update(bodyBuffer)
		.digest('base64');

	const A = Buffer.from(expectedSig);
	const B = Buffer.from(signature);

	return A.length === B.length && timingSafeEqual(A, B);
};

/**
 * Headers of a Standard Webhooks delivery (https://www.standardwebhooks.com).
 */
export interface StandardWebhookHeaders {
	/**
	 * Content of the `webhook-id` header (The delivery ID, reused by automatic retries).
	 */
	id: string;
	/**
	 * Content of the `webhook-timestamp` header (Unix seconds of this attempt).
	 */
	timestamp: string;
	/**
	 * Content of the `webhook-signature` header (`v1,<base64>`, space-separated when there are several).
	 */
	signature: string;
}

/**
 * Verify a Standard Webhooks delivery (https://www.standardwebhooks.com), the format
 * used by webhook endpoints created after the Standard Webhooks cutoff. The signature is
 * an HMAC-SHA256 of `${id}.${timestamp}.${raw}` keyed with the secret of the webhook
 * endpoint: when the secret starts with `whsec_`, the rest is base64-decoded, otherwise
 * its UTF-8 bytes are used.
 *
 * @reference https://docs.abacatepay.com/pages/webhooks/security
 *
 * @param raw Raw body response (string).
 * @param headers The `webhook-id`, `webhook-timestamp` and `webhook-signature` headers.
 * @param secret The secret of your webhook endpoint.
 * @param toleranceSeconds Maximum age (and clock skew) of `webhook-timestamp`, in seconds (Default `300`).
 * @returns A boolean that indicates if the signature is valid and recent.
 */
export const verifyStandardWebhookSignature = (
	raw: string,
	headers: StandardWebhookHeaders,
	secret: string,
	toleranceSeconds = 300,
) => {
	const timestamp = Number(headers.timestamp);

	if (!Number.isInteger(timestamp)) return false;
	if (Math.abs(Math.floor(Date.now() / 1000) - timestamp) > toleranceSeconds)
		return false;

	const key = secret.startsWith('whsec_')
		? Buffer.from(secret.slice('whsec_'.length), 'base64')
		: Buffer.from(secret, 'utf8');

	const expected = Buffer.from(
		createHmac('sha256', key)
			.update(`${headers.id}.${headers.timestamp}.${raw}`)
			.digest('base64'),
	);

	return headers.signature.split(' ').some((entry) => {
		const [scheme, signature] = entry.split(',');

		if (scheme !== 'v1' || !signature) return false;

		const received = Buffer.from(signature);

		return (
			received.length === expected.length && timingSafeEqual(received, expected)
		);
	});
};
