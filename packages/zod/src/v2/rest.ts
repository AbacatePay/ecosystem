import { type _ZodType, z } from 'zod';
import { StringEnum } from '../utils';
import {
	APIBoleto,
	APICheckout,
	APICoupon,
	APICustomer,
	APIPaymentLink,
	APIPayout,
	APIPixTransfer,
	APIProduct,
	APIQRCodePIX,
	APIStore,
	APISubscription,
	APISubscriptionPlanChange,
	APISubscriptionUsageRecord,
	CouponDiscountKind,
	PaymentMethod,
	PaymentStatus,
	PixKeyType,
} from '.';
// Imported directly (not via the barrel) so module init order doesn't matter:
// `rest.ts` is exported before `webhook.ts` in `./index`, and importing
// these from '.' would hit a TDZ error at module-eval time.
import { APIWebhook, WebhookEventType } from './webhook';

/**
 * Any response returned by the AbacatePay API
 */
export const APIResponse = <Schema extends _ZodType>(schema: Schema) =>
	z.discriminatedUnion('success', [
		z.object({
			data: schema,
			error: z.null(),
			success: z
				.literal([true])
				.describe('Whether the request was successfull or not.'),
		}),
		z.object({
			data: z.null(),
			error: z.string().describe('Error message returned from the API.'),
			success: z
				.literal([false])
				.describe('Whether the request was successfull or not.'),
		}),
	]);

/**
 * Any response returned by the AbacatePay API
 */
export type APIResponse<Schema extends z._ZodType> = z.infer<
	ReturnType<typeof APIResponse<Schema>>
>;

/**
 * Any response returned by the AbacatePay API that has a `pagination` field (Not cursor based)
 * @returns
 */
export const APIResponseWithPagination = <Schema extends _ZodType>(
	schema: Schema,
) =>
	z.discriminatedUnion('success', [
		z.object({
			data: schema,
			error: z.null(),
			success: z
				.literal([true])
				.describe('Whether the request was successfull or not.'),
			pagination: z.object({
				page: z.int().min(1).describe('Current page.'),
				limit: z.int().min(0).describe('Number of items per page.'),
				items: z.int().min(0).describe('Number of items.'),
				totalPages: z.int().min(0).describe('Number of pages.'),
			}),
		}),
		z.object({
			data: z.null(),
			error: z.string().describe('Error message returned from the API.'),
			success: z
				.literal([false])
				.describe('Whether the request was successfull or not.'),
		}),
	]);

/**
 * Any response returned by the AbacatePay API that has a `pagination` field (Not cursor based)
 * @returns
 */
export type APIResponseWithPagination<Schema extends z._ZodType> = z.infer<
	ReturnType<typeof APIResponseWithPagination<Schema>>
>;

/**
 * Any response returned by the AbacatePay API that has a `pagination` field and is cursor-based
 */
export const APIResponseWithCursorBasedPagination = <Schema extends _ZodType>(
	schema: Schema,
) =>
	z.discriminatedUnion('success', [
		z.object({
			data: schema,
			error: z.null(),
			success: z
				.literal([true])
				.describe('Whether the request was successfull or not.'),
			pagination: z.object({
				limit: z.int().min(0).describe('Number of items per page.'),
				hasNext: z
					.boolean()
					.describe('Indicates whether there is a next page.'),
				hasPrevious: z
					.boolean()
					.describe('Indicates whether there is a previous page.'),
				nextCursor: z
					.union([z.null(), z.string()])
					.describe('Cursor for the next page.'),
			}),
		}),
		z.object({
			data: z.null(),
			error: z.string().describe('Error message returned from the API.'),
			success: z
				.literal([false])
				.describe('Whether the request was successfull or not.'),
		}),
	]);

/**
 * Any response returned by the AbacatePay API that has a `pagination` field and is cursor-based
 */
export type APIResponseWithCursorBasedPagination<Schema extends z._ZodType> =
	z.infer<ReturnType<typeof APIResponseWithCursorBasedPagination<Schema>>>;

/**
 * https://api.abacatepay.com/v2/customers/create
 *
 * @reference https://docs.abacatepay.com/pages/client/create
 */
export const RESTPostCreateCustomerBody = APICustomer.pick({
	email: true,
}).and(
	APICustomer.pick({
		name: true,
		taxId: true,
		zipCode: true,
		cellphone: true,
		metadata: true,
	}).partial(),
);

/**
 * https://api.abacatepay.com/v2/customers/create
 *
 * @reference https://docs.abacatepay.com/pages/client/create
 */
export type RESTPostCreateCustomerBody = z.infer<
	typeof RESTPostCreateCustomerBody
>;

/**
 * https://api.abacatepay.com/v2/customers/create
 *
 * @reference https://docs.abacatepay.com/pages/client/create
 */
export const RESTPostCreateCustomerData = APIResponse(APICustomer);

/**
 * https://api.abacatepay.com/v2/customers/create
 *
 * @reference https://docs.abacatepay.com/pages/client/create
 */
export type RESTPostCreateCustomerData = z.infer<
	typeof RESTPostCreateCustomerData
>;

/**
 * https://api.abacatepay.com/v2/checkouts/create
 *
 * @reference https://docs.abacatepay.com/pages/payment/create
 */
export const RESTPostCreateNewCheckoutBody = z.object({
	methods: z
		.array(PaymentMethod)
		.describe(
			'Payment methods that will be accepted (Defaults to `[PIX, CARD]`).',
		)
		.optional(),
	returnUrl: z
		.url()
		.describe(
			'URL to redirect the customer if they click on the "Back" option.',
		)
		.optional(),
	completionUrl: z
		.url()
		.describe('URL to redirect the customer when payment is completed.')
		.optional(),
	customerId: z
		.string()
		.describe('The ID of a customer already registered in your store.')
		.optional(),
	customer: APICustomer.pick({
		name: true,
		email: true,
		taxId: true,
		cellphone: true,
	}).optional(),
	coupons: z
		.array(z.string())
		.max(50)
		.describe(
			'List of coupons available for resem used with billing (0-50 max.).',
		)
		.optional(),
	externalId: z
		.string()
		.describe(
			'If you have a unique identifier for your billing application, completely optional.',
		)
		.optional(),
	metadata: z
		.record(z.string(), z.any())
		.describe('Optional billing metadata.')
		.optional(),
	items: APICheckout.shape.items,
	frequency: StringEnum(
		['ONE_TIME', 'MULTIPLE_PAYMENTS', 'SUBSCRIPTION'],
		'Billing frequency. Defaults to `ONE_TIME`.',
	).optional(),
	upSellProductId: z
		.string()
		.describe('ID of an additional product offered as an upsell.')
		.optional(),
	interest: z
		.object({
			value: z
				.int()
				.describe('Monthly interest rate, in hundredths of a percent.'),
		})
		.describe('Late interest configuration (Applies to BOLETO).')
		.optional(),
	fine: z
		.object({
			value: z.int().describe('Fine value.'),
			type: StringEnum(['PERCENTAGE', 'FIXED'], 'Type of fine applied.'),
		})
		.describe('Late fine configuration (Applies to BOLETO).')
		.optional(),
});

/**
 * https://api.abacatepay.com/v2/checkouts/create
 *
 * @reference https://docs.abacatepay.com/pages/payment/create
 */
export type RESTPostCreateNewCheckoutBody = z.infer<
	typeof RESTPostCreateNewCheckoutBody
>;

/**
 * https://api.abacatepay.com/v2/checkouts/create
 *
 * @reference https://docs.abacatepay.com/pages/payment/create
 */
