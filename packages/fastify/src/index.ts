import {
	dispatch,
	parse,
	verify,
	type WebhookOptions,
} from '@abacatepay/adapters/webhooks';
import type { FastifyReply, FastifyRequest } from 'fastify';

const BAD_REQUEST_STATUS_CODE = 400;
const UNAUTHORIZED_STATUS_CODE = 401;
const NO_CONTENT_STATUS_CODE = 204;

export { version } from './version.js';

export type WebhooksHandler = (
	req: FastifyRequest,
	reply: FastifyReply,
) => Promise<FastifyReply>;

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
		handler: async (req: FastifyRequest, reply: FastifyReply) => {
			const { webhookSecret } = req.query as Record<string, string | undefined>;

			if (webhookSecret !== options.secret)
				return reply
					.status(UNAUTHORIZED_STATUS_CODE)
					.send({ error: 'Unauthorized' });

			const signature = req.headers['x-webhook-signature'];

			if (typeof signature !== 'string')
				return reply
					.status(BAD_REQUEST_STATUS_CODE)
					.send({ error: 'Missing signature' });

			const { body } = req;

			if (typeof body !== 'string')
				return reply
					.status(BAD_REQUEST_STATUS_CODE)
					.send({ error: 'Invalid raw body' });

			if (!verify(body, signature))
				return reply
					.status(UNAUTHORIZED_STATUS_CODE)
					.send({ error: 'Invalid signature' });

			let parsed: unknown;

			try {
				parsed = JSON.parse(body);
			} catch {
				return reply
					.status(BAD_REQUEST_STATUS_CODE)
					.send({ error: 'Invalid JSON' });
			}

			const { data, success } = parse(parsed);

			if (!success)
				return reply
					.status(BAD_REQUEST_STATUS_CODE)
					.send({ error: 'Invalid payload' });

			await dispatch(data, options);

			return reply.status(NO_CONTENT_STATUS_CODE).send();
		},
	};
};
