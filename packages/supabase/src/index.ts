import { WebhookEvent } from '@abacatepay/zod/v2';
import { AbacatePaySupabaseError } from './errors';
import type { WebhookOptions } from './types';
import { verifyWebhookSignature } from './utils';

const BAD_REQUEST = 400;
const UNAUTHORIZED = 401;
const NO_CONTENT = 204;

export { AbacatePaySupabaseError } from './errors';
export * from './types';
export { version } from './version';

export const Webhooks = ({
	secret,
	onPayload,
	onPayoutDone,
	onBillingPaid,
	onPayoutFailed,
}: WebhookOptions) => {
	if (!secret)
		throw new AbacatePaySupabaseError('Webhook secret is missing.', {
			code: 'WEBHOOK_SECRET_MISSING',
		});

	return async (req: Request): Promise<Response> => {
		const url = new URL(req.url);
		const webhookSecret = url.searchParams.get('webhookSecret');

		if (webhookSecret !== secret)
			return new Response(JSON.stringify({ error: 'Unauthorized' }), {
				status: UNAUTHORIZED,
			});

		const signature = req.headers.get('x-webhook-signature');

		if (!signature)
			return new Response(JSON.stringify({ error: 'Missing signature' }), {
				status: BAD_REQUEST,
			});

		const raw = await req.text();

		if (!verifyWebhookSignature(raw, signature))
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

		const { data, success } = WebhookEvent.safeParse(parsed);

		if (!success)
			return new Response(JSON.stringify({ error: 'Invalid payload' }), {
				status: BAD_REQUEST,
			});

		switch (data.event) {
			case 'billing.paid':
				await (onBillingPaid ?? onPayload)?.(data);

				break;
			case 'payout.done':
				await (onPayoutDone ?? onPayload)?.(data);

				break;
			case 'payout.failed':
				await (onPayoutFailed ?? onPayload)?.(data);

				break;
		}

		return new Response(null, { status: NO_CONTENT });
	};
};
