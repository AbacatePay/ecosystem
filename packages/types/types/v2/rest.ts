import type {
	APIBoleto,
	APICheckout,
	APICoupon,
	APICustomer,
	APIPayout,
	APIPixTransfer,
	APIQRCodePIX,
	APIStore,
	APIWebhook,
	CouponDiscountKind,
	PaymentMethod,
	PaymentStatus,
	PixKeyType,
	WebhookEventType,
} from '.';
import type { APIPaymentLink } from './entities/paymentLink';
import type { APIProduct } from './entities/products';
import type {
	APISubscription,
	APISubscriptionPlanChange,
	APISubscriptionUsageRecord,
} from './entities/subscription';

/**
 * Any response returned by the AbacatePay API.
 */
export type APIResponse<Data> =
	| {
			/**
			 * The data of the response.
			 */
			data: Data;
			error: null;
			/**
			 * Whether the request was successful or not.
			 */
			success: true;
	  }
	| {
			data: null;
			/**
			 * Error message returned from the API.
			 */
			error: string;
			/**
			 * Whether the request was successful or not.
			 */
			success: false;
	  };

/**
 * Any response returned by the AbacatePay API that has a `pagination` field (Not cursor based).
 */
export type APIResponseWithPagination<Data> =
	| {
			/**
			 * The data of the response.
			 */
			data: Data;
			error: null;
			/**
			 * Whether the request was successful or not.
			 */
			success: true;
			/**
			 * Pagination info.
			 */
			pagination: {
				/**
				 * Current page.
				 */
				page: number;
				/**
				 * Number of items per page.
				 */
				limit: number;
				/**
				 * Number of items.
				 */
				items: number;
				/**
				 * Number of pages.
				 */
				totalPages: number;
			};
	  }
	| {
			data: null;
			/**
			 * Error message returned from the API.
			 */
			error: string;
			/**
			 * Whether the request was successful or not.
			 */
			success: false;
	  };

/**
 * Any response returned by the AbacatePay API that has a `pagination` field and is cursor-based.
 */
export type APIResponseWithCursorBasedPagination<Data> =
	| {
			/**
			 * The data of the response.
			 */
			data: Data;
			error: null;
			/**
			 * Whether the request was successful or not.
			 */
			success: true;
			/**
			 * Pagination info.
			 */
			pagination: {
				/**
				 * Number of items per page.
				 */
				limit: number;
				/**
				 * Indicates whether there is a next page.
				 */
				hasNext: boolean;
				/**
				 * Indicates whether there is a previous page.
				 */
				hasPrevious: boolean;
				/**
				 * Cursor for the next page.
				 */
				nextCursor: string | null;
			};
	  }
	| {
			data: null;
			/**
			 * Error message returned from the API.
			 */
			error: string;
			/**
			 * Whether the request was successful or not.
			 */
			success: false;
	  };

/**
 * https://api.abacatepay.com/v2/customers/create
 *
 * @reference https://docs.abacatepay.com/pages/client/create
 */
export type RESTPostCreateCustomerBody = Pick<APICustomer, 'email'> &
	Partial<
		Pick<APICustomer, 'name' | 'taxId' | 'zipCode' | 'cellphone' | 'metadata'>
	>;

/**
 * https://api.abacatepay.com/v2/customers/create
 *
 * @reference https://docs.abacatepay.com/pages/client/create
 */
export type RESTPostCreateCustomerData = APIResponse<APICustomer>;

/**
 * https://api.abacatepay.com/v2/checkouts/create
 *
 * @reference https://docs.abacatepay.com/pages/payment/create
 */