export const RESTPostCreateNewCheckoutData = APIResponse(APICheckout);

/**
 * https://api.abacatepay.com/v2/checkouts/create
 *
 * @reference https://docs.abacatepay.com/pages/payment/create
 */
export type RESTPostCreateNewCheckoutData = z.infer<
	typeof RESTPostCreateNewCheckoutData
>;

/**
 * https://api.abacatepay.com/v2/checkouts/refund
 *
 * @reference https://docs.abacatepay.com/pages/payment/refund
 */
export const RESTPostRefundCheckoutBody = z.object({
	id: z
		.string()
		.describe(
			'Public ID of the resource to refund (prefixes: `bill_`, `char_`, `pix_char_`, `card_`).',
		),
	reason: z
		.string()
		.max(500)
		.describe('Refund reason, shown in the transaction history.')
		.optional(),
});

/**
 * https://api.abacatepay.com/v2/checkouts/refund
 *
 * @reference https://docs.abacatepay.com/pages/payment/refund
 */
export type RESTPostRefundCheckoutBody = z.infer<
	typeof RESTPostRefundCheckoutBody
>;

/**
 * https://api.abacatepay.com/v2/checkouts/refund
 *
 * @reference https://docs.abacatepay.com/pages/payment/refund
 */
export const RESTPostRefundCheckoutData = APIResponse(
	z.object({
		refundPublicId: z
			.string()
			.describe('Public ID of the refund transaction that was created.'),
	}),
);

/**
 * https://api.abacatepay.com/v2/checkouts/refund
 *
 * @reference https://docs.abacatepay.com/pages/payment/refund
 */
export type RESTPostRefundCheckoutData = z.infer<
	typeof RESTPostRefundCheckoutData
>;

/**
 * https://api.abacatepay.com/v2/checkouts/list
 *
 * @reference https://docs.abacatepay.com/pages/payment/list
 */
export const RESTGetListCheckoutsQueryParams = z.object({
	page: z.int().min(1).default(1).describe('Number of the page.').optional(),
	limit: z.int().min(1).describe('Number of items per page.').optional(),
});

/**
 * https://api.abacatepay.com/v2/checkouts/list
 *
 * @reference https://docs.abacatepay.com/pages/payment/list
 */
export type RESTGetListCheckoutsQueryParams = z.infer<
	typeof RESTGetListCheckoutsQueryParams
>;

/**
 * https://api.abacatepay.com/v2/checkouts/list
 *
 * @reference https://docs.abacatepay.com/pages/payment/list
 */
export const RESTGetListCheckoutsData = APIResponseWithPagination(
	z.array(APICheckout),
);

/**
 * https://api.abacatepay.com/v2/checkouts/list
 *
 * @reference https://docs.abacatepay.com/pages/payment/list
 */
export type RESTGetListCheckoutsData = z.infer<typeof RESTGetListCheckoutsData>;

/**
 * https://api.abacatepay.com/v2/checkouts/get
 *
 * @reference https://docs.abacatepay.com/pages/payment/one
 */
export const RESTGetCheckoutData = APIResponse(APICheckout);

/**
 * https://api.abacatepay.com/v2/checkouts/get
 *
 * @reference https://docs.abacatepay.com/pages/payment/one
 */
export type RESTGetCheckoutData = z.infer<typeof RESTGetCheckoutData>;

/**
 * https://api.abacatepay.com/v2/checkouts/get
 *
 * @reference https://docs.abacatepay.com/pages/payment/one
 */
export const RESTGetCheckoutQueryParams = z.object({
	id: z.string().describe('Unique billing identifier.'),
});

/**
 * https://api.abacatepay.com/v2/checkouts/get
 *
 * @reference https://docs.abacatepay.com/pages/payment/one
 */
export type RESTGetCheckoutQueryParams = z.infer<
	typeof RESTGetCheckoutQueryParams
>;

/**
 * https://api.abacatepay.com/v2/payment-links/create
 *
 * @reference https://docs.abacatepay.com/pages/payment-links/create
 */
export const RESTPostCreatePaymentLinkBody = RESTPostCreateNewCheckoutBody.omit(
	{ customerId: true, customer: true, frequency: true, upSellProductId: true },
);

/**
 * https://api.abacatepay.com/v2/payment-links/create
 *
 * @reference https://docs.abacatepay.com/pages/payment-links/create
 */
export type RESTPostCreatePaymentLinkBody = z.infer<
	typeof RESTPostCreatePaymentLinkBody
>;

/**
 * https://api.abacatepay.com/v2/payment-links/create
 *
 * @reference https://docs.abacatepay.com/pages/payment-links/create
 */
export const RESTPostCreatePaymentLinkData = APIResponse(APIPaymentLink);

/**
 * https://api.abacatepay.com/v2/payment-links/create
 *
 * @reference https://docs.abacatepay.com/pages/payment-links/create
 */
export type RESTPostCreatePaymentLinkData = z.infer<
	typeof RESTPostCreatePaymentLinkData
>;

/**
 * https://api.abacatepay.com/v2/payment-links/list
 *
 * @reference https://docs.abacatepay.com/pages/payment-links/list
 */
export const RESTGetListPaymentLinksQueryParams = z.object({
	page: z.int().min(1).default(1).describe('Number of the page.').optional(),
	limit: z.int().min(1).describe('Number of items per page.').optional(),
});

/**
 * https://api.abacatepay.com/v2/payment-links/list
 *
 * @reference https://docs.abacatepay.com/pages/payment-links/list
 */
export type RESTGetListPaymentLinksQueryParams = z.infer<
	typeof RESTGetListPaymentLinksQueryParams
>;

/**
 * https://api.abacatepay.com/v2/payment-links/list
 *
 * @reference https://docs.abacatepay.com/pages/payment-links/list
 */
export const RESTGetListPaymentLinksData = APIResponseWithPagination(
	z.array(APIPaymentLink),
);

/**
 * https://api.abacatepay.com/v2/payment-links/list
 *
 * @reference https://docs.abacatepay.com/pages/payment-links/list
 */
export type RESTGetListPaymentLinksData = z.infer<
	typeof RESTGetListPaymentLinksData
>;

/**
 * https://api.abacatepay.com/v2/payment-links/one
 *
 * @reference https://docs.abacatepay.com/pages/payment-links/one
 */
export const RESTGetPaymentLinkQueryParams = z.object({
	id: z.string().describe('Unique payment link identifier.'),
});

/**
 * https://api.abacatepay.com/v2/payment-links/one
 *
 * @reference https://docs.abacatepay.com/pages/payment-links/one
 */
export type RESTGetPaymentLinkQueryParams = z.infer<
	typeof RESTGetPaymentLinkQueryParams
>;

/**
 * https://api.abacatepay.com/v2/payment-links/one
 *
 * @reference https://docs.abacatepay.com/pages/payment-links/one
 */
export const RESTGetPaymentLinkData = APIResponse(APIPaymentLink);

/**
 * https://api.abacatepay.com/v2/payment-links/one
 *
 * @reference https://docs.abacatepay.com/pages/payment-links/one
 */
export type RESTGetPaymentLinkData = z.infer<typeof RESTGetPaymentLinkData>;

/**
 * https://api.abacatepay.com/v2/payment-links/refund
 *
 * @reference https://docs.abacatepay.com/pages/payment-links/refund
 */
