import { z } from 'zod';

/**
 * https://docs.abacatepay.com/pages/client/reference#estrutura
 */
export const APICustomer = z.object({
	id: z
		.string()
		.describe('Unique customer identifier.')
		.meta({ example: 'cust_abc123' }),
	metadata: z.object({
		name: z
			.string()
			.describe("Customer's full name.")
			.meta({ example: 'Daniel Lima' }),
		email: z
			.email()
			.describe("Customer's email")
			.meta({ example: 'daniel_lima@abacatepay.com' }),
		taxId: z
			.string()
			.describe("Customer's CPF or CNPJ.")
			.meta({ example: '123.456.789-01' }),
		cellphone: z
			.string()
			.describe("Customer's cell phone.")
			.meta({ example: '(11) 4002-8922' }),
	}),
});

/**
 * https://docs.abacatepay.com/pages/client/reference#estrutura
 */
export type APICustomer = z.infer<typeof APICustomer>;