export interface RESTPostCreateNewCheckoutBody {
	/**
	 * Payment methods that will be accepted (Defaults to `[PIX, CARD]`).
	 *
	 * @see {@link PaymentMethod}
	 */
	methods?: PaymentMethod[];
	/**
	 * URL to redirect the customer if they click on the "Back" option.
	 */
	returnUrl?: string;
	/**
	 * URL to redirect the customer when payment is completed.
	 */
	completionUrl?: string;
	/**
	 * The ID of a customer already registered in your store.
	 */
	customerId?: string;
	/**
	 * Your customer's data to create it.
	 * The customer object is not mandatory, but when entering any `customer` information, all `name`, `cellphone`, `email` and `taxId` fields are mandatory.
	 */
	customer?: Pick<APICustomer, 'name' | 'email' | 'taxId' | 'cellphone'>;
	/**
	 * List of coupons available for resem used with billing (0-50 max.).
	 */
	coupons?: string[];
	/**
	 * If you have a unique identifier for your billing application, completely optional.
	 */
	externalId?: string;
	/**
	 * Optional billing metadata.
	 */
	metadata?: Record<string, object>;
	/**
	 * List of items included in the charge.
	 * This is the only required field — the total value is calculated from these items.
	 */
	items: APICheckout['items'];
	/**
	 * Billing frequency. Defaults to `ONE_TIME`.
	 */
	frequency?: 'ONE_TIME' | 'MULTIPLE_PAYMENTS' | 'SUBSCRIPTION';
	/**
	 * ID of an additional product offered as an upsell.
	 */
	upSellProductId?: string;
	/**
	 * Late interest configuration (Applies to BOLETO).
	 */
	interest?: {
		/**
		 * Monthly interest rate, in hundredths of a percent.
		 */
		value: number;
	};
	/**
	 * Late fine configuration (Applies to BOLETO).
	 */
	fine?: {
		/**
		 * Fine value.
		 */
		value: number;
		/**
		 * Type of fine applied.
		 */
		type: 'PERCENTAGE' | 'FIXED';
	};
}

/**
 * https://api.abacatepay.com/v2/checkouts/create
 *
 * @reference https://docs.abacatepay.com/pages/payment/create
 */
export type RESTPostCreateNewCheckoutData = APIResponse<APICheckout>;

/**
 * https://api.abacatepay.com/v2/checkouts/refund
 *
 * @reference https://docs.abacatepay.com/pages/payment/refund
 */
export interface RESTPostRefundCheckoutBody {
	/**
	 * Public ID of the resource to refund (prefixes: `bill_`, `char_`, `pix_char_`, `card_`).
	 */
	id: string;
	/**
	 * Refund reason, shown in the transaction history (Max 500 characters).
	 */
	reason?: string;
}

/**
 * https://api.abacatepay.com/v2/checkouts/refund
 *
 * @reference https://docs.abacatepay.com/pages/payment/refund
 */
export type RESTPostRefundCheckoutData = APIResponse<{
	/**
	 * Public ID of the refund transaction that was created.
	 */
	refundPublicId: string;
}>;

/**
 * Inner `data` payload sent to `POST /transparents/create` when `method` is `PIX`.
 *
 * @reference https://docs.abacatepay.com/pages/transparents/create
 */
export interface RESTPostCreateQRCodePixBody
	extends Pick<RESTPostCreateNewCheckoutBody, 'customer' | 'metadata'> {
	/**
	 * Charge amount in cents.
	 */
	amount: number;
	/**
	 * Billing expiration time in seconds.
	 */
	expiresIn?: number;
	/**
	 * Message that will appear when paying the PIX.
	 */
	description?: string;
}

/**
 * https://api.abacatepay.com/v2/transparents/create
 *
 * @reference https://docs.abacatepay.com/pages/transparents/create
 */
export type RESTPostCreateQRCodePixData = APIResponse<APIQRCodePIX>;

/**
 * Inner `data` payload sent to `POST /transparents/create` when `method` is `BOLETO`.
 *
 * @reference https://docs.abacatepay.com/pages/transparents/boleto
 */
export interface RESTPostCreateBoletoBody {
	/**
	 * Charge amount in cents.
	 */
	amount: number;
	/**
	 * Message that will appear on the Boleto.
	 */
	description?: string;
	/**
	 * Customer data. `name` and `taxId` are mandatory for Boleto.
	 */
	customer: Pick<APICustomer, 'name' | 'taxId'> &
		Partial<Pick<APICustomer, 'email' | 'cellphone'>>;
	/**
	 * Optional charge metadata.
	 */
	metadata?: Record<string, object>;
}

/**
 * https://api.abacatepay.com/v2/transparents/create
 *
 * @reference https://docs.abacatepay.com/pages/transparents/boleto
 */
export type RESTPostCreateBoletoData = APIResponse<APIBoleto>;

/**
 * Wire-level request body for `POST /transparents/create` — the SDK builds this
 * from {@link RESTPostCreateQRCodePixBody} / {@link RESTPostCreateBoletoBody}, callers
 * of the SDK never construct it directly.
 *
 * @reference https://docs.abacatepay.com/pages/transparents/reference
 */
export type RESTPostCreateTransparentBody =
	| { method: 'PIX'; data: RESTPostCreateQRCodePixBody }
	| { method: 'BOLETO'; data: RESTPostCreateBoletoBody };

