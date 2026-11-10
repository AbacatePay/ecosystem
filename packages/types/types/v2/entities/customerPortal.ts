/**
 * Link to the customer portal, where one customer manages what they bought in one checkout: they sign
 * in with a code sent to their email, see the payments, ask for a refund, cancel the subscription and
 * change the card.
 *
 * https://docs.abacatepay.com/pages/customer-portal/reference
 */
export interface APICustomerPortalLink {
	/**
	 * Unique link identifier.
	 */
	id: string;
	/**
	 * URL of the portal to send to the customer.
	 */
	url: string;
	/**
	 * Customer ID (`cust_...`).
	 */
	customerId: string;
	/**
	 * Checkout ID (`bill_...`).
	 */
	checkoutId: string;
	/**
	 * Indicates whether the link was created in a testing environment.
	 */
	devMode: boolean;
	/**
	 * Link creation date.
	 */
	createdAt: string;
}
