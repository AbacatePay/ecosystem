import { describe, expect, test } from 'bun:test';
import { createHmac } from 'node:crypto';
import { ABACATEPAY_SHARED_KEY } from '@abacatepay/adapters/webhooks';
import { Webhooks } from '../src';

const sign = (raw: string) =>
	createHmac('sha256', ABACATEPAY_SHARED_KEY).update(raw).digest('base64');

const mockRes = () => {
	const res = {
		statusCode: 0,
		body: undefined as unknown,
		status(code: number) {
			res.statusCode = code;
			return res;
		},
		json(body: unknown) {
			res.body = body;
			return res;
		},
		send(body?: unknown) {
			res.body = body;
			return res;
		},
	};
	return res;
};

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

		const res = mockRes();
		await handler(
			{ query: { webhookSecret: 'wrong' }, headers: {} } as never,
			res as never,
		);

		expect(res.statusCode).toBe(401);
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

		const res = mockRes();
		await handler(
			{
				query: { webhookSecret: 'whsec_test' },
				headers: { 'x-webhook-signature': sign(body) },
				body: Buffer.from(body),
			} as never,
			res as never,
		);

		expect(res.statusCode).toBe(204);
		expect(dispatched).toBe(true);
	});
});