/**
 * https://api.abacatepay.com/v2/transparents/list
 *
 * @reference https://docs.abacatepay.com/pages/transparents/list
 */
export interface RESTGetListTransparentsQueryParams {
	/**
	 * Cursor for the next page.
	 */
	after?: string;
	/**
	 * Cursor for the previous page.
	 */
	before?: string;
	/**
	 * Number of items per page (1-100).
	 *
	 * @default 100
	 */
	limit?: number;
	/**
	 * Filter by QRCode/Boleto identifier.
	 */
	id?: string;
	/**
	 * Filter by status.
	 */
	status?: PaymentStatus;
}

/**
 * https://api.abacatepay.com/v2/transparents/list
 *
 * @reference https://docs.abacatepay.com/pages/transparents/list
 */
export type RESTGetListTransparentsData = APIResponseWithCursorBasedPagination<
	(APIQRCodePIX | APIBoleto)[]
>;

/**
 * https://api.abacatepay.com/v2/transparents/refund
 *
 * @reference https://docs.abacatepay.com/pages/transparents/refund
 */
export interface RESTPostRefundTransparentBody {
	/**
	 * Public ID of the resource to refund (prefixes: `char_`, `pix_char_`, `card_`, `bill_`).
	 */
	id: string;
	/**
	 * Refund reason, shown in the transaction history (Max 500 characters).
	 */
	reason?: string;
}

/**
 * https://api.abacatepay.com/v2/transparents/refund
 *
 * @reference https://docs.abacatepay.com/pages/transparents/refund
 */
export type RESTPostRefundTransparentData = APIResponse<{
	/**
	 * Public ID of the refund transaction that was created.
	 */
	refundPublicId: string;
}>;

/**
 * https://api.abacatepay.com/v2/transparents/simulate-payment
 *
 * @reference https://docs.abacatepay.com/pages/transparents/simulate-payment
 */
export interface RESTPostSimulateQRCodePixPaymentQueryParams {
	/**
	 * QRCode Pix ID.
	 */
	id: string;
}

/**
 * https://api.abacatepay.com/v2/transparents/simulate-payment
 *
 * @reference https://docs.abacatepay.com/pages/transparents/simulate-payment
 */
export interface RESTPostSimulateQRCodePixPaymentBody {
	/**
	 * Optional metadata for the request.
	 */
	metadata?: Record<string, object>;
}

/**
 * https://api.abacatepay.com/v2/transparents/simulate-payment
 *
 * @reference https://docs.abacatepay.com/pages/transparents/simulate-payment
 */
export type RESTPostSimulateQRCodePixPaymentData = APIResponse<APIQRCodePIX>;

/**
 * https://api.abacatepay.com/v2/transparents/check
 *
 * @reference https://docs.abacatepay.com/pages/transparents/check
 */
export interface RESTGetCheckQRCodePixStatusQueryParams {
	/**
	 * QRCode Pix ID.
	 */
	id: string;
}

/**
 * https://api.abacatepay.com/v2/transparents/check
 *
 * @reference https://docs.abacatepay.com/pages/transparents/check
 */
export type RESTGetCheckQRCodePixStatusData = APIResponse<{
	/**
	 * QRCode Pix expiration date.
	 */
	expiresAt: string;
	/**
	 * Information about the progress of QRCode Pix.
	 */
	status: PaymentStatus;
}>;

/**
 * https://api.abacatepay.com/v2/checkouts/list
 *
 * @reference https://docs.abacatepay.com/pages/payment/list
 */
export interface RESTGetListCheckoutsQueryParams {
	/**
	 * Number of the page.
	 *
	 * @default 1
	 */
	page?: number;
	/**
	 * Number of items per page.
	 *
	 * @default 20
	 */
	limit?: number;
}

/**
 * https://api.abacatepay.com/v2/checkouts/list
 *
 * @reference https://docs.abacatepay.com/pages/payment/list
 */
export type RESTGetListCheckoutsData = APIResponseWithPagination<APICheckout[]>;

/**
 * https://api.abacatepay.com/v2/checkouts/get
 *
 * @reference https://docs.abacatepay.com/pages/payment/one
 */
export type RESTGetCheckoutData = APIResponse<APICheckout>;

/**
 * https://api.abacatepay.com/v2/checkouts/get
 *
 * @reference https://docs.abacatepay.com/pages/payment/one
 */
export interface RESTGetCheckoutQueryParams {
	/**
	 * Unique billing identifier.
	 */
	id: string;
}