export const RESTPostRefundPaymentLinkBody = z.object({
	id: z.string().describe('Public ID of the resource to refund.'),
	reason: z
		.string()
		.max(500)
		.describe('Refund reason, shown in the transaction history.')
		.optional(),
});

/**
 * https://api.abacatepay.com/v2/payment-links/refund
 *
 * @reference https://docs.abacatepay.com/pages/payment-links/refund
 */
export type RESTPostRefundPaymentLinkBody = z.infer<
	typeof RESTPostRefundPaymentLinkBody
>;

/**
 * https://api.abacatepay.com/v2/payment-links/refund
 *
 * @reference https://docs.abacatepay.com/pages/payment-links/refund
 */
export const RESTPostRefundPaymentLinkData = APIResponse(
	z.object({
		refundPublicId: z
			.string()
			.describe('Public ID of the refund transaction that was created.'),
	}),
);

/**
 * https://api.abacatepay.com/v2/payment-links/refund
 *
 * @reference https://docs.abacatepay.com/pages/payment-links/refund
 */
export type RESTPostRefundPaymentLinkData = z.infer<
	typeof RESTPostRefundPaymentLinkData
>;

/**
 * https://api.abacatepay.com/v2/coupons/create
 *
 * @reference https://docs.abacatepay.com/pages/coupons/create
 */
export const RESTPostCreateCouponBody = z.object({
	code: z.string().describe('Unique coupon identifier.'),
	discount: z.int().describe('Discount amount to be applied.'),
	discountKind: CouponDiscountKind,
	notes: z.string().describe('Coupon description').optional(),
	maxRedeems: z
		.int()
		.min(-1)
		.describe(
			'Number of times the coupon can be redeemed. -1 means this coupon can be redeemed without limits.',
		)
		.optional(),
	metadata: z
		.record(z.string(), z.any())
		.describe('Key value object for coupon metadata.'),
});

/**
 * https://api.abacatepay.com/v2/coupons/create
 *
 * @reference https://docs.abacatepay.com/pages/coupons/create
 */
export type RESTPostCreateCouponBody = z.infer<typeof RESTPostCreateCouponBody>;

/**
 * https://api.abacatepay.com/v2/coupons/create
 *
 * @reference https://docs.abacatepay.com/pages/coupons/create
 */
export const RESTPostCreateCouponData = APIResponse(APICoupon);

/**
 * https://api.abacatepay.com/v2/coupons/create
 *
 * @reference https://docs.abacatepay.com/pages/coupons/create
 */
export type RESTPostCreateCouponData = z.infer<typeof RESTPostCreateCouponData>;

/**
 * https://api.abacatepay.com/v2/coupons/list
 *
 * @reference https://docs.abacatepay.com/pages/coupons/list
 */
export const RESTGetListCouponsData = APIResponseWithPagination(
	z.array(APICoupon),
);

/**
 * https://api.abacatepay.com/v2/coupons/list
 *
 * @reference https://docs.abacatepay.com/pages/coupons/list
 */
export type RESTGetListCouponsData = z.infer<typeof RESTGetListCouponsData>;

/**
 * https://api.abacatepay.com/v2/coupons/list
 *
 * @reference https://docs.abacatepay.com/pages/coupons/list
 */
export const RESTGetListCouponsQueryParams = z.object({
	page: z.int().min(1).default(1).describe('Page number.').optional(),
	limit: z.int().min(1).describe('Number of items per page.').optional(),
});

/**
 * https://api.abacatepay.com/v2/coupons/list
 *
 * @reference https://docs.abacatepay.com/pages/coupons/list
 */
export type RESTGetListCouponsQueryParams = z.infer<
	typeof RESTGetListCouponsQueryParams
>;

/**
 * https://api.abacatepay.com/v2/coupons/get
 *
 * @reference https://docs.abacatepay.com/pages/coupons/get
 */
export const RESTGetCouponQueryParams = z.object({
	id: z.string().describe('The ID of the coupon.'),
});

/**
 * https://api.abacatepay.com/v2/coupons/get
 *
 * @reference https://docs.abacatepay.com/pages/coupons/get
 */
export type RESTGetCouponQueryParams = z.infer<typeof RESTGetCouponQueryParams>;

/**
 * https://api.abacatepay.com/v2/coupons/get
 *
 * @reference https://docs.abacatepay.com/pages/coupons/get
 */
export const RESTGetCouponData = APIResponse(APICoupon);

/**
 * https://api.abacatepay.com/v2/coupons/get
 *
 * @reference https://docs.abacatepay.com/pages/coupons/get
 */
export type RESTGetCouponData = z.infer<typeof RESTGetCouponData>;

/**
 * https://api.abacatepay.com/v2/coupons/delete
 *
 * @reference https://docs.abacatepay.com/pages/coupons/delete
 */
export const RESTDeleteCouponBody = z.object({
	id: z.string().describe('The ID of the coupon.'),
});

/**
 * https://api.abacatepay.com/v2/coupons/delete
 *
 * @reference https://docs.abacatepay.com/pages/coupons/delete
 */
export type RESTDeleteCouponBody = z.infer<typeof RESTDeleteCouponBody>;

/**
 * https://api.abacatepay.com/v2/coupons/delete
 *
 * @reference https://docs.abacatepay.com/pages/coupons/delete
 */
export const RESTDeleteCouponData = APIResponse(APICoupon);

/**
 * https://api.abacatepay.com/v2/coupons/delete
 *
 * @reference https://docs.abacatepay.com/pages/coupons/delete
 */
export type RESTDeleteCouponData = z.infer<typeof RESTDeleteCouponData>;

/**
 * https://api.abacatepay.com/v2/coupons/toggle
 *
 * @reference https://docs.abacatepay.com/pages/coupons/toggle
 */
export const RESTPostToggleCouponStatusBody = z.object({
	id: z.string().describe('The ID of the coupon.'),
});

/**
 * https://api.abacatepay.com/v2/coupons/toggle
 *
 * @reference https://docs.abacatepay.com/pages/coupons/toggle
 */
export type RESTPostToggleCouponStatusBody = z.infer<
	typeof RESTPostToggleCouponStatusBody
>;

/**
 * https://api.abacatepay.com/v2/coupons/toggle
 *
 * @reference https://docs.abacatepay.com/pages/coupons/toggle
 */
export const RESTPostToggleCouponStatusData = APIResponse(APICoupon);

/**
 * https://api.abacatepay.com/v2/coupons/toggle
 *
 * @reference https://docs.abacatepay.com/pages/coupons/toggle
 */
export type RESTPostToggleCouponStatusData = z.infer<
	typeof RESTPostToggleCouponStatusData
>;

/**
 * https://api.abacatepay.com/v2/payouts/create
 *
 * @reference https://docs.abacatepay.com/pages/payouts/create
 */
export const RESTPostCreateNewPayoutBody = z.object({
	externalId: z
		.string()
		.describe('Unique identifier of the payout in your system.'),
	amount: z.int().min(350).describe('Payout value in cents (Min 350).'),
	description: z.string().describe('Optional payout description.').optional(),
});

/**
 * https://api.abacatepay.com/v2/payouts/create
 *
 * @reference https://docs.abacatepay.com/pages/payouts/create
 */
export type RESTPostCreateNewPayoutBody = z.infer<
	typeof RESTPostCreateNewPayoutBody
>;

/**
 * https://api.abacatepay.com/v2/payouts/create
 *
 * @reference https://docs.abacatepay.com/pages/payouts/create
 */
export const RESTPostCreateNewPayoutData = APIResponse(APIPayout);

