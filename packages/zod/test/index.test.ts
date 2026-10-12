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
});

describe('v2 webhook schemas', () => {
	for (const [name, body] of Object.entries(legacyBodies))
		test(`WebhookEvent parses a real ${name} body`, () => {
			const result = WebhookEvent.safeParse(body);

			expect(result.error?.issues).toBeUndefined();
			expect(result.data?.event).toBe(body.event);
		});

	test('keeps the card installment fields of transparent.completed', () => {
		const result = WebhookEvent.parse(transparentCardInstallments);

		if (result.event !== 'transparent.completed')
			throw new Error('expected transparent.completed');

		expect(result.data.transparent.amount).toBe(3000);
		expect(result.data.transparent.installmentCount).toBe(2);
		expect(result.data.transparent.installmentAmount).toBe(1500);
		expect(result.data.transparent.installmentGroupId).toBe('cinst_1');
		expect(result.data.payerInformation.method).toBe('CARD');
	});

	test('keeps fields AbacatePay adds in the future instead of rejecting the event', () => {
		const result = WebhookEvent.parse({
			...checkoutCompleted,
			newEnvelopeField: true,
			data: {
				...checkoutCompleted.data,
				checkout: { ...checkoutCompleted.data.checkout, newField: 'kept' },
			},
		});

		expect(result).toMatchObject({
			newEnvelopeField: true,
			data: { checkout: { newField: 'kept' } },
		});
	});

	test('discriminates payout.completed from payout.failed', () => {
		const result = WebhookEvent.parse(payoutFailed);

		expect(result.event).toBe('payout.failed');
		if (result.event === 'payout.failed')
			expect(result.data.withdraw.status).toBe('FAILED');
	});

	test('rejects the payout shape that AbacatePay never sends', () => {
		expect(WebhookEvent.safeParse(outdatedPayoutBody).success).toBe(false);
	});

	test('rejects a body without apiVersion', () => {
		const { apiVersion: _, ...body } = checkoutCompleted;

		expect(WebhookEvent.safeParse(body).success).toBe(false);
	});

	test('StandardWebhookEvent parses a Standard Webhooks body', () => {
		const result = StandardWebhookEvent.safeParse(standardTransparentCompleted);

		expect(result.error?.issues).toBeUndefined();
		expect(result.data?.type).toBe('transparent.completed');
		expect(WebhookEvent.safeParse(standardTransparentCompleted).success).toBe(
			false,
		);
	});
});