/**
 * https://api.abacatepay.com/v2/payment-links/create
 *
 * @reference https://docs.abacatepay.com/pages/payment-links/create
 */
export type RESTPostCreatePaymentLinkBody = Omit<
	RESTPostCreateNewCheckoutBody,
	'customerId' | 'customer' | 'frequency' | 'upSellProductId'
>;

/**
 * https://api.abacatepay.com/v2/payment-links/create
 *
 * @reference https://docs.abacatepay.com/pages/payment-links/create
 */
export type RESTPostCreatePaymentLinkData = APIResponse<APIPaymentLink>;

/**
 * https://api.abacatepay.com/v2/payment-links/list
 *
 * @reference https://docs.abacatepay.com/pages/payment-links/list
 */
export interface RESTGetListPaymentLinksQueryParams {
	/**
	 * Number of the page.
	 *
	 * @default 1
	 */
	page?: number;
	/**
	 * Number of items per page.
	 *
	 * @default 20
	 */
	limit?: number;
}

/**
 * https://api.abacatepay.com/v2/payment-links/list
 *
 * @reference https://docs.abacatepay.com/pages/payment-links/list
 */
export type RESTGetListPaymentLinksData = APIResponseWithPagination<
	APIPaymentLink[]
>;

/**
 * https://api.abacatepay.com/v2/payment-links/one
 *
 * @reference https://docs.abacatepay.com/pages/payment-links/one
 */
export interface RESTGetPaymentLinkQueryParams {
	/**
	 * Unique payment link identifier.
	 */
	id: string;
}

/**
 * https://api.abacatepay.com/v2/payment-links/one
 *
 * @reference https://docs.abacatepay.com/pages/payment-links/one
 */
export type RESTGetPaymentLinkData = APIResponse<APIPaymentLink>;

/**
 * https://api.abacatepay.com/v2/payment-links/refund
 *
 * @reference https://docs.abacatepay.com/pages/payment-links/refund
 */
export interface RESTPostRefundPaymentLinkBody {
	/**
	 * Public ID of the resource to refund.
	 */
	id: string;
	/**
	 * Refund reason, shown in the transaction history (Max 500 characters).
	 */
	reason?: string;
}

/**
 * https://api.abacatepay.com/v2/payment-links/refund
 *
 * @reference https://docs.abacatepay.com/pages/payment-links/refund
 */
export type RESTPostRefundPaymentLinkData = APIResponse<{
	/**
	 * Public ID of the refund transaction that was created.
	 */
	refundPublicId: string;
}>;

/**
 * https://api.abacatepay.com/v2/customers/list
 *
 * @reference https://docs.abacatepay.com/pages/client/list
 */
export type RESTGetListCustomersData = APIResponseWithPagination<APICustomer[]>;

/**
 * https://api.abacatepay.com/v2/customers/list
 *
 * @reference https://docs.abacatepay.com/pages/client/list
 */
export interface RESTGetListCustomersQueryParams {
	/**
	 * Number of the page.
	 */
	page?: number;
	/**
	 * Number of items per page.
	 */
	limit?: number;
}

/**
 * https://api.abacatepay.com/v2/customers/get
 *
 * @reference https://docs.abacatepay.com/pages/client/get
 */
export interface RESTGetCustomerQueryParams {
	/**
	 * The ID of the customer.
	 */
	id: string;
}

/**
 * https://api.abacatepay.com/v2/customers/get
 *
 * @reference https://docs.abacatepay.com/pages/client/get
 */
export type RESTGetCustomerData = APIResponse<
	Omit<APICustomer, 'country' | 'zipCode'>
>;

/**
 * https://api.abacatepay.com/v2/customers/delete
 *
 * @reference https://docs.abacatepay.com/pages/client/delete
 */
export interface RESTDeleteCustomerBody {
	/**
	 * Unique public identifier of the customer to be deleted.
	 */
	id: string;
}

/**
 * https://api.abacatepay.com/v2/customers/delete
 *
 * @reference https://docs.abacatepay.com/pages/client/delete
 */
export type RESTDeleteCustomerData = APIResponse<
	Omit<APICustomer, 'country' | 'zipCode'>
>;

/**
 * https://api.abacatepay.com/v2/coupons/create
 *
 * @reference https://docs.abacatepay.com/pages/coupons/create
 */
