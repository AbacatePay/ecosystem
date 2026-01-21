import { WebhookEvent } from '@abacatepay/typebox/v2';
import { verifyWebhookSignature, WebhookEventType } from '@abacatepay/types/v2';
import { Parse } from '@sinclair/typebox/value';
import type { Context } from 'elysia';
import type { WebhookOptions } from './types';

export { version } from './version';

/**
 * A simple utility which resolves incoming webhook payloads by signing the webhook secret properly.
 * @param options Options to use
 */
export const Webhooks = ({
	onPayload,
	onPayoutDone,
	onBillingPaid,
	onPayoutFailed,
	secret = process.env.ABACATEPAY_WEBHOOK_SECRET ??
		process.env.ABACATE_PAY_WEBHOOK_SECRET,
}: WebhookOptions) => {
	if (!secret) throw new Error('Webhook secret is missing in the options');

	return async (context: Context) => {
		if (context.query.webhookSecret !== secret) return;

		const signature = context.headers['x-webhook-signature'];

		if (!signature) return;

		const raw = await context.request.text();

		if (!verifyWebhookSignature(raw, signature)) return;

		const data = Parse(WebhookEvent, context.body);

		switch (data.event) {
			case WebhookEventType.BillingPaid:
				return (onBillingPaid ?? onPayload)?.(data);
			case WebhookEventType.PayoutDone:
				return (onPayoutDone ?? onPayload)?.(data);
			case WebhookEventType.PayoutFailed:
				return (onPayoutFailed ?? onPayload)?.(data);
		}
	};
};
