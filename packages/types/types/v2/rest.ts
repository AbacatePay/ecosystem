import type { APIBankStatementItem } from './entities/bankStatement';
import type {
	APIBoletoFine,
	APIBoletoInterest,
	APICheckout,
	APICheckoutItem,
	APISubscriptionCheckout,
	CheckoutStatus,
	PaymentMethod,
} from './entities/checkout';
import type {
	APICoupon,
	CouponDiscountKind,
	CouponStatus,
} from './entities/coupon';
import type { APICustomer, APICustomerAddress } from './entities/customer';
import type { APIPaymentLink } from './entities/paymentLink';
import type { APIPayout } from './entities/payout';
import type {
	APIBoleto,
	APIPixTransfer,
	APIQRCodePIX,
	PixKeyType,
} from './entities/pix';
import type {
	APIProduct,
	ProductCycle,
	ProductStatus,
} from './entities/products';
import type { APIRefund } from './entities/refund';
import type {
	APIReport,
	APIReportSpec,
	ReportId,
	SnapshotReportId,
} from './entities/report';
import type { APIStore } from './entities/store';
import type {
	APISubscription,
	APISubscriptionPlanChange,
	APISubscriptionUsageRecord,
	SubscriptionStatus,
} from './entities/subscription';
import type {
	TransactionKind,
	TransactionMethod,
	TransactionStatus,
} from './entities/transaction';
import type {
	APICardTransparent,
	APITransparent,
	APITransparentUTM,
	TransparentMethod,
	TransparentStatus,
} from './entities/transparent';
import type {
	APIWebhook,
	WebhookEventType,
	WebhookV1EventName,
} from './webhook';

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
 * Cursor pagination info returned by every v2 list endpoint, as a sibling of `data`.
 *
 * To read every page, send `pagination.next` as `after` until it is `null`. Do not rely on
 * `hasMore` alone: part of the API traffic is served by an implementation where `hasMore`
 * is also `true` when only newer items exist.
 */
export interface APICursorPagination {
	/**
	 * Whether there are more items. Prefer checking `next !== null`.
	 */
	hasMore: boolean;
	/**
	 * ID of the last item of this page. Send it as `after` to get the next (older) page. `null` when there is none.
	 */
	next: string | null;
	/**
	 * ID of the first item of this page. Send it as `before` to get the previous (newer) page. `null` when there is none.
	 */
	before: string | null;
}

/**
 * Any response returned by a v2 list endpoint (Cursor-based pagination).
 *
 * @see {@link APICursorPagination}
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
			pagination: APICursorPagination;
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
 * @deprecated The v2 API has no page-based pagination. This is an alias of {@link APIResponseWithCursorBasedPagination}.
 */
export type APIResponseWithPagination<Data> =
	APIResponseWithCursorBasedPagination<Data>;

/**
 * Query parameters accepted by every v2 list endpoint (except `/pix/list`).
 * Items are always sorted from the newest to the oldest.
 */
export interface RESTCursorPaginationQueryParams {
	/**
	 * Returns the items created before this item ID (Send `pagination.next` here).
	 */
	after?: string;
	/**
	 * Returns the items created after this item ID (Send `pagination.before` here).
	 */
	before?: string;
	/**
	 * Number of items per page (1-100).
	 *
	 * @default 100
	 */
	limit?: number;
	/**
	 * Only items created on or after this day (`YYYY-MM-DD`, America/Sao_Paulo, not before `2024-01-01`).
	 */
	startDate?: string;
	/**
	 * Only items created on or before this day (`YYYY-MM-DD`, America/Sao_Paulo).
	 */
	endDate?: string;
}

/**
 * Requires at least one of the keys of `Type`.
 */
export type AtLeastOne<Type> = {
	[Key in keyof Type]-?: Required<Pick<Type, Key>> & Partial<Omit<Type, Key>>;
}[keyof Type];

/**
 * `Omit` that distributes over unions.
 */
export type DistributiveOmit<
	Type,
	Key extends PropertyKey,
> = Type extends unknown ? Omit<Type, Key> : never;

/**
 * https://api.abacatepay.com/v2/customers/create
 *
 * Customers are de-duplicated by taxId, email and cellphone: when one already exists it is returned (Merged) instead of a new one.
 *
 * @reference https://docs.abacatepay.com/pages/client/create
 */
export interface RESTPostCreateCustomerBody {
	/**
	 * Customer's email.
	 */
	email: string;
	/**
	 * CPF or CNPJ, with or without punctuation (Check digits are validated).
	 */
	taxId?: string;
	/**
	 * Customer's full name.
	 */
	name?: string;
	/**
	 * Customer's cell phone.
	 */
	cellphone?: string;
	/**
	 * Customer zip code.
	 */
	zipCode?: string;
}

/**
 * https://api.abacatepay.com/v2/customers/create
 *
 * @reference https://docs.abacatepay.com/pages/client/create
 */
export type RESTPostCreateCustomerData = APIResponse<APICustomer>;

/**
 * https://api.abacatepay.com/v2/customers/list
 *
 * @reference https://docs.abacatepay.com/pages/client/list
 */
export interface RESTGetListCustomersQueryParams
	extends RESTCursorPaginationQueryParams {
	/**
	 * Filter by customer ID.
	 */
	id?: string;
	/**
	 * Case-insensitive partial match on the email.
	 */
	email?: string;
	/**
	 * Case-insensitive partial match on the name.
	 */
	name?: string;
	/**
	 * Partial match on the CPF/CNPJ (Stored as digits).
	 */
	taxId?: string;
	/**
	 * Partial match on the cell phone (Stored as digits).
	 */
	cellphone?: string;
}

/**
 * https://api.abacatepay.com/v2/customers/list
 *
 * @reference https://docs.abacatepay.com/pages/client/list
 */
export type RESTGetListCustomersData = APIResponseWithCursorBasedPagination<
	APICustomer[]
>;

/**
 * https://api.abacatepay.com/v2/customers/get
 *
 * At least one of `id`, `email` or `taxId` is required; they are combined with AND.
 *
 * @reference https://docs.abacatepay.com/pages/client/get
 */