export interface RESTPostCreateCouponBody {
	/**
	 * Unique coupon identifier.
	 *
	 * @example "DEYVIN_20"
	 */
	code: string;
	/**
	 * Discount amount to be applied.
	 */
	discount: number;
	/**
	 * Type of discount applied, percentage or fixed.
	 *
	 * @see {@link CouponDiscountKind}
	 */
	discountKind: CouponDiscountKind;
	/**
	 * Coupon description.
	 */
	notes?: string;
	/**
	 * Number of times the coupon can be redeemed. -1 means this coupon can be redeemed without limits.
	 *
	 * @default -1
	 */
	maxRedeems?: number;
	/**
	 * Key value object for coupon metadata.
	 */
	metadata?: Record<string, unknown>;
}

/**
 * https://api.abacatepay.com/v2/coupons/create
 *
 * @reference https://docs.abacatepay.com/pages/coupons/create
 */
export type RESTPostCreateCouponData = APIResponse<APICoupon>;

/**
 * https://api.abacatepay.com/v2/payouts/create
 *
 * @reference https://docs.abacatepay.com/pages/payouts/create
 */
export interface RESTPostCreateNewPayoutBody {
	/**
	 * Unique identifier of the payout in your system.
	 */
	externalId: string;
	/**
	 * Payout value in cents (Min 350).
	 */
	amount: number;
	/**
	 * Optional payout description.
	 */
	description?: string;
}

/**
 * https://api.abacatepay.com/v2/payouts/create
 *
 * @reference https://docs.abacatepay.com/pages/payouts/create
 */
export type RESTPostCreateNewWPayoutData = APIResponse<APIPayout>;

/**
 * https://api.abacatepay.com/v2/payouts/get
 *
 * @reference https://docs.abacatepay.com/pages/payouts/get
 */
export interface RESTGetSearchPayoutQueryParams {
	/**
	 * Unique payout identifier in your system.
	 */
	externalId: string;
}

/**
 * https://api.abacatepay.com/v2/payouts/get
 *
 * @reference https://docs.abacatepay.com/pages/payouts/get
 */
export type RESTGetSearchPayoutData = APIResponse<APIPayout>;

/**
 * https://api.abacatepay.com/v2/payouts/list
 *
 * @reference https://docs.abacatepay.com/pages/payouts/list
 */
export interface RESTGetListPayoutsQueryParams {
	/**
	 * Number of the page.
	 *
	 * @default 1
	 */
	page?: number;
	/**
	 * Number of items per page.
	 *
	 * @default 20
	 */
	limit?: number;
}

/**
 * https://api.abacatepay.com/v2/payouts/list
 *
 * @reference https://docs.abacatepay.com/pages/payouts/list
 */
export type RESTGetListPayoutsData = APIResponseWithPagination<APIPayout[]>;

/**
 * https://api.abacatepay.com/v2/pix/send
 *
 * @reference https://docs.abacatepay.com/pages/pix/create
 */
export interface RESTPostSendPixTransferBody {
	/**
	 * Transfer amount in cents (Min 100).
	 */
	amount: number;
	/**
	 * Unique identifier of the transfer in your system.
	 */
	externalId: string;
	/**
	 * Optional transfer description.
	 */
	description?: string;
	/**
	 * Destination PIX key.
	 */
	pix: {
		/**
		 * The PIX key itself.
		 */
		key: string;
		/**
		 * Type of the PIX key.
		 *
		 * @see {@link PixKeyType}
		 */
		type: PixKeyType;
	};
}

/**
 * https://api.abacatepay.com/v2/pix/send
 *
 * @reference https://docs.abacatepay.com/pages/pix/create
 */
export type RESTPostSendPixTransferData = APIResponse<APIPixTransfer>;

/**
 * https://api.abacatepay.com/v2/pix/get
 *
 * @reference https://docs.abacatepay.com/pages/pix/get
 */
export interface RESTGetPixTransferQueryParams {
	/**
	 * Unique transfer identifier in AbacatePay. At least one of `id`/`externalId` is required.
	 */
	id?: string;
	/**
	 * Unique transfer identifier in your system. At least one of `id`/`externalId` is required.
	 */
	externalId?: string;
}

/**
 * https://api.abacatepay.com/v2/pix/get
 *
 * @reference https://docs.abacatepay.com/pages/pix/get
 */
export type RESTGetPixTransferData = APIResponse<APIPixTransfer>;

/**
 * https://api.abacatepay.com/v2/pix/list
 *
 * @reference https://docs.abacatepay.com/pages/pix/list
 */
