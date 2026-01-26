import { REST } from '@abacatepay/rest';
import type {
	APIWithdraw,
	RESTGetCheckQRCodePixStatusData,
	RESTGetListBillingsData,
	RESTGetListCouponsData,
	RESTGetListCustomersData,
	RESTGetListWithdrawsData,
	RESTGetMerchantData,
	RESTGetMRRData,
	RESTGetStoreDetailsData,
	RESTPostCreateCouponBody,
	RESTPostCreateCouponData,
	RESTPostCreateCustomerBody,
	RESTPostCreateCustomerData,
	RESTPostCreateNewChargeBody,
	RESTPostCreateNewChargeData,
	RESTPostCreateNewWithdrawBody,
	RESTPostCreateNewWithdrawData,
	RESTPostCreateQRCodePixBody,
	RESTPostSimulatePaymentData,
} from '@abacatepay/types/v1';
import { Routes } from '@abacatepay/types/v1/routes';
import type { AbacatePayOptions } from './types';

export * from './types';

/**
 * This is the main entry point for interacting with the AbacatePay API,
 * providing high-level, domain-oriented methods on top of the REST client.
 */
export const AbacatePay = ({ secret, rest }: AbacatePayOptions) => {
	const client = new REST({
		secret,
		...rest,
		version: 1,
	});

	return {
		/**
		 * Low-level REST client instance.
		 *
		 * Exposes the raw REST interface in case you need direct access
		 * to HTTP methods or custom routes.
		 */
		rest: client,

		customers: {
			create(body: RESTPostCreateCustomerBody) {
				return client.post<RESTPostCreateCustomerData>(Routes.customer.create, {
					body,
				});
			},
			list() {
				return client.get<RESTGetListCustomersData>(Routes.customer.list);
			},
		},

		billings: {
			create(body: RESTPostCreateNewChargeBody) {
				return client.post<RESTPostCreateNewChargeData>(Routes.billing.create, {
					body,
				});
			},
			list() {
				return client.get<RESTGetListBillingsData>(Routes.billing.list);
			},
		},

		pix: {
			create(body: RESTPostCreateQRCodePixBody) {
				return client.post<RESTPostCreateQRCodePixBody>(
					Routes.pix.createQRCode,
					{
						body,
					},
				);
			},
			simulate(id: string, metadata?: Record<string, unknown>) {
				return client.post<RESTPostSimulatePaymentData>(
					Routes.pix.simulatePayment({ id }),
					{
						body: { metadata },
					},
				);
			},
			status(id: string) {
				return client.get<RESTGetCheckQRCodePixStatusData>(
					Routes.pix.checkStatus({ id }),
				);
			},
		},

		coupons: {
			create(body: RESTPostCreateCouponBody) {
				return client.post<RESTPostCreateCouponData>(Routes.coupon.create, {
					body,
				});
			},
			list() {
				return client.get<RESTGetListCouponsData>(Routes.coupon.list);
			},
		},

		withdraw: {
			create(body: RESTPostCreateNewWithdrawBody) {
				return client.post<RESTPostCreateNewWithdrawData>(
					Routes.withdraw.create,
					{ body },
				);
			},
			list() {
				return client.get<RESTGetListWithdrawsData>(Routes.withdraw.list);
			},
			get(id: string) {
				// TODO: Add this type do @abacatepay/types later
				return client.get<APIWithdraw>(Routes.withdraw.get({ externalId: id }));
			},
		},

		store: {
			get() {
				return client.get<RESTGetStoreDetailsData>(Routes.store.get);
			},
		},

		mrr: {
			get() {
				return client.get<RESTGetMRRData>(Routes.mrr.get);
			},
			renevue(start: string, end: string) {
				// TODO: Add type and query params in Routes.mrr.revenue
				return client.get<{
					totalRevenue: number;
					totalTransactions: number;
					transactionPerDay: Record<
						string,
						{
							amount: number;
							count: number;
						}
					>;
				}>(`${Routes.mrr.revenue}?startDate=${start}&endDate=${end}`);
			},
			merchant() {
				return client.get<RESTGetMerchantData>(Routes.mrr.merchant);
			},
		},
	};
};
