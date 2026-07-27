import { type Static, type TAnySchema, Type as t } from '@sinclair/typebox';
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
export const APIResponse = <Schema extends TAnySchema>(schema: Schema) =>
	t.Union([
		t.Object({
			data: schema,
			error: t.Null({
				examples: [null],
				description: 'Error message returned from the API.',
			}),
			success: t.Literal(true, {
				examples: [true],
				description: 'Whether the response was successfull or not.',
			}),
		}),
		t.Object({
			data: t.Null(),
			error: t.String({
				examples: ['API key inválida.'],
				description: 'Error message returned from the API.',
			}),
			success: t.Literal(false, {
				examples: [false],
				description: 'Whether the response was successfull or not.',
			}),
		}),
	]);

/**
 * Any response returned by the AbacatePay API
 */
export type APIResponse<Schema extends TAnySchema> = Static<
	ReturnType<typeof APIResponse<Schema>>
>;

/**
 * Any response returned by the AbacatePay API that has a `pagination` field (Not cursor based)
 * @returns
 */
export const APIResponseWithPagination = <Schema extends TAnySchema>(
	schema: Schema,
) =>
	t.Union([
		t.Object({
			data: schema,
			error: t.Null({
				description: 'Error message returned from the API',
			}),
			success: t.Literal(true, {
				description: 'Whether the response was successfull or not.',
			}),
			pagination: t.Object({
				page: t.Integer({
					minimum: 1,
					examples: [1],
					description: 'Current page.',
				}),
				limit: t.Integer({
					minimum: 0,
					examples: [15],
					description: 'Number of items per page.',
				}),
				items: t.Integer({
					minimum: 0,
					examples: [5],
					description: 'Number of items.',
				}),
				totalPages: t.Integer({
					minimum: 0,
					examples: [1],
					description: 'Number of pages.',
				}),
			}),
		}),
		t.Object({
			data: t.Null(),
			error: t.String({
				description: 'Error message returned from the API.',
			}),
			success: t.Literal(false, {
				description: 'Whether the response was successfull or not.',
			}),
		}),
	]);

/**
 * Any response returned by the AbacatePay API that has a `pagination` field (Not cursor based)
 * @returns
 */
export type APIResponseWithPagination<Schema extends TAnySchema> = Static<
	ReturnType<typeof APIResponseWithPagination<Schema>>
>;

/**
 * Any response returned by the AbacatePay API that has a `pagination` field and is cursor-based
 */
export const APIResponseWithCursorBasedPagination = <Schema extends TAnySchema>(
	schema: Schema,
) =>
	t.Union([
		t.Object({
			data: schema,
			error: t.Null({
				description: 'Error message returned from the API',
			}),
			success: t.Literal(true, {
				description: 'Whether the response was successfull or not.',
			}),
			pagination: t.Object({
				limit: t.Integer({
					minimum: 0,
					examples: [15],
					description: 'Number of items per page.',
				}),
				hasNext: t.Boolean({
					examples: [false],
					description: 'Indicates whether there is a next page.',
				}),
				hasPrevious: t.Boolean({
					examples: [true],
					description: 'Indicates whether there is a previous page.',
				}),
				nextCursor: t.Union([t.Null(), t.String()], {
					examples: [null],
					description: 'Cursor for the next page.',
				}),
			}),
		}),
		t.Object({
			data: t.Null(),
			error: t.String({
				description: 'Error message returned from the API.',
			}),
			success: t.Literal(false, {
				description: 'Whether the response was successfull or not.',
			}),
		}),
	]);

/**
 * Any response returned by the AbacatePay API that has a `pagination` field and is cursor-based
 */
export type APIResponseWithCursorBasedPagination<Schema extends TAnySchema> =
	Static<ReturnType<typeof APIResponseWithCursorBasedPagination<Schema>>>;

/**
 * https://api.abacatepay.com/v2/checkouts/create
 *
 * @reference https://docs.abacatepay.com/pages/payment/create
 */
export const RESTPostCreateNewCheckoutBody = t.Object({
	methods: t.Optional(
		t.Array(PaymentMethod, {
			description:
				'Payment methods that will be accepted (Defaults to `[PIX, CARD]`).',
		}),
	),
	returnUrl: t.Optional(
		t.String({
			format: 'uri',
			examples: ['https://yourstore.com/checkout/cancelled'],
			description:
				'URL to redirect the customer if they click on the "Back" option.',
		}),
	),
	completionUrl: t.Optional(
		t.String({
			format: 'uri',
			examples: ['https://yourstore.com/checkout/thanks'],
			description: 'URL to redirect the customer when payment is completed.',
		}),
	),
	customerId: t.Optional(
		t.String({
			examples: [undefined],
			description: 'The ID of a customer already registered in your store.',
		}),
	),
	customer: t.Optional(
		t.Pick(APICustomer, ['name', 'email', 'taxId', 'cellphone']),
	),
	coupons: t.Optional(
		t.Array(
			t.String({
				examples: ['SUMMER_26'],
			}),
			{
				maxItems: 50,
				description:
					'List of coupons available for resem used with billing (0-50 max.).',
			},
		),
	),
	externalId: t.Optional(
		t.String({
			examples: ['invoice_123456'],
			description:
				'If you have a unique identifier for your billing application, completely optional.',
		}),
	),
	metadata: t.Optional(
		t.Record(t.String(), t.Any(), {
			examples: [{}],
			description: 'Optional billing metadata.',
		}),
	),
	items: APICheckout.properties.items,
	frequency: t.Optional(
		StringEnum(['ONE_TIME', 'MULTIPLE_PAYMENTS', 'SUBSCRIPTION'], {
			examples: ['ONE_TIME'],
			description: 'Billing frequency. Defaults to `ONE_TIME`.',
		}),
	),
	upSellProductId: t.Optional(
		t.String({
			description: 'ID of an additional product offered as an upsell.',
		}),
	),
	interest: t.Optional(
		t.Object(
			{
				value: t.Integer({
					description: 'Monthly interest rate, in hundredths of a percent.',
				}),
			},
			{ description: 'Late interest configuration (Applies to BOLETO).' },
		),
	),
	fine: t.Optional(
		t.Object(
			{
				value: t.Integer({ description: 'Fine value.' }),
				type: StringEnum(['PERCENTAGE', 'FIXED'], {
					description: 'Type of fine applied.',
				}),
			},
			{ description: 'Late fine configuration (Applies to BOLETO).' },
		),
	),
});

/**
 * https://api.abacatepay.com/v2/checkouts/create
 *
 * @reference https://docs.abacatepay.com/pages/payment/create
 */
