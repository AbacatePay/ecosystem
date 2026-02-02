import { z } from 'zod';
import { StringEnum } from '../../utils';

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
 * https://docs.abacatepay.com/pages/checkouts/reference#estrutura
 */
export const APICheckout = z.object({
	id: z
		.string()
		.describe('Unique billing identifier.')
		.meta({ example: 'bill_123' }),
	amount: z
		.int()
		.min(100)
		.describe('Total amount to be paid in cents.')
		.meta({ example: 4000 }),
	paidAmount: z
		.union([z.null(), z.int().min(100)])
		.describe(
			'Amount already paid in cents.`null` if it has not yet been paid.',
		)
		.meta({ example: null }),
	externalId: z
		.union([z.null(), z.string()])
		.meta({ example: null })
		.describe('Bill ID in your system.'),
	url: z
		.url()
		.describe('URL where the user can complete the payment.')
		.meta({ example: 'https://myshop.com/premium' }),
	items: z
		.array(
			z.object({
				id: z.string().describe('Product ID.'),
				quantity: z.int().min(1).describe('Item quantity.'),
			}),
		)
		.meta({
			example: [
				{
					id: 'prod_123',
					quantity: 1,
				},
			],
		})
		.min(1)
		.describe('List of items in billing.'),
	status: PaymentStatus,
	devMode: z
		.boolean()
		.meta({ example: true })
		.describe(
			'Indicates whether the charge was created in a development (true) or production (false) environment.',
		),
	metadata: z
		.record(z.string(), z.any())
		.meta({ example: {} })
		.describe('Additial metadata for the charge.'),
	returnUrl: z
		.url()
		.meta({ example: 'https://myshop.com/premium' })
		.describe(
			'URL that the customer will be redirected to when clicking the "back" button.',
		),
	completionUrl: z
		.url()
		.meta({ example: 'https://myshop.com/thanks' })
		.describe(
			'URL that the customer will be redirected to when making payment.',
		),
	receiptUrl: z
		.union([z.null(), z.url()])
		.meta({ example: null })
		.describe('Payment receipt URL.'),
	coupons: z
		.array(z.string())
		.max(50)
		.default([])
		.meta({ example: ['SUMMER'] })
		.describe('Coupons allowed in billing.'),
	customerId: z
		.union([z.null(), z.string()])
		.meta({ example: null })
		.describe('Customer ID associated with the charge.'),
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
 * https://docs.abacatepay.com/pages/checkouts/reference#estrutura
 */
export type APICheckout = z.infer<typeof APICheckout>;