/**
 * https://api.abacatepay.com/v2/payouts/create
 *
 * @reference https://docs.abacatepay.com/pages/payouts/create
 */
export type RESTPostCreateNewPayoutData = z.infer<
	typeof RESTPostCreateNewPayoutData
>;

/**
 * https://api.abacatepay.com/v2/payouts/get
 *
 * @reference https://docs.abacatepay.com/pages/payouts/get
 */
export const RESTGetSearchPayoutQueryParams = z.object({
	externalId: z.string().describe('Unique payout identifier in your system.'),
});

/**
 * https://api.abacatepay.com/v2/payouts/get
 *
 * @reference https://docs.abacatepay.com/pages/payouts/get
 */
export type RESTGetSearchPayoutQueryParams = z.infer<
	typeof RESTGetSearchPayoutQueryParams
>;

/**
 * https://api.abacatepay.com/v2/payouts/get
 *
 * @reference https://docs.abacatepay.com/pages/payouts/get
 */
export const RESTGetSearchPayoutData = APIResponse(APIPayout);

/**
 * https://api.abacatepay.com/v2/payouts/get
 *
 * @reference https://docs.abacatepay.com/pages/payouts/get
 */
export type RESTGetSearchPayoutData = z.infer<typeof RESTGetSearchPayoutData>;

/**
 * https://api.abacatepay.com/v2/payouts/list
 *
 * @reference https://docs.abacatepay.com/pages/payouts/list
 */
export const RESTGetListPayoutsQueryParams = z.object({
	page: z.int().min(1).default(1).describe('Page number.').optional(),
	limit: z.int().min(1).describe('Number of items per page.').optional(),
});

/**
 * https://api.abacatepay.com/v2/payouts/list
 *
 * @reference https://docs.abacatepay.com/pages/payouts/list
 */
export type RESTGetListPayoutsQueryParams = z.infer<
	typeof RESTGetListPayoutsQueryParams
>;

/**
 * https://api.abacatepay.com/v2/payouts/list
 *
 * @reference https://docs.abacatepay.com/pages/payouts/list
 */
export const RESTGetListPayoutsData = APIResponseWithPagination(
	z.array(APIPayout),
);

/**
 * https://api.abacatepay.com/v2/payouts/list
 *
 * @reference https://docs.abacatepay.com/pages/payouts/list
 */
export type RESTGetListPayoutsData = z.infer<typeof RESTGetListPayoutsData>;

/**
 * https://api.abacatepay.com/v2/pix/send
 *
 * @reference https://docs.abacatepay.com/pages/pix/create
 */
export const RESTPostSendPixTransferBody = z.object({
	amount: z.int().min(1).describe('Transfer amount in cents (Min 100).'),
	externalId: z
		.string()
		.describe('Unique identifier of the transfer in your system.'),
	description: z.string().describe('Optional transfer description.').optional(),
	pix: z.object({
		key: z.string().describe('The PIX key itself.'),
		type: PixKeyType,
	}),
});

/**
 * https://api.abacatepay.com/v2/pix/send
 *
 * @reference https://docs.abacatepay.com/pages/pix/create
 */
export type RESTPostSendPixTransferBody = z.infer<
	typeof RESTPostSendPixTransferBody
>;

/**
 * https://api.abacatepay.com/v2/pix/send
 *
 * @reference https://docs.abacatepay.com/pages/pix/create
 */
export const RESTPostSendPixTransferData = APIResponse(APIPixTransfer);

/**
 * https://api.abacatepay.com/v2/pix/send
 *
 * @reference https://docs.abacatepay.com/pages/pix/create
 */
export type RESTPostSendPixTransferData = z.infer<
	typeof RESTPostSendPixTransferData
>;

/**
 * https://api.abacatepay.com/v2/pix/get
 *
 * @reference https://docs.abacatepay.com/pages/pix/get
 */
export const RESTGetPixTransferQueryParams = z.object({
	id: z
		.string()
		.describe(
			'Unique transfer identifier in AbacatePay. At least one of `id`/`externalId` is required.',
		)
		.optional(),
	externalId: z
		.string()
		.describe(
			'Unique transfer identifier in your system. At least one of `id`/`externalId` is required.',
		)
		.optional(),
});

/**
 * https://api.abacatepay.com/v2/pix/get
 *
 * @reference https://docs.abacatepay.com/pages/pix/get
 */
export type RESTGetPixTransferQueryParams = z.infer<
	typeof RESTGetPixTransferQueryParams
>;

/**
 * https://api.abacatepay.com/v2/pix/get
 *
 * @reference https://docs.abacatepay.com/pages/pix/get
 */
export const RESTGetPixTransferData = APIResponse(APIPixTransfer);

/**
 * https://api.abacatepay.com/v2/pix/get
 *
 * @reference https://docs.abacatepay.com/pages/pix/get
 */
export type RESTGetPixTransferData = z.infer<typeof RESTGetPixTransferData>;

/**
 * https://api.abacatepay.com/v2/pix/list
 *
 * @reference https://docs.abacatepay.com/pages/pix/list
 */
export const RESTGetListPixTransfersQueryParams = z.object({
	limit: z
		.int()
		.min(1)
		.max(100)
		.describe('Number of items per page (1-100).')
		.optional(),
	after: z.string().describe('Cursor for the next page.').optional(),
	before: z.string().describe('Cursor for the previous page.').optional(),
	id: z.string().describe('Filter by AbacatePay transaction ID.').optional(),
	externalId: z.string().describe('Filter by external system ID.').optional(),
	status: z.string().describe('Filter by transaction status.').optional(),
});

/**
 * https://api.abacatepay.com/v2/pix/list
 *
 * @reference https://docs.abacatepay.com/pages/pix/list
 */
export type RESTGetListPixTransfersQueryParams = z.infer<
	typeof RESTGetListPixTransfersQueryParams
>;

/**
 * https://api.abacatepay.com/v2/pix/list
 *
 * @reference https://docs.abacatepay.com/pages/pix/list
 */
export const RESTGetListPixTransfersData = APIResponseWithCursorBasedPagination(
	z.array(APIPixTransfer),
);

/**
 * https://api.abacatepay.com/v2/pix/list
 *
 * @reference https://docs.abacatepay.com/pages/pix/list
 */
export type RESTGetListPixTransfersData = z.infer<
	typeof RESTGetListPixTransfersData
>;

/**
 * Inner `data` payload sent to `POST /transparents/create` when `method` is `PIX`.
 *
 * @reference https://docs.abacatepay.com/pages/transparents/create
 */
export const RESTPostCreateQRCodePixBody = RESTPostCreateNewCheckoutBody.pick({
	customer: true,
	metadata: true,
}).extend({
	amount: z.int().describe('Charge amount in cents.'),
	expiresIn: z.int().describe('Billing expiration time in seconds.').optional(),
	description: z
		.string()
		.describe('Message that will appear when paying the PIX.')
		.optional(),
});

/**
 * https://api.abacatepay.com/v2/transparents/create
 *
 * @reference https://docs.abacatepay.com/pages/transparents/create
 */
export type RESTPostCreateQRCodePixBody = z.infer<
	typeof RESTPostCreateQRCodePixBody
>;

/**
 * https://api.abacatepay.com/v2/transparents/create
 *
 * @reference https://docs.abacatepay.com/pages/transparents/create
 */
export const RESTPostCreateQRCodePixData = APIResponse(APIQRCodePIX);

/**
 * https://api.abacatepay.com/v2/transparents/create
 *
 * @reference https://docs.abacatepay.com/pages/transparents/create
 */