export type RESTGetCustomerQueryParams = AtLeastOne<{
	/**
	 * The ID of the customer.
	 */
	id: string;
	/**
	 * Customer's email.
	 */
	email: string;
	/**
	 * Customer's CPF or CNPJ.
	 */
	taxId: string;
}>;

/**
 * https://api.abacatepay.com/v2/customers/get
 *
 * @reference https://docs.abacatepay.com/pages/client/get
 */
export type RESTGetCustomerData = APIResponse<APICustomer>;

/**
 * https://api.abacatepay.com/v2/customers/delete
 *
 * @reference https://docs.abacatepay.com/pages/client/delete
 */
export interface RESTPostDeleteCustomerQueryParams {
	/**
	 * Unique public identifier of the customer to be deleted.
	 */
	id: string;
}

/**
 * https://api.abacatepay.com/v2/customers/delete
 *
 * @deprecated The ID is sent in the query string. Use {@link RESTPostDeleteCustomerQueryParams}.
 */
export type RESTDeleteCustomerBody = RESTPostDeleteCustomerQueryParams;

/**
 * https://api.abacatepay.com/v2/customers/delete
 *
 * @reference https://docs.abacatepay.com/pages/client/delete
 */
export type RESTPostDeleteCustomerData = APIResponse<APICustomer>;

/**
 * https://api.abacatepay.com/v2/customers/delete
 *
 * @deprecated Use {@link RESTPostDeleteCustomerData}.
 */
export type RESTDeleteCustomerData = RESTPostDeleteCustomerData;

/**
 * https://api.abacatepay.com/v2/checkouts/create
 *
 * @reference https://docs.abacatepay.com/pages/payment/create
 */
export interface RESTPostCreateNewCheckoutBody {
	/**
	 * Products being sold. `id` accepts the product ID or its `externalId`.
	 * Always send `quantity`: the API does not apply its default.
	 */
	items: APICheckoutItem[];
	/**
	 * Payment methods that will be accepted (Defaults to `[PIX, CARD]`, so CARD must be enabled for your store when omitted).
	 *
	 * @see {@link PaymentMethod}
	 */
	methods?: PaymentMethod[];
	/**
	 * The ID of a customer already registered in your store.
	 */
	customerId?: string;
	/**
	 * Your identifier for this checkout. When a checkout with this `externalId` already exists, it is returned unchanged.
	 */
	externalId?: string;
	/**
	 * URL to redirect the customer if they click on the "Back" option.
	 */
	returnUrl?: string;
	/**
	 * URL to redirect the customer when payment is completed.
	 */
	completionUrl?: string;
	/**
	 * Coupon codes the customer may use (Max 50).
	 */
	coupons?: string[];
	/**
	 * Card configuration. Requires `CARD` in `methods`.
	 */
	card?: {
		/**
		 * Maximum number of installments (1-12). Each installment must be at least R$10.
		 */
		maxInstallments: number;
	};
	/**
	 * ID (Or `externalId`) of an active product without billing cycle offered as an upsell.
	 */
	upSellProductId?: string;
	/**
	 * Late interest configuration. Requires `BOLETO` in `methods`.
	 */
	interest?: APIBoletoInterest;
	/**
	 * Late fine configuration. Requires `BOLETO` in `methods`.
	 */
	fine?: APIBoletoFine;
	/**
	 * Boleto due date (`YYYY-MM-DD`, up to 365 days ahead). Requires `BOLETO` in `methods`.
	 */
	dueDate?: string;
	/**
	 * Optional billing metadata, returned as-is.
	 */
	metadata?: Record<string, unknown>;
}

/**
 * https://api.abacatepay.com/v2/checkouts/create
 *
 * @reference https://docs.abacatepay.com/pages/payment/create
 */
export type RESTPostCreateNewCheckoutData = APIResponse<APICheckout>;

/**
 * https://api.abacatepay.com/v2/checkouts/list
 *
 * @reference https://docs.abacatepay.com/pages/payment/list
 */
export interface RESTGetListCheckoutsQueryParams
	extends RESTCursorPaginationQueryParams {
	/**
	 * Filter by checkout ID.
	 */
	id?: string;
	/**
	 * Case-insensitive partial match on the checkout ID or on the customer email.
	 */
	keyword?: string;
	/**
	 * Filter by status.
	 */
	status?: CheckoutStatus;
	/**
	 * Filter by customer ID (`cust_...`).
	 */
	customerId?: string;
	/**
	 * Filter by your `externalId`.
	 */
	externalId?: string;
	/**
	 * Only checkouts that accept this payment method.
	 */
	method?: PaymentMethod | 'CRYPTO';
}

/**
 * https://api.abacatepay.com/v2/checkouts/list
 *
 * @reference https://docs.abacatepay.com/pages/payment/list
 */
export type RESTGetListCheckoutsData = APIResponseWithCursorBasedPagination<
	APICheckout[]
>;

/**
 * https://api.abacatepay.com/v2/checkouts/get
 *
 * At least one of `id`, `externalId` or `customerId` is required.
 *
 * @reference https://docs.abacatepay.com/pages/payment/one
 */
export type RESTGetCheckoutQueryParams = AtLeastOne<{
	/**
	 * Unique billing identifier (`bill_...`).
	 */
	id: string;
	/**
	 * Your `externalId` for the checkout.
	 */
	externalId: string;
	/**
	 * Customer ID (`cust_...`).
	 */
	customerId: string;
}> & {
	/**
	 * Only checkouts that accept this payment method.
	 */
	method?: PaymentMethod | 'CRYPTO';
};

/**
 * https://api.abacatepay.com/v2/checkouts/get
 *
 * @reference https://docs.abacatepay.com/pages/payment/one
 */
export type RESTGetCheckoutData = APIResponse<APICheckout>;

/**
 * https://api.abacatepay.com/v2/checkouts/delete
 *
 * @reference https://docs.abacatepay.com/pages/payment/reference
 */
export interface RESTPostDeleteCheckoutQueryParams {
	/**
	 * Checkout ID (`bill_...`).
	 */
	id: string;
}

/**
 * https://api.abacatepay.com/v2/checkouts/delete
 *
 * @reference https://docs.abacatepay.com/pages/payment/reference
 */
export type RESTPostDeleteCheckoutData = APIResponse<APICheckout>;

