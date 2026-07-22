import type {
	RESTGetListCheckoutsQueryParams,
	RESTGetListCouponsQueryParams,
	RESTGetListCustomersQueryParams,
	RESTGetListPaymentLinksQueryParams,
	RESTGetListPayoutsQueryParams,
	RESTGetListPixTransfersQueryParams,
	RESTGetListProductsQueryParams,
	RESTGetListSubscriptionsQueryParams,
	RESTGetListTransparentsQueryParams,
	RESTGetListWebhooksQueryParams,
	RESTGetPixTransferQueryParams,
	RESTGetProductQueryParams,
} from './rest';

export const Routes = {
	customers: {
		/**
		 * POST - https://api.abacatepay.com/v2/customers/create
		 */
		create: '/customers/create',

		/**
		 * GET - https://api.abacatepay.com/v2/customers/list
		 */
		list({ page = 1, limit = 20 }: RESTGetListCustomersQueryParams = {}) {
			return `/customers/list?page=${page}&limit=${limit}` as const;
		},

		/**
		 * GET - https://api.abacatepay.com/v2/customers/get
		 */
		get(id: string) {
			return `/customers/get?id=${id}` as const;
		},

		/**
		 * POST - https://api.abacatepay.com/v2/customers/delete
		 */
		delete: '/customers/delete',
	},
	checkouts: {
		/**
		 * POST - https://api.abacatepay.com/v2/checkouts/create
		 */
		create: '/checkouts/create',

		/**
		 * GET - https://api.abacatepay.com/v2/checkouts/list
		 */
		list({ page = 1, limit = 20 }: RESTGetListCheckoutsQueryParams = {}) {
			return `/checkouts/list?page=${page}&limit=${limit}` as const;
		},

		/**
		 * GET - https://api.abacatepay.com/v2/checkouts/get
		 */
		get(id: string) {
			return `/checkouts/get?id=${id}` as const;
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
		list({ page = 1, limit = 20 }: RESTGetListPaymentLinksQueryParams = {}) {
			return `/payment-links/list?page=${page}&limit=${limit}` as const;
		},

		/**
		 * GET - https://api.abacatepay.com/v2/payment-links/one
		 */
		get(id: string) {
			return `/payment-links/one?id=${id}` as const;
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
		list({
			limit = 100,
			after,
			before,
			id,
			status,
		}: RESTGetListTransparentsQueryParams = {}) {
			const query = new URLSearchParams({ limit: `${limit}` });

			if (after) query.append('after', after);
			if (before) query.append('before', before);
			if (id) query.append('id', id);
			if (status) query.append('status', status);

			return `/transparents/list?${query}` as const;
		},

		/**
		 * POST - https://api.abacatepay.com/v2/transparents/simulate-payment
		 */
		simulatePayment(id: string) {
			return `/transparents/simulate-payment?id=${id}` as const;
		},

		/**
		 * GET - https://api.abacatepay.com/v2/transparents/check
		 */
		checkStatus(id: string) {
			return `/transparents/check?id=${id}` as const;
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
		get({ id, externalId }: RESTGetPixTransferQueryParams = {}) {
			const query = new URLSearchParams();

			if (id) query.append('id', id);
			if (externalId) query.append('externalId', externalId);

			return `/pix/get?${query}` as const;
		},

		/**
		 * GET - https://api.abacatepay.com/v2/pix/list
		 */
		list({
			limit = 100,
			after,
			before,
			id,
			externalId,
			status,
		}: RESTGetListPixTransfersQueryParams = {}) {
			const query = new URLSearchParams({ limit: `${limit}` });

			if (after) query.append('after', after);
			if (before) query.append('before', before);
			if (id) query.append('id', id);
			if (externalId) query.append('externalId', externalId);
			if (status) query.append('status', status);

			return `/pix/list?${query}` as const;
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
		list({ page = 1, limit = 20 }: RESTGetListCouponsQueryParams = {}) {
			return `/coupons/list?page=${page}&limit=${limit}` as const;
		},

		/**
		 * GET - https://api.abacatepay.com/v2/coupons/get
		 */
		get(id: string) {
			return `/coupons/get?id=${id}` as const;
		},

		/**
		 * POST - https://api.abacatepay.com/v2/coupons/delete
		 */
		delete: '/coupons/delete',

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
		get(externalId: string) {
			return `/payouts/get?externalId=${externalId}` as const;
		},

		/**
		 * GET - https://api.abacatepay.com/v2/payouts/list
		 */
		list({ page = 1, limit = 20 }: RESTGetListPayoutsQueryParams = {}) {
			return `/payouts/list?page=${page}&limit=${limit}`;
		},
	},
	store: {
		/**
		 * GET - https://api.abacatepay.com/v2/store/get
		 */
		get: '/store/get',
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
		 * GET - https://api.abacatepay.com/v2/public-mrr/renevue
		 */
		revenue(start: string, end: string) {
			return `/public-mrr/revenue?startDate=${start}&endDate=${end}` as const;
		},
	},
	subscriptions: {
		/**
		 * POST - https://api.abacatepay.com/v2/subscriptions/create
		 */
		create: '/subscriptions/create',

		/**
		 * GET - https://api.abacatepay.com/v2/subscriptions/list
		 */
		list({ cursor, limit = 20 }: RESTGetListSubscriptionsQueryParams = {}) {
			const query = new URLSearchParams({ limit: `${limit}` });

			if (cursor) query.append('cursor', cursor);

			return `/subscriptions/list?${query}` as const;
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
	},

	products: {
		/**
		 * POST - https://api.abacatepay.com/v2/products/create
		 */
		create: '/products/create',

		/**
		 * GET - https://api.abacatepay.com/v2/products/list
		 */
		list({ page = 1, limit = 20 }: RESTGetListProductsQueryParams = {}) {
			return `/products/list?page=${page}&limit=${limit}` as const;
		},

		/**
		 * GET - https://api.abacatepay.com/v2/products/get
		 */
		get({ id, externalId }: RESTGetProductQueryParams = {}) {
			const query = new URLSearchParams();

			if (id) query.append('id', id);
			if (externalId) query.append('externalId', externalId);

			return `/products/get?${query}` as const;
		},

		/**
		 * POST - https://api.abacatepay.com/v2/products/delete
		 */
		delete(id: string) {
			return `/products/delete?id=${id}` as const;
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
		list({
			limit = 100,
			after,
			before,
			search,
			id,
		}: RESTGetListWebhooksQueryParams = {}) {
			const query = new URLSearchParams({ limit: `${limit}` });

			if (after) query.append('after', after);
			if (before) query.append('before', before);
			if (search) query.append('search', search);
			if (id) query.append('id', id);

			return `/webhooks/list?${query}` as const;
		},

		/**
		 * GET - https://api.abacatepay.com/v2/webhooks/get
		 */
		get(id: string) {
			return `/webhooks/get?id=${id}` as const;
		},

		/**
		 * POST - https://api.abacatepay.com/v2/webhooks/delete
		 */
		delete: '/webhooks/delete',
	},
} as const;
