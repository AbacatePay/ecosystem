import { z } from 'zod';

/**
 * https://docs.abacatepay.com/pages/client/reference#estrutura
 */
export const APICustomer = z.object({
	id: z
		.string()
		.describe('Unique customer identifier.')
		.meta({ example: 'cust_123' }),
	devMode: z
		.boolean()
		.meta({ example: true })
		.describe(
			'Indicates whether the client was created in a testing environment.',
		),
	country: z.string().describe('Customer country.').meta({ example: 'Brazil' }),
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
		.meta({ example: '012.345.678-90' }),
	cellphone: z
		.string()
		.describe("Customer's cell phone.")
		.meta({ example: '(00) 00000-0000' }),
	zipCode: z.string().describe('Customer zip code.').meta({ example: '...' }),
	metadata: z
		.record(z.string(), z.any())
		.describe('Additional customer metadata.')
		.meta({ example: { externalId: 'my_customer_123' } })
		.optional(),
});

/**
 * https://docs.abacatepay.com/pages/client/reference#estrutura
 */
export type APICustomer = z.infer<typeof APICustomer>;