export type RESTPostCreateNewCheckoutBody = Static<
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
export type RESTPostCreateNewCheckoutData = Static<
	typeof RESTPostCreateNewCheckoutData
>;

/**
 * https://api.abacatepay.com/v2/checkouts/refund
 *
 * @reference https://docs.abacatepay.com/pages/payment/refund
 */
export const RESTPostRefundCheckoutBody = t.Object({
	id: t.String({
		description:
			'Public ID of the resource to refund (prefixes: `bill_`, `char_`, `pix_char_`, `card_`).',
	}),
	reason: t.Optional(
		t.String({
			maxLength: 500,
			description: 'Refund reason, shown in the transaction history.',
		}),
	),
});

/**
 * https://api.abacatepay.com/v2/checkouts/refund
 *
 * @reference https://docs.abacatepay.com/pages/payment/refund
 */
export type RESTPostRefundCheckoutBody = Static<
	typeof RESTPostRefundCheckoutBody
>;

/**
 * https://api.abacatepay.com/v2/checkouts/refund
 *
 * @reference https://docs.abacatepay.com/pages/payment/refund
 */
export const RESTPostRefundCheckoutData = APIResponse(
	t.Object({
		refundPublicId: t.String({
			description: 'Public ID of the refund transaction that was created.',
		}),
	}),
);

/**
 * https://api.abacatepay.com/v2/checkouts/refund
 *
 * @reference https://docs.abacatepay.com/pages/payment/refund
 */
export type RESTPostRefundCheckoutData = Static<
	typeof RESTPostRefundCheckoutData
>;

/**
 * https://api.abacatepay.com/v2/checkouts/list
 *
 * @reference https://docs.abacatepay.com/pages/payment/list
 */
export const RESTGetListCheckoutsQueryParams = t.Object({
	page: t.Optional(
		t.Integer({ minimum: 1, default: 1, description: 'Number of the page.' }),
	),
	limit: t.Optional(
		t.Integer({ minimum: 1, description: 'Number of items per page.' }),
	),
});

/**
 * https://api.abacatepay.com/v2/checkouts/list
 *
 * @reference https://docs.abacatepay.com/pages/payment/list
 */
export type RESTGetListCheckoutsQueryParams = Static<
	typeof RESTGetListCheckoutsQueryParams
>;

/**
 * https://api.abacatepay.com/v2/checkouts/list
 *
 * @reference https://docs.abacatepay.com/pages/payment/list
 */
export const RESTGetListCheckoutsData = APIResponseWithPagination(
	t.Array(APICheckout),
);

/**
 * https://api.abacatepay.com/v2/checkouts/list
 *
 * @reference https://docs.abacatepay.com/pages/payment/list
 */
export type RESTGetListCheckoutsData = Static<typeof RESTGetListCheckoutsData>;

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
export type RESTGetCheckoutData = Static<typeof RESTGetCheckoutData>;

/**
 * https://api.abacatepay.com/v2/checkouts/get
 *
 * @reference https://docs.abacatepay.com/pages/payment/one
 */
export const RESTGetCheckoutQueryParams = t.Object({
	id: t.String({
		examples: ['bill_12oimasd23'],
		description: 'Unique billing identifier.',
	}),
});

/**
 * https://api.abacatepay.com/v2/checkouts/get
 *
 * @reference https://docs.abacatepay.com/pages/payment/one
 */
export type RESTGetCheckoutQueryParams = Static<
	typeof RESTGetCheckoutQueryParams
>;

/**
 * https://api.abacatepay.com/v2/payment-links/create
 *
 * @reference https://docs.abacatepay.com/pages/payment-links/create
 */
export const RESTPostCreatePaymentLinkBody = t.Omit(
	RESTPostCreateNewCheckoutBody,
	['customerId', 'customer', 'frequency', 'upSellProductId'],
);

/**
 * https://api.abacatepay.com/v2/payment-links/create
 *
 * @reference https://docs.abacatepay.com/pages/payment-links/create
 */
export type RESTPostCreatePaymentLinkBody = Static<
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
export type RESTPostCreatePaymentLinkData = Static<
	typeof RESTPostCreatePaymentLinkData
>;

/**
 * https://api.abacatepay.com/v2/payment-links/list
 *
 * @reference https://docs.abacatepay.com/pages/payment-links/list
 */
export const RESTGetListPaymentLinksQueryParams = t.Object({
	page: t.Optional(
		t.Integer({ minimum: 1, default: 1, description: 'Number of the page.' }),
	),
	limit: t.Optional(
		t.Integer({ minimum: 1, description: 'Number of items per page.' }),
	),
});

/**
 * https://api.abacatepay.com/v2/payment-links/list
 *
 * @reference https://docs.abacatepay.com/pages/payment-links/list
 */
export type RESTGetListPaymentLinksQueryParams = Static<
	typeof RESTGetListPaymentLinksQueryParams
>;

/**
 * https://api.abacatepay.com/v2/payment-links/list
 *
 * @reference https://docs.abacatepay.com/pages/payment-links/list
 */
export const RESTGetListPaymentLinksData = APIResponseWithPagination(
	t.Array(APIPaymentLink),
);

/**
 * https://api.abacatepay.com/v2/payment-links/list
 *
 * @reference https://docs.abacatepay.com/pages/payment-links/list
 */
export type RESTGetListPaymentLinksData = Static<
	typeof RESTGetListPaymentLinksData
>;

/**
 * https://api.abacatepay.com/v2/payment-links/one
 *
 * @reference https://docs.abacatepay.com/pages/payment-links/one
 */
export const RESTGetPaymentLinkQueryParams = t.Object({
	id: t.String({ description: 'Unique payment link identifier.' }),
});

/**
 * https://api.abacatepay.com/v2/payment-links/one
 *
 * @reference https://docs.abacatepay.com/pages/payment-links/one
 */
export type RESTGetPaymentLinkQueryParams = Static<
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
export type RESTGetPaymentLinkData = Static<typeof RESTGetPaymentLinkData>;

/**
 * https://api.abacatepay.com/v2/payment-links/refund
 *
 * @reference https://docs.abacatepay.com/pages/payment-links/refund
 */
export const RESTPostRefundPaymentLinkBody = t.Object({
	id: t.String({ description: 'Public ID of the resource to refund.' }),
	reason: t.Optional(
		t.String({
			maxLength: 500,
			description: 'Refund reason, shown in the transaction history.',
		}),
	),
});

