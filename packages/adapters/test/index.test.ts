import { describe, expect, test } from 'bun:test';
import { dispatch, parse } from '../src/webhooks';

const basePayout = {
	id: 'payout_1',
	devMode: false,
	receiptUrl: null,
	amount: 1000,
	platformFee: 80,
	externalId: 'trx_1',
	createdAt: new Date(),
	updatedAt: new Date(),
};

describe('dispatch', () => {
	test('routes payout.completed to onPayoutCompleted, not onPayload', () => {
		const event = parse({
			id: 'log_1',
			event: 'payout.completed',
			devMode: false,
			data: { transaction: { ...basePayout, status: 'COMPLETE' } },
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
			devMode: false,
			data: { transaction: { ...basePayout, status: 'CANCELLED' } },
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

	test('routes an undocumented event type (e.g. subscription.renewed) by its own handler', () => {
		const event = parse({
			id: 'log_3',
			event: 'subscription.renewed',
			devMode: false,
			data: { subscriptionId: 'subs_123' },
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
});
