import {
	dispatch,
	parse,
	verify,
	type WebhookOptions,
} from '@abacatepay/adapters/webhooks';
import { type Context, status } from 'elysia';

export { version } from './version';

export type WebhooksHandler = (context: Context) => Promise<unknown>;

/**
 * Result of {@link Webhooks}. Never throws — a missing secret resolves to
 * `{ ok: false, error }` instead.
 */
export type WebhooksResult =
	| { ok: true; error: null; handler: WebhooksHandler }
	| { ok: false; error: string; handler: null };

/**
 * A simple utility which resolves incoming webhook payloads by signing the webhook secret properly.
 * @param options Options to use
 */
export const Webhooks = (options: WebhookOptions): WebhooksResult => {
	if (!options.secret)
		return { ok: false, error: 'Webhook secret is missing.', handler: null };

	return {
		ok: true,
		error: null,
		handler: async (context: Context) => {
			if (context.query.webhookSecret !== options.secret)
				return status('Unauthorized', { error: 'Unauthorized' });

			const signature = context.headers['x-webhook-signature'];

			if (!signature)
				return status('Bad Request', { error: 'Missing signature' });

			const raw = await context.request.text();

			if (!verify(raw, signature))
				return status('Unauthorized', { error: 'Invalid signature' });

			const { data, success } = parse(context.body);

			if (!success) return status('Bad Request', { error: 'Invalid payload' });

			await dispatch(data, options);
		},
	};
};