/**
 * https://api.abacatepay.com/v2/payment-links/refund
 *
 * @reference https://docs.abacatepay.com/pages/payment-links/refund
 */
export type RESTPostRefundPaymentLinkBody = Static<
	typeof RESTPostRefundPaymentLinkBody
>;

/**
 * https://api.abacatepay.com/v2/payment-links/refund
 *
 * @reference https://docs.abacatepay.com/pages/payment-links/refund
 */
export const RESTPostRefundPaymentLinkData = APIResponse(
	t.Object({
		refundPublicId: t.String({
			description: 'Public ID of the refund transaction that was created.',
		}),
	}),
);

/**
 * https://api.abacatepay.com/v2/payment-links/refund
 *
 * @reference https://docs.abacatepay.com/pages/payment-links/refund
 */
export type RESTPostRefundPaymentLinkData = Static<
	typeof RESTPostRefundPaymentLinkData
>;

/**
 * https://api.abacatepay.com/v2/coupons/create
 *
 * @reference https://docs.abacatepay.com/pages/coupons/create
 */
export const RESTPostCreateCouponBody = t.Object({
	code: t.String({
		examples: ['DEYVIN_20'],
		description: 'Unique coupon identifier.',
	}),
	discount: t.Integer({
		examples: [2300],
		description: 'Discount amount to be applied.',
	}),
	discountKind: CouponDiscountKind,
	notes: t.Optional(
		t.String({
			examples: ['Test coupon.'],
			description: 'Coupon description',
		}),
	),
	maxRedeems: t.Optional(
		t.Integer({
			minimum: -1,
			examples: [3],
			description:
				'Number of times the coupon can be redeemed. -1 means this coupon can be redeemed without limits.',
		}),
	),
	metadata: t.Record(t.String(), t.Any(), {
		examples: [{}],
		description: 'Key value object for coupon metadata.',
	}),
});

/**
 * https://api.abacatepay.com/v2/coupons/create
 *
 * @reference https://docs.abacatepay.com/pages/coupons/create
 */
export type RESTPostCreateCouponBody = Static<typeof RESTPostCreateCouponBody>;

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
export type RESTPostCreateCouponData = Static<typeof RESTPostCreateCouponData>;

/**
 * https://api.abacatepay.com/v2/coupons/list
 *
 * @reference https://docs.abacatepay.com/pages/coupons/list
 */
export const RESTGetListCouponsData = APIResponseWithPagination(
	t.Array(APICoupon),
);

/**
 * https://api.abacatepay.com/v2/coupons/list
 *
 * @reference https://docs.abacatepay.com/pages/coupons/list
 */
export type RESTGetListCouponsData = Static<typeof RESTGetListCouponsData>;

/**
 * https://api.abacatepay.com/v2/coupons/list
 *
 * @reference https://docs.abacatepay.com/pages/coupons/list
 */
export const RESTGetListCouponsQueryParams = t.Object({
	page: t.Optional(
		t.Integer({
			minimum: 1,
			default: 1,
			examples: [3],
			description: 'Page number.',
		}),
	),
	limit: t.Optional(
		t.Integer({
			minimum: 1,
			examples: [15],
			description: 'Number of items per page.',
		}),
	),
});

/**
 * https://api.abacatepay.com/v2/coupons/list
 *
 * @reference https://docs.abacatepay.com/pages/coupons/list
 */
export type RESTGetListCouponsQueryParams = Static<
	typeof RESTGetListCouponsQueryParams
>;

/**
 * https://api.abacatepay.com/v2/coupons/get
 *
 * @reference https://docs.abacatepay.com/pages/coupons/get
 */
export const RESTGetCouponQueryParams = t.Object({
	id: t.String({
		examples: ['SUMMER_26'],
		description: 'The ID of the coupon.',
	}),
});

/**
 * https://api.abacatepay.com/v2/coupons/get
 *
 * @reference https://docs.abacatepay.com/pages/coupons/get
 */
export type RESTGetCouponQueryParams = Static<typeof RESTGetCouponQueryParams>;

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
export type RESTGetCouponData = Static<typeof RESTGetCouponData>;

/**
 * https://api.abacatepay.com/v2/coupons/delete
 *
 * @reference https://docs.abacatepay.com/pages/coupons/delete
 */
export const RESTDeleteCouponBody = t.Object({
	id: t.String({
		examples: ['SUMMER_26'],
		description: 'The ID of the coupon.',
	}),
});

/**
 * https://api.abacatepay.com/v2/coupons/delete
 *
 * @reference https://docs.abacatepay.com/pages/coupons/delete
 */
export type RESTDeleteCouponBody = Static<typeof RESTDeleteCouponBody>;

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
export type RESTDeleteCouponData = Static<typeof RESTDeleteCouponData>;

/**
 * https://api.abacatepay.com/v2/coupons/toggle
 *
 * @reference https://docs.abacatepay.com/pages/coupons/toggle
 */
export const RESTPostToggleCouponStatusBody = t.Object({
	id: t.String({
		examples: ['SUMMER_26'],
		description: 'The ID of the coupon.',
	}),
});

/**
 * https://api.abacatepay.com/v2/coupons/toggle
 *
 * @reference https://docs.abacatepay.com/pages/coupons/toggle
 */
export type RESTPostToggleCouponStatusBody = Static<
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
export type RESTPostToggleCouponStatusData = Static<
	typeof RESTPostToggleCouponStatusData
>;

/**
 * https://api.abacatepay.com/v2/payouts/create
 *
 * @reference https://docs.abacatepay.com/pages/payouts/create
 */
export const RESTPostCreateNewPayoutBody = t.Object({
	externalId: t.String({
		examples: ['invoice_1231231'],
		description: 'Unique identifier of the payout in your system.',
	}),
	amount: t.Integer({
		minimum: 350,
		examples: [350],
		description: 'Payout value in cents (Min 350).',
	}),
	description: t.Optional(
		t.String({
			examples: ['No desc for this.'],
			description: 'Optional payout description.',
		}),
	),
});

/**
 * https://api.abacatepay.com/v2/payouts/create
 *
 * @reference https://docs.abacatepay.com/pages/payouts/create
 */
export type RESTPostCreateNewPayoutBody = Static<
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
export type RESTPostCreateNewPayoutData = Static<
	typeof RESTPostCreateNewPayoutData
>;

/**
 * https://api.abacatepay.com/v2/payouts/get
 *
 * @reference https://docs.abacatepay.com/pages/payouts/get
 */
export const RESTGetSearchPayoutQueryParams = t.Object({
	externalId: t.String({
		examples: ['invoice_12312312'],
		description: 'Unique payout identifier in your system.',
	}),
});