export interface RESTGetListPixTransfersQueryParams {
	/**
	 * Number of items per page (1-100).
	 *
	 * @default 100
	 */
	limit?: number;
	/**
	 * Cursor for the next page.
	 */
	after?: string;
	/**
	 * Cursor for the previous page.
	 */
	before?: string;
	/**
	 * Filter by AbacatePay transaction ID.
	 */
	id?: string;
	/**
	 * Filter by external system ID.
	 */
	externalId?: string;
	/**
	 * Filter by transaction status.
	 */
	status?: string;
}

/**
 * https://api.abacatepay.com/v2/pix/list
 *
 * @reference https://docs.abacatepay.com/pages/pix/list
 */
export type RESTGetListPixTransfersData = APIResponseWithCursorBasedPagination<
	APIPixTransfer[]
>;

/**
 * https://api.abacatepay.com/v2/public-mrr/revenue
 *
 * @reference https://docs.abacatepay.com/pages/trustMRR/list
 */
export interface RESTGetRevenueByPeriodQueryParams {
	/**
	 * Period start date (YYYY-MM-DD format).
	 */
	startDate: string;
	/**
	 * Period end date (YYYY-MM-DD format).
	 */
	endDate: string;
}

/**
 * https://api.abacatepay.com/v2/public-mrr/revenue
 *
 * @reference https://docs.abacatepay.com/pages/trustMRR/list
 */
export type RESTGetRevenueByPeriodData = APIResponse<{
	/**
	 * Total revenue for the period in cents.
	 */
	totalRevenue: number;
	/**
	 * Total transactions in the period.
	 */
	totalTransactions: number;
	/**
	 * Object with transactions grouped by day (key is the date in YYYY-MM-DD format).
	 */
	transactionsPerDay: Record<
		string,
		{
			/**
			 * Total value of the day's transactions in cents.
			 */
			amount: number;
			/**
			 * Number of transactions for the day.
			 */
			count: number;
		}
	>;
}>;

/**
 * https://api.abacatepay.com/v2/public-mrr/merchant-info
 *
 * @reference https://docs.abacatepay.com/pages/trustMRR/get
 */
export type RESTGetMerchantData = APIResponse<{
	/**
	 * Store name.
	 */
	name: string;
	/**
	 * Store website.
	 */
	website: string;
	/**
	 * Store creation date.
	 */
	createdAt: string;
}>;

/**
 * https://api.abacatepay.com/v2/public-mrr/mrr
 *
 * @reference https://docs.abacatepay.com/pages/trustMRR/mrr
 */
export type RESTGetMRRData = APIResponse<{
	/**
	 * Monthly recurring revenue in cents. Value 0 indicates that there is no recurring revenue at the moment.
	 */
	mrr: number;
	/**
	 * Total active subscriptions. Value 0 indicates that there are no currently active subscriptions.
	 */
	totalActiveSubscriptions: number;
}>;

/**
 * https://api.abacatepay.com/v2/store/get
 *
 * @reference https://docs.abacatepay.com/pages/store/get
 */
export type RESTGetStoreDetailsData = APIResponse<APIStore>;

/**
 * https://api.abacatepay.com/v2/coupons/list
 *
 * @reference https://docs.abacatepay.com/pages/coupons/list
 */
export type RESTGetListCouponsData = APIResponseWithPagination<APICoupon[]>;

/**
 * https://api.abacatepay.com/v2/coupons/list
 *
 * @reference https://docs.abacatepay.com/pages/coupons/list
 */
export interface RESTGetListCouponsQueryParams {
	/**
	 * Page number.
	 *
	 * @default 1
	 */
	page?: number;
	/**
	 * Number of items per page.
	 */
	limit?: number;
}

/**
 * https://api.abacatepay.com/v2/coupons/get
 *
 * @reference https://docs.abacatepay.com/pages/coupons/get
 */
export interface RESTGetCouponQueryParams {
	/**
	 * The ID of the coupon.
	 */
	id: string;
}

/**
 * https://api.abacatepay.com/v2/coupons/get
 *
 * @reference https://docs.abacatepay.com/pages/coupons/get
 */
export type RESTGetCouponData = APIResponse<APICoupon>;

/**
 * https://api.abacatepay.com/v2/coupons/delete
 *
 * @reference https://docs.abacatepay.com/pages/coupons/delete
 */
export interface RESTDeleteCouponBody {
	/**
	 * The ID of the coupon.
	 */
	id: string;
}

/**
 * https://api.abacatepay.com/v2/coupons/delete
 *
 * @reference https://docs.abacatepay.com/pages/coupons/delete
 */
export type RESTDeleteCouponData = APIResponse<APICoupon>;

