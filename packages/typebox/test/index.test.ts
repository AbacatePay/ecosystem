import { describe, expect, test } from 'bun:test';
import { FormatRegistry } from '@sinclair/typebox';
import { Value } from '@sinclair/typebox/value';
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

// The package doesn't register a `uri` format validator itself (pre-existing
// gap, not specific to these tests), so `Value.Check` would otherwise reject
// every `format: 'uri'` field with "Unknown format 'uri'".
if (!FormatRegistry.Has('uri')) FormatRegistry.Set('uri', () => true);

describe('v2 schemas', () => {
	test('checkout create body accepts an array of methods and the new fields', () => {
		const body = {
			methods: ['PIX', 'CARD', 'BOLETO'],
			items: [{ id: 'prod_123', quantity: 1 }],
			frequency: 'SUBSCRIPTION',
			interest: { value: 100 },
			fine: { value: 200, type: 'PERCENTAGE' },
		};

		expect(Value.Check(RESTPostCreateNewCheckoutBody, body)).toBe(true);
	});

	test('transparent create body wire envelope accepts PIX and BOLETO variants', () => {
		const pix = { method: 'PIX', data: { amount: 1000 } };
		const boleto = {
			method: 'BOLETO',
			data: {
				amount: 1000,
				customer: { name: 'Daniel Lima', taxId: '012.345.678-90' },
			},
		};

		expect(Value.Check(RESTPostCreateTransparentBody, pix)).toBe(true);
		expect(Value.Check(RESTPostCreateTransparentBody, boleto)).toBe(true);
	});

	test('RESTPostCreateBoletoBody requires name and taxId', () => {
		expect(
			Value.Check(RESTPostCreateBoletoBody, { amount: 1000, customer: {} }),
		).toBe(false);
	});

	test('pix transfer send body validates the destination key', () => {
		const body = {
			amount: 100,
			externalId: 'trx_123',
			pix: { key: 'foo@bar.com', type: 'EMAIL' },
		};

		expect(Value.Check(RESTPostSendPixTransferBody, body)).toBe(true);
	});

	test('APIPaymentLink requires frequency to be MULTIPLE_PAYMENTS', () => {
		const invalid = {
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
		};

		expect(Value.Check(APIPaymentLink, invalid)).toBe(false);
	});

	test('APIWebhook parses a full webhook resource', () => {
		const webhook = {
			id: 'webh_123',
			name: 'Order fulfillment',
			endpoint: 'https://myshop.com/webhooks/abacatepay',
			events: ['checkout.completed', 'payout.failed'],
			devMode: false,
			v2: true,
			createdAt: new Date(),
			updatedAt: new Date(),
		};

		expect(Value.Check(APIWebhook, webhook)).toBe(true);
	});

	test('RESTPostCreateWebhookBody accepts the full v2 event taxonomy', () => {
		const body = {
			name: 'My webhook',
			endpoint: 'https://myshop.com/hook',
			secret: 'whsec_123',
			events: ['transfer.completed', 'subscription.trial_started'],
		};

		expect(Value.Check(RESTPostCreateWebhookBody, body)).toBe(true);
	});

	test('RESTGetListWebhooksData accepts the cursor-based pagination envelope', () => {
		const result = {
			data: [],
			error: null,
			success: true,
			pagination: {
				limit: 100,
				hasNext: false,
				hasPrevious: false,
				nextCursor: null,
			},
		};

		expect(Value.Check(RESTGetListWebhooksData, result)).toBe(true);
	});

	test('RESTPostChangeSubscriptionPlanData parses a plan-change result', () => {
		const result = {
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
		};

		expect(Value.Check(RESTPostChangeSubscriptionPlanData, result)).toBe(true);
	});

	test('WebhookEvent discriminates payout.completed from payout.failed', () => {
		const completed = {
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
		};

		expect(Value.Check(WebhookEvent, completed)).toBe(true);
	});
});
