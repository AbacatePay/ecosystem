import { z } from 'zod';
import { PaymentStatus } from './checkout';

/**
 * A reusable payment link — unlike a Checkout, the same link can be paid by
 * multiple customers instead of being tied to a single transaction.
 *
 * https://docs.abacatepay.com/pages/payment-links/reference
 */
export const APIPaymentLink = z.object({
	id: z
		.string()
		.describe('Unique payment link identifier.')
		.meta({ example: 'bill_123' }),
	url: z
		.url()
		.describe('Shareable checkout URL.')
		.meta({ example: 'https://myshop.com/premium' }),
	amount: z.int().describe('Total amount in cents.').meta({ example: 4000 }),
	paidAmount: z
		.union([z.null(), z.int()])
		.meta({ example: null })
		.describe('Amount paid in cents. `null` if it has not yet been paid.'),
	status: PaymentStatus,
	frequency: z
		.literal('MULTIPLE_PAYMENTS')
		.meta({ example: 'MULTIPLE_PAYMENTS' })
		.describe('Always `MULTIPLE_PAYMENTS` for payment links.'),
	items: z
		.array(
			z.object({
				id: z.string().describe('Product ID.'),
				quantity: z.int().min(1).describe('Item quantity.'),
			}),
		)
		.meta({ example: [{ id: 'prod_123', quantity: 1 }] })
		.describe('List of items included in the payment link.'),
	externalId: z
		.union([z.null(), z.string()])
		.meta({ example: null })
		.describe('Reference ID in your system.'),
	createdAt: z.coerce
		.date()
		.describe('Payment link creation date and time.')
		.meta({ example: new Date() }),
	updatedAt: z.coerce
		.date()
		.describe('Payment link last updated date and time.')
		.meta({ example: new Date() }),
});

/**
 * https://docs.abacatepay.com/pages/payment-links/reference
 */
export type APIPaymentLink = z.infer<typeof APIPaymentLink>;
