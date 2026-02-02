import { z } from 'zod';
import { PaymentStatus } from './checkout';

/**
 * https://docs.abacatepay.com/pages/transparents/reference
 */
export const APIQRCodePIX = z.object({
	id: z
		.string()
		.describe('Unique QRCode PIX identifier.')
		.meta({ example: 'pix_char_123' }),
	amount: z
		.int()
		.describe('Charge amount in cents (e.g. 4000 = R$40.00).')
		.meta({ example: 4000 }),
	status: PaymentStatus,
	devMode: z
		.boolean()
		.meta({ example: false })
		.describe(
			'Indicates whether the charge is in a testing (true) or production (false) environment.',
		),
	brCode: z
		.string()
		.describe('PIX code (copy-and-paste) for payment.')
		.meta({ example: '00020101021226950014br.gov.bcb.pix' }),
	brCodeBase64: z
		.base64()
		.meta({ example: 'data:image/png;base64,iVBORw0KGgoAAA' })
		.describe('PIX code in Base64 format (Useful for displaying in images).'),
	platformFee: z
		.int()
		.meta({ example: 80 })
		.describe('Platform fee in cents. Example: 80 means R$0.80.'),
	createdAt: z.coerce
		.date()
		.describe('QRCode PIX creation date and time.')
		.meta({ example: new Date() }),
	updatedAt: z.coerce
		.date()
		.describe('QRCode PIX last updated date and time.')
		.meta({ example: new Date() }),
	expiresAt: z.coerce
		.date()
		.describe('QRCode expiration date and time.')
		.meta({ example: new Date() }),
});

/**
 * https://docs.abacatepay.com/pages/transparents/reference
 */
export type APIQRCodePIX = z.infer<typeof APIQRCodePIX>;
