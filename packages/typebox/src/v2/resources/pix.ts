import { type Static, Type as t } from '@sinclair/typebox';
import { StringEnum } from '../../utils';
import { PaymentStatus } from './checkout';

/**
 * https://docs.abacatepay.com/pages/transparents/reference
 */
export const APIQRCodePIX = t.Object({
	id: t.String({
		examples: ['pix_char_123456'],
		description: 'Unique QRCode PIX identifier.',
	}),
	amount: t.Integer({
		examples: [4000],
		description: 'Charge amount in cents (e.g. 4000 = R$40.00).',
	}),
	status: PaymentStatus,
	devMode: t.Boolean({
		examples: [true],
		description:
			'Indicates whether the charge is in a testing (true) or production (false) environment.',
	}),
	brCode: t.String({
		examples: ['00020101021226950014br.gov.bcb.pix'],
		description: 'PIX code (copy-and-paste) for payment.',
	}),
	brCodeBase64: t.String({
		examples: ['data:image/png;base64,iVBORw0KGgoAAA'],
		description: 'PIX code in Base64 format (Useful for displaying in images).',
	}),
	platformFee: t.Integer({
		examples: [80],
		description: 'Platform fee in cents. Example: 80 means R$0.80.',
	}),
	receiptUrl: t.Optional(
		t.Union([t.Null(), t.String({ format: 'uri' })], {
			examples: [null],
			description: 'Payment receipt URL.',
		}),
	),
	createdAt: t.Date({
		examples: ['2025-01-01T12:00:00Z'],
		description: 'QRCode PIX creation date and time.',
	}),
	updatedAt: t.Date({
		examples: ['2025-01-01T12:00:00Z'],
		description: 'QRCode PIX last updated date and time.',
	}),
	expiresAt: t.Date({
		examples: ['2025-01-02T12:00:00Z'],
		description: 'QRCode expiration date and time.',
	}),
	metadata: t.Optional(
		t.Record(t.String(), t.Any(), {
			examples: [{}],
			description: 'Additional metadata attached to the charge.',
		}),
	),
});

/**
 * https://docs.abacatepay.com/pages/transparents/reference
 */
export type APIQRCodePIX = Static<typeof APIQRCodePIX>;

/**
 * https://docs.abacatepay.com/pages/transparents/boleto
 */
export const APIBoleto = t.Object({
	id: t.String({
		examples: ['bill_char_123456'],
		description: 'Unique Boleto identifier.',
	}),
	amount: t.Integer({
		examples: [4000],
		description: 'Charge amount in cents.',
	}),
	status: PaymentStatus,
	devMode: t.Boolean({
		examples: [true],
		description:
			'Indicates whether the charge is in a testing (true) or production (false) environment.',
	}),
	barCode: t.String({
		examples: ['00190.00009 03384.318207'],
		description: 'Boleto barcode.',
	}),
	url: t.String({
		format: 'uri',
		examples: ['https://myshop.com/boleto/bill_char_123456'],
		description: 'URL to view/print the Boleto.',
	}),
	pix: t.Object(
		{
			brCode: t.String({
				examples: ['00020101021226950014br.gov.bcb.pix'],
				description: 'PIX code (copy-and-paste) for payment.',
			}),
			brCodeBase64: t.String({
				examples: ['data:image/png;base64,iVBORw0KGgoAAA'],
				description:
					'PIX code in Base64 format (Useful for displaying in images).',
			}),
		},
		{ description: 'PIX alternative for paying the same Boleto.' },
	),
	platformFee: t.Integer({
		examples: [80],
		description: 'Platform fee in cents.',
	}),
	receiptUrl: t.Union([t.Null(), t.String({ format: 'uri' })], {
		examples: [null],
		description: 'Payment receipt URL.',
	}),
	createdAt: t.Date({
		examples: ['2025-01-01T12:00:00Z'],
		description: 'Boleto creation date and time.',
	}),
	updatedAt: t.Date({
		examples: ['2025-01-01T12:00:00Z'],
		description: 'Boleto last updated date and time.',
	}),
	expiresAt: t.Date({
		examples: ['2025-01-05T12:00:00Z'],
		description: 'Boleto expiration date and time.',
	}),
	metadata: t.Optional(
		t.Record(t.String(), t.Any(), {
			examples: [{}],
			description: 'Additional metadata attached to the charge.',
		}),
	),
});

/**
 * https://docs.abacatepay.com/pages/transparents/boleto
 */
export type APIBoleto = Static<typeof APIBoleto>;

/**
 * https://docs.abacatepay.com/pages/pix/reference
 */
export const PixTransferStatus = StringEnum(
	['PENDING', 'EXPIRED', 'CANCELLED', 'COMPLETE', 'REFUNDED'],
	{ examples: ['PENDING'], description: 'Transfer status.' },
);

/**
 * https://docs.abacatepay.com/pages/pix/reference
 */
export type PixTransferStatus = Static<typeof PixTransferStatus>;

/**
 * https://docs.abacatepay.com/pages/pix/create
 */
export const PixKeyType = StringEnum(
	['CPF', 'CNPJ', 'PHONE', 'EMAIL', 'RANDOM', 'BR_CODE'],
	{ examples: ['EMAIL'], description: 'Type of the destination PIX key.' },
);

/**
 * https://docs.abacatepay.com/pages/pix/create
 */
export type PixKeyType = Static<typeof PixKeyType>;

/**
 * Outbound PIX transfer to a third-party PIX key (Sending money out).
 *
 * https://docs.abacatepay.com/pages/pix/reference
 */
export const APIPixTransfer = t.Object({
	id: t.String({
		examples: ['pix_transfer_123'],
		description: 'Unique transfer identifier.',
	}),
	status: PixTransferStatus,
	devMode: t.Boolean({
		examples: [false],
		description:
			'Indicates whether the transfer is in a testing (true) or production (false) environment.',
	}),
	receiptUrl: t.Union([t.Null(), t.String({ format: 'uri' })], {
		examples: [null],
		description: 'Proof-of-transfer URL, available once completed.',
	}),
	amount: t.Integer({
		examples: [4000],
		description: 'Transfer amount in cents.',
	}),
	platformFee: t.Integer({
		examples: [80],
		description: 'Platform fee in cents.',
	}),
	externalId: t.Union([t.Null(), t.String()], {
		examples: [null],
		description: 'Unique transfer identifier in your system.',
	}),
	createdAt: t.Date({
		examples: ['2025-01-01T12:00:00Z'],
		description: 'Transfer creation date and time.',
	}),
	updatedAt: t.Date({
		examples: ['2025-01-01T12:00:00Z'],
		description: 'Transfer last updated date and time.',
	}),
});

/**
 * https://docs.abacatepay.com/pages/pix/reference
 */
export type APIPixTransfer = Static<typeof APIPixTransfer>;
