import { type Static, Type as t } from '@sinclair/typebox';
import { PaymentStatus } from './checkout';

/**
 * A reusable payment link — unlike a Checkout, the same link can be paid by
 * multiple customers instead of being tied to a single transaction.
 *
 * https://docs.abacatepay.com/pages/payment-links/reference
 */
export const APIPaymentLink = t.Object({
	id: t.String({
		examples: ['bill_abc123xyz'],
		description: 'Unique payment link identifier.',
	}),
	url: t.String({
		format: 'uri',
		examples: ['https://app.abacatepay.com/pay/bill_abc123xyz'],
		description: 'Shareable checkout URL.',
	}),
	amount: t.Integer({
		examples: [4000],
		description: 'Total amount in cents.',
	}),
	paidAmount: t.Union([t.Null(), t.Integer()], {
		examples: [null],
		description: 'Amount paid in cents. `null` if it has not yet been paid.',
	}),
	status: PaymentStatus,
	frequency: t.Literal('MULTIPLE_PAYMENTS', {
		examples: ['MULTIPLE_PAYMENTS'],
		description: 'Always `MULTIPLE_PAYMENTS` for payment links.',
	}),
	items: t.Array(
		t.Object({
			id: t.String({ description: 'Product ID.' }),
			quantity: t.Integer({ minimum: 1, description: 'Item quantity.' }),
		}),
		{
			examples: [[{ id: 'prod_123', quantity: 1 }]],
			description: 'List of items included in the payment link.',
		},
	),
	externalId: t.Union([t.Null(), t.String()], {
		examples: [null],
		description: 'Reference ID in your system.',
	}),
	createdAt: t.Date({
		examples: ['2025-01-01T00:00:00Z'],
		description: 'Payment link creation date and time.',
	}),
	updatedAt: t.Date({
		examples: ['2025-01-01T00:00:00Z'],
		description: 'Payment link last updated date and time.',
	}),
});

/**
 * https://docs.abacatepay.com/pages/payment-links/reference
 */
export type APIPaymentLink = Static<typeof APIPaymentLink>;