/**
 * https://api.abacatepay.com/v2/coupons/toggle
 *
 * @reference https://docs.abacatepay.com/pages/coupons/toggle
 */
export interface RESTPostToggleCouponStatusBody {
	/**
	 * The ID of the coupon.
	 */
	id: string;
}

/**
 * https://api.abacatepay.com/v2/coupons/toggle
 *
 * @reference https://docs.abacatepay.com/pages/coupons/toggle
 */
export type RESTPostToggleCouponStatusData = APIResponse<APICoupon>;

/**
 * https://api.abacatepay.com/v2/products/create
 *
 * @reference https://docs.abacatepay.com/pages/products/create
 */
export interface RESTPostCreateProductBody
	extends Pick<APIProduct, 'externalId' | 'name' | 'price' | 'currency'> {
	/**
	 * Description for the product.
	 */
	description?: string;
}

/**
 * https://api.abacatepay.com/v2/products/create
 *
 * @reference https://docs.abacatepay.com/pages/products/create
 */
export type RESTPostCreateProductData = APIResponse<APIProduct>;

/**
 * https://api.abacatepay.com/v2/products/list
 *
 * @reference https://docs.abacatepay.com/pages/products/list
 */
export interface RESTGetListProductsQueryParams {
	/**
	 * Page number.
	 */
	page?: number;
	/**
	 * Limit of products to return.
	 */
	limit?: number;
}

/**
 * https://api.abacatepay.com/v2/products/list
 *
 * @reference https://docs.abacatepay.com/pages/products/list
 */
export type RESTGetListProductsData = APIResponseWithPagination<APIProduct[]>;

/**
 * https://api.abacatepay.com/v2/products/get
 *
 * @reference https://docs.abacatepay.com/pages/products/get
 */
export interface RESTGetProductQueryParams {
	/**
	 * The product ID.
	 */
	id?: string;
	/**
	 * External ID of the product.
	 */
	externalId?: string;
}

/**
 * https://api.abacatepay.com/v2/products/get
 *
 * @reference https://docs.abacatepay.com/pages/products/get
 */
export type RESTGetProductData = APIResponse<APIProduct>;

/**
 * https://api.abacatepay.com/v2/products/delete
 *
 * @reference https://docs.abacatepay.com/pages/products/delete
 */
export interface RESTDeleteProductQueryParams {
	/**
	 * The product ID.
	 */
	id: string;
}

/**
 * https://api.abacatepay.com/v2/products/delete
 *
 * @reference https://docs.abacatepay.com/pages/products/delete
 */
export type RESTDeleteProductData = APIResponse<APIProduct>;

/**
 * https://api.abacatepay.com/v2/subscriptions/create
 *
 * @reference https://docs.abacatepay.com/pages/subscriptions/create
 */
export interface RESTPostCreateSubscriptionBody
	extends Pick<
		APISubscription,
		| 'amount'
		| 'name'
		| 'externalId'
		| 'method'
		| 'frequency'
		| 'customerId'
		| 'retryPolicy'
	> {
	/**
	 * Subscription description.
	 */
	description?: string;
}

/**
 * https://api.abacatepay.com/v2/subscriptions/create
 *
 * @reference https://docs.abacatepay.com/pages/subscriptions/create
 */
export type RESTPostCreateSubscriptionData = APIResponse<APISubscription>;

/**
 * https://api.abacatepay.com/v2/subscriptions/list
 *
 * @reference https://docs.abacatepay.com/pages/subscriptions/list
 */
export interface RESTGetListSubscriptionsQueryParams {
	/**
	 * Cursor for the pagination.
	 */
	cursor?: string;
	/**
	 * Number of items per page.
	 *
	 * @default 20
	 */
	limit?: number;
}

/**
 * https://api.abacatepay.com/v2/subscriptions/list
 *
 * @reference https://docs.abacatepay.com/pages/subscriptions/list
 */
export type RESTGetListSubscriptionsData = APIResponseWithCursorBasedPagination<
	APISubscription[]
>;

/**
 * https://api.abacatepay.com/v2/subscriptions/cancel
 *
 * @reference https://docs.abacatepay.com/pages/subscriptions/cancel
 */
export interface RESTPostCancelSubscriptionBody {
	/**
	 * Unique subscription identifier.
	 */
	id: string;
}

/**
 * Cancellation is immediate (`cancelPolicy: NOW`) — there is no grace period.
 *
 * @reference https://docs.abacatepay.com/pages/subscriptions/cancel
 */
export type RESTPostCancelSubscriptionData = APIResponse<APISubscription>;

