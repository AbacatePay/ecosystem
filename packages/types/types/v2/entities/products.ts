/**
 * https://docs.abacatepay.com/pages/products/reference#estrutura
 */
export interface APIProduct {
	/**
	 * The ID of your product (`prod_...`).
	 */
	id: string;
	/**
	 * Unique product identifier in your system.
	 */
	externalId: string;
	/**
	 * Product name.
	 */
	name: string;
	/**
	 * Product description (`''` when not set).
	 */
	description: string;
	/**
	 * Product image URL.
	 */
	imageUrl: string | null;
	/**
	 * Whether a downloadable file is attached to the product.
	 */
	hasFile: boolean;
	/**
	 * Product price in cents.
	 */
	price: number;
	/**
	 * Product currency.
	 */
	currency: 'BRL';
	/**
	 * Product status.
	 */
	status: ProductStatus;
	/**
	 * Indicates whether the product was created in a testing environment.
	 */
	devMode: boolean;
	/**
	 * Billing cycle of subscription products, `null` for one-time products.
	 *
	 * @see {@link ProductCycle}
	 */
	cycle: ProductCycle | null;
	/**
	 * Free-trial days of subscription products.
	 */
	trialDays: number | null;
	/**
	 * Product creation date.
	 */
	createdAt: string;
	/**
	 * Product update date.
	 */
	updatedAt: string;
}

/**
 * https://docs.abacatepay.com/pages/products/reference#atributos
 */
export enum ProductStatus {
	Active = 'ACTIVE',
	Archived = 'ARCHIVED',
}

/**
 * Billing cycle of a subscription product.
 *
 * https://docs.abacatepay.com/pages/products/reference#atributos
 */
export enum ProductCycle {
	Daily = 'DAILY',
	Weekly = 'WEEKLY',
	Monthly = 'MONTHLY',
	Quarterly = 'QUARTERLY',
	Semiannually = 'SEMIANNUALLY',
	Annually = 'ANNUALLY',
}
