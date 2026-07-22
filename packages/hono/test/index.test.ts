import { describe, expect, test } from 'bun:test';
import { createHmac } from 'node:crypto';
import { ABACATEPAY_SHARED_KEY } from '@abacatepay/adapters/webhooks';
import { Webhooks } from '../src';

const sign = (raw: string) =>
	createHmac('sha256', ABACATEPAY_SHARED_KEY).update(raw).digest('base64');

const mockContext = ({
	query,
	headers = {},
	body,
}: {
	query?: string;
	headers?: Record<string, string>;
	body?: string;
}) => ({
	req: {
		query: (_key: string) => query,
		header: (key: string) => headers[key.toLowerCase()],
		text: async () => body ?? '',
	},
	json: (payload: unknown, status: number) => ({ payload, status }),
});

describe('Webhooks', () => {
	test('never throws on a missing secret, resolves { ok: false } instead', () => {
		const result = Webhooks({});

		expect(result.ok).toBe(false);
		expect(result.handler).toBeNull();
		if (result.ok) return;
		expect(result.error).toContain('secret');
	});

	test('rejects a mismatched webhookSecret query param with 401', async () => {
		const { ok, handler } = Webhooks({ secret: 'whsec_test' });
		if (!ok) throw new Error('expected ok');

		const ctx = mockContext({ query: 'wrong' });
		const result = await handler(ctx as never);

		expect((result as { status: number })?.status).toBe(401);
	});

	test('returns 400 on a malformed JSON body instead of throwing', async () => {
		const { ok, handler } = Webhooks({ secret: 'whsec_test' });
		if (!ok) throw new Error('expected ok');

		const body = '{not valid json';
		const ctx = mockContext({
			query: 'whsec_test',
			headers: { 'x-webhook-signature': sign(body) },
			body,
		});
		const result = await handler(ctx as never);

		expect((result as { status: number })?.status).toBe(400);
	});

	test('dispatches a validly signed event', async () => {
		let dispatched = false;

		const { ok, handler } = Webhooks({
			secret: 'whsec_test',
			onPayoutCompleted() {
				dispatched = true;
			},
		});
		if (!ok) throw new Error('expected ok');

		const body = JSON.stringify({
			id: 'log_1',
			event: 'payout.completed',
			devMode: false,
			data: {
				transaction: {
					id: 'payout_1',
					devMode: false,
					receiptUrl: null,
					amount: 1000,
					platformFee: 80,
					externalId: 'trx_1',
					createdAt: new Date().toISOString(),
					updatedAt: new Date().toISOString(),
					status: 'COMPLETE',
				},
			},
		});

		const ctx = mockContext({
			query: 'whsec_test',
			headers: { 'x-webhook-signature': sign(body) },
			body,
		});
		await handler(ctx as never);

		expect(dispatched).toBe(true);
	});
});