export type RESTPostCreateQRCodePixData = z.infer<
	typeof RESTPostCreateQRCodePixData
>;

/**
 * Inner `data` payload sent to `POST /transparents/create` when `method` is `BOLETO`.
 *
 * @reference https://docs.abacatepay.com/pages/transparents/boleto
 */
export const RESTPostCreateBoletoBody = z.object({
	amount: z.int().describe('Charge amount in cents.'),
	description: z
		.string()
		.describe('Message that will appear on the Boleto.')
		.optional(),
	customer: APICustomer.pick({ name: true, taxId: true })
		.and(APICustomer.pick({ email: true, cellphone: true }).partial())
		.describe('Customer data. `name` and `taxId` are mandatory for Boleto.'),
	metadata: z
		.record(z.string(), z.any())
		.describe('Optional charge metadata.')
		.optional(),
});

/**
 * https://api.abacatepay.com/v2/transparents/create
 *
 * @reference https://docs.abacatepay.com/pages/transparents/boleto
 */
export type RESTPostCreateBoletoBody = z.infer<typeof RESTPostCreateBoletoBody>;

/**
 * https://api.abacatepay.com/v2/transparents/create
 *
 * @reference https://docs.abacatepay.com/pages/transparents/boleto
 */
export const RESTPostCreateBoletoData = APIResponse(APIBoleto);

/**
 * https://api.abacatepay.com/v2/transparents/create
 *
 * @reference https://docs.abacatepay.com/pages/transparents/boleto
 */
export type RESTPostCreateBoletoData = z.infer<typeof RESTPostCreateBoletoData>;

/**
 * Wire-level request body for `POST /transparents/create` — the SDK builds this
 * from {@link RESTPostCreateQRCodePixBody} / {@link RESTPostCreateBoletoBody}, callers
 * never construct it directly.
 *
 * @reference https://docs.abacatepay.com/pages/transparents/reference
 */
export const RESTPostCreateTransparentBody = z.union([
	z.object({ method: z.literal('PIX'), data: RESTPostCreateQRCodePixBody }),
	z.object({ method: z.literal('BOLETO'), data: RESTPostCreateBoletoBody }),
]);

/**
 * @reference https://docs.abacatepay.com/pages/transparents/reference
 */
export type RESTPostCreateTransparentBody = z.infer<
	typeof RESTPostCreateTransparentBody
>;

/**
 * https://api.abacatepay.com/v2/transparents/list
 *
 * @reference https://docs.abacatepay.com/pages/transparents/list
 */
export const RESTGetListTransparentsQueryParams = z.object({
	after: z.string().describe('Cursor for the next page.').optional(),
	before: z.string().describe('Cursor for the previous page.').optional(),
	limit: z
		.int()
		.min(1)
		.max(100)
		.describe('Number of items per page (1-100).')
		.optional(),
	id: z.string().describe('Filter by QRCode/Boleto identifier.').optional(),
	status: PaymentStatus.optional(),
});

/**
 * https://api.abacatepay.com/v2/transparents/list
 *
 * @reference https://docs.abacatepay.com/pages/transparents/list
 */
export type RESTGetListTransparentsQueryParams = z.infer<
	typeof RESTGetListTransparentsQueryParams
>;

/**
 * https://api.abacatepay.com/v2/transparents/list
 *
 * @reference https://docs.abacatepay.com/pages/transparents/list
 */
export const RESTGetListTransparentsData = APIResponseWithCursorBasedPagination(
	z.array(z.union([APIQRCodePIX, APIBoleto])),
);

/**
 * https://api.abacatepay.com/v2/transparents/list
 *
 * @reference https://docs.abacatepay.com/pages/transparents/list
 */
export type RESTGetListTransparentsData = z.infer<
	typeof RESTGetListTransparentsData
>;

/**
 * https://api.abacatepay.com/v2/transparents/refund
 *
 * @reference https://docs.abacatepay.com/pages/transparents/refund
 */
export const RESTPostRefundTransparentBody = z.object({
	id: z
		.string()
		.describe(
			'Public ID of the resource to refund (prefixes: `char_`, `pix_char_`, `card_`, `bill_`).',
		),
	reason: z
		.string()
		.max(500)
		.describe('Refund reason, shown in the transaction history.')
		.optional(),
});

/**
 * https://api.abacatepay.com/v2/transparents/refund
 *
 * @reference https://docs.abacatepay.com/pages/transparents/refund
 */
export type RESTPostRefundTransparentBody = z.infer<
	typeof RESTPostRefundTransparentBody
>;

/**
 * https://api.abacatepay.com/v2/transparents/refund
 *
 * @reference https://docs.abacatepay.com/pages/transparents/refund
 */
export const RESTPostRefundTransparentData = APIResponse(
	z.object({
		refundPublicId: z
			.string()
			.describe('Public ID of the refund transaction that was created.'),
	}),
);

/**
 * https://api.abacatepay.com/v2/transparents/refund
 *
 * @reference https://docs.abacatepay.com/pages/transparents/refund
 */
export type RESTPostRefundTransparentData = z.infer<
	typeof RESTPostRefundTransparentData
>;

/**
 * https://api.abacatepay.com/v2/transparents/simulate-payment
 *
 * @reference https://docs.abacatepay.com/pages/transparents/simulate-payment
 */
export const RESTPostSimulateQRCodePixPaymentQueryParams = z.object({
	id: z.string().describe('QRCode Pix ID.'),
});

/**
 * https://api.abacatepay.com/v2/transparents/simulate-payment
 *
 * @reference https://docs.abacatepay.com/pages/transparents/simulate-payment
 */
export type RESTPostSimulateQRCodePixPaymentQueryParams = z.infer<
	typeof RESTPostSimulateQRCodePixPaymentQueryParams
>;

/**
 * https://api.abacatepay.com/v2/transparents/simulate-payment
 *
 * @reference https://docs.abacatepay.com/pages/transparents/simulate-payment
 */
export const RESTPostSimulateQRCodePixPaymentBody = z.object({
	metadata: z
		.record(z.string(), z.any())
		.describe('Optional metadata for the request.'),
});

/**
 * https://api.abacatepay.com/v2/transparents/simulate-payment
 *
 * @reference https://docs.abacatepay.com/pages/transparents/simulate-payment
 */
export type RESTPostSimulateQRCodePixPaymentBody = z.infer<
	typeof RESTPostSimulateQRCodePixPaymentBody
>;

/**
 * https://api.abacatepay.com/v2/transparents/simulate-payment
 *
 * @reference https://docs.abacatepay.com/pages/transparents/simulate-payment
 */
export const RESTPostSimulateQRCodePixPaymentData = APIResponse(APIQRCodePIX);

/**
 * https://api.abacatepay.com/v2/transparents/simulate-payment
 *
 * @reference https://docs.abacatepay.com/pages/transparents/simulate-payment
 */
export type RESTPostSimulateQRCodePixPaymentData = z.infer<
	typeof RESTPostSimulateQRCodePixPaymentData
>;

/**
 * https://api.abacatepay.com/v2/transparents/check
 *
 * @reference https://docs.abacatepay.com/pages/transparents/check
 */
export const RESTGetCheckQRCodePixStatusQueryParams = z.object({
	id: z.string().describe('QRCode Pix ID.'),
});

/**
 * https://api.abacatepay.com/v2/transparents/check
 *
 * @reference https://docs.abacatepay.com/pages/transparents/check
 */
export type RESTGetCheckQRCodePixStatusQueryParams = z.infer<
	typeof RESTGetCheckQRCodePixStatusQueryParams