/**
 * https://api.abacatepay.com/v2/payouts/get
 *
 * @reference https://docs.abacatepay.com/pages/payouts/get
 */
export type RESTGetSearchPayoutQueryParams = Static<
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
export type RESTGetSearchPayoutData = Static<typeof RESTGetSearchPayoutData>;

/**
 * https://api.abacatepay.com/v2/payouts/list
 *
 * @reference https://docs.abacatepay.com/pages/payouts/list
 */
export const RESTGetListPayoutsQueryParams = t.Object({
	page: t.Optional(
		t.Integer({
			minimum: 1,
			default: 1,
			examples: [3],
			description: 'Page number.',
		}),
	),
	limit: t.Optional(
		t.Integer({
			minimum: 1,
			examples: [15],
			description: 'Number of items per page.',
		}),
	),
});

/**
 * https://api.abacatepay.com/v2/payouts/list
 *
 * @reference https://docs.abacatepay.com/pages/payouts/list
 */
export type RESTGetListPayoutsQueryParams = Static<
	typeof RESTGetListPayoutsQueryParams
>;

/**
 * https://api.abacatepay.com/v2/payouts/list
 *
 * @reference https://docs.abacatepay.com/pages/payouts/list
 */
export const RESTGetListPayoutsData = APIResponseWithPagination(
	t.Array(APIPayout),
);

/**
 * https://api.abacatepay.com/v2/payouts/list
 *
 * @reference https://docs.abacatepay.com/pages/payouts/list
 */
export type RESTGetListPayoutsData = Static<typeof RESTGetListPayoutsData>;

/**
 * https://api.abacatepay.com/v2/pix/send
 *
 * @reference https://docs.abacatepay.com/pages/pix/create
 */
export const RESTPostSendPixTransferBody = t.Object({
	amount: t.Integer({
		minimum: 1,
		description: 'Transfer amount in cents (Min 100).',
	}),
	externalId: t.String({
		description: 'Unique identifier of the transfer in your system.',
	}),
	description: t.Optional(
		t.String({ description: 'Optional transfer description.' }),
	),
	pix: t.Object({
		key: t.String({ description: 'The PIX key itself.' }),
		type: PixKeyType,
	}),
});

/**
 * https://api.abacatepay.com/v2/pix/send
 *
 * @reference https://docs.abacatepay.com/pages/pix/create
 */
export type RESTPostSendPixTransferBody = Static<
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
export type RESTPostSendPixTransferData = Static<
	typeof RESTPostSendPixTransferData
>;

/**
 * https://api.abacatepay.com/v2/pix/get
 *
 * @reference https://docs.abacatepay.com/pages/pix/get
 */
export const RESTGetPixTransferQueryParams = t.Object({
	id: t.Optional(
		t.String({
			description:
				'Unique transfer identifier in AbacatePay. At least one of `id`/`externalId` is required.',
		}),
	),
	externalId: t.Optional(
		t.String({
			description:
				'Unique transfer identifier in your system. At least one of `id`/`externalId` is required.',
		}),
	),
});

/**
 * https://api.abacatepay.com/v2/pix/get
 *
 * @reference https://docs.abacatepay.com/pages/pix/get
 */
export type RESTGetPixTransferQueryParams = Static<
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
export type RESTGetPixTransferData = Static<typeof RESTGetPixTransferData>;

/**
 * https://api.abacatepay.com/v2/pix/list
 *
 * @reference https://docs.abacatepay.com/pages/pix/list
 */
export const RESTGetListPixTransfersQueryParams = t.Object({
	limit: t.Optional(
		t.Integer({
			minimum: 1,
			maximum: 100,
			description: 'Number of items per page (1-100).',
		}),
	),
	after: t.Optional(t.String({ description: 'Cursor for the next page.' })),
	before: t.Optional(
		t.String({ description: 'Cursor for the previous page.' }),
	),
	id: t.Optional(
		t.String({ description: 'Filter by AbacatePay transaction ID.' }),
	),
	externalId: t.Optional(
		t.String({ description: 'Filter by external system ID.' }),
	),
	status: t.Optional(
		t.String({ description: 'Filter by transaction status.' }),
	),
});

/**
 * https://api.abacatepay.com/v2/pix/list
 *
 * @reference https://docs.abacatepay.com/pages/pix/list
 */
export type RESTGetListPixTransfersQueryParams = Static<
	typeof RESTGetListPixTransfersQueryParams
>;

/**
 * https://api.abacatepay.com/v2/pix/list
 *
 * @reference https://docs.abacatepay.com/pages/pix/list
 */
export const RESTGetListPixTransfersData = APIResponseWithCursorBasedPagination(
	t.Array(APIPixTransfer),
);

/**
 * https://api.abacatepay.com/v2/pix/list
 *
 * @reference https://docs.abacatepay.com/pages/pix/list
 */
export type RESTGetListPixTransfersData = Static<
	typeof RESTGetListPixTransfersData
>;

/**
 * Inner `data` payload sent to `POST /transparents/create` when `method` is `PIX`.
 *
 * @reference https://docs.abacatepay.com/pages/transparents/create
 */
export const RESTPostCreateQRCodePixBody = t.Intersect([
	t.Pick(RESTPostCreateNewCheckoutBody, ['customer', 'metadata']),
	t.Object({
		amount: t.Integer({
			examples: [1234],
			description: 'Charge amount in cents.',
		}),
		expiresIn: t.Optional(
			t.Integer({
				description: 'Billing expiration time in seconds.',
			}),
		),
		description: t.Optional(
			t.String({
				description: 'Message that will appear when paying the PIX.',
			}),
		),
	}),
]);

/**
 * https://api.abacatepay.com/v2/transparents/create
 *
 * @reference https://docs.abacatepay.com/pages/transparents/create
 */
export type RESTPostCreateQRCodePixBody = Static<
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
export type RESTPostCreateQRCodePixData = Static<
	typeof RESTPostCreateQRCodePixData
>;

/**
 * Inner `data` payload sent to `POST /transparents/create` when `method` is `BOLETO`.
 *
 * @reference https://docs.abacatepay.com/pages/transparents/boleto
 */
export const RESTPostCreateBoletoBody = t.Object({
	amount: t.Integer({ description: 'Charge amount in cents.' }),
	description: t.Optional(
		t.String({ description: 'Message that will appear on the Boleto.' }),
	),
	customer: t.Intersect(
		[
			t.Pick(APICustomer, ['name', 'taxId']),
			t.Partial(t.Pick(APICustomer, ['email', 'cellphone'])),
		],
		{
			description:
				'Customer data. `name` and `taxId` are mandatory for Boleto.',
		},
	),
	metadata: t.Optional(
		t.Record(t.String(), t.Any(), { description: 'Optional charge metadata.' }),
	),
});

