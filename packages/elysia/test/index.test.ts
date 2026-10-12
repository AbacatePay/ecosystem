import { describe, expect, test } from 'bun:test';
import { createHmac } from 'node:crypto';
import { ABACATEPAY_SHARED_KEY } from '@abacatepay/adapters/webhooks';
import { Webhooks } from '../src';

const sign = (raw: string) =>
	createHmac('sha256', ABACATEPAY_SHARED_KEY).update(raw).digest('base64');

const mockContext = ({
	webhookSecret,
	signature,
	raw,
	body,
}: {
	webhookSecret?: string;
	signature?: string;
	raw?: string;
	body?: unknown;
}) => {
	const headers = signature ? { 'x-webhook-signature': signature } : {};
	const text = async () => raw ?? '';

	return { query: { webhookSecret }, headers, request: { text }, body };
};

describe('Webhooks', () => {
	test('never throws on a missing secret, resolves { ok: false } instead', () => {
		const result = Webhooks({});

		expect(result.ok).toBe(false);
		expect(result.handler).toBeNull();
		if (result.ok) return;
		expect(result.error).toContain('secret');
	});

	test('rejects a mismatched webhookSecret query param', async () => {
		const { ok, handler } = Webhooks({ secret: 'whsec_test' });
		if (!ok) throw new Error('expected ok');

		const result = (await handler(
			mockContext({ webhookSecret: 'wrong' }) as never,
		)) as { code: number };

		expect(result.code).toBe(401);
	});

	test('rejects an invalid signature', async () => {
		const { ok, handler } = Webhooks({ secret: 'whsec_test' });
		if (!ok) throw new Error('expected ok');

		const result = (await handler(
			mockContext({
				webhookSecret: 'whsec_test',
				signature: 'bogus',
				raw: '{}',
			}) as never,
		)) as { code: number };

		expect(result.code).toBe(401);
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

		const event = {
			id: 'log_1',
			event: 'payout.completed',
			apiVersion: 2,
			devMode: false,
			data: {
				withdraw: {
					id: 'tran_1',
					amount: 1000,
					status: 'COMPLETE',
					method: 'PIX',
					platformFee: 80,
					receiptUrl: null,
					externalId: null,
					createdAt: new Date().toISOString(),
					updatedAt: new Date().toISOString(),
					endToEndIdentifier: null,
				},
			},
		};
		const raw = JSON.stringify(event);

		await handler(
			mockContext({
				webhookSecret: 'whsec_test',
				signature: sign(raw),
				raw,
				body: event,
			}) as never,
		);

		expect(dispatched).toBe(true);
	});
});
