import { z } from 'zod';
import { StringEnum } from '../../utils';
import { APICustomer } from './customer';

/**
 * https://docs.abacatepay.com/pages/payment/reference#atributos
 */
export const PaymentStatus = StringEnum(
	['PENDING', 'EXPIRED', 'CANCELLED', 'PAID', 'REFUNDED'],
	'Billing status. Can be `PENDING`, `EXPIRED`, `CANCELLED`, `PAID`, `REFUNDED`.',
).meta({ example: 'PENDING' });

/**
 * https://docs.abacatepay.com/pages/payment/reference#atributos
 */
export type PaymentStatus = z.infer<typeof PaymentStatus>;

/**
 * https://docs.abacatepay.com/pages/payment/create#body-methods
 */
export const PaymentMethod = StringEnum(
	['PIX', 'CARD'],
	'Payment method.',
).meta({ example: 'PIX' });

/**
 * https://docs.abacatepay.com/pages/payment/create#body-methods
 */
export type PaymentMethod = z.infer<typeof PaymentMethod>;

/**
 * https://docs.abacatepay.com/pages/payment/create#body-frequency
 */
export const PaymentFrequency = StringEnum(
	['ONE_TIME', 'MULTIPLE_PAYMENTS'],
	'Payment frequency.',
).meta({ example: 'ONE_TIME' });

/**
 * https://docs.abacatepay.com/pages/payment/create#body-frequency
 */
export type PaymentFrequency = z.infer<typeof PaymentFrequency>;

export const APIProduct = z.object({
	externalId: z
		.string()
		.describe(
			'The product id on your system. We use this id to create your product on AbacatePay automatically, so make sure your id is unique.',
		)
		.meta({ example: 'product_9384838' }),
	name: z
		.string()
		.describe('Product name.')
		.meta({ example: 'One Time Premium' }),
	quantity: z
		.int()
		.describe('Quantity of product being purchased')
		.min(1)
		.meta({ example: 1 }),
	price: z
		.int()
		.describe('Price per unit of product in cents. The minimum is 100 (1 BRL).')
		.min(100)
		.meta({ example: 5000 }),
	description: z
		.string()
		.describe('Detailed product description.')
		.optional()
		.meta({ example: 'Premium for the X Shop' }),
});

/**
 * https://docs.abacatepay.com/pages/payment/reference#estrutura
 */
export const APICharge = z.object({
	id: z
		.string()
		.describe('Unique billing identifier.')
		.meta({ example: 'bill_123456' }),
	frequency: PaymentFrequency,
	externalId: z
		.nullable(z.string())
		.describe('Bill ID in your system.')
		.meta({ example: 'order_abc123' }),
	url: z
		.url()
		.describe('URL where the user can complete the payment.')
		.meta({ example: 'https://myshop.com/premium' }),
	status: PaymentStatus,
	devMode: z
		.boolean()
		.describe(
			'Indicates whether the charge was created in a development (true) or production (false) environmenz.',
		)
		.meta({ example: false }),
	metadata: z.object({
		fee: z
			.number()
			.describe('Fee applied by AbacatePay.')
			.meta({ example: 80 }),
		returnUrl: z
			.url()
			.describe(
				'URL that the customer will be redirected to when clicking the “back” button.',
			)
			.meta({ example: 'https://myshop.com/' }),
		completionUrl: z
			.url()
			.describe(
				'URL that the customer will be redirected to when making payment.',
			)
			.meta({ example: 'https://myshop.com/thanks' }),
	}),
	methods: PaymentMethod.array().meta({ example: ['PIX'] }),
	products: z
		.array(APIProduct)
		.describe('List of products included in the charge.')
		.min(1)
		.meta({
			example: [
				{
					externalId: 'prod_a91020320',
					name: 'One Time Premium',
					quantity: 1,
					price: 1000,
					description: 'Buy one-time premium',
				},
			],
		}),
	customer: APICustomer.optional(),
	nextBilling: z
		.nullable(z.coerce.date())
		.meta({ example: new Date() })
		.describe('Date and time of next charge, or null for one-time charges.'),
	allowCoupons: z
		.boolean()
		.describe('Whether or not to allow coupons for billing.')
		.optional()
		.meta({ example: false }),
	coupons: z
		.array(z.string())
		.describe(
			'Coupons allowed in billing. Coupons are only considered if `allowCoupons` is true.',
		)
		.min(50)
		.meta({ example: ['SUMMER'] })
		.default([]),
	createdAt: z.coerce
		.date()
		.describe('Charge creation date and time.')
		.meta({ example: new Date() }),
	updatedAt: z.coerce
		.date()
		.describe('Charge last updated date and time.')
		.meta({ example: new Date() }),
});

/**
 * https://docs.abacatepay.com/pages/payment/reference#estrutura
 */
export type APICharge = z.infer<typeof APICharge>;
