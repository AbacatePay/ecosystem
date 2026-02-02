import { z } from 'zod';
import { StringEnum } from '../../utils';

/**
 * https://docs.abacatepay.com/pages/payouts/reference#atributos
 */
export const PayoutStatus = StringEnum(
	['PENDING', 'EXPIRED', 'CANCELLED', 'COMPLETE', 'REFUNDED'],
	'Transaction status.',
).meta({ example: 'PENDING' });

/**
 * https://docs.abacatepay.com/pages/payouts/reference#atributos
 */
export type PayoutStatus = z.infer<typeof PayoutStatus>;

/**
 * https://docs.abacatepay.com/pages/payouts/reference
 */
export const APIPayout = z.object({
	id: z
		.string()
		.describe('Unique transaction identifier.')
		.meta({ example: 'payout_123' }),
	status: PayoutStatus,
	devMode: z
		.boolean()
		.meta({ example: false })
		.describe(
			'Indicates whether the transaction was created in a testing environment.',
		),
	receiptUrl: z
		.union([z.null(), z.url()])
		.describe('Transaction proof URL.')
		.meta({ example: null }),
	amount: z.int().describe('Payout value in cents.').meta({ example: 3000 }),
	platformFee: z.int().describe('Platform fee in cents.').meta({ example: 80 }),
	externalId: z
		.string()
		.describe('External transaction identifier.')
		.meta({ example: 'tsx_123' }),
	createdAt: z.coerce
		.date()
		.describe('Transaction creation date.')
		.meta({ example: new Date() }),
	updatedAt: z.coerce
		.date()
		.describe('Transaction update date.')
		.meta({ example: new Date() }),
});

/**
 * https://docs.abacatepay.com/pages/payouts/reference
 */
export type APIPayout = z.infer<typeof APIPayout>;
