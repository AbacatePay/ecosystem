import { z } from 'zod';
import { StringEnum } from '../../utils';

/**
 * https://docs.abacatepay.com/pages/products/reference#atributos
 */
export const ProductStatus = StringEnum(
	['ACTIVE', 'INACTIVE'],
	'Product status.',
).meta({ example: 'ACTIVE' });

/**
 * https://docs.abacatepay.com/pages/products/reference#atributos
 */
export type ProductStatus = z.infer<typeof ProductStatus>;

/**
 * https://docs.abacatepay.com/pages/products/reference#estrutura
 */
export const APIProduct = z.object({
	id: z
		.string()
		.describe('The ID of your product.')
		.meta({ example: 'prod_123' }),
	externalId: z
		.string()
		.describe('Unique product identifier in your system.')
		.meta({ example: 'product_xyz' }),
	name: z.string().describe('Product name.').meta({ example: 'Premium' }),
	price: z.int().describe('Product price in cents.').meta({ example: 4000 }),
	currency: z.string().describe('Product currency.').meta({ example: 'BRL' }),
	status: ProductStatus,
	devMode: z
		.boolean()
		.meta({ example: false })
		.describe(
			'Indicates whether the product was created in a testing environment.',
		),
	createdAt: z.coerce
		.date()
		.describe('Product creation date.')
		.meta({ example: new Date() }),
	updatedAt: z.coerce
		.date()
		.describe('Product update date.')
		.meta({ example: new Date() }),
	description: z
		.union([z.null(), z.string()])
		.meta({ example: null })
		.describe('Product description.'),
});

/**
 * https://docs.abacatepay.com/pages/products/reference#estrutura
 */
export type APIProduct = z.infer<typeof APIProduct>;
