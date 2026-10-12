import type { CouponStatus } from './entities/coupon';
import type {
	RESTGetCheckoutQueryParams,
	RESTGetCustomerQueryParams,
	RESTGetListBankStatementQueryParams,
	RESTGetListCheckoutsQueryParams,
	RESTGetListCouponsQueryParams,
	RESTGetListCustomersQueryParams,
	RESTGetListPaymentLinksQueryParams,
	RESTGetListPayoutsQueryParams,
	RESTGetListPixTransfersQueryParams,
	RESTGetListProductsQueryParams,
	RESTGetListStoresQueryParams,
	RESTGetListSubscriptionCheckoutsQueryParams,
	RESTGetListSubscriptionsQueryParams,
	RESTGetListTransparentsQueryParams,
	RESTGetListWebhooksQueryParams,
	RESTGetPaymentLinkQueryParams,
	RESTGetPixTransferQueryParams,
	RESTGetProductQueryParams,
	RESTGetRunReportQueryParams,
	RESTGetSearchPayoutQueryParams,
	RESTGetSubscriptionCheckoutQueryParams,
	RESTGetSubscriptionQueryParams,
} from './rest';

/**
 * Builds `path?query`, skipping `undefined`/`null` values and URL-encoding the rest.
 */
const withQuery = <Path extends string>(path: Path, params: object = {}) => {
	const query = new URLSearchParams();

	for (const [key, value] of Object.entries(params))
		if (value !== undefined && value !== null) query.append(key, `${value}`);

	const search = `${query}`;

	return (search ? `${path}?${search}` : path) as Path | `${Path}?${string}`;
};

/**
 * Turns an ID into `{ id }`, keeping query objects as they are.
 */
const byId = <Query extends object>(query: string | Query) =>
	typeof query === 'string' ? { id: query } : query;

