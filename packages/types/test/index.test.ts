import { describe, expect, test } from 'bun:test';
import { createHmac } from 'node:crypto';
import {
	ABACATEPAY_SHARED_KEY,
	verifyStandardWebhookSignature,
	verifyWebhookSignature,
} from '../types';
import {
	type APITransparent,
	isBoletoTransparent,
	isCardTransparent,
	isPayoutCompletedWebhookEvent,
	isPixTransparent,
	Routes,
	type WebhookEvent,
	WebhookEventType,
} from '../types/v2';

describe('Routes (v2)', () => {
	test('list builders send only the parameters that were given', () => {
		expect(Routes.customers.list()).toBe('/customers/list');
		expect(Routes.customers.list({ limit: undefined, after: undefined })).toBe(
			'/customers/list',
		);
		expect(
			Routes.checkouts.list({
				after: 'bill_9',
				limit: 25,
				startDate: '2026-01-01',
				endDate: '2026-01-31',
			}),
		).toBe(
			'/checkouts/list?after=bill_9&limit=25&startDate=2026-01-01&endDate=2026-01-31',
		);
	});

	test('builders URL-encode merchant-chosen values', () => {
		expect(Routes.coupons.get('10%OFF')).toBe('/coupons/get?id=10%25OFF');
		expect(Routes.payouts.get({ externalId: 'a&b #1' })).toBe(
			'/payouts/get?externalId=a%26b+%231',
		);
	});

	test('deletes carry the id in the query string', () => {
		expect(Routes.customers.delete('cust_1')).toBe(
			'/customers/delete?id=cust_1',
		);
		expect(Routes.coupons.delete('CUPOM')).toBe('/coupons/delete?id=CUPOM');
		expect(Routes.webhooks.delete('webh_1')).toBe('/webhooks/delete?id=webh_1');
		expect(Routes.checkouts.delete('bill_1')).toBe(
			'/checkouts/delete?id=bill_1',
		);
		expect(Routes.paymentLinks.delete('bill_2')).toBe(
			'/payment-links/delete?id=bill_2',
		);
		expect(Routes.subscriptions.checkouts.delete('bill_3')).toBe(
			'/subscriptions/checkouts/delete?id=bill_3',
		);
	});

	test('routes point to the paths the API serves', () => {
		expect(Routes.paymentLinks.get('bill_1')).toBe(
			'/payment-links/get?id=bill_1',
		);
		expect(Routes.stores.get).toBe('/stores/get');
		expect(Routes.store.get).toBe('/stores/get');
		expect(Routes.transparents.get('card_1')).toBe(
			'/transparents/get?id=card_1',
		);
		expect(Routes.mrr.byDay('2026-01-01', '2026-01-31')).toBe(
			'/public-mrr/mrr-by-day?startDate=2026-01-01&endDate=2026-01-31',
		);
	});

	test('pix/get always sends the id key the API requires', () => {
		expect(Routes.transfers.get({ externalId: 'trx_1' })).toBe(
			'/pix/get?id=&externalId=trx_1',
		);
		expect(Routes.transfers.get({ id: 'tran_1' })).toBe('/pix/get?id=tran_1');
	});
});

describe('verifyWebhookSignature (legacy)', () => {
	test('accepts the HMAC of the raw body and rejects a tampered body', () => {
		const raw = JSON.stringify({ id: 'log_1', event: 'payout.completed' });
		const signature = createHmac('sha256', ABACATEPAY_SHARED_KEY)
			.update(raw)
			.digest('base64');

		expect(verifyWebhookSignature(raw, signature)).toBe(true);
		expect(verifyWebhookSignature(`${raw} `, signature)).toBe(false);
	});
});

describe('verifyStandardWebhookSignature', () => {
	const raw = JSON.stringify({
		type: 'transparent.completed',
		timestamp: '2026-11-02T12:00:00.000Z',
		apiVersion: 2,
		devMode: true,
		data: { transparent: { id: 'card_1' } },
	});

	const sign = (secret: string, id: string, timestamp: number, body = raw) => {
		const key = secret.startsWith('whsec_')
			? Buffer.from(secret.slice('whsec_'.length), 'base64')
			: Buffer.from(secret, 'utf8');

		return `v1,${createHmac('sha256', key).update(`${id}.${timestamp}.${body}`).digest('base64')}`;
	};

	const now = () => Math.floor(Date.now() / 1000);

	for (const secret of [
		`whsec_${Buffer.from('k'.repeat(32)).toString('base64')}`,
		'plain-merchant-secret-with-32-chars!!',
	])
		test(`accepts a valid signature (${secret.slice(0, 6)}...)`, () => {
			const timestamp = now();

			expect(
				verifyStandardWebhookSignature(
					raw,
					{
						id: 'log_1',
						timestamp: `${timestamp}`,
						signature: sign(secret, 'log_1', timestamp),
					},
					secret,
				),
			).toBe(true);
		});

	test('accepts any of several space-separated signatures', () => {
		const secret = 'plain-merchant-secret-with-32-chars!!';
		const timestamp = now();

		expect(
			verifyStandardWebhookSignature(
				raw,
				{
					id: 'log_1',
					timestamp: `${timestamp}`,
					signature: `v1,invalid ${sign(secret, 'log_1', timestamp)}`,
				},
				secret,
			),
		).toBe(true);
	});

	test('rejects a tampered body, another id and an old timestamp', () => {
		const secret = 'plain-merchant-secret-with-32-chars!!';
		const timestamp = now();
		const signature = sign(secret, 'log_1', timestamp);
		const headers = { id: 'log_1', timestamp: `${timestamp}`, signature };

		expect(
			verifyStandardWebhookSignature(
				raw.replace('card_1', 'card_2'),
				headers,
				secret,
			),
		).toBe(false);
		expect(
			verifyStandardWebhookSignature(raw, { ...headers, id: 'log_2' }, secret),
		).toBe(false);

		const old = timestamp - 3_600;

		expect(
			verifyStandardWebhookSignature(
				raw,
				{
					id: 'log_1',
					timestamp: `${old}`,
					signature: sign(secret, 'log_1', old),
				},
				secret,
			),
		).toBe(false);
	});
});

describe('type guards', () => {
	test('webhook guards narrow by event', () => {
		const event = {
			id: 'log_1',
			event: WebhookEventType.PayoutCompleted,
			apiVersion: 2,
			devMode: false,
			data: {},
		} as unknown as WebhookEvent;

		expect(isPayoutCompletedWebhookEvent(event)).toBe(true);
	});

	test('transparent guards use the ID prefix', () => {
		const charge = (id: string) => ({ id }) as APITransparent;

		expect(isPixTransparent(charge('pix_char_1'))).toBe(true);
		expect(isBoletoTransparent(charge('bole_1'))).toBe(true);
		expect(isCardTransparent(charge('card_1'))).toBe(true);
		expect(isCardTransparent(charge('pix_char_1'))).toBe(false);
	});
});
