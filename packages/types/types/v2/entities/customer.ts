/**
 * https://docs.abacatepay.com/pages/client/reference#estrutura
 */
export interface APICustomer {
	/**
	 * Unique customer identifier.
	 */
	id: string;
	/**
	 * Indicates whether the client was created in a testing environment.
	 */
	devMode: boolean;
	/**
	 * Customer country.
	 */
	country: string;
	/**
	 * Customer's full name.
	 */
	name: string;
	/**
	 * Customer's email.
	 */
	email: string;
	/**
	 * Customer's CPF or CNPJ.
	 */
	taxId: string;
	/**
	 * Customer's cell phone.
	 */
	cellphone: string;
	/**
	 * Customer zip code.
	 */
	zipCode: string;
	/**
	 * Additional customer metadata.
	 */
	metadata?: Record<string, object>;
}