/**
 * https://api.abacatepay.com/v2/transparents/create
 *
 * @reference https://docs.abacatepay.com/pages/transparents/boleto
 */
export type RESTPostCreateBoletoBody = Static<typeof RESTPostCreateBoletoBody>;

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
export type RESTPostCreateBoletoData = Static<typeof RESTPostCreateBoletoData>;

/**
 * Wire-level request body for `POST /transparents/create` — the SDK builds this
 * from {@link RESTPostCreateQRCodePixBody} / {@link RESTPostCreateBoletoBody}, callers
 * never construct it directly.
 *
 * @reference https://docs.abacatepay.com/pages/transparents/reference
 */
export const RESTPostCreateTransparentBody = t.Union([
	t.Object({ method: t.Literal('PIX'), data: RESTPostCreateQRCodePixBody }),
	t.Object({ method: t.Literal('BOLETO'), data: RESTPostCreateBoletoBody }),
]);

/**
 * @reference https://docs.abacatepay.com/pages/transparents/reference
 */
export type RESTPostCreateTransparentBody = Static<
	typeof RESTPostCreateTransparentBody
>;

/**
 * https://api.abacatepay.com/v2/transparents/list
 *
 * @reference https://docs.abacatepay.com/pages/transparents/list
 */
export const RESTGetListTransparentsQueryParams = t.Object({
	after: t.Optional(t.String({ description: 'Cursor for the next page.' })),
	before: t.Optional(
		t.String({ description: 'Cursor for the previous page.' }),
	),
	limit: t.Optional(
		t.Integer({
			minimum: 1,
			maximum: 100,
			description: 'Number of items per page (1-100).',
		}),
	),
	id: t.Optional(
		t.String({ description: 'Filter by QRCode/Boleto identifier.' }),
	),
	status: t.Optional(PaymentStatus),
});

/**
 * https://api.abacatepay.com/v2/transparents/list
 *
 * @reference https://docs.abacatepay.com/pages/transparents/list
 */
export type RESTGetListTransparentsQueryParams = Static<
	typeof RESTGetListTransparentsQueryParams
>;

/**
 * https://api.abacatepay.com/v2/transparents/list
 *
 * @reference https://docs.abacatepay.com/pages/transparents/list
 */
export const RESTGetListTransparentsData = APIResponseWithCursorBasedPagination(
	t.Array(t.Union([APIQRCodePIX, APIBoleto])),
);

/**
 * https://api.abacatepay.com/v2/transparents/list
 *
 * @reference https://docs.abacatepay.com/pages/transparents/list
 */
export type RESTGetListTransparentsData = Static<
	typeof RESTGetListTransparentsData
>;

/**
 * https://api.abacatepay.com/v2/transparents/refund
 *
 * @reference https://docs.abacatepay.com/pages/transparents/refund
 */
export const RESTPostRefundTransparentBody = t.Object({
	id: t.String({
		description:
			'Public ID of the resource to refund (prefixes: `char_`, `pix_char_`, `card_`, `bill_`).',
	}),
	reason: t.Optional(
		t.String({
			maxLength: 500,
			description: 'Refund reason, shown in the transaction history.',
		}),
	),
});

/**
 * https://api.abacatepay.com/v2/transparents/refund
 *
 * @reference https://docs.abacatepay.com/pages/transparents/refund
 */
export type RESTPostRefundTransparentBody = Static<
	typeof RESTPostRefundTransparentBody
>;

/**
 * https://api.abacatepay.com/v2/transparents/refund
 *
 * @reference https://docs.abacatepay.com/pages/transparents/refund
 */
export const RESTPostRefundTransparentData = APIResponse(
	t.Object({
		refundPublicId: t.String({
			description: 'Public ID of the refund transaction that was created.',
		}),
	}),
);

/**
 * https://api.abacatepay.com/v2/transparents/refund
 *
 * @reference https://docs.abacatepay.com/pages/transparents/refund
 */
export type RESTPostRefundTransparentData = Static<
	typeof RESTPostRefundTransparentData
>;

/**
 * https://api.abacatepay.com/v2/transparents/simulate-payment
 *
 * @reference https://docs.abacatepay.com/pages/transparents/simulate-payment
 */
export const RESTPostSimulateQRCodePixPaymentQueryParams = t.Object({
	id: t.String({
		examples: ['pix_char_123adi9i2m'],
		description: 'QRCode Pix ID.',
	}),
});

/**
 * https://api.abacatepay.com/v2/transparents/simulate-payment
 *
 * @reference https://docs.abacatepay.com/pages/transparents/simulate-payment
 */
export type RESTPostSimulateQRCodePixPaymentQueryParams = Static<
	typeof RESTPostSimulateQRCodePixPaymentQueryParams
>;

/**
 * https://api.abacatepay.com/v2/transparents/simulate-payment
 *
 * @reference https://docs.abacatepay.com/pages/transparents/simulate-payment
 */
export const RESTPostSimulateQRCodePixPaymentBody = t.Object({
	metadata: t.Record(t.String(), t.Any(), {
		examples: [{}],
		description: 'Optional metadata for the request.',
	}),
});

/**
 * https://api.abacatepay.com/v2/transparents/simulate-payment
 *
 * @reference https://docs.abacatepay.com/pages/transparents/simulate-payment
 */
export type RESTPostSimulateQRCodePixPaymentBody = Static<
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
export type RESTPostSimulateQRCodePixPaymentData = Static<
	typeof RESTPostSimulateQRCodePixPaymentData
>;

/**
 * https://api.abacatepay.com/v2/transparents/check
 *
 * @reference https://docs.abacatepay.com/pages/transparents/check
 */
export const RESTGetCheckQRCodePixStatusQueryParams = t.Object({
	id: t.String({
		examples: ['pix_char_1239129'],
		description: 'QRCode Pix ID.',
	}),
});

/**
 * https://api.abacatepay.com/v2/transparents/check
 *
 * @reference https://docs.abacatepay.com/pages/transparents/check
 */
export type RESTGetCheckQRCodePixStatusQueryParams = Static<
	typeof RESTGetCheckQRCodePixStatusQueryParams
>;

/**
 * https://api.abacatepay.com/v2/transparents/check
 *
 * @reference https://docs.abacatepay.com/pages/transparents/check
 */