export const Routes = {
	customers: {
		/**
		 * POST - https://api.abacatepay.com/v2/customers/create
		 */
		create: '/customers/create',

		/**
		 * GET - https://api.abacatepay.com/v2/customers/list
		 */
		list(query: RESTGetListCustomersQueryParams = {}) {
			return withQuery('/customers/list', query);
		},

		/**
		 * GET - https://api.abacatepay.com/v2/customers/get
		 */
		get(query: string | RESTGetCustomerQueryParams) {
			return withQuery('/customers/get', byId(query));
		},

		/**
		 * POST - https://api.abacatepay.com/v2/customers/delete
		 */
		delete(id: string) {
			return withQuery('/customers/delete', { id });
		},
	},
	checkouts: {
		/**
		 * POST - https://api.abacatepay.com/v2/checkouts/create
		 */
		create: '/checkouts/create',

		/**
		 * GET - https://api.abacatepay.com/v2/checkouts/list
		 */
		list(query: RESTGetListCheckoutsQueryParams = {}) {
			return withQuery('/checkouts/list', query);
		},

		/**
		 * GET - https://api.abacatepay.com/v2/checkouts/get
		 */
		get(query: string | RESTGetCheckoutQueryParams) {
			return withQuery('/checkouts/get', byId(query));
		},

		/**
		 * POST - https://api.abacatepay.com/v2/checkouts/delete
		 */
		delete(id: string) {
			return withQuery('/checkouts/delete', { id });
		},

		/**
		 * POST - https://api.abacatepay.com/v2/checkouts/refund
		 */
		refund: '/checkouts/refund',
	},
	paymentLinks: {
		/**
		 * POST - https://api.abacatepay.com/v2/payment-links/create
		 */
		create: '/payment-links/create',

		/**
		 * GET - https://api.abacatepay.com/v2/payment-links/list
		 */
		list(query: RESTGetListPaymentLinksQueryParams = {}) {
			return withQuery('/payment-links/list', query);
		},

		/**
		 * GET - https://api.abacatepay.com/v2/payment-links/get
		 */
		get(query: string | RESTGetPaymentLinkQueryParams) {
			return withQuery('/payment-links/get', byId(query));
		},

		/**
		 * POST - https://api.abacatepay.com/v2/payment-links/delete
		 */
		delete(id: string) {
			return withQuery('/payment-links/delete', { id });
		},

		/**
		 * POST - https://api.abacatepay.com/v2/payment-links/refund
		 */
		refund: '/payment-links/refund',
	},
	transparents: {
		/**
		 * POST - https://api.abacatepay.com/v2/transparents/create
		 */
		create: '/transparents/create',

		/**
		 * GET - https://api.abacatepay.com/v2/transparents/list
		 */
		list(query: RESTGetListTransparentsQueryParams = {}) {
			return withQuery('/transparents/list', query);
		},

		/**
		 * GET - https://api.abacatepay.com/v2/transparents/get
		 */
		get(id: string) {
			return withQuery('/transparents/get', { id });
		},

		/**
		 * POST - https://api.abacatepay.com/v2/transparents/simulate-payment
		 */
		simulatePayment(id: string) {
			return withQuery('/transparents/simulate-payment', { id });
		},

		/**
		 * GET - https://api.abacatepay.com/v2/transparents/check
		 */
		checkStatus(id: string) {
			return withQuery('/transparents/check', { id });
		},

		/**
		 * POST - https://api.abacatepay.com/v2/transparents/refund
		 */
		refund: '/transparents/refund',
	},
	transfers: {
		/**
		 * POST - https://api.abacatepay.com/v2/pix/send
		 */
		send: '/pix/send',

		/**
		 * GET - https://api.abacatepay.com/v2/pix/get
		 */
		get({ id, externalId }: RESTGetPixTransferQueryParams) {
			// The API requires `id` to be present; an empty value means "look up by `externalId`".
			return withQuery('/pix/get', { id: id ?? '', externalId });
		},

		/**
		 * GET - https://api.abacatepay.com/v2/pix/list
		 */
		list(query: RESTGetListPixTransfersQueryParams) {
			return withQuery('/pix/list', query);
		},
	},
	coupons: {
		/**
		 * POST - https://api.abacatepay.com/v2/coupons/create
		 */
		create: '/coupons/create',

		/**
		 * GET - https://api.abacatepay.com/v2/coupons/list
		 */
		list(query: RESTGetListCouponsQueryParams = {}) {
			return withQuery('/coupons/list', query);
		},

		/**
		 * GET - https://api.abacatepay.com/v2/coupons/get
		 */
		get(id: string, status?: CouponStatus) {
			return withQuery('/coupons/get', { id, status });
		},

		/**
		 * POST - https://api.abacatepay.com/v2/coupons/delete
		 */
		delete(id: string) {
			return withQuery('/coupons/delete', { id });
		},

		/**
		 * POST - https://api.abacatepay.com/v2/coupons/toggle
		 */
		toggleStatus: '/coupons/toggle',
	},
	payouts: {
		/**
		 * POST - https://api.abacatepay.com/v2/payouts/create
		 */
		create: '/payouts/create',

		/**
		 * GET - https://api.abacatepay.com/v2/payouts/get
		 */
		get(query: RESTGetSearchPayoutQueryParams) {
			return withQuery('/payouts/get', query);
		},

		/**
		 * GET - https://api.abacatepay.com/v2/payouts/list
		 */
		list(query: RESTGetListPayoutsQueryParams = {}) {
			return withQuery('/payouts/list', query);
		},
	},
	bankStatement: {
		/**
		 * GET - https://api.abacatepay.com/v2/bank-statement/list
		 */
		list(query: RESTGetListBankStatementQueryParams = {}) {
			return withQuery('/bank-statement/list', query);
		},
	},
	stores: {
		/**
		 * GET - https://api.abacatepay.com/v2/stores/get
		 */
		get: '/stores/get',

		/**
		 * GET - https://api.abacatepay.com/v2/stores/list
		 */
		list(query: RESTGetListStoresQueryParams = {}) {
			return withQuery('/stores/list', query);
		},
	},
	/**
	 * @deprecated Use `Routes.stores`. `/v2/store/get` does not exist, so this points to `/stores/get`.
	 */
	store: {
		/**
		 * GET - https://api.abacatepay.com/v2/stores/get
		 *
		 * @deprecated Use `Routes.stores.get`.
		 */
		get: '/stores/get',
	},
	mrr: {
		/**
		 * GET - https://api.abacatepay.com/v2/public-mrr/mrr
		 */
		get: '/public-mrr/mrr',

		/**
		 * GET - https://api.abacatepay.com/v2/public-mrr/merchant-info
		 */
		merchant: '/public-mrr/merchant-info',

		/**
		 * GET - https://api.abacatepay.com/v2/public-mrr/revenue
		 */
		revenue(start: string, end: string) {
			return withQuery('/public-mrr/revenue', {
				startDate: start,
				endDate: end,
			});
		},

		/**
		 * GET - https://api.abacatepay.com/v2/public-mrr/mrr-by-day
		 */
		byDay(start: string, end: string) {
			return withQuery('/public-mrr/mrr-by-day', {
				startDate: start,
				endDate: end,
			});
		},
	},
	subscriptions: {
		/**
		 * POST - https://api.abacatepay.com/v2/subscriptions/create
		 */
		create: '/subscriptions/create',

		/**
		 * GET - https://api.abacatepay.com/v2/subscriptions/get
		 */
		get(query: RESTGetSubscriptionQueryParams) {
			return withQuery('/subscriptions/get', query);
		},

		/**
		 * GET - https://api.abacatepay.com/v2/subscriptions/list
		 */
		list(query: RESTGetListSubscriptionsQueryParams = {}) {
			return withQuery('/subscriptions/list', query);
		},

		/**
		 * POST - https://api.abacatepay.com/v2/subscriptions/cancel
		 */
		cancel: '/subscriptions/cancel',

		/**
		 * POST - https://api.abacatepay.com/v2/subscriptions/change-plan
		 */
		changePlan: '/subscriptions/change-plan',

		/**
		 * POST - https://api.abacatepay.com/v2/subscriptions/record-usage
		 */
		recordUsage: '/subscriptions/record-usage',

		checkouts: {
			/**
			 * GET - https://api.abacatepay.com/v2/subscriptions/checkouts/get
			 */
			get(query: string | RESTGetSubscriptionCheckoutQueryParams) {
				return withQuery('/subscriptions/checkouts/get', byId(query));
			},

			/**
			 * GET - https://api.abacatepay.com/v2/subscriptions/checkouts/list
			 */
			list(query: RESTGetListSubscriptionCheckoutsQueryParams = {}) {
				return withQuery('/subscriptions/checkouts/list', query);
			},

			/**
			 * POST - https://api.abacatepay.com/v2/subscriptions/checkouts/delete
			 */
			delete(id: string) {
				return withQuery('/subscriptions/checkouts/delete', { id });
			},
		},
	},
	products: {
		/**
		 * POST - https://api.abacatepay.com/v2/products/create
		 */
		create: '/products/create',

		/**
		 * GET - https://api.abacatepay.com/v2/products/list
		 */
		list(query: RESTGetListProductsQueryParams = {}) {
			return withQuery('/products/list', query);
		},

		/**
		 * GET - https://api.abacatepay.com/v2/products/get
		 */
		get(query: RESTGetProductQueryParams) {
			return withQuery('/products/get', query);
		},

		/**
		 * POST - https://api.abacatepay.com/v2/products/delete
		 */
		delete(id: string) {
			return withQuery('/products/delete', { id });
		},
	},
	webhooks: {
		/**
		 * POST - https://api.abacatepay.com/v2/webhooks/create
		 */
		create: '/webhooks/create',

		/**
		 * GET - https://api.abacatepay.com/v2/webhooks/list
		 */
		list(query: RESTGetListWebhooksQueryParams = {}) {
			return withQuery('/webhooks/list', query);
		},

		/**
		 * GET - https://api.abacatepay.com/v2/webhooks/get
		 */
		get(id: string) {
			return withQuery('/webhooks/get', { id });
		},

		/**
		 * POST - https://api.abacatepay.com/v2/webhooks/delete
		 */
		delete(id: string) {
			return withQuery('/webhooks/delete', { id });
		},
	},
	reports: {
		/**
		 * GET - https://api.abacatepay.com/v2/reports/list
		 */
		list: '/reports/list',

		/**
		 * GET - https://api.abacatepay.com/v2/reports/run
		 */
		run(query: RESTGetRunReportQueryParams) {
			return withQuery('/reports/run', query);
		},
	},
} as const;