>;

/**
 * https://api.abacatepay.com/v2/transparents/check
 *
 * @reference https://docs.abacatepay.com/pages/transparents/check
 */
export const RESTGetCheckQRCodePixStatusData = APIResponse(
	z.object({
		expiresAt: z.coerce.date().describe('QRCode Pix expiration date.'),
		status: PaymentStatus,
	}),
);

/**
 * https://api.abacatepay.com/v2/transparents/check
 *
 * @reference https://docs.abacatepay.com/pages/transparents/check
 */
export type RESTGetCheckQRCodePixStatusData = z.infer<
	typeof RESTGetCheckQRCodePixStatusData
>;

/**
 * https://api.abacatepay.com/v2/products/create
 *
 * @reference https://docs.abacatepay.com/pages/products/create
 */
export const RESTPostCreateProductBody = APIProduct.pick({
	name: true,
	price: true,
	currency: true,
	externalId: true,
}).extend({
	description: z.string().describe('Description for the product.').optional(),
});

/**
 * https://api.abacatepay.com/v2/products/create
 *
 * @reference https://docs.abacatepay.com/pages/products/create
 */
export type RESTPostCreateProductBody = z.infer<
	typeof RESTPostCreateProductBody
>;

/**
 * https://api.abacatepay.com/v2/products/create
 *
 * @reference https://docs.abacatepay.com/pages/products/create
 */
export const RESTPostCreateProductData = APIResponse(APIProduct);

/**
 * https://api.abacatepay.com/v2/products/create
 *
 * @reference https://docs.abacatepay.com/pages/products/create
 */
export type RESTPostCreateProductData = z.infer<
	typeof RESTPostCreateProductData
>;

/**
 * https://api.abacatepay.com/v2/products/list
 *
 * @reference https://docs.abacatepay.com/pages/products/list
 */
export const RESTGetListProductsQueryParams = z.object({
	page: z.int().min(1).default(1).describe('Page number.').optional(),
	limit: z.int().min(1).describe('Limit of products to return.').optional(),
});

/**
 * https://api.abacatepay.com/v2/products/list
 *
 * @reference https://docs.abacatepay.com/pages/products/list
 */
export type RESTGetListProductsQueryParams = z.infer<
	typeof RESTGetListProductsQueryParams
>;

/**
 * https://api.abacatepay.com/v2/products/list
 *
 * @reference https://docs.abacatepay.com/pages/products/list
 */
export const RESTGetListProductsData = APIResponseWithPagination(
	z.array(APIProduct),
);

/**
 * https://api.abacatepay.com/v2/products/list
 *
 * @reference https://docs.abacatepay.com/pages/products/list
 */
export type RESTGetListProductsData = z.infer<typeof RESTGetListProductsData>;

/**
 * https://api.abacatepay.com/v2/products/get
 *
 * @reference https://docs.abacatepay.com/pages/products/get
 */
export const RESTGetProductQueryParams = z.object({
	id: z.string().describe('The product ID.').optional(),
	externalId: z.string().describe('External ID of the product.').optional(),
});

/**
 * https://api.abacatepay.com/v2/products/get
 *
 * @reference https://docs.abacatepay.com/pages/products/get
 */
export type RESTGetProductQueryParams = z.infer<
	typeof RESTGetProductQueryParams
>;

/**
 * https://api.abacatepay.com/v2/products/get
 *
 * @reference https://docs.abacatepay.com/pages/products/get
 */
export const RESTGetProductData = APIResponse(APIProduct);

/**
 * https://api.abacatepay.com/v2/products/get
 *
 * @reference https://docs.abacatepay.com/pages/products/get
 */
export type RESTGetProductData = z.infer<typeof RESTGetProductData>;

/**
 * https://api.abacatepay.com/v2/products/delete
 *
 * @reference https://docs.abacatepay.com/pages/products/delete
 */
export const RESTDeleteProductQueryParams = z.object({
	id: z.string().describe('The product ID.'),
});

/**
 * https://api.abacatepay.com/v2/products/delete
 *
 * @reference https://docs.abacatepay.com/pages/products/delete
 */
export type RESTDeleteProductQueryParams = z.infer<
	typeof RESTDeleteProductQueryParams
>;

/**
 * https://api.abacatepay.com/v2/products/delete
 *
 * @reference https://docs.abacatepay.com/pages/products/delete
 */
export const RESTDeleteProductData = APIResponse(APIProduct);

/**
 * https://api.abacatepay.com/v2/products/delete
 *
 * @reference https://docs.abacatepay.com/pages/products/delete
 */
export type RESTDeleteProductData = z.infer<typeof RESTDeleteProductData>;

/**
 * https://api.abacatepay.com/v2/store/get
 *
 * @reference https://docs.abacatepay.com/pages/store/get
 */
export const RESTGetStoreDetailsData = APIResponse(APIStore);

/**
 * https://api.abacatepay.com/v2/store/get
 *
 * @reference https://docs.abacatepay.com/pages/store/get
 */
export type RESTGetStoreDetailsData = z.infer<typeof RESTGetStoreDetailsData>;

/**
 * https://api.abacatepay.com/v2/public-mrr/mrr
 *
 * @reference https://docs.abacatepay.com/pages/trustMRR/mrr
 */
export const RESTGetMRRData = APIResponse(
	z.object({
		mrr: z
			.int()
			.min(0)
			.describe(
				'Monthly recurring revenue in cents. Value 0 indicates that there is no recurring revenue at the moment.',
			),
		totalActiveSubscriptions: z
			.int()
			.min(0)
			.describe(
				'Total active subscriptions. Value 0 indicates that there are no currently active subscriptions.',
			),
	}),
);

/**
 * https://api.abacatepay.com/v2/public-mrr/mrr
 *
 * @reference https://docs.abacatepay.com/pages/trustMRR/mrr
 */
export type RESTGetMRRData = z.infer<typeof RESTGetMRRData>;

/**
 * https://api.abacatepay.com/v2/subscriptions/create
 *
 * @reference https://docs.abacatepay.com/pages/subscriptions/create
 */
export const RESTPostCreateSubscriptionBody = APISubscription.pick({
	name: true,
	amount: true,
	method: true,
	frequency: true,
	customerId: true,
	externalId: true,
	retryPolicy: true,
}).extend({
	description: z.string().describe('Subscription description.').optional(),
});

/**
 * https://api.abacatepay.com/v2/subscriptions/create
 *
 * @reference https://docs.abacatepay.com/pages/subscriptions/create
 */
export type RESTPostCreateSubscriptionBody = z.infer<
	typeof RESTPostCreateSubscriptionBody
>;

/**
 * https://api.abacatepay.com/v2/subscriptions/create
 *
 * @reference https://docs.abacatepay.com/pages/subscriptions/create
 */
export const RESTPostCreateSubscriptionData = APIResponse(APISubscription);

/**
 * https://api.abacatepay.com/v2/subscriptions/create
 *
 * @reference https://docs.abacatepay.com/pages/subscriptions/create
 */
export type RESTPostCreateSubscriptionData = z.infer<
	typeof RESTPostCreateSubscriptionData
>;

/**
 * https://api.abacatepay.com/v2/subscriptions/list
 *
 * @reference https://docs.abacatepay.com/pages/subscriptions/list
 */
export const RESTGetListSubscriptionsQueryParams = z.object({
	cursor: z.string().describe('Cursor for the pagination.').optional(),
	limit: z.int().default(20).describe('Number of items per page.').optional(),
});

