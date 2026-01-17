import { type Static, Type as t } from '@sinclair/typebox';
import { StringEnum } from '../../utils';

/**
 * https://docs.abacatepay.com/pages/payment/reference#atributos
 */
export const PaymentStatus = StringEnum(
	['PENDING', 'EXPIRED', 'CANCELLED', 'PAID', 'REFUNDED'],
	'Billing status. Can be `PENDING`, `EXPIRED`, `CANCELLED`, `PAID`, `REFUNDED`.',
);

export type PaymentStatus = Static<typeof PaymentStatus>;

/**
 * https://docs.abacatepay.com/pages/payment/create#body-methods
 */
export const PaymentMethod = StringEnum(['PIX', 'CARD'], 'Payment method.');

export type PaymentMethod = Static<typeof PaymentMethod>;

/**
 * https://docs.abacatepay.com/pages/checkouts/reference#estrutura
 */
export const APICheckout = t.Object({
	id: t.String({
		description: 'Unique billing identifier.',
	}),
	amount: t.Integer({
		minimum: 100,
		description: 'Total amount to be paid in cents.',
	}),
	paidAmount: t.Union(
		[
			t.Null(),
			t.Integer({
				minimum: 100,
			}),
		],
		{
			description:
				'Amount already paid in cents.`null` if it has not yet been paid.',
		},
	),
	externalId: t.Union([t.Null(), t.String()], {
		description: 'Bill ID in your system.',
	}),
	url: t.String({
		format: 'uri',
		description: 'URL where the user can complete the payment.',
	}),
	items: t.Array(
		t.Object({
			id: t.String({
				description: 'Product ID.',
			}),
			quantity: t.Integer({
				minimum: 1,
				description: 'Item quantity.',
			}),
		}),
		{
			minItems: 1,
			description: 'List of items in billing.',
		},
	),
	status: PaymentStatus,
	devMode: t.Boolean({
		description:
			'Indicates whether the charge was created in a development (true) or production (false) environment.',
	}),
	metadata: t.Record(t.String(), t.Any(), {
		description: 'Additial metadata for the charge.',
	}),
	returnUrl: t.String({
		format: 'uri',
		description:
			'URL that the customer will be redirected to when clicking the “back” button.',
	}),
	completionUrl: t.String({
		format: 'uri',
		description:
			'URL that the customer will be redirected to when making payment.',
	}),
	receiptUrl: t.Union([t.Null(), t.String({ format: 'uri' })], {
		description: 'Payment receipt URL.',
	}),
	coupons: t.Array(t.String(), {
		default: [],
		maxItems: 50,
		description: 'Coupons allowed in billing.',
	}),
	customerId: t.Union([t.Null(), t.String()], {
		description: 'Customer ID associated with the charge.',
	}),
	createdAt: t.Date({
		description: 'Charge creation date and time.',
	}),
	updatedAt: t.Date({
		description: 'Charge last updated date and time.',
	}),
});

export type APICheckout = Static<typeof APICheckout>;
