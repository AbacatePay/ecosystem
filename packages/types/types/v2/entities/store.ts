/**
 * https://docs.abacatepay.com/pages/store/reference#estrutura
 */
export interface APIStore {
	/**
	 * Unique identifier for your store on AbacatePay.
	 */
	id: string;
	/**
	 * Name of your store/company.
	 *
	 * @example "Minha Loja Online"
	 */
	name: string;
	/**
	 * Object containing information about your account balances.
	 *
	 * @remarks All balance values ​​are returned in cents. To convert to Reais, divide by 100. For example: 15000 cents = R$150.00.
	 */
	balance: {
		/**
		 * Balance available for withdrawal in cents.
		 */
		available: number;
		/**
		 * Balance pending confirmation in cents.
		 */
		pending: number;
		/**
		 * Balance blocked in disputes in cents.
		 *
		 * @remarks The blocked balance represents amounts that are in dispute or under review. These amounts are not available for withdrawal until the situation is resolved.
		 */
		blocked: number;
	};
}
