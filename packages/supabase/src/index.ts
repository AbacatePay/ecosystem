import {
	dispatch,
	parse,
	verify,
	type WebhookOptions,
} from '@abacatepay/adapters/webhooks';

const NO_CONTENT = 204;
const BAD_REQUEST = 400;
const UNAUTHORIZED = 401;

export { version } from './version';

export type WebhooksHandler = (req: Request) => Promise<Response>;

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
		handler: async (req: Request): Promise<Response> => {
			const url = new URL(req.url);
			const webhookSecret = url.searchParams.get('webhookSecret');

			if (webhookSecret !== options.secret)
				return new Response(JSON.stringify({ error: 'Unauthorized' }), {
					status: UNAUTHORIZED,
				});

			const signature = req.headers.get('x-webhook-signature');

			if (!signature)
				return new Response(JSON.stringify({ error: 'Missing signature' }), {
					status: BAD_REQUEST,
				});

			const raw = await req.text();

			if (!verify(raw, signature))
				return new Response(JSON.stringify({ error: 'Invalid signature' }), {
					status: UNAUTHORIZED,
				});

			let parsed: unknown;

			try {
				parsed = JSON.parse(raw);
			} catch {
				return new Response(JSON.stringify({ error: 'Invalid JSON' }), {
					status: BAD_REQUEST,
				});
			}

			const { data, success } = parse(parsed);

			if (!success)
				return new Response(JSON.stringify({ error: 'Invalid payload' }), {
					status: BAD_REQUEST,
				});

			await dispatch(data, options);

			return new Response(null, { status: NO_CONTENT });
		},
	};
};