export const RESTGetCheckQRCodePixStatusData = APIResponse(
	t.Object({
		expiresAt: t.Date({
			examples: [new Date()],
			description: 'QRCode Pix expiration date.',
		}),
		status: PaymentStatus,
	}),
);

/**
 * https://api.abacatepay.com/v2/transparents/check
 *
 * @reference https://docs.abacatepay.com/pages/transparents/check
 */
export type RESTGetCheckQRCodePixStatusData = Static<
	typeof RESTGetCheckQRCodePixStatusData
>;

/**
 * https://api.abacatepay.com/v2/products/create
 *
 * @reference https://docs.abacatepay.com/pages/products/create
 */
export const RESTPostCreateProductBody = t.Intersect([
	t.Object({
		description: t.Optional(
			t.String({
				description: 'Description for the product.',
			}),
		),
	}),
	t.Pick(APIProduct, ['name', 'price', 'currency', 'externalId']),
]);

/**
 * https://api.abacatepay.com/v2/products/create
 *
 * @reference https://docs.abacatepay.com/pages/products/create
 */
export type RESTPostCreateProductBody = Static<
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
export type RESTPostCreateProductData = Static<
	typeof RESTPostCreateProductData
>;

/**
 * https://api.abacatepay.com/v2/products/list
 *
 * @reference https://docs.abacatepay.com/pages/products/list
 */
export const RESTGetListProductsQueryParams = t.Object({
	page: t.Optional(
		t.Integer({
			minimum: 1,
			default: 1,
			examples: [3],
			description: 'Page number.',
		}),
	),
	limit: t.Optional(
		t.Integer({
			minimum: 1,
			examples: [15],
			description: 'Number of items per page.',
		}),
	),
});

/**
 * https://api.abacatepay.com/v2/products/list
 *
 * @reference https://docs.abacatepay.com/pages/products/list
 */
export type RESTGetListProductsQueryParams = Static<
	typeof RESTGetListProductsQueryParams
>;

/**
 * https://api.abacatepay.com/v2/products/list
 *
 * @reference https://docs.abacatepay.com/pages/products/list
 */
export const RESTGetListProductsData = APIResponseWithPagination(
	t.Array(APIProduct),
);

/**
 * https://api.abacatepay.com/v2/products/list
 *
 * @reference https://docs.abacatepay.com/pages/products/list
 */
export type RESTGetListProductsData = Static<typeof RESTGetListProductsData>;

/**
 * https://api.abacatepay.com/v2/products/get
 *
 * @reference https://docs.abacatepay.com/pages/products/get
 */
export const RESTGetProductQueryParams = t.Object({
	id: t.Optional(
		t.String({
			description: 'The product ID.',
		}),
	),
	externalId: t.Optional(
		t.String({
			description: 'External ID of the product.',
		}),
	),
});

/**
 * https://api.abacatepay.com/v2/products/get
 *
 * @reference https://docs.abacatepay.com/pages/products/get
 */
export type RESTGetProductQueryParams = Static<
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
export type RESTGetProductData = Static<typeof RESTGetProductData>;

/**
 * https://api.abacatepay.com/v2/products/delete
 *
 * @reference https://docs.abacatepay.com/pages/products/delete
 */
export const RESTDeleteProductQueryParams = t.Object({
	id: t.String({ description: 'The product ID.' }),
});

/**
 * https://api.abacatepay.com/v2/products/delete
 *
 * @reference https://docs.abacatepay.com/pages/products/delete
 */
export type RESTDeleteProductQueryParams = Static<
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
export type RESTDeleteProductData = Static<typeof RESTDeleteProductData>;

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
export type RESTGetStoreDetailsData = Static<typeof RESTGetStoreDetailsData>;

/**
 * https://api.abacatepay.com/v2/public-mrr/mrr
 *
 * @reference https://docs.abacatepay.com/pages/trustMRR/mrr
 */
export const RESTGetMRRData = APIResponse(
	t.Object({
		mrr: t.Integer({
			minimum: 0,
			examples: [100],
			description:
				'Monthly recurring revenue in cents. Value 0 indicates that there is no recurring revenue at the moment.',
		}),
		totalActiveSubscriptions: t.Integer({
			minimum: 0,
			examples: [1],
			description:
				'Total active subscriptions. Value 0 indicates that there are no currently active subscriptions.',
		}),
	}),
);

/**
 * https://api.abacatepay.com/v2/public-mrr/mrr
 *
 * @reference https://docs.abacatepay.com/pages/trustMRR/mrr
 */
export type RESTGetMRRData = Static<typeof RESTGetMRRData>;

/**
 * https://api.abacatepay.com/v2/subscriptions/create
 *
 * @reference https://docs.abacatepay.com/pages/subscriptions/create
 */
export const RESTPostCreateSubscriptionBody = t.Intersect([
	t.Object({
		description: t.Optional(
			t.String({
				description: 'Subscription description.',
			}),
		),
	}),
	t.Pick(APISubscription, [
		'name',
		'amount',
		'method',
		'frequency',
		'customerId',
		'externalId',
		'retryPolicy',
	]),
]);

/**
 * https://api.abacatepay.com/v2/subscriptions/create
 *
 * @reference https://docs.abacatepay.com/pages/subscriptions/create
 */
export type RESTPostCreateSubscriptionBody = Static<
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
export type RESTPostCreateSubscriptionData = Static<
	typeof RESTPostCreateSubscriptionData
>;

/**
 * https://api.abacatepay.com/v2/subscriptions/list
 *
 * @reference https://docs.abacatepay.com/pages/subscriptions/list
 */
export const RESTGetListSubscriptionsQueryParams = t.Object({
	cursor: t.Optional(
		t.String({
			description: 'Cursor for the pagination.',
		}),
	),
	limit: t.Optional(
		t.Integer({
			examples: [3],
			default: 20,
			description: 'Number of items per page.',
		}),
	),
});

/**
 * https://api.abacatepay.com/v2/subscriptions/list
 *
 * @reference https://docs.abacatepay.com/pages/subscriptions/list
 */
export type RESTGetListSubscriptionsQueryParams = Static<
	typeof RESTGetListSubscriptionsQueryParams
>;

/**
 * https://api.abacatepay.com/v2/subscriptions/list
 *
 * @reference https://docs.abacatepay.com/pages/subscriptions/list
 */
export const RESTGetListSubscriptionsData =
	APIResponseWithCursorBasedPagination(t.Array(APISubscription));

/**
 * https://api.abacatepay.com/v2/subscriptions/list
 *
 * @reference https://docs.abacatepay.com/pages/subscriptions/list
 */
