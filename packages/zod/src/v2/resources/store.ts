import { z } from 'zod';

/**
 * https://docs.abacatepay.com/pages/store/reference#estrutura
 */
export const APIStore = z.object({
	id: z
		.string()
		.describe('Unique identifier for your store on AbacatePay.')
		.meta({ example: 'store_123' }),
	name: z
		.string()
		.describe('Name of your store/company.')
		.meta({ example: 'Online Shop' }),
	balance: z
		.object({
			available: z
				.int()
				.describe('Balance available for withdrawal in cents.')
				.meta({ example: 4000 }),
			pending: z
				.int()
				.describe('Balance pending confirmation in cents.')
				.meta({ example: 2000 }),
			blocked: z
				.int()
				.describe('Balance blocked in disputes in cents.')
				.meta({ example: 0 }),
		})
		.describe('Object containing information about your account balances.'),
});

/**
 * https://docs.abacatepay.com/pages/store/reference#estrutura
 */
export type APIStore = z.infer<typeof APIStore>;