/**
 * https://api.abacatepay.com/v2/subscriptions/change-plan
 *
 * @reference https://docs.abacatepay.com/pages/subscriptions/change-plan
 */
export interface RESTPostChangeSubscriptionPlanBody {
	/**
	 * Unique subscription identifier.
	 */
	id: string;
	/**
	 * ID of the new product. It must have a billing cycle configured.
	 */
	productId: string;
	/**
	 * New quantity for the product.
	 */
	quantity: number;
}

/**
 * Only one `PENDING` change can exist per subscription — calling this again
 * replaces the prior unapplied change. The change is applied at the next
 * billing cycle.
 *
 * @reference https://docs.abacatepay.com/pages/subscriptions/change-plan
 */
export type RESTPostChangeSubscriptionPlanData =
	APIResponse<APISubscriptionPlanChange>;

/**
 * https://api.abacatepay.com/v2/subscriptions/record-usage
 *
 * @reference https://docs.abacatepay.com/pages/subscriptions/record-usage
 */
export interface RESTPostRecordSubscriptionUsageBody {
	/**
	 * Unique subscription identifier.
	 */
	id: string;
	/**
	 * ID of the pay-as-you-go product (Must not have a billing cycle).
	 */
	productId: string;
	/**
	 * Number of units to record.
	 */
	units: number;
	/**
	 * Whether to add or subtract the units from the current cycle.
	 */
	action: 'add' | 'subtract';
}

/**
 * https://api.abacatepay.com/v2/subscriptions/record-usage
 *
 * @reference https://docs.abacatepay.com/pages/subscriptions/record-usage
 */
export type RESTPostRecordSubscriptionUsageData =
	APIResponse<APISubscriptionUsageRecord>;

/**
 * https://api.abacatepay.com/v2/webhooks/create
 *
 * @reference https://docs.abacatepay.com/pages/webhooks/create
 */
export interface RESTPostCreateWebhookBody {
	/**
	 * Webhook name, for your own identification.
	 */
	name: string;
	/**
	 * HTTPS endpoint that will receive the events.
	 */
	endpoint: string;
	/**
	 * Secret used to sign the payloads sent to `endpoint`.
	 */
	secret: string;
	/**
	 * Event types this webhook should be notified about.
	 *
	 * @see {@link WebhookEventType}
	 */
	events: WebhookEventType[];
}

/**
 * https://api.abacatepay.com/v2/webhooks/create
 *
 * @reference https://docs.abacatepay.com/pages/webhooks/create
 */
export type RESTPostCreateWebhookData = APIResponse<APIWebhook>;

/**
 * https://api.abacatepay.com/v2/webhooks/list
 *
 * @reference https://docs.abacatepay.com/pages/webhooks/list
 */
export interface RESTGetListWebhooksQueryParams {
	/**
	 * Search by webhook name, ID, or endpoint.
	 */
	search?: string;
	/**
	 * Cursor for the next page.
	 */
	after?: string;
	/**
	 * Cursor for the previous page.
	 */
	before?: string;
	/**
	 * Number of items per page (1-100).
	 *
	 * @default 100
	 */
	limit?: number;
	/**
	 * Filter by a specific webhook ID.
	 */
	id?: string;
}

/**
 * https://api.abacatepay.com/v2/webhooks/list
 *
 * @reference https://docs.abacatepay.com/pages/webhooks/list
 */
export type RESTGetListWebhooksData = APIResponseWithCursorBasedPagination<
	APIWebhook[]
>;

/**
 * https://api.abacatepay.com/v2/webhooks/get
 *
 * @reference https://docs.abacatepay.com/pages/webhooks/get
 */
export interface RESTGetWebhookQueryParams {
	/**
	 * Unique webhook identifier.
	 */
	id: string;
}

/**
 * https://api.abacatepay.com/v2/webhooks/get
 *
 * @reference https://docs.abacatepay.com/pages/webhooks/get
 */
export type RESTGetWebhookData = APIResponse<APIWebhook>;

/**
 * https://api.abacatepay.com/v2/webhooks/delete
 *
 * @reference https://docs.abacatepay.com/pages/webhooks/delete
 */
export interface RESTPostDeleteWebhookBody {
	/**
	 * Unique webhook identifier.
	 */
	id: string;
}

/**
 * https://api.abacatepay.com/v2/webhooks/delete
 *
 * @reference https://docs.abacatepay.com/pages/webhooks/delete
 */
export type RESTPostDeleteWebhookData = APIResponse<APIWebhook>;