/**
 * https://api.abacatepay.com/v2/subscriptions/list
 *
 * @reference https://docs.abacatepay.com/pages/subscriptions/list
 */
export type RESTGetListSubscriptionsQueryParams = z.infer<
	typeof RESTGetListSubscriptionsQueryParams
>;

/**
 * https://api.abacatepay.com/v2/subscriptions/list
 *
 * @reference https://docs.abacatepay.com/pages/subscriptions/list
 */
export const RESTGetListSubscriptionsData =
	APIResponseWithCursorBasedPagination(z.array(APISubscription));

/**
 * https://api.abacatepay.com/v2/subscriptions/list
 *
 * @reference https://docs.abacatepay.com/pages/subscriptions/list
 */
export type RESTGetListSubscriptionsData = z.infer<
	typeof RESTGetListSubscriptionsData
>;

/**
 * https://api.abacatepay.com/v2/subscriptions/cancel
 *
 * @reference https://docs.abacatepay.com/pages/subscriptions/cancel
 */
export const RESTPostCancelSubscriptionBody = z.object({
	id: z.string().describe('Unique subscription identifier.'),
});

/**
 * https://api.abacatepay.com/v2/subscriptions/cancel
 *
 * @reference https://docs.abacatepay.com/pages/subscriptions/cancel
 */
export type RESTPostCancelSubscriptionBody = z.infer<
	typeof RESTPostCancelSubscriptionBody
>;

/**
 * Cancellation is immediate (`cancelPolicy: NOW`) — there is no grace period.
 *
 * @reference https://docs.abacatepay.com/pages/subscriptions/cancel
 */
export const RESTPostCancelSubscriptionData = APIResponse(APISubscription);

/**
 * @reference https://docs.abacatepay.com/pages/subscriptions/cancel
 */
export type RESTPostCancelSubscriptionData = z.infer<
	typeof RESTPostCancelSubscriptionData
>;

/**
 * https://api.abacatepay.com/v2/subscriptions/change-plan
 *
 * @reference https://docs.abacatepay.com/pages/subscriptions/change-plan
 */
export const RESTPostChangeSubscriptionPlanBody = z.object({
	id: z.string().describe('Unique subscription identifier.'),
	productId: z
		.string()
		.describe(
			'ID of the new product. It must have a billing cycle configured.',
		),
	quantity: z.int().describe('New quantity for the product.'),
});

/**
 * https://api.abacatepay.com/v2/subscriptions/change-plan
 *
 * @reference https://docs.abacatepay.com/pages/subscriptions/change-plan
 */
export type RESTPostChangeSubscriptionPlanBody = z.infer<
	typeof RESTPostChangeSubscriptionPlanBody
>;

/**
 * Only one `PENDING` change can exist per subscription — calling this again
 * replaces the prior unapplied change. The change is applied at the next
 * billing cycle.
 *
 * @reference https://docs.abacatepay.com/pages/subscriptions/change-plan
 */
export const RESTPostChangeSubscriptionPlanData = APIResponse(
	APISubscriptionPlanChange,
);

/**
 * @reference https://docs.abacatepay.com/pages/subscriptions/change-plan
 */
export type RESTPostChangeSubscriptionPlanData = z.infer<
	typeof RESTPostChangeSubscriptionPlanData
>;

/**
 * https://api.abacatepay.com/v2/subscriptions/record-usage
 *
 * @reference https://docs.abacatepay.com/pages/subscriptions/record-usage
 */
export const RESTPostRecordSubscriptionUsageBody = z.object({
	id: z.string().describe('Unique subscription identifier.'),
	productId: z
		.string()
		.describe(
			'ID of the pay-as-you-go product (Must not have a billing cycle).',
		),
	units: z.int().describe('Number of units to record.'),
	action: StringEnum(
		['add', 'subtract'],
		'Whether to add or subtract the units from the current cycle.',
	),
});

/**
 * https://api.abacatepay.com/v2/subscriptions/record-usage
 *
 * @reference https://docs.abacatepay.com/pages/subscriptions/record-usage
 */
export type RESTPostRecordSubscriptionUsageBody = z.infer<
	typeof RESTPostRecordSubscriptionUsageBody
>;

/**
 * https://api.abacatepay.com/v2/subscriptions/record-usage
 *
 * @reference https://docs.abacatepay.com/pages/subscriptions/record-usage
 */
export const RESTPostRecordSubscriptionUsageData = APIResponse(
	APISubscriptionUsageRecord,
);

/**
 * https://api.abacatepay.com/v2/subscriptions/record-usage
 *
 * @reference https://docs.abacatepay.com/pages/subscriptions/record-usage
 */
export type RESTPostRecordSubscriptionUsageData = z.infer<
	typeof RESTPostRecordSubscriptionUsageData
>;

/**
 * https://api.abacatepay.com/v2/webhooks/create
 *
 * @reference https://docs.abacatepay.com/pages/webhooks/create
 */
export const RESTPostCreateWebhookBody = z.object({
	name: z.string().describe('Webhook name, for your own identification.'),
	endpoint: z.url().describe('HTTPS endpoint that will receive the events.'),
	secret: z
		.string()
		.describe('Secret used to sign the payloads sent to `endpoint`.'),
	events: z
		.array(WebhookEventType)
		.describe('Event types this webhook should be notified about.'),
});

/**
 * https://api.abacatepay.com/v2/webhooks/create
 *
 * @reference https://docs.abacatepay.com/pages/webhooks/create
 */
export type RESTPostCreateWebhookBody = z.infer<
	typeof RESTPostCreateWebhookBody
>;

/**
 * https://api.abacatepay.com/v2/webhooks/create
 *
 * @reference https://docs.abacatepay.com/pages/webhooks/create
 */
export const RESTPostCreateWebhookData = APIResponse(APIWebhook);

/**
 * https://api.abacatepay.com/v2/webhooks/create
 *
 * @reference https://docs.abacatepay.com/pages/webhooks/create
 */
export type RESTPostCreateWebhookData = z.infer<
	typeof RESTPostCreateWebhookData
>;

/**
 * https://api.abacatepay.com/v2/webhooks/list
 *
 * @reference https://docs.abacatepay.com/pages/webhooks/list
 */
export const RESTGetListWebhooksQueryParams = z.object({
	search: z
		.string()
		.describe('Search by webhook name, ID, or endpoint.')
		.optional(),
	after: z.string().describe('Cursor for the next page.').optional(),
	before: z.string().describe('Cursor for the previous page.').optional(),
	limit: z
		.int()
		.min(1)
		.max(100)
		.describe('Number of items per page (1-100).')
		.optional(),
	id: z.string().describe('Filter by a specific webhook ID.').optional(),
});

/**
 * https://api.abacatepay.com/v2/webhooks/list
 *
 * @reference https://docs.abacatepay.com/pages/webhooks/list
 */
export type RESTGetListWebhooksQueryParams = z.infer<
	typeof RESTGetListWebhooksQueryParams
>;

/**
 * https://api.abacatepay.com/v2/webhooks/list
 *
 * @reference https://docs.abacatepay.com/pages/webhooks/list
 */
export const RESTGetListWebhooksData = APIResponseWithCursorBasedPagination(
	z.array(APIWebhook),
);

/**
 * https://api.abacatepay.com/v2/webhooks/list
 *
 * @reference https://docs.abacatepay.com/pages/webhooks/list
 */
export type RESTGetListWebhooksData = z.infer<typeof RESTGetListWebhooksData>;

