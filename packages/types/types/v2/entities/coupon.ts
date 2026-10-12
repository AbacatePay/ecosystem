/**
 * https://docs.abacatepay.com/pages/coupons/reference#estrutura
 */
export interface APICoupon {
	/**
	 * The coupon code, which is also its identifier.
	 */
	id: string;
	/**
	 * Type of discount applied by the coupon.
	 */
	discountKind: CouponDiscountKind;
	/**
	 * Discount amount. For `PERCENTAGE` it is in basis points (1000 = 10%, max 10000). For `FIXED` it is in cents (e.g. 500 = R$5.00).
	 */
	discount: number;
	/**
	 * Coupon status.
	 */
	status: CouponStatus;
	/**
	 * How many times the coupon can be redeemed, `-1` for unlimited.
	 */
	maxRedeems: number;
	/**
	 * Counter of how many times the coupon has been used by customers.
	 */
	redeemsCount: number;
	/**
	 * Indicates whether the coupon was created in a development (true) or production (false) environment.
	 */
	devMode: boolean;
	/**
	 * Internal notes of the coupon (`''` when not set).
	 */
	notes: string;
	/**
	 * Coupon creation date and time.
	 */
	createdAt: string;
	/**
	 * Coupon last updated date and time.
	 */
	updatedAt: string;
}

/**
 * https://docs.abacatepay.com/pages/coupons/reference#atributos
 */
export enum CouponDiscountKind {
	Percentage = 'PERCENTAGE',
	Fixed = 'FIXED',
}

/**
 * https://docs.abacatepay.com/pages/coupons/reference#atributos
 */
export enum CouponStatus {
	Active = 'ACTIVE',
	Disabled = 'DISABLED',
	Deleted = 'DELETED',
}