export type RESTGetListSubscriptionsData = Static<
	typeof RESTGetListSubscriptionsData
>;

/**
 * https://api.abacatepay.com/v2/subscriptions/cancel
 *
 * @reference https://docs.abacatepay.com/pages/subscriptions/cancel
 */
export const RESTPostCancelSubscriptionBody = t.Object({
	id: t.String({ description: 'Unique subscription identifier.' }),
});

/**
 * https://api.abacatepay.com/v2/subscriptions/cancel
 *
 * @reference https://docs.abacatepay.com/pages/subscriptions/cancel
 */
export type RESTPostCancelSubscriptionBody = Static<
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
export type RESTPostCancelSubscriptionData = Static<
	typeof RESTPostCancelSubscriptionData
>;

/**
 * https://api.abacatepay.com/v2/subscriptions/change-plan
 *
 * @reference https://docs.abacatepay.com/pages/subscriptions/change-plan
 */
export const RESTPostChangeSubscriptionPlanBody = t.Object({
	id: t.String({ description: 'Unique subscription identifier.' }),
	productId: t.String({
		description:
			'ID of the new product. It must have a billing cycle configured.',
	}),
	quantity: t.Integer({ description: 'New quantity for the product.' }),
});

/**
 * https://api.abacatepay.com/v2/subscriptions/change-plan
 *
 * @reference https://docs.abacatepay.com/pages/subscriptions/change-plan
 */
export type RESTPostChangeSubscriptionPlanBody = Static<
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
export type RESTPostChangeSubscriptionPlanData = Static<
	typeof RESTPostChangeSubscriptionPlanData
>;

/**
 * https://api.abacatepay.com/v2/subscriptions/record-usage
 *
 * @reference https://docs.abacatepay.com/pages/subscriptions/record-usage
 */
export const RESTPostRecordSubscriptionUsageBody = t.Object({
	id: t.String({ description: 'Unique subscription identifier.' }),
	productId: t.String({
		description:
			'ID of the pay-as-you-go product (Must not have a billing cycle).',
	}),
	units: t.Integer({ description: 'Number of units to record.' }),
	action: StringEnum(['add', 'subtract'], {
		description: 'Whether to add or subtract the units from the current cycle.',
	}),
});

/**
 * https://api.abacatepay.com/v2/subscriptions/record-usage
 *
 * @reference https://docs.abacatepay.com/pages/subscriptions/record-usage
 */
export type RESTPostRecordSubscriptionUsageBody = Static<
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
export type RESTPostRecordSubscriptionUsageData = Static<
	typeof RESTPostRecordSubscriptionUsageData
>;

/**
 * https://api.abacatepay.com/v2/webhooks/create
 *
 * @reference https://docs.abacatepay.com/pages/webhooks/create
 */
export const RESTPostCreateWebhookBody = t.Object({
	name: t.String({ description: 'Webhook name, for your own identification.' }),
	endpoint: t.String({
		format: 'uri',
		description: 'HTTPS endpoint that will receive the events.',
	}),
	secret: t.String({
		description: 'Secret used to sign the payloads sent to `endpoint`.',
	}),
	events: t.Array(WebhookEventType, {
		description: 'Event types this webhook should be notified about.',
	}),
});

/**
 * https://api.abacatepay.com/v2/webhooks/create
 *
 * @reference https://docs.abacatepay.com/pages/webhooks/create
 */
export type RESTPostCreateWebhookBody = Static<
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
export type RESTPostCreateWebhookData = Static<
	typeof RESTPostCreateWebhookData
>;

/**
 * https://api.abacatepay.com/v2/webhooks/list
 *
 * @reference https://docs.abacatepay.com/pages/webhooks/list
 */
export const RESTGetListWebhooksQueryParams = t.Object({
	search: t.Optional(
		t.String({ description: 'Search by webhook name, ID, or endpoint.' }),
	),
	after: t.Optional(t.String({ description: 'Cursor for the next page.' })),
	before: t.Optional(
		t.String({ description: 'Cursor for the previous page.' }),
	),
	limit: t.Optional(
		t.Integer({
			minimum: 1,
			maximum: 100,
			description: 'Number of items per page (1-100).',
		}),
	),
	id: t.Optional(t.String({ description: 'Filter by a specific webhook ID.' })),
});

/**
 * https://api.abacatepay.com/v2/webhooks/list
 *
 * @reference https://docs.abacatepay.com/pages/webhooks/list
 */
export type RESTGetListWebhooksQueryParams = Static<
	typeof RESTGetListWebhooksQueryParams
>;

/**
 * https://api.abacatepay.com/v2/webhooks/list
 *
 * @reference https://docs.abacatepay.com/pages/webhooks/list
 */
export const RESTGetListWebhooksData = APIResponseWithCursorBasedPagination(
	t.Array(APIWebhook),
);

/**
 * https://api.abacatepay.com/v2/webhooks/list
 *
 * @reference https://docs.abacatepay.com/pages/webhooks/list
 */
export type RESTGetListWebhooksData = Static<typeof RESTGetListWebhooksData>;

/**
 * https://api.abacatepay.com/v2/webhooks/get
 *
 * @reference https://docs.abacatepay.com/pages/webhooks/get
 */
export const RESTGetWebhookQueryParams = t.Object({
	id: t.String({ description: 'Unique webhook identifier.' }),
});

/**
 * https://api.abacatepay.com/v2/webhooks/get
 *
 * @reference https://docs.abacatepay.com/pages/webhooks/get
 */
export type RESTGetWebhookQueryParams = Static<
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
export type RESTGetWebhookData = Static<typeof RESTGetWebhookData>;

/**
 * https://api.abacatepay.com/v2/webhooks/delete
 *
 * @reference https://docs.abacatepay.com/pages/webhooks/delete
 */
export const RESTPostDeleteWebhookBody = t.Object({
	id: t.String({ description: 'Unique webhook identifier.' }),
});

/**
 * https://api.abacatepay.com/v2/webhooks/delete
 *
 * @reference https://docs.abacatepay.com/pages/webhooks/delete
 */
export type RESTPostDeleteWebhookBody = Static<
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
export type RESTPostDeleteWebhookData = Static<
	typeof RESTPostDeleteWebhookData
>;

/**
 * https://api.abacatepay.com/v2/customers/create
 *
 * @reference https://docs.abacatepay.com/pages/client/create
 */
