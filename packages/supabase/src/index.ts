import {
	dispatch,
	parse,
	verify,
	type WebhookOptions,
} from '@abacatepay/adapters/webhooks';
import { AbacatePaySupabaseError } from './errors';

const NO_CONTENT = 204;
const BAD_REQUEST = 400;
const UNAUTHORIZED = 401;

export { AbacatePaySupabaseError } from './errors';
export { version } from './version';

export const Webhooks = (options: WebhookOptions) => {
	if (!options.secret)
		throw new AbacatePaySupabaseError('Webhook secret is missing.', {
			code: 'WEBHOOK_SECRET_MISSING',
		});

	return async (req: Request): Promise<Response> => {
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
	};
};