/**
 * https://api.abacatepay.com/v2/checkouts/refund
 *
 * @reference https://docs.abacatepay.com/pages/payment/refund
 */
export interface RESTPostRefundCheckoutBody {
	/**
	 * Checkout ID (`bill_...`) or the ID of one of its charges (`char_`, `pix_char_`, `card_`).
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
export type RESTPostRefundCheckoutData = APIResponse<APIRefund>;

/**
 * https://api.abacatepay.com/v2/payment-links/create
 *
 * Payment links do not accept a `customerId`, card installments or Google/Apple Pay.
 *
 * @reference https://docs.abacatepay.com/pages/payment-links/create
 */
export type RESTPostCreatePaymentLinkBody = Omit<
	RESTPostCreateNewCheckoutBody,
	'customerId' | 'methods' | 'card'
> & {
	/**
	 * Payment methods that will be accepted (Defaults to `[PIX, CARD]`).
	 */
	methods?: (PaymentMethod.Pix | PaymentMethod.Card | PaymentMethod.Boleto)[];
	/**
	 * Card configuration. Payment links do not support installments.
	 */
	card?: {
		/**
		 * Must be `1`.
		 */
		maxInstallments: 1;
	};
};

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
export type RESTGetListPaymentLinksQueryParams =
	RESTGetListCheckoutsQueryParams;

/**
 * https://api.abacatepay.com/v2/payment-links/list
 *
 * @reference https://docs.abacatepay.com/pages/payment-links/list
 */
export type RESTGetListPaymentLinksData = APIResponseWithCursorBasedPagination<
	APIPaymentLink[]
>;

/**
 * https://api.abacatepay.com/v2/payment-links/get
 *
 * At least one of `id`, `externalId` or `customerId` is required.
 *
 * @reference https://docs.abacatepay.com/pages/payment-links/one
 */
export type RESTGetPaymentLinkQueryParams = RESTGetCheckoutQueryParams;

/**
 * https://api.abacatepay.com/v2/payment-links/get
 *
 * @reference https://docs.abacatepay.com/pages/payment-links/one
 */
export type RESTGetPaymentLinkData = APIResponse<APIPaymentLink>;

/**
 * https://api.abacatepay.com/v2/payment-links/delete
 *
 * @reference https://docs.abacatepay.com/pages/payment-links/reference
 */
export interface RESTPostDeletePaymentLinkQueryParams {
	/**
	 * Payment link ID (`bill_...`).
	 */
	id: string;
}

/**
 * https://api.abacatepay.com/v2/payment-links/delete
 *
 * @reference https://docs.abacatepay.com/pages/payment-links/reference
 */
export type RESTPostDeletePaymentLinkData = APIResponse<APIPaymentLink>;

/**
 * https://api.abacatepay.com/v2/payment-links/refund
 *
 * @reference https://docs.abacatepay.com/pages/payment-links/refund
 */
export interface RESTPostRefundPaymentLinkBody {
	/**
	 * ID of the charge to refund (`char_`, `pix_char_` or `card_`), never the payment link (`bill_...`).
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
export type RESTPostRefundPaymentLinkData = APIResponse<APIRefund>;

/**
 * Inner `data` payload sent to `POST /transparents/create` when `method` is `PIX`.
 *
 * @reference https://docs.abacatepay.com/pages/transparents/create
 */
export interface RESTPostCreateQRCodePixBody {
	/**
	 * Charge amount in cents (Integer, min 100).
	 */
	amount: number;
	/**
	 * Billing expiration time in seconds (Min 60, or 300 for some providers).
	 *
	 * @default 86400
	 */
	expiresIn?: number;
	/**
	 * Message that will appear when paying the PIX (Max 140 characters, no emoji; banks show the first 37).
	 */
	description?: string;
	/**
	 * Your identifier for this charge. If a `PENDING` charge with this `externalId` exists, it is returned instead of a new one.
	 */
	externalId?: string;
	/**
	 * Your customer's data. When sent, all four fields are required.
	 */
	customer?: {
		/**
		 * Customer's full name.
		 */
		name: string;
		/**
		 * Customer's cell phone.
		 */
		cellphone: string;
		/**
		 * Customer's email.
		 */
		email: string;
		/**
		 * Customer's CPF or CNPJ.
		 */
		taxId: string;
	};
	/**
	 * Reject payments whose payer CPF/CNPJ differs from `customer.taxId` (Requires `customer`, not supported by every provider).
	 *
	 * @default false
	 */
	ensureSameTaxId?: boolean;
	/**
	 * UTM parameters of the charge.
	 */
	utm?: APITransparentUTM;
	/**
	 * Optional charge metadata, returned as-is.
	 */
	metadata?: Record<string, unknown>;
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
	 * Charge amount in cents (Integer, min 300).
	 */
	amount: number;
	/**
	 * Customer data. `name` and `taxId` are mandatory for Boleto.
	 */
	customer: {
		/**
		 * Customer's full name.
		 */
		name: string;
		/**
		 * Customer's CPF or CNPJ.
		 */
		taxId: string;
		/**
		 * Customer's email.
		 */
		email?: string;
		/**
		 * Customer's cell phone.
		 */
		cellphone?: string;
		/**
		 * Customer zip code.
		 */
		zipCode?: string;
		/**
		 * Customer address.
		 */
		address?: APICustomerAddress;
	};
	/**
	 * Due date (`YYYY-MM-DD`, up to 365 days ahead). Defaults to 3 business days.
	 */
	dueDate?: string;
	/**
	 * Late interest configuration.
	 */
	interest?: APIBoletoInterest;
	/**
	 * Late fine configuration.
	 */
	fine?: APIBoletoFine;
	/**
	 * UTM parameters of the charge.
	 */
	utm?: APITransparentUTM;
	/**
	 * Optional charge metadata, returned as-is.
	 */
	metadata?: Record<string, unknown>;
}

/**
 * https://api.abacatepay.com/v2/transparents/create
 *
 * @reference https://docs.abacatepay.com/pages/transparents/boleto
 */
export type RESTPostCreateBoletoData = APIResponse<APIBoleto>;

/**
 * Customer of a card charge. All fields are required.
 */
export interface RESTPostCreateCardCustomer {
	/**
	 * Customer's full name (1-150 characters).
	 */
	name: string;
	/**
	 * Customer's email (Valid email, up to 150 characters).
	 */
	email: string;
	/**
	 * CPF or CNPJ, with or without punctuation (11-18 characters, check digits are validated).
	 */
	taxId: string;
	/**
	 * Customer's cell phone (8-20 characters).
	 */
	cellphone: string;
}

/**
 * Fields of a card charge shared by both ways of identifying the card.
 */
export interface RESTPostCreateCardBodyBase {
	/**
	 * Total amount of the sale in cents (Integer, min 100). With `token`, it must equal the amount the token was created for.
	 */
	amount: number;
	/**
	 * Number of installments (1-12). Above 1, each installment must be at least R$10 (`amount >= installmentCount * 1000`).
	 *
	 * @default 1
	 */
	installmentCount?: number;
	/**
	 * Customer data. All fields are required.
	 */
	customer: RESTPostCreateCardCustomer;
	/**
	 * Optional charge metadata. Every value must be a string.
	 */
	metadata?: Record<string, string>;
}

/**
 * Inner `data` payload sent to `POST /transparents/create` when `method` is `CARD`.
 * Send exactly one of `token` or `cardToken`.
 *
 * @reference https://docs.abacatepay.com/pages/transparents/card
 */
export type RESTPostCreateCardBody = RESTPostCreateCardBodyBase &
	(
		| {
				/**
				 * Single-use `ctok_...` token created in the browser by AbacatePay.js. It expires 60 seconds after it is created.
				 */
				token: string;
				cardToken?: never;
		  }
		| {
				/**
				 * Permanent `cardToken` returned by a previous charge. The card is charged again without a new tokenization.
				 */
				cardToken: string;
				token?: never;
		  }
	);

/**
 * https://api.abacatepay.com/v2/transparents/create
 *
 * For installment sales the response describes the first installment, and `amount` is the total of the sale.
 *
 * @reference https://docs.abacatepay.com/pages/transparents/card
 */
export type RESTPostCreateCardData = APIResponse<
	APICardTransparent & {
		/**
		 * The metadata sent on creation (`{}` when none).
		 */
		metadata: Record<string, string>;
	}
>;

/**
 * Wire-level request body for `POST /transparents/create`. The SDK builds this from
 * {@link RESTPostCreateQRCodePixBody}, {@link RESTPostCreateBoletoBody} and
 * {@link RESTPostCreateCardBody}, callers of the SDK never construct it directly.
 *
 * @reference https://docs.abacatepay.com/pages/transparents/reference
 */
export type RESTPostCreateTransparentBody =
	| {
			/**
			 * Payment method.
			 */
			method: 'PIX';
			/**
			 * PIX QR Code data.
			 */
			data: RESTPostCreateQRCodePixBody;
	  }
	| {
			/**
			 * Payment method.
			 */
			method: 'BOLETO';
			/**
			 * Boleto data.
			 */
			data: RESTPostCreateBoletoBody;
	  }
	| {
			/**
			 * Payment method.
			 */
			method: 'CARD';
			/**
			 * Card charge data.
			 */
			data: RESTPostCreateCardBody;
	  };

/**
 * https://api.abacatepay.com/v2/transparents/list
 *
 * @reference https://docs.abacatepay.com/pages/transparents/list
 */
export interface RESTGetListTransparentsQueryParams
	extends RESTCursorPaginationQueryParams {
	/**
	 * Filter by charge ID.
	 */
	id?: string;
	/**
	 * Filter by your `externalId`.
	 */
	externalId?: string;
	/**
	 * Filter by status.
	 */
	status?: TransparentStatus;
	/**
	 * Filter by method (Transparent PIX QR Codes are `PIX_QRCODE`).
	 */
	method?: TransparentMethod;
}

/**
 * https://api.abacatepay.com/v2/transparents/list
 *
 * Card installment sales appear once per installment.
 *
 * @reference https://docs.abacatepay.com/pages/transparents/list
 */
export type RESTGetListTransparentsData = APIResponseWithCursorBasedPagination<
	APITransparent[]
>;

/**
 * https://api.abacatepay.com/v2/transparents/get
 *
 * @reference https://docs.abacatepay.com/pages/transparents/reference
 */
export interface RESTGetTransparentQueryParams {
	/**
	 * Charge ID (`pix_char_...`, `bole_...` or `card_...`).
	 */
	id: string;
}

/**
 * https://api.abacatepay.com/v2/transparents/get
 *
 * @reference https://docs.abacatepay.com/pages/transparents/reference
 */
export type RESTGetTransparentData = APIResponse<APITransparent>;

/**
 * https://api.abacatepay.com/v2/transparents/refund
 *
 * @reference https://docs.abacatepay.com/pages/transparents/refund
 */
export interface RESTPostRefundTransparentBody {
	/**
	 * ID of the transparent charge to refund (`pix_char_...` or `card_...`). Boletos cannot be refunded.
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
export type RESTPostRefundTransparentData = APIResponse<APIRefund>;

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
 * @deprecated The API ignores the request body.
 */
export interface RESTPostSimulateQRCodePixPaymentBody {
	/**
	 * Ignored by the API.
	 */
	metadata?: Record<string, unknown>;
}

/**
 * https://api.abacatepay.com/v2/transparents/simulate-payment
 *
 * Dev mode only. The `PAID` status in the response is optimistic: the payment is processed asynchronously.
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
 * Only for transparent PIX QR Codes. Not cached, so use it to poll for the payment.
 *
 * @reference https://docs.abacatepay.com/pages/transparents/check
 */
export type RESTGetCheckQRCodePixStatusData = APIResponse<{
	/**
	 * QRCode Pix ID.
	 */
	id: string;
	/**
	 * QRCode Pix expiration date.
	 */
	expiresAt: string;
	/**
	 * Information about the progress of QRCode Pix.
	 */
	status: TransparentStatus;
}>;

/**
 * https://api.abacatepay.com/v2/coupons/create
 *
 * Creating a coupon whose code already exists returns the existing coupon unchanged.
 *
 * @reference https://docs.abacatepay.com/pages/coupons/create
 */
export interface RESTPostCreateCouponBody {
	/**
	 * Unique coupon code, also used as its ID.
	 *
	 * @example "DEYVIN_20"
	 */
	code: string;
	/**
	 * Integer discount. `PERCENTAGE`: basis points (1000 = 10%, max 10000). `FIXED`: cents (Min 100).
	 */
	discount: number;
	/**
	 * Type of discount applied, percentage or fixed.
	 *
	 * @see {@link CouponDiscountKind}
	 */
	discountKind: CouponDiscountKind;
	/**
	 * Number of times the coupon can be redeemed, `-1` for unlimited.
	 */
	maxRedeems: number;
	/**
	 * Coupon description.
	 */
	notes?: string;
	/**
	 * When the coupon starts to be valid (ISO 8601, not earlier than tomorrow).
	 */
	startsAt?: string;
	/**
	 * When the coupon expires (ISO 8601, not earlier than tomorrow nor than `startsAt`).
	 */
	expiresAt?: string;
}

/**
 * https://api.abacatepay.com/v2/coupons/create
 *
 * @reference https://docs.abacatepay.com/pages/coupons/create
 */
export type RESTPostCreateCouponData = APIResponse<APICoupon>;

/**
 * https://api.abacatepay.com/v2/coupons/list
 *
 * Deleted coupons are never listed.
 *
 * @reference https://docs.abacatepay.com/pages/coupons/list
 */
export interface RESTGetListCouponsQueryParams
	extends RESTCursorPaginationQueryParams {
	/**
	 * Case-insensitive partial match on the coupon code.
	 */
	id?: string;
	/**
	 * Filter by status.
	 */
	status?: CouponStatus.Active | CouponStatus.Disabled;
}

/**
 * https://api.abacatepay.com/v2/coupons/list
 *
 * @reference https://docs.abacatepay.com/pages/coupons/list
 */
export type RESTGetListCouponsData = APIResponseWithCursorBasedPagination<
	APICoupon[]
>;

/**
 * https://api.abacatepay.com/v2/coupons/get
 *
 * @reference https://docs.abacatepay.com/pages/coupons/get
 */
export interface RESTGetCouponQueryParams {
	/**
	 * The coupon code.
	 */
	id: string;
	/**
	 * Only returns the coupon when it has this status.
	 */
	status?: CouponStatus;
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
export interface RESTPostDeleteCouponQueryParams {
	/**
	 * The coupon code.
	 */
	id: string;
}

/**
 * https://api.abacatepay.com/v2/coupons/delete
 *
 * @deprecated The ID is sent in the query string. Use {@link RESTPostDeleteCouponQueryParams}.
 */
export type RESTDeleteCouponBody = RESTPostDeleteCouponQueryParams;

/**
 * https://api.abacatepay.com/v2/coupons/delete
 *
 * @reference https://docs.abacatepay.com/pages/coupons/delete
 */
export type RESTPostDeleteCouponData = APIResponse<APICoupon>;

/**
 * https://api.abacatepay.com/v2/coupons/delete
 *
 * @deprecated Use {@link RESTPostDeleteCouponData}.
 */
export type RESTDeleteCouponData = RESTPostDeleteCouponData;

/**
 * https://api.abacatepay.com/v2/coupons/toggle
 *
 * @reference https://docs.abacatepay.com/pages/coupons/toggle
 */
export interface RESTPostToggleCouponStatusBody {
	/**
	 * The coupon code.
	 */
	id: string;
}

/**
 * https://api.abacatepay.com/v2/coupons/toggle
 *
 * `ACTIVE` coupons become `DISABLED` and any other becomes `ACTIVE`, so a repeated call flips the status back.
 *
 * @reference https://docs.abacatepay.com/pages/coupons/toggle
 */
export type RESTPostToggleCouponStatusData = APIResponse<APICoupon>;

/**
 * https://api.abacatepay.com/v2/payouts/create
 *
 * Withdraws to a PIX key of your own store (Same CPF/CNPJ). One payout per store every 30 seconds.
 *
 * @reference https://docs.abacatepay.com/pages/payouts/create
 */
export interface RESTPostCreateNewPayoutBody {
	/**
	 * Payout value in cents.
	 */
	amount: number;
	/**
	 * Destination PIX key.
	 */
	pix: {
		/**
		 * Type of the PIX key.
		 *
		 * @see {@link PixKeyType}
		 */
		type: PixKeyType;
		/**
		 * The PIX key itself.
		 */
		key: string;
	};
	/**
	 * Optional payout description (No emoji).
	 */
	description?: string;
	/**
	 * Unique identifier of the payout in your system. Not used for idempotency.
	 */
	externalId?: string;
}

/**
 * https://api.abacatepay.com/v2/payouts/create
 *
 * @reference https://docs.abacatepay.com/pages/payouts/create
 */
export type RESTPostCreateNewPayoutData = APIResponse<APIPayout>;

/**
 * https://api.abacatepay.com/v2/payouts/create
 *
 * @deprecated Use {@link RESTPostCreateNewPayoutData}.
 */
export type RESTPostCreateNewWPayoutData = RESTPostCreateNewPayoutData;

/**
 * https://api.abacatepay.com/v2/payouts/get
 *
 * At least one of `id` or `externalId` is required.
 *
 * @reference https://docs.abacatepay.com/pages/payouts/get
 */
export type RESTGetSearchPayoutQueryParams = AtLeastOne<{
	/**
	 * Unique payout identifier in AbacatePay (`tran_...`).
	 */
	id: string;
	/**
	 * Unique payout identifier in your system.
	 */
	externalId: string;
}>;

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
export interface RESTGetListPayoutsQueryParams
	extends RESTCursorPaginationQueryParams {
	/**
	 * Case-insensitive partial match on the transaction ID.
	 */
	id?: string;
}

/**
 * https://api.abacatepay.com/v2/payouts/list
 *
 * @remarks The API currently lists every transaction of your store here, not only payouts.
 *
 * @reference https://docs.abacatepay.com/pages/payouts/list
 */
export type RESTGetListPayoutsData = APIResponseWithCursorBasedPagination<
	APIPayout[]
>;

/**
 * https://api.abacatepay.com/v2/pix/send
 *
 * One transfer per store every 30 seconds. The fee is taken from `amount`.
 *
 * @reference https://docs.abacatepay.com/pages/pix/create
 */
export interface RESTPostSendPixTransferBody {
	/**
	 * Transfer amount in cents (Integer, min 100). The recipient receives `amount - platformFee`.
	 */
	amount: number;
	/**
	 * Unique identifier of the transfer in your system. Not used for idempotency.
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
 * At least one of `id` or `externalId` is required. The API currently requires the `id` key to be
 * present, so the SDK sends an empty `id` when you look up by `externalId` only.
 *
 * @reference https://docs.abacatepay.com/pages/pix/get
 */
export type RESTGetPixTransferQueryParams = AtLeastOne<{
	/**
	 * Unique transfer identifier in AbacatePay (`tran_...`).
	 */
	id: string;
	/**
	 * Unique transfer identifier in your system.
	 */
	externalId: string;
}>;

/**
 * https://api.abacatepay.com/v2/pix/get
 *
 * @reference https://docs.abacatepay.com/pages/pix/get
 */
export type RESTGetPixTransferData = APIResponse<APIPixTransfer>;

/**
 * https://api.abacatepay.com/v2/pix/list
 *
 * @remarks The API currently requires `id`, matches it partially (case-insensitive) against the IDs of
 * every transaction of your store (Not only PIX transfers), returns at most 100 items (Newest first) and
 * supports no cursor or other filter.
 *
 * @reference https://docs.abacatepay.com/pages/pix/list
 */
export interface RESTGetListPixTransfersQueryParams {
	/**
	 * Partial transaction ID to search for (e.g. `tran_`).
	 */
	id: string;
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
 * https://api.abacatepay.com/v2/bank-statement/list
 *
 * @reference https://docs.abacatepay.com/pages/bank-statement/list
 */
export interface RESTGetListBankStatementQueryParams
	extends RESTCursorPaginationQueryParams {
	/**
	 * Filter by transaction status. Every status except `PENDING` is returned by default.
	 */
	status?: TransactionStatus;
	/**
	 * Filter by transaction method.
	 */
	method?: TransactionMethod;
	/**
	 * Filter by transaction kind.
	 */
	kind?: TransactionKind;
	/**
	 * Case-insensitive partial match on the transaction ID.
	 */
	search?: string;
}

/**
 * https://api.abacatepay.com/v2/bank-statement/list
 *
 * @reference https://docs.abacatepay.com/pages/bank-statement/list
 */
export type RESTGetListBankStatementData = APIResponseWithCursorBasedPagination<
	APIBankStatementItem[]
>;

/**
 * https://api.abacatepay.com/v2/public-mrr/revenue
 *
 * Requires an `mrr_` token (Trust MRR).
 *
 * @reference https://docs.abacatepay.com/pages/trustMRR/list
 */
export interface RESTGetRevenueByPeriodQueryParams {
	/**
	 * Period start date (YYYY-MM-DD format).
	 */
	startDate: string;
	/**
	 * Period end date (YYYY-MM-DD format, must be after `startDate`).
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
 * Requires an `mrr_` token (Trust MRR).
 *
 * @reference https://docs.abacatepay.com/pages/trustMRR/get
 */
export type RESTGetMerchantData = APIResponse<{
	/**
	 * Store ID.
	 */
	id: string;
	/**
	 * Store name.
	 */
	name: string;
	/**
	 * Store website (Empty string when not set).
	 */
	website: string;
	/**
	 * Store creation date.
	 */
	createdAt: string;
	/**
	 * Store country.
	 */
	country: 'BR';
}>;

/**
 * https://api.abacatepay.com/v2/public-mrr/mrr
 *
 * Requires an `mrr_` token (Trust MRR).
 *
 * @reference https://docs.abacatepay.com/pages/trustMRR/mrr
 */
export type RESTGetMRRData = APIResponse<{
	/**
	 * Monthly recurring revenue. `value` is in cents (0 when there is none).
	 */
	mrr: {
		/**
		 * Currency of the value.
		 */
		currency: 'BRL';
		/**
		 * MRR in cents.
		 */
		value: number;
	};
	/**
	 * Active subscriptions, trials included. `value` is a count (The API still tags it with `currency`).
	 */
	totalActiveSubscriptions: {
		/**
		 * Always `BRL`.
		 */
		currency: 'BRL';
		/**
		 * Number of active subscriptions.
		 */
		value: number;
	};
}>;

/**
 * https://api.abacatepay.com/v2/public-mrr/mrr-by-day
 *
 * Requires an `mrr_` token (Trust MRR).
 *
 * @reference https://docs.abacatepay.com/pages/trustMRR/mrr-by-day
 */
export interface RESTGetMRRByDayQueryParams {
	/**
	 * First day (YYYY-MM-DD).
	 */
	startDate: string;
	/**
	 * Last day (YYYY-MM-DD, inclusive, at most 366 days after `startDate`).
	 */
	endDate: string;
}

/**
 * https://api.abacatepay.com/v2/public-mrr/mrr-by-day
 *
 * One entry per day of the range, keyed by `YYYY-MM-DD`.
 *
 * @reference https://docs.abacatepay.com/pages/trustMRR/mrr-by-day
 */
export type RESTGetMRRByDayData = APIResponse<
	Record<
		string,
		{
			/**
			 * MRR at the end of the day, in cents.
			 */
			mrr: number;
		}
	>
>;

/**
 * https://api.abacatepay.com/v2/stores/get
 *
 * The API caches this response (Balance included) for up to one hour.
 *
 * @reference https://docs.abacatepay.com/pages/store/get
 */
export type RESTGetStoreDetailsData = APIResponse<APIStore>;

/**
 * https://api.abacatepay.com/v2/stores/list
 *
 * @reference https://docs.abacatepay.com/pages/store/reference
 */
export interface RESTGetListStoresQueryParams
	extends RESTCursorPaginationQueryParams {
	/**
	 * Filter by store ID.
	 */
	id?: string;
	/**
	 * Case-insensitive match on the store name.
	 */
	name?: string;
}

/**
 * https://api.abacatepay.com/v2/stores/list
 *
 * @remarks Only your own store is returned, with the dev and production balances summed. `pagination`
 * is missing when the API answers from its cache.
 *
 * @reference https://docs.abacatepay.com/pages/store/reference
 */
export type RESTGetListStoresData =
	| {
			/**
			 * The data of the response.
			 */
			data: APIStore[];
			error: null;
			/**
			 * Whether the request was successful or not.
			 */
			success: true;
			/**
			 * Pagination info (Missing when the API answers from its cache).
			 */
			pagination?: APICursorPagination;
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
 * https://api.abacatepay.com/v2/products/create
 *
 * @reference https://docs.abacatepay.com/pages/products/create
 */
export interface RESTPostCreateProductBody {
	/**
	 * Unique product identifier in your system, among your non-deleted products (Max 128 characters).
	 */
	externalId: string;
	/**
	 * Product name (Max 256 characters).
	 */
	name: string;
	/**
	 * Product price in cents (Integer, min 1).
	 */
	price: number;
	/**
	 * Product currency.
	 */
	currency: 'BRL';
	/**
	 * Description for the product (Max 2048 characters).
	 */
	description?: string;
	/**
	 * Public URL of a PDF (Max 20MB) delivered to the buyer after payment.
	 */
	fileUrl?: string;
	/**
	 * Billing cycle. Makes it a subscription product.
	 *
	 * @see {@link ProductCycle}
	 */
	cycle?: ProductCycle;
	/**
	 * Free-trial days (1-90), for subscription products.
	 */
	trialDays?: number;
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
export interface RESTGetListProductsQueryParams
	extends RESTCursorPaginationQueryParams {
	/**
	 * Filter by product ID.
	 */
	id?: string;
	/**
	 * Regular expression matched against the name, ID and `externalId` (Case-insensitive).
	 */
	keyword?: string;
	/**
	 * Filter by status.
	 */
	status?: ProductStatus;
	/**
	 * Filter by currency.
	 */
	currency?: 'BRL';
	/**
	 * Regular expression matched against the name (Case-insensitive).
	 */
	name?: string;
	/**
	 * Filter by `externalId`.
	 */
	externalId?: string;
}

/**
 * https://api.abacatepay.com/v2/products/list
 *
 * @reference https://docs.abacatepay.com/pages/products/list
 */
export type RESTGetListProductsData = APIResponseWithCursorBasedPagination<
	APIProduct[]
>;

/**
 * https://api.abacatepay.com/v2/products/get
 *
 * At least one of `id`, `externalId` or `name` is required; they are combined with AND.
 *
 * @reference https://docs.abacatepay.com/pages/products/get
 */
export type RESTGetProductQueryParams = AtLeastOne<{
	/**
	 * The product ID.
	 */
	id: string;
	/**
	 * External ID of the product.
	 */
	externalId: string;
	/**
	 * Regular expression matched against the name (Case-insensitive).
	 */
	name: string;
}>;

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
 * Deletes every variation of the product group and returns the group's primary product.
 *
 * @reference https://docs.abacatepay.com/pages/products/delete
 */
export type RESTDeleteProductData = APIResponse<APIProduct>;

/**
 * https://api.abacatepay.com/v2/subscriptions/create
 *
 * Creates a subscription checkout (`bill_...`). The subscription itself (`subs_...`)
 * is created when a customer pays it.
 *
 * @reference https://docs.abacatepay.com/pages/subscriptions/create
 */
export interface RESTPostCreateSubscriptionBody {
	/**
	 * Products of the subscription. Every product must have a billing cycle, all the same cycle.
	 * More than one product requires the multi-product feature on your store.
	 * Always send `quantity`: the API does not apply its default.
	 */
	items: APICheckoutItem[];
	/**
	 * Accepted payment methods. `PIX` (Pix Automático) requires the feature on your store.
	 *
	 * @default [PaymentMethod.Card]
	 */
	methods?: (PaymentMethod.Card | PaymentMethod.Pix)[];
	/**
	 * ID of a customer already registered in your store.
	 */
	customerId?: string;
	/**
	 * Your identifier for this checkout. Sending an `externalId` that already exists in your store
	 * returns the existing billing instead of creating a new one.
	 */
	externalId?: string;
	/**
	 * URL used by the "Back" button.
	 */
	returnUrl?: string;
	/**
	 * URL the customer is sent to after paying.
	 */
	completionUrl?: string;
	/**
	 * Coupon codes accepted by this checkout (Max 50).
	 */
	coupons?: string[];
	/**
	 * Active product without billing cycle offered as an upsell.
	 */
	upSellProductId?: string;
	/**
	 * Card configuration. Subscriptions do not support installments.
	 */
	card?: {
		/**
		 * Must be `1`.
		 */
		maxInstallments: 1;
	};
	/**
	 * Retry policy for failed charges. Both fields are required when sent.
	 */
	retryPolicy?: {
		/**
		 * Charge attempts before the subscription is cancelled (1-10, the API uses 3 when omitted).
		 */
		maxRetry: number;
		/**
		 * Days between attempts (1-30, the API uses 1 when omitted).
		 */
		retryEvery: number;
	};
	/**
	 * Optional metadata, returned as-is.
	 */
	metadata?: Record<string, unknown>;
}

/**
 * https://api.abacatepay.com/v2/subscriptions/create
 *
 * @reference https://docs.abacatepay.com/pages/subscriptions/create
 */
export type RESTPostCreateSubscriptionData =
	APIResponse<APISubscriptionCheckout>;

/**
 * https://api.abacatepay.com/v2/subscriptions/list
 *
 * @reference https://docs.abacatepay.com/pages/subscriptions/list
 */
export interface RESTGetListSubscriptionsQueryParams
	extends RESTCursorPaginationQueryParams {
	/**
	 * Filter by status.
	 */
	status?: SubscriptionStatus.Active | SubscriptionStatus.Cancelled;
	/**
	 * Only subscriptions originated by this subscription checkout (`bill_...`).
	 */
	checkoutId?: string;
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
 * https://api.abacatepay.com/v2/subscriptions/get
 *
 * At least one of `id`, `externalId` or `customerId` is required; the most recent match is returned.
 *
 * @reference https://docs.abacatepay.com/pages/subscriptions/get
 */
export type RESTGetSubscriptionQueryParams = AtLeastOne<{
	/**
	 * Subscription ID (`subs_...`).
	 */
	id: string;
	/**
	 * `externalId` of the checkout that originated the subscription.
	 */
	externalId: string;
	/**
	 * Customer ID (`cust_...`). Returns the customer's most recent subscription.
	 */
	customerId: string;
}>;

/**
 * https://api.abacatepay.com/v2/subscriptions/get
 *
 * @reference https://docs.abacatepay.com/pages/subscriptions/get
 */
export type RESTGetSubscriptionData = APIResponse<APISubscription>;

/**
 * https://api.abacatepay.com/v2/subscriptions/cancel
 *
 * @reference https://docs.abacatepay.com/pages/subscriptions/cancel
 */
export interface RESTPostCancelSubscriptionBody {
	/**
	 * Unique subscription identifier (`subs_...`, not the checkout ID).
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
 * Send either `items` or `productId` + `quantity`.
 *
 * @reference https://docs.abacatepay.com/pages/subscriptions/change-plan
 */
export type RESTPostChangeSubscriptionPlanBody =
	| {
			/**
			 * Unique subscription identifier.
			 */
			id: string;
			/**
			 * New products of the subscription. More than one product requires the multi-product feature on your store.
			 */
			items: {
				/**
				 * Product ID. It must have the same billing cycle as the others.
				 */
				productId: string;
				/**
				 * Quantity (Integer >= 1).
				 */
				quantity: number;
			}[];
	  }
	| {
			/**
			 * Unique subscription identifier.
			 */
			id: string;
			/**
			 * ID of the new product. It must have a billing cycle configured.
			 */
			productId: string;
			/**
			 * New quantity for the product (Integer >= 1).
			 */
			quantity: number;
	  };

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
	 * Number of units to record (Integer >= 1).
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
 * https://api.abacatepay.com/v2/subscriptions/checkouts/get
 *
 * At least one of `id`, `externalId` or `customerId` is required.
 *
 * @reference https://docs.abacatepay.com/pages/subscriptions/checkouts-get
 */
export type RESTGetSubscriptionCheckoutQueryParams = RESTGetCheckoutQueryParams;

/**
 * https://api.abacatepay.com/v2/subscriptions/checkouts/get
 *
 * @reference https://docs.abacatepay.com/pages/subscriptions/checkouts-get
 */
export type RESTGetSubscriptionCheckoutData =
	APIResponse<APISubscriptionCheckout>;

/**
 * https://api.abacatepay.com/v2/subscriptions/checkouts/list
 *
 * @reference https://docs.abacatepay.com/pages/subscriptions/checkouts-list
 */
export type RESTGetListSubscriptionCheckoutsQueryParams =
	RESTGetListCheckoutsQueryParams;

/**
 * https://api.abacatepay.com/v2/subscriptions/checkouts/list
 *
 * @reference https://docs.abacatepay.com/pages/subscriptions/checkouts-list
 */
export type RESTGetListSubscriptionCheckoutsData =
	APIResponseWithCursorBasedPagination<APISubscriptionCheckout[]>;

/**
 * https://api.abacatepay.com/v2/subscriptions/checkouts/delete
 *
 * @reference https://docs.abacatepay.com/pages/subscriptions/checkouts-delete
 */
export interface RESTPostDeleteSubscriptionCheckoutQueryParams {
	/**
	 * Subscription checkout ID (`bill_...`).
	 */
	id: string;
}

/**
 * https://api.abacatepay.com/v2/subscriptions/checkouts/delete
 *
 * Subscriptions already created by the checkout stay active.
 *
 * @reference https://docs.abacatepay.com/pages/subscriptions/checkouts-delete
 */
export type RESTPostDeleteSubscriptionCheckoutData =
	APIResponse<APISubscriptionCheckout>;

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
	 * Public HTTPS endpoint that will receive the events.
	 */
	endpoint: string;
	/**
	 * Secret of the webhook (At least 32 characters). Legacy deliveries send it as `?webhookSecret=`;
	 * Standard Webhooks deliveries are signed with it.
	 */
	secret: string;
	/**
	 * Event types this webhook should be notified about. v1 event names are also accepted and are
	 * delivered with the v1 payload.
	 *
	 * @see {@link WebhookEventType}
	 */
	events: (WebhookEventType | WebhookV1EventName)[];
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
export interface RESTGetListWebhooksQueryParams
	extends RESTCursorPaginationQueryParams {
	/**
	 * Case-insensitive search by webhook name, ID, or endpoint.
	 */
	search?: string;
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
export interface RESTPostDeleteWebhookQueryParams {
	/**
	 * Unique webhook identifier.
	 */
	id: string;
}

/**
 * https://api.abacatepay.com/v2/webhooks/delete
 *
 * @deprecated The ID is sent in the query string. Use {@link RESTPostDeleteWebhookQueryParams}.
 */
export type RESTPostDeleteWebhookBody = RESTPostDeleteWebhookQueryParams;

/**
 * https://api.abacatepay.com/v2/webhooks/delete
 *
 * The API returns no `data` on success.
 *
 * @reference https://docs.abacatepay.com/pages/webhooks/delete
 */
export type RESTPostDeleteWebhookData = APIResponse<null | undefined>;

/**
 * https://api.abacatepay.com/v2/reports/list
 *
 * Catalog of the financial reports available to `GET /reports/run`.
 */
export type RESTGetListReportsData = APIResponse<APIReportSpec[]>;

/**
 * https://api.abacatepay.com/v2/reports/run
 *
 * Period reports require `startDate` and `endDate` (The API silently uses "today" without them).
 */
export type RESTGetRunReportQueryParams =
	| {
			/**
			 * Report that takes no period.
			 */
			reportId: SnapshotReportId;
	  }
	| {
			/**
			 * Report ID.
			 */
			reportId: Exclude<ReportId, SnapshotReportId>;
			/**
			 * First day, inclusive (YYYY-MM-DD).
			 */
			startDate: string;
			/**
			 * Last day, inclusive (YYYY-MM-DD).
			 */
			endDate: string;
			/**
			 * IANA timezone of the period.
			 *
			 * @default 'America/Sao_Paulo'
			 */
			timezone?: string;
	  };

/**
 * https://api.abacatepay.com/v2/reports/run
 *
 * The API caches each report for 60 seconds.
 */
export type RESTGetRunReportData = APIResponse<APIReport>;
