import { describe, expect, test } from 'bun:test';
import {
	APIPaymentLink,
	APIWebhook,
	RESTGetListWebhooksData,
	RESTPostChangeSubscriptionPlanData,
	RESTPostCreateBoletoBody,
	RESTPostCreateNewCheckoutBody,
	RESTPostCreateTransparentBody,
	RESTPostCreateWebhookBody,
	RESTPostSendPixTransferBody,
	WebhookEvent,
} from '../src/v2';

describe('v2 schemas', () => {
	test('checkout create body accepts an array of methods and the new fields', () => {
		const body = RESTPostCreateNewCheckoutBody.parse({
			methods: ['PIX', 'CARD', 'BOLETO'],
			items: [{ id: 'prod_123', quantity: 1 }],
			frequency: 'SUBSCRIPTION',
			interest: { value: 100 },
			fine: { value: 200, type: 'PERCENTAGE' },
		});

		expect(body.methods).toEqual(['PIX', 'CARD', 'BOLETO']);
	});

	test('transparent create body wire envelope accepts PIX and BOLETO variants', () => {
		const pix = RESTPostCreateTransparentBody.parse({
			method: 'PIX',
			data: { amount: 1000 },
		});
		const boleto = RESTPostCreateTransparentBody.parse({
			method: 'BOLETO',
			data: {
				amount: 1000,
				customer: { name: 'Daniel Lima', taxId: '012.345.678-90' },
			},
		});

		expect(pix.method).toBe('PIX');
		expect(boleto.method).toBe('BOLETO');
	});

	test('RESTPostCreateBoletoBody requires name and taxId', () => {
		expect(() =>
			RESTPostCreateBoletoBody.parse({ amount: 1000, customer: {} }),
		).toThrow();
	});

	test('pix transfer send body validates the destination key', () => {
		const body = RESTPostSendPixTransferBody.parse({
			amount: 100,
			externalId: 'trx_123',
			pix: { key: 'foo@bar.com', type: 'EMAIL' },
		});

		expect(body.pix.type).toBe('EMAIL');
	});

	test('APIPaymentLink requires frequency to be MULTIPLE_PAYMENTS', () => {
		expect(() =>
			APIPaymentLink.parse({
				id: 'bill_123',
				url: 'https://myshop.com/pay',
				amount: 1000,
				paidAmount: null,
				status: 'PENDING',
				frequency: 'ONE_TIME',
				items: [{ id: 'prod_123', quantity: 1 }],
				externalId: null,
				createdAt: new Date(),
				updatedAt: new Date(),
			}),
		).toThrow();
	});

	test('APIWebhook parses a full webhook resource', () => {
		const webhook = APIWebhook.parse({
			id: 'webh_123',
			name: 'Order fulfillment',
			endpoint: 'https://myshop.com/webhooks/abacatepay',
			events: ['checkout.completed', 'payout.failed'],
			devMode: false,
			v2: true,
			createdAt: new Date(),
			updatedAt: new Date(),
		});

		expect(webhook.events).toContain('checkout.completed');
	});

	test('RESTPostCreateWebhookBody accepts the full v2 event taxonomy', () => {
		const body = RESTPostCreateWebhookBody.parse({
			name: 'My webhook',
			endpoint: 'https://myshop.com/hook',
			secret: 'whsec_123',
			events: ['transfer.completed', 'subscription.trial_started'],
		});

		expect(body.events).toHaveLength(2);
	});

	test('RESTGetListWebhooksData accepts the cursor-based pagination envelope', () => {
		const result = RESTGetListWebhooksData.parse({
			data: [],
			error: null,
			success: true,
			pagination: {
				limit: 100,
				hasNext: false,
				hasPrevious: false,
				nextCursor: null,
			},
		});

		expect(result.success).toBe(true);
	});

	test('RESTPostChangeSubscriptionPlanData parses a plan-change result', () => {
		const result = RESTPostChangeSubscriptionPlanData.parse({
			data: {
				id: 'sub_change_123',
				subscriptionId: 'subs_123',
				status: 'PENDING',
				productId: 'prod_123',
				quantity: 2,
				newAmount: 8000,
				requestedAt: new Date(),
			},
			error: null,
			success: true,
		});

		expect(result.success).toBe(true);
	});

	test('WebhookEvent discriminates payout.completed from payout.failed', () => {
		const completed = WebhookEvent.parse({
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
					createdAt: new Date(),
					updatedAt: new Date(),
					status: 'COMPLETE',
				},
			},
		});

		expect(completed.event).toBe('payout.completed');
	});
});
