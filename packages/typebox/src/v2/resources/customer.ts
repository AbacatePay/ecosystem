import { type Static, Type as t } from '@sinclair/typebox';

/**
 * https://docs.abacatepay.com/pages/client/reference#estrutura
 */
export const APICustomer = t.Object({
	id: t.String({
		description: 'Unique customer identifier.',
	}),
	devMode: t.Boolean({
		description:
			'Indicates whether the client was created in a testing environment.',
	}),
	country: t.String({
		description: 'Customer country.',
	}),
	name: t.String({
		description: "Customer's full name.",
	}),
	email: t.String({
		format: 'email',
		description: "Customer's email",
	}),
	taxId: t.String({
		description: "Customer's CPF or CNPJ.",
	}),
	cellphone: t.String({
		description: "Customer's cell phone.",
	}),
	zipCode: t.String({
		description: 'Customer zip code.',
	}),
	metadata: t.Optional(
		t.Record(t.String(), t.Any(), {
			description: 'Additional customer metadata.',
		}),
	),
});

export type APICustomer = Static<typeof APICustomer>;
