/**
 * Address of a customer.
 *
 * https://docs.abacatepay.com/pages/client/reference#estrutura
 */
export interface APICustomerAddress {
	/**
	 * Zip code (CEP).
	 */
	zipCode: string;
	/**
	 * Street name.
	 */
	street: string;
	/**
	 * Street number.
	 */
	number: string;
	/**
	 * Neighborhood.
	 */
	neighborhood: string;
	/**
	 * City.
	 */
	city: string;
	/**
	 * Two-letter state code (UF).
	 */
	state: string;
	/**
	 * Address complement.
	 */
	complement?: string;
}

/**
 * https://docs.abacatepay.com/pages/client/reference#estrutura
 */
export interface APICustomer {
	/**
	 * Unique customer identifier (`cust_...`).
	 */
	id: string;
	/**
	 * Indicates whether the client was created in a testing environment.
	 */
	devMode: boolean;
	/**
	 * Customer's email. `''` when the customer has none (e.g. created by a Boleto without email).
	 */
	email: string;
	/**
	 * Customer's CPF or CNPJ (Digits only).
	 */
	taxId: string | null;
	/**
	 * Customer country.
	 */
	country: 'BR' | null;
	/**
	 * Customer's full name.
	 */
	name: string | null;
	/**
	 * Customer's cell phone (Digits only).
	 */
	cellphone: string | null;
	/**
	 * Customer zip code (Digits only).
	 */
	zipCode: string | null;
	/**
	 * Customer address. Only customers created by a Boleto with an address have one.
	 */
	address:
		| (APICustomerAddress & {
				/**
				 * Internal ID of the stored address.
				 */
				_id?: string;
		  })
		| null;
	/**
	 * Additional customer metadata (`{}` when empty).
	 */
	metadata: Record<string, string>;
}