export const RESTPostCreateCustomerBody = t.Intersect([
	t.Pick(APICustomer, ['email']),
	t.Partial(
		t.Pick(APICustomer, ['name', 'taxId', 'zipCode', 'cellphone', 'metadata']),
	),
]);

/**
 * https://api.abacatepay.com/v2/customers/create
 *
 * @reference https://docs.abacatepay.com/pages/client/create
 */
export type RESTPostCreateCustomerBody = Static<
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
export type RESTPostCreateCustomerData = Static<
	typeof RESTPostCreateCustomerData
>;

/**
 * https://api.abacatepay.com/v2/customers/list
 *
 * @reference https://docs.abacatepay.com/pages/client/list
 */
export const RESTGetListCustomersData = APIResponseWithPagination(
	t.Array(APICustomer),
);

/**
 * https://api.abacatepay.com/v2/customers/list
 *
 * @reference https://docs.abacatepay.com/pages/client/list
 */
export type RESTGetListCustomersData = Static<typeof RESTGetListCustomersData>;

/**
 * https://api.abacatepay.com/v2/customers/list
 *
 * @reference https://docs.abacatepay.com/pages/client/list
 */
export const RESTGetListCustomersQueryParams = t.Object({
	page: t.Optional(
		t.Integer({
			minimum: 1,
			examples: [3],
			default: 1,
			description: 'Page number.',
		}),
	),
	limit: t.Optional(
		t.Integer({
			examples: [10],
			minimum: 1,
			description: 'Number of items per page.',
		}),
	),
});

/**
 * https://api.abacatepay.com/v2/customers/list
 *
 * @reference https://docs.abacatepay.com/pages/client/list
 */
export type RESTGetListCustomersQueryParams = Static<
	typeof RESTGetListCustomersQueryParams
>;

/**
 * https://api.abacatepay.com/v2/customers/get
 *
 * @reference https://docs.abacatepay.com/pages/client/get
 */
export const RESTGetCustomerQueryParams = t.Object({
	id: t.String({
		examples: ['1293kasd'],
		description: 'The ID of the customer.',
	}),
});

/**
 * https://api.abacatepay.com/v2/customers/get
 *
 * @reference https://docs.abacatepay.com/pages/client/get
 */
export type RESTGetCustomerQueryParams = Static<
	typeof RESTGetCustomerQueryParams
>;

/**
 * https://api.abacatepay.com/v2/customers/get
 *
 * @reference https://docs.abacatepay.com/pages/client/get
 */
export const RESTGetCustomerData = APIResponse(
	t.Omit(APICustomer, ['country', 'zipCode']),
);

/**
 * https://api.abacatepay.com/v2/customers/get
 *
 * @reference https://docs.abacatepay.com/pages/client/get
 */
export type RESTGetCustomerData = Static<typeof RESTGetCustomerData>;

/**
 * https://api.abacatepay.com/v2/customers/delete
 *
 * @reference https://docs.abacatepay.com/pages/client/delete
 */
export const RESTDeleteCustomerBody = t.Object({
	id: t.String({
		examples: ['cust_12malsdi93w'],
		description: 'Unique public identifier of the customer to be deleted.',
	}),
});

/**
 * https://api.abacatepay.com/v2/customers/delete
 *
 * @reference https://docs.abacatepay.com/pages/client/delete
 */
export type RESTDeleteCustomerBody = Static<typeof RESTDeleteCustomerBody>;

/**
 * https://api.abacatepay.com/v2/customers/delete
 *
 * @reference https://docs.abacatepay.com/pages/client/delete
 */
export const RESTDeleteCustomerData = APIResponse(
	t.Omit(APICustomer, ['country', 'zipCode']),
);

/**
 * https://api.abacatepay.com/v2/customers/delete
 *
 * @reference https://docs.abacatepay.com/pages/client/delete
 */
export type RESTDeleteCustomerData = Static<typeof RESTDeleteCustomerData>;

/**
 * https://api.abacatepay.com/v2/public-mrr/revenue
 *
 * @reference https://docs.abacatepay.com/pages/trustMRR/list
 */
export const RESTGetRevenueByPeriodQueryParams = t.Object({
	startDate: t.Date({
		examples: [new Date()],
		description: 'Period start date (YYYY-MM-DD format).',
	}),
	endDate: t.Date({
		examples: [new Date()],
		description: 'Period end date (YYYY-MM-DD format).',
	}),
});

/**
 * https://api.abacatepay.com/v2/public-mrr/revenue
 *
 * @reference https://docs.abacatepay.com/pages/trustMRR/list
 */
export type RESTGetRevenueByPeriodQueryParams = Static<
	typeof RESTGetRevenueByPeriodQueryParams
>;

/**
 * https://api.abacatepay.com/v2/public-mrr/revenue
 *
 * @reference https://docs.abacatepay.com/pages/trustMRR/list
 */
export const RESTGetRevenueByPeriodData = APIResponse(
	t.Object({
		totalRevenue: t.Integer({
			examples: [10000],
			description: 'Total revenue for the period in cents.',
		}),
		totalTransactions: t.Integer({
			examples: [39],
			description: 'Total transactions in the period.',
		}),
		transactionsPerDay: t.Record(
			t.String(),
			t.Object({
				amount: t.Integer({
					examples: [3200],
					description: "Total value of the day's transactions in cents.",
				}),
				count: t.Integer({
					examples: [12],
					description: 'Number of transactions for the day.',
				}),
			}),
			{
				description:
					'Object with transactions grouped by day (key is the date in YYYY-MM-DD format).',
			},
		),
	}),
);

/**
 * https://api.abacatepay.com/v2/public-mrr/revenue
 *
 * @reference https://docs.abacatepay.com/pages/trustMRR/list
 */
export type RESTGetRevenueByPeriodData = Static<
	typeof RESTGetRevenueByPeriodData
>;

/**
 * https://api.abacatepay.com/v2/public-mrr/merchant-info
 *
 * @reference https://docs.abacatepay.com/pages/trustMRR/get
 */
export const RESTGetMerchantData = APIResponse(
	t.Object({
		name: t.String({
			examples: ['Summer Store'],
			description: 'Store name.',
		}),
		website: t.String({
			format: 'uri',
			examples: ['https://summer-store.com/'],
			description: 'Store website.',
		}),
		createdAt: t.Date({
			examples: [new Date()],
			description: 'Store creation date.',
		}),
	}),
);

/**
 * https://api.abacatepay.com/v2/public-mrr/merchant-info
 *
 * @reference https://docs.abacatepay.com/pages/trustMRR/get
 */
export type RESTGetMerchantData = Static<typeof RESTGetMerchantData>;
