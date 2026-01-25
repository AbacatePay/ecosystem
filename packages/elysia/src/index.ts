import {
	dispatch,
	parse,
	verify,
	type WebhookOptions,
} from '@abacatepay/adapters/webhooks';
import type { Context } from 'elysia';
import { AbacatePayElysiaError } from './errors';

export { version } from './version';

/**
 * A simple utility which resolves incoming webhook payloads by signing the webhook secret properly.
 * @param options Options to use
 */
export const Webhooks = (options: WebhookOptions) => {
	if (!options.secret)
		throw new AbacatePayElysiaError(
			'Webhook secret is missing. Set ABACATEPAY_WEBHOOK_SECRET.',
			{ code: 'WEBHOOK_SECRET_MISSING' },
		);

	return async (context: Context) => {
		if (context.query.webhookSecret !== options.secret) return;

		const signature = context.headers['x-webhook-signature'];

		if (!signature) return;

		const raw = await context.request.text();

		if (!verify(raw, signature)) return;

		const { data, success } = parse(context.body);

		if (!success) return;

		await dispatch(data, options);
	};
};
