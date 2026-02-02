import { z } from 'zod';
import { StringEnum } from '../../utils';

/**
 * https://docs.abacatepay.com/pages/withdraw/reference#atributos
 */
export const WithdrawStatus = StringEnum(
	['PENDING', 'EXPIRED', 'CANCELLED', 'COMPLETE', 'REFUNDED'],
	'Transaction status.',
).meta({ example: 'PENDING' });

/**
 * https://docs.abacatepay.com/pages/withdraw/reference#atributos
 */
export type WithdrawStatus = z.infer<typeof WithdrawStatus>;

/**
 * https://docs.abacatepay.com/pages/withdraws/reference
 */
export const APIWithdraw = z.object({
	id: z
		.string()
		.describe('Unique transaction identifier.')
		.meta({ example: 'tran_123' }),
	status: WithdrawStatus,
	devMode: z
		.boolean()
		.describe(
			'Indicates whether the transaction was created in a testing environment.',
		)
		.meta({ example: false }),
	receiptUrl: z
		.url()
		.describe('Transaction proof URL.')
		.meta({ example: 'https://abacatepay.com/receipt/tran_123' }),
	amount: z.int().describe('Withdraw value in cents.').meta({ example: 10000 }),
	platformFee: z.int().describe('Platform fee in cents.').meta({ example: 80 }),
	externalId: z
		.string()
		.describe('External transaction identifier.')
		.optional()
		.meta({ example: 'tsx_123' }),
	createdAt: z.coerce
		.date()
		.describe('Transaction creation date.')
		.meta({ example: new Date() }),
	updatedAt: z.coerce
		.date()
		.describe('Transaction update date.')
		.meta({ example: new Date() }),
	kind: z
		.literal('WITHDRAW')
		.describe("Transaction type. It will always be 'WITHDRAW'")
		.meta({ example: 'WITHDRAW' }),
});

/**
 * https://docs.abacatepay.com/pages/withdraws/reference
 */
export type APIWithdraw = z.infer<typeof APIWithdraw>;