/**
 * https://api.abacatepay.com/v2/webhooks/get
 *
 * @reference https://docs.abacatepay.com/pages/webhooks/get
 */
export const RESTGetWebhookQueryParams = z.object({
	id: z.string().describe('Unique webhook identifier.'),
});

/**
 * https://api.abacatepay.com/v2/webhooks/get
 *
 * @reference https://docs.abacatepay.com/pages/webhooks/get
 */
export type RESTGetWebhookQueryParams = z.infer<
	typeof RESTGetWebhookQueryParams
>;

/**
 * https://api.abacatepay.com/v2/webhooks/get
 *
 * @reference https://docs.abacatepay.com/pages/webhooks/get
 */
export const RESTGetWebhookData = APIResponse(APIWebhook);

/**
 * https://api.abacatepay.com/v2/webhooks/get
 *
 * @reference https://docs.abacatepay.com/pages/webhooks/get
 */
export type RESTGetWebhookData = z.infer<typeof RESTGetWebhookData>;

/**
 * https://api.abacatepay.com/v2/webhooks/delete
 *
 * @reference https://docs.abacatepay.com/pages/webhooks/delete
 */
export const RESTPostDeleteWebhookBody = z.object({
	id: z.string().describe('Unique webhook identifier.'),
});

/**
 * https://api.abacatepay.com/v2/webhooks/delete
 *
 * @reference https://docs.abacatepay.com/pages/webhooks/delete
 */
export type RESTPostDeleteWebhookBody = z.infer<
	typeof RESTPostDeleteWebhookBody
>;

/**
 * https://api.abacatepay.com/v2/webhooks/delete
 *
 * @reference https://docs.abacatepay.com/pages/webhooks/delete
 */
export const RESTPostDeleteWebhookData = APIResponse(APIWebhook);

/**
 * https://api.abacatepay.com/v2/webhooks/delete
 *
 * @reference https://docs.abacatepay.com/pages/webhooks/delete
 */
export type RESTPostDeleteWebhookData = z.infer<
	typeof RESTPostDeleteWebhookData
>;

/**
 * https://api.abacatepay.com/v2/customers/list
 *
 * @reference https://docs.abacatepay.com/pages/client/list
 */
export const RESTGetListCustomersData = APIResponseWithPagination(
	z.array(APICustomer),
);

/**
 * https://api.abacatepay.com/v2/customers/list
 *
 * @reference https://docs.abacatepay.com/pages/client/list
 */
export type RESTGetListCustomersData = z.infer<typeof RESTGetListCustomersData>;

/**
 * https://api.abacatepay.com/v2/customers/list
 *
 * @reference https://docs.abacatepay.com/pages/client/list
 */
export const RESTGetListCustomersQueryParams = z.object({
	page: z.int().min(1).default(1).describe('Page number.').optional(),
	limit: z.int().min(1).describe('Number of items per page.').optional(),
});

/**
 * https://api.abacatepay.com/v2/customers/list
 *
 * @reference https://docs.abacatepay.com/pages/client/list
 */
export type RESTGetListCustomersQueryParams = z.infer<
	typeof RESTGetListCustomersQueryParams
>;

/**
 * https://api.abacatepay.com/v2/customers/get
 *
 * @reference https://docs.abacatepay.com/pages/client/get
 */
export const RESTGetCustomerQueryParams = z.object({
	id: z.string().describe('The ID of the customer.'),
});

/**
 * https://api.abacatepay.com/v2/customers/get
 *
 * @reference https://docs.abacatepay.com/pages/client/get
 */
export type RESTGetCustomerQueryParams = z.infer<
	typeof RESTGetCustomerQueryParams
>;

/**
 * https://api.abacatepay.com/v2/customers/get
 *
 * @reference https://docs.abacatepay.com/pages/client/get
 */
export const RESTGetCustomerData = APIResponse(
	APICustomer.omit({ country: true, zipCode: true }),
);

/**
 * https://api.abacatepay.com/v2/customers/get
 *
 * @reference https://docs.abacatepay.com/pages/client/get
 */
export type RESTGetCustomerData = z.infer<typeof RESTGetCustomerData>;

/**
 * https://api.abacatepay.com/v2/customers/delete
 *
 * @reference https://docs.abacatepay.com/pages/client/delete
 */
export const RESTDeleteCustomerBody = z.object({
	id: z
		.string()
		.describe('Unique public identifier of the customer to be deleted.'),
});

/**
 * https://api.abacatepay.com/v2/customers/delete
 *
 * @reference https://docs.abacatepay.com/pages/client/delete
 */
export type RESTDeleteCustomerBody = z.infer<typeof RESTDeleteCustomerBody>;

/**
 * https://api.abacatepay.com/v2/customers/delete
 *
 * @reference https://docs.abacatepay.com/pages/client/delete
 */
export const RESTDeleteCustomerData = APIResponse(
	APICustomer.omit({ country: true, zipCode: true }),
);

/**
 * https://api.abacatepay.com/v2/customers/delete
 *
 * @reference https://docs.abacatepay.com/pages/client/delete
 */
export type RESTDeleteCustomerData = z.infer<typeof RESTDeleteCustomerData>;

/**
 * https://api.abacatepay.com/v2/public-mrr/revenue
 *
 * @reference https://docs.abacatepay.com/pages/trustMRR/list
 */
export const RESTGetRevenueByPeriodQueryParams = z.object({
	startDate: z.coerce.date().describe('Period start date (YYYY-MM-DD format).'),
	endDate: z.coerce.date().describe('Period end date (YYYY-MM-DD format).'),
});

/**
 * https://api.abacatepay.com/v2/public-mrr/revenue
 *
 * @reference https://docs.abacatepay.com/pages/trustMRR/list
 */
export type RESTGetRevenueByPeriodQueryParams = z.infer<
	typeof RESTGetRevenueByPeriodQueryParams
>;

/**
 * https://api.abacatepay.com/v2/public-mrr/revenue
 *
 * @reference https://docs.abacatepay.com/pages/trustMRR/list
 */
export const RESTGetRevenueByPeriodData = APIResponse(
	z.object({
		totalRevenue: z.int().describe('Total revenue for the period in cents.'),
		totalTransactions: z.int().describe('Total transactions in the period.'),
		transactionsPerDay: z
			.record(
				z.string(),
				z.object({
					amount: z
						.int()
						.describe("Total value of the day's transactions in cents."),
					count: z.int().describe('Number of transactions for the day.'),
				}),
			)
			.describe(
				'Object with transactions grouped by day (key is the date in YYYY-MM-DD format).',
			),
	}),
);

/**
 * https://api.abacatepay.com/v2/public-mrr/revenue
 *
 * @reference https://docs.abacatepay.com/pages/trustMRR/list
 */
export type RESTGetRevenueByPeriodData = z.infer<
	typeof RESTGetRevenueByPeriodData
>;

/**
 * https://api.abacatepay.com/v2/public-mrr/merchant-info
 *
 * @reference https://docs.abacatepay.com/pages/trustMRR/get
 */
export const RESTGetMerchantData = APIResponse(
	z.object({
		name: z.string().describe('Store name.'),
		website: z.url().describe('Store website.'),
		createdAt: z.coerce.date().describe('Store creation date.'),
	}),
);

/**
 * https://api.abacatepay.com/v2/public-mrr/merchant-info
 *
 * @reference https://docs.abacatepay.com/pages/trustMRR/get
 */
export type RESTGetMerchantData = z.infer<typeof RESTGetMerchantData>;
