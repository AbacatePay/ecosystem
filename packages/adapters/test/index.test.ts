import { describe, expect, test } from 'bun:test';
import { dispatch, parse } from '../src/webhooks';

const withdraw = {
	id: 'tran_1',
	amount: 1000,
	status: 'COMPLETE',
	method: 'PIX',
	platformFee: 80,
	receiptUrl: null,
	externalId: null,
	createdAt: '2026-10-01T12:00:00.000Z',
	updatedAt: '2026-10-01T12:00:00.000Z',
	endToEndIdentifier: null,
};

const subscription = {
	id: 'subs_1',
	amount: 2200,
	currency: 'BRL',
	method: 'CARD',
	status: 'ACTIVE',
	frequency: 'MONTHLY',
	createdAt: '2026-09-01T12:00:00.000Z',
	updatedAt: '2026-10-01T12:00:00.000Z',
	canceledAt: null,
	cancelPolicy: null,
	cancelledDueTo: null,
};

const customer = { id: '', name: null, email: null, taxId: null };

describe('parse', () => {
	test('accepts a real payout.completed body', () => {
		const event = parse({
			id: 'log_1',
			event: 'payout.completed',
			apiVersion: 2,
			devMode: false,
			data: { withdraw },
		});

		expect(event.success).toBe(true);
	});

	test('rejects the payout shape AbacatePay never sends', () => {
		const event = parse({
			id: 'log_1',
			event: 'payout.completed',
			devMode: false,
			data: { transaction: { ...withdraw, devMode: false } },
		});

		expect(event.success).toBe(false);
	});
});

describe('dispatch', () => {
	test('routes payout.completed to onPayoutCompleted, not onPayload', () => {
		const event = parse({
			id: 'log_1',
			event: 'payout.completed',
			apiVersion: 2,
			devMode: false,
			data: { withdraw },
		});

		expect(event.success).toBe(true);
		if (!event.success) return;

		let onPayoutCompletedCalled = false;
		let onPayloadCalled = false;

		dispatch(event.data, {
			secret: 'whsec_test',
			onPayoutCompleted: () => {
				onPayoutCompletedCalled = true;
			},
			onPayload: () => {
				onPayloadCalled = true;
			},
		});

		expect(onPayoutCompletedCalled).toBe(true);
		expect(onPayloadCalled).toBe(false);
	});

	test('falls back to onPayload when a specific handler is not provided', () => {
		const event = parse({
			id: 'log_2',
			event: 'payout.failed',
			apiVersion: 2,
			devMode: false,
			data: { withdraw: { ...withdraw, status: 'FAILED' } },
		});

		expect(event.success).toBe(true);
		if (!event.success) return;

		let onPayloadCalled = false;

		dispatch(event.data, {
			secret: 'whsec_test',
			onPayload: () => {
				onPayloadCalled = true;
			},
		});

		expect(onPayloadCalled).toBe(true);
	});

	test('routes subscription.renewed by its own handler', () => {
		const event = parse({
			id: 'log_3',
			event: 'subscription.renewed',
			apiVersion: 2,
			devMode: false,
			data: { subscription, customer },
		});

		expect(event.success).toBe(true);
		if (!event.success) return;

		let onSubscriptionRenewedCalled = false;

		dispatch(event.data, {
			secret: 'whsec_test',
			onSubscriptionRenewed: () => {
				onSubscriptionRenewedCalled = true;
			},
		});

		expect(onSubscriptionRenewedCalled).toBe(true);
	});

	test('routes subscription.plan_changed to onSubscriptionPlanChanged', () => {
		const event = parse({
			id: 'log_4',
			event: 'subscription.plan_changed',
			apiVersion: 2,
			devMode: false,
			data: {
				subscription,
				customer,
				changeSource: 'API_CHANGE_PLAN',
				pendingUpdateId: 'subu_1',
				items: [{ productId: 'prod_1', quantity: 2, newAmount: 4400 }],
				productId: 'prod_1',
				quantity: 2,
				newAmount: 4400,
				status: 'PENDING',
				requestedAt: '2026-10-10T12:00:00.000Z',
			},
		});

		expect(event.success).toBe(true);
		if (!event.success) return;

		let newAmount: number | undefined;

		dispatch(event.data, {
			secret: 'whsec_test',
			onSubscriptionPlanChanged: (payload) => {
				newAmount = payload.data.newAmount;
			},
		});

		expect(newAmount).toBe(4400);
	});

	test('routes subscription.payment_failed to onSubscriptionPaymentFailed', () => {
		const event = parse({
			id: 'log_5',
			event: 'subscription.payment_failed',
			apiVersion: 2,
			devMode: true,
			data: {
				subscription,
				customer,
				installmentId: 'intl_1',
				installmentNumber: 2,
				retryNumber: 3,
			},
		});

		expect(event.success).toBe(true);
		if (!event.success) return;

		let retryNumber: number | undefined;

		dispatch(event.data, {
			secret: 'whsec_test',
			onSubscriptionPaymentFailed: (payload) => {
				retryNumber = payload.data.retryNumber;
			},
		});

		expect(retryNumber).toBe(3);
	});
});
