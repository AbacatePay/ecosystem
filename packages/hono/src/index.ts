import {
	dispatch,
	parse,
	verify,
	type WebhookOptions,
} from '@abacatepay/adapters/webhooks';
import type { Context } from 'hono';

const BAD_REQUEST_STATUS_CODE = 400;
const UNAUTHORIZED_STATUS_CODE = 401;

export { version } from './version.js';

export type WebhooksHandler = (ctx: Context) => Promise<Response | undefined>;

/**
 * Result of {@link Webhooks}. Never throws — a missing secret resolves to
 * `{ ok: false, error }` instead.
 */
export type WebhooksResult =
	| { ok: true; error: null; handler: WebhooksHandler }
	| { ok: false; error: string; handler: null };

export const Webhooks = (options: WebhookOptions): WebhooksResult => {
	if (!options.secret)
		return { ok: false, error: 'Webhook secret is missing.', handler: null };

	return {
		ok: true,
		error: null,
		handler: async (ctx: Context) => {
			const webhookSecret = ctx.req.query('webhookSecret');

			if (webhookSecret !== options.secret)
				return ctx.json({ error: 'Unauthorized' }, UNAUTHORIZED_STATUS_CODE);

			const signature = ctx.req.header('x-webhook-signature');

			if (!signature)
				return ctx.json(
					{ error: 'Missing signature' },
					BAD_REQUEST_STATUS_CODE,
				);

			const raw = await ctx.req.text();

			if (!verify(raw, signature))
				return ctx.json(
					{ error: 'Invalid signature' },
					UNAUTHORIZED_STATUS_CODE,
				);

			let parsed: unknown;

			try {
				parsed = JSON.parse(raw);
			} catch {
				return ctx.json({ error: 'Invalid JSON' }, BAD_REQUEST_STATUS_CODE);
			}

			const { success, data } = parse(parsed);

			if (!success)
				return ctx.json({ error: 'Invalid payload' }, BAD_REQUEST_STATUS_CODE);

			await dispatch(data, options);
		},
	};
};
