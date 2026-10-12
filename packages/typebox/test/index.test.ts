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
	StandardWebhookEvent,
	WebhookEvent,
} from '../src/v2';
import {
	checkoutCompleted,
	legacyBodies,
	outdatedPayoutBody,
	payoutFailed,
	standardTransparentCompleted,
	transparentCardInstallments,
} from './webhook-fixtures';

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
});

describe('v2 webhook schemas', () => {
	const errorsOf = (value: unknown) =>
		[...Value.Errors(WebhookEvent, value)].map(
			(error) => `${error.path}: ${error.message}`,
		);

	for (const [name, body] of Object.entries(legacyBodies))
		test(`WebhookEvent accepts a real ${name} body`, () => {
			expect(Value.Check(WebhookEvent, body) ? [] : errorsOf(body)).toEqual([]);
		});

	test('accepts the card installment fields of transparent.completed', () => {
		expect(Value.Check(WebhookEvent, transparentCardInstallments)).toBe(true);
		expect(
			Value.Check(WebhookEvent, {
				...transparentCardInstallments,
				data: {
					...transparentCardInstallments.data,
					transparent: {
						...transparentCardInstallments.data.transparent,
						installmentCount: '2',
					},
				},
			}),
		).toBe(false);
	});

	test('accepts fields AbacatePay adds in the future instead of rejecting the event', () => {
		const body = {
			...checkoutCompleted,
			newEnvelopeField: true,
			data: {
				...checkoutCompleted.data,
				checkout: { ...checkoutCompleted.data.checkout, newField: 'kept' },
			},
		};

		expect(Value.Check(WebhookEvent, body)).toBe(true);
	});

	test('accepts payout.failed with the FAILED status', () => {
		expect(Value.Check(WebhookEvent, payoutFailed)).toBe(true);
	});

	test('rejects the payout shape that AbacatePay never sends', () => {
		expect(Value.Check(WebhookEvent, outdatedPayoutBody)).toBe(false);
	});

	test('rejects a body without apiVersion', () => {
		const { apiVersion: _, ...body } = checkoutCompleted;

		expect(Value.Check(WebhookEvent, body)).toBe(false);
	});

	test('StandardWebhookEvent accepts a Standard Webhooks body', () => {
		expect(
			Value.Check(StandardWebhookEvent, standardTransparentCompleted),
		).toBe(true);
		expect(Value.Check(WebhookEvent, standardTransparentCompleted)).toBe(false);
	});
});
