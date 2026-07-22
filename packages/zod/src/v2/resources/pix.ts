import { z } from 'zod';
import { StringEnum } from '../../utils';
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
	receiptUrl: z
		.union([z.null(), z.url()])
		.meta({ example: null })
		.describe('Payment receipt URL.')
		.optional(),
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
	metadata: z
		.record(z.string(), z.any())
		.meta({ example: {} })
		.describe('Additional metadata attached to the charge.')
		.optional(),
});

/**
 * https://docs.abacatepay.com/pages/transparents/reference
 */
export type APIQRCodePIX = z.infer<typeof APIQRCodePIX>;

/**
 * https://docs.abacatepay.com/pages/transparents/boleto
 */
export const APIBoleto = z.object({
	id: z
		.string()
		.describe('Unique Boleto identifier.')
		.meta({ example: 'bill_char_123' }),
	amount: z.int().describe('Charge amount in cents.').meta({ example: 4000 }),
	status: PaymentStatus,
	devMode: z
		.boolean()
		.meta({ example: false })
		.describe(
			'Indicates whether the charge is in a testing (true) or production (false) environment.',
		),
	barCode: z
		.string()
		.describe('Boleto barcode.')
		.meta({ example: '00190.00009 03384.318207' }),
	url: z
		.url()
		.describe('URL to view/print the Boleto.')
		.meta({ example: 'https://myshop.com/boleto/bill_char_123' }),
	pix: z
		.object({
			brCode: z
				.string()
				.describe('PIX code (copy-and-paste) for payment.')
				.meta({ example: '00020101021226950014br.gov.bcb.pix' }),
			brCodeBase64: z
				.base64()
				.meta({ example: 'data:image/png;base64,iVBORw0KGgoAAA' })
				.describe(
					'PIX code in Base64 format (Useful for displaying in images).',
				),
		})
		.describe('PIX alternative for paying the same Boleto.'),
	platformFee: z.int().meta({ example: 80 }).describe('Platform fee in cents.'),
	receiptUrl: z
		.union([z.null(), z.url()])
		.meta({ example: null })
		.describe('Payment receipt URL.'),
	createdAt: z.coerce
		.date()
		.describe('Boleto creation date and time.')
		.meta({ example: new Date() }),
	updatedAt: z.coerce
		.date()
		.describe('Boleto last updated date and time.')
		.meta({ example: new Date() }),
	expiresAt: z.coerce
		.date()
		.describe('Boleto expiration date and time.')
		.meta({ example: new Date() }),
	metadata: z
		.record(z.string(), z.any())
		.meta({ example: {} })
		.describe('Additional metadata attached to the charge.')
		.optional(),
});

/**
 * https://docs.abacatepay.com/pages/transparents/boleto
 */
export type APIBoleto = z.infer<typeof APIBoleto>;

/**
 * https://docs.abacatepay.com/pages/pix/reference
 */
export const PixTransferStatus = StringEnum(
	['PENDING', 'EXPIRED', 'CANCELLED', 'COMPLETE', 'REFUNDED'],
	'Transfer status.',
).meta({ example: 'PENDING' });

/**
 * https://docs.abacatepay.com/pages/pix/reference
 */
export type PixTransferStatus = z.infer<typeof PixTransferStatus>;

/**
 * https://docs.abacatepay.com/pages/pix/create
 */
export const PixKeyType = StringEnum(
	['CPF', 'CNPJ', 'PHONE', 'EMAIL', 'RANDOM', 'BR_CODE'],
	'Type of the destination PIX key.',
).meta({ example: 'EMAIL' });

/**
 * https://docs.abacatepay.com/pages/pix/create
 */
export type PixKeyType = z.infer<typeof PixKeyType>;

/**
 * Outbound PIX transfer to a third-party PIX key (Sending money out).
 *
 * https://docs.abacatepay.com/pages/pix/reference
 */
export const APIPixTransfer = z.object({
	id: z
		.string()
		.describe('Unique transfer identifier.')
		.meta({ example: 'pix_transfer_123' }),
	status: PixTransferStatus,
	devMode: z
		.boolean()
		.meta({ example: false })
		.describe(
			'Indicates whether the transfer is in a testing (true) or production (false) environment.',
		),
	receiptUrl: z
		.union([z.null(), z.url()])
		.meta({ example: null })
		.describe('Proof-of-transfer URL, available once completed.'),
	amount: z.int().meta({ example: 4000 }).describe('Transfer amount in cents.'),
	platformFee: z.int().meta({ example: 80 }).describe('Platform fee in cents.'),
	externalId: z
		.union([z.null(), z.string()])
		.meta({ example: null })
		.describe('Unique transfer identifier in your system.'),
	createdAt: z.coerce
		.date()
		.describe('Transfer creation date and time.')
		.meta({ example: new Date() }),
	updatedAt: z.coerce
		.date()
		.describe('Transfer last updated date and time.')
		.meta({ example: new Date() }),
});

/**
 * https://docs.abacatepay.com/pages/pix/reference
 */
export type APIPixTransfer = z.infer<typeof APIPixTransfer>;
