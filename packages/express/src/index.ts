import {
	dispatch,
	parse,
	verify,
	type WebhookOptions,
} from '@abacatepay/adapters/webhooks';
import type { Request, Response } from 'express';

const BAD_REQUEST_STATUS_CODE = 400;
const UNAUTHORIZED_STATUS_CODE = 401;
const NO_CONTENT_STATUS_CODE = 204;

export { version } from './version';

export type WebhooksHandler = (
	req: Request,
	res: Response,
) => Promise<Response>;

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
		handler: async (req: Request, res: Response) => {
			const { webhookSecret } = req.query;

			if (webhookSecret !== options.secret)
				return res
					.status(UNAUTHORIZED_STATUS_CODE)
					.json({ error: 'Unauthorized' });

			const signature = req.headers['x-webhook-signature'];

			if (typeof signature !== 'string')
				return res
					.status(BAD_REQUEST_STATUS_CODE)
					.json({ error: 'Missing signature' });

			const { body } = req;

			if (!Buffer.isBuffer(body))
				return res
					.status(BAD_REQUEST_STATUS_CODE)
					.json({ error: 'Invalid raw body' });

			const raw = body.toString('utf8');

			if (!verify(raw, signature))
				return res
					.status(UNAUTHORIZED_STATUS_CODE)
					.json({ error: 'Invalid signature' });

			let parsed: unknown;

			try {
				parsed = JSON.parse(raw);
			} catch {
				return res
					.status(BAD_REQUEST_STATUS_CODE)
					.json({ error: 'Invalid JSON' });
			}

			const { data, success } = parse(parsed);

			if (!success)
				return res
					.status(BAD_REQUEST_STATUS_CODE)
					.json({ error: 'Invalid payload' });

			await dispatch(data, options);

			return res.status(NO_CONTENT_STATUS_CODE).send();
		},
	};
};
