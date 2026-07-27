import { createREST } from '@abacatepay/rest';
import type {
	RESTDeleteCouponData,
	RESTDeleteCustomerData,
	RESTDeleteProductData,
	RESTGetCheckoutData,
	RESTGetCheckQRCodePixStatusData,
	RESTGetCouponData,
	RESTGetCustomerData,
	RESTGetListCheckoutsData,
	RESTGetListCheckoutsQueryParams,
	RESTGetListCouponsData,
	RESTGetListCouponsQueryParams,
	RESTGetListCustomersData,
	RESTGetListCustomersQueryParams,
	RESTGetListPaymentLinksData,
	RESTGetListPaymentLinksQueryParams,
	RESTGetListPayoutsData,
	RESTGetListPayoutsQueryParams,
	RESTGetListPixTransfersData,
	RESTGetListPixTransfersQueryParams,
	RESTGetListProductsData,
	RESTGetListProductsQueryParams,
	RESTGetListSubscriptionsData,
	RESTGetListSubscriptionsQueryParams,
	RESTGetListTransparentsData,
	RESTGetListTransparentsQueryParams,
	RESTGetListWebhooksData,
	RESTGetListWebhooksQueryParams,
	RESTGetMerchantData,
	RESTGetMRRData,
	RESTGetPaymentLinkData,
	RESTGetPixTransferData,
	RESTGetPixTransferQueryParams,
	RESTGetProductData,
	RESTGetProductQueryParams,
	RESTGetRevenueByPeriodData,
	RESTGetRevenueByPeriodQueryParams,
	RESTGetSearchPayoutData,
	RESTGetStoreDetailsData,
	RESTGetWebhookData,
	RESTPostCancelSubscriptionData,
	RESTPostChangeSubscriptionPlanBody,
	RESTPostChangeSubscriptionPlanData,
	RESTPostCreateBoletoBody,
	RESTPostCreateBoletoData,
	RESTPostCreateCouponBody,
	RESTPostCreateCouponData,
	RESTPostCreateCustomerBody,
	RESTPostCreateCustomerData,
	RESTPostCreateNewCheckoutBody,
	RESTPostCreateNewCheckoutData,
	RESTPostCreateNewPayoutBody,
	RESTPostCreateNewWPayoutData,
	RESTPostCreatePaymentLinkBody,
	RESTPostCreatePaymentLinkData,
	RESTPostCreateProductBody,
	RESTPostCreateProductData,
	RESTPostCreateQRCodePixBody,
	RESTPostCreateQRCodePixData,
	RESTPostCreateSubscriptionBody,
	RESTPostCreateSubscriptionData,
	RESTPostCreateTransparentBody,
	RESTPostCreateWebhookBody,
	RESTPostCreateWebhookData,
	RESTPostDeleteWebhookData,
	RESTPostRecordSubscriptionUsageBody,
	RESTPostRecordSubscriptionUsageData,
	RESTPostRefundCheckoutData,
	RESTPostRefundPaymentLinkData,
	RESTPostRefundTransparentData,
	RESTPostSendPixTransferBody,
	RESTPostSendPixTransferData,
	RESTPostSimulateQRCodePixPaymentData,
	RESTPostToggleCouponStatusData,
} from '@abacatepay/types/v2';
import { Routes } from '@abacatepay/types/v2';
import type { AbacatePayOptions } from './types';

export * from './types';

/**
 * This is the main entry point for interacting with the AbacatePay API,
 * providing high-level, domain-oriented methods on top of the REST client.
 *
 * No method here ever throws — every call resolves to the exact
 * `{ data, error, success }` shape the AbacatePay API itself returns.
 */
export const AbacatePay = ({ secret, rest }: AbacatePayOptions) => {
	const client = createREST({
		secret,
		...rest,
		version: 2,
	});

	return {
		/**
		 * Low-level REST client instance.
		 *
		 * Exposes the raw REST interface in case you need direct access
		 * to HTTP methods or custom routes.
		 */
		rest: client,

		/**
		 * Customer management operations.
		 */
		customers: {
			/**
			 * Retrieve a customer by its unique identifier.
			 *
			 * @param id Customer ID.
			 * @returns The customer data.
			 */
			get(id: string) {
				return client.get<RESTGetCustomerData>(Routes.customers.get(id));
			},

			/**
			 * Permanently delete a customer.
			 *
			 * @param id Customer ID.
			 * @returns Deletion result.
			 */
			delete(id: string) {
				return client.post<RESTDeleteCustomerData>(Routes.customers.delete, {
					body: { id },
				});
			},

			/**
			 * Create a new customer.
			 *
			 * @param body Customer creation payload.
			 * @returns The created customer.
			 */
			create(body: RESTPostCreateCustomerBody) {
				return client.post<RESTPostCreateCustomerData>(
					Routes.customers.create,
					{ body },
				);
			},

			/**
			 * List customers with optional pagination.
			 *
			 * @param query Optional query parameters.
			 * @returns A paginated list of customers.
			 */
			list(query?: RESTGetListCustomersQueryParams) {
				return client.get<RESTGetListCustomersData>(
					Routes.customers.list(query),
				);
			},
		},

		/**
		 * Checkout management operations.
		 */
		checkouts: {
			/**
			 * Create a new checkout.
			 *
			 * @param body Checkout creation payload.
			 * @returns The created checkout.
			 */
			create(body: RESTPostCreateNewCheckoutBody) {
				return client.post<RESTPostCreateNewCheckoutData>(
					Routes.checkouts.create,
					{ body },
				);
			},

			/**
			 * List checkouts with optional pagination.
			 *
			 * @param query Optional query parameters.
			 * @returns A paginated list of checkouts.
			 */
			list(query?: RESTGetListCheckoutsQueryParams) {
				return client.get<RESTGetListCheckoutsData>(
					Routes.checkouts.list(query),
				);
			},

			/**
			 * Retrieve a checkout by ID.
			 *
			 * @param id Checkout ID.
			 * @returns The checkout data.
			 */
			get(id: string) {
				return client.get<RESTGetCheckoutData>(Routes.checkouts.get(id));
			},

			/**
			 * Refund a completed checkout.
			 *
			 * @param id Public ID of the resource to refund (e.g. `bill_`, `char_`, `pix_char_`, `card_`).
			 * @param reason Optional refund reason, shown in the transaction history.
			 * @returns The public ID of the created refund transaction.
			 */
			refund(id: string, reason?: string) {
				return client.post<RESTPostRefundCheckoutData>(
					Routes.checkouts.refund,
					{ body: { id, reason } },
				);
			},
		},

		/**
		 * Reusable payment link operations — unlike a checkout, the same link
		 * can be paid by multiple customers.
		 */
		paymentLinks: {
			/**
			 * Create a new payment link.
			 *
			 * @param body Payment link creation payload.
			 * @returns The created payment link.
			 */
			create(body: RESTPostCreatePaymentLinkBody) {
				return client.post<RESTPostCreatePaymentLinkData>(
					Routes.paymentLinks.create,
					{ body },
				);
			},

			/**
			 * List payment links with optional pagination.
			 *
			 * @param query Optional query parameters.
			 * @returns A paginated list of payment links.
			 */
			list(query?: RESTGetListPaymentLinksQueryParams) {
				return client.get<RESTGetListPaymentLinksData>(
					Routes.paymentLinks.list(query),
				);
			},

			/**
			 * Retrieve a payment link by ID.
			 *
			 * @param id Payment link ID.
			 * @returns The payment link data.
			 */
			get(id: string) {
				return client.get<RESTGetPaymentLinkData>(Routes.paymentLinks.get(id));
			},

			/**
			 * Refund a payment made through a payment link.
			 *
			 * @param id Public ID of the resource to refund.
			 * @param reason Optional refund reason, shown in the transaction history.
			 * @returns The public ID of the created refund transaction.
			 */
			refund(id: string, reason?: string) {
				return client.post<RESTPostRefundPaymentLinkData>(
					Routes.paymentLinks.refund,
					{ body: { id, reason } },
				);
			},
		},

		/**
		 * Embedded PIX QR-code charge operations (Receiving a payment).
		 */
		pix: {
			/**
			 * Create a new PIX QR Code charge.
			 *
			 * @param body PIX creation payload.
			 * @returns The created PIX QR Code.
			 */
			create(body: RESTPostCreateQRCodePixBody) {
				const wireBody: RESTPostCreateTransparentBody = {
					method: 'PIX',
					data: body,
				};

				return client.post<RESTPostCreateQRCodePixData>(
					Routes.transparents.create,
					{ body: wireBody },
				);
			},

			/**
			 * List embedded PIX QR-code (and Boleto) charges.
			 *
			 * @param query Optional query parameters.
			 * @returns A paginated list of transparent charges.
			 */
			list(query?: RESTGetListTransparentsQueryParams) {
				return client.get<RESTGetListTransparentsData>(
					Routes.transparents.list(query),
				);
			},

			/**
			 * Simulate a PIX payment for testing purposes.
			 *
			 * @param id PIX transaction ID.
			 * @param metadata Optional metadata to attach to the simulation.
			 * @returns The simulated payment result.
			 */
			simulate(id: string, metadata?: Record<string, object>) {
				return client.post<RESTPostSimulateQRCodePixPaymentData>(
					Routes.transparents.simulatePayment(id),
					{ body: { metadata } },
				);
			},

			/**
			 * Retrieve the current status of a PIX payment.
			 *
			 * @param id PIX transaction ID.
			 * @returns The PIX payment status.
			 */
			status(id: string) {
				return client.get<RESTGetCheckQRCodePixStatusData>(
					Routes.transparents.checkStatus(id),
				);
			},

			/**
			 * Refund an embedded PIX charge.
			 *
			 * @param id Public ID of the resource to refund.
			 * @param reason Optional refund reason, shown in the transaction history.
			 * @returns The public ID of the created refund transaction.
			 */
			refund(id: string, reason?: string) {
				return client.post<RESTPostRefundTransparentData>(
					Routes.transparents.refund,
					{ body: { id, reason } },
				);
			},
		},

		/**
		 * Embedded Boleto charge operations.
		 */
		boleto: {
			/**
			 * Create a new Boleto charge.
			 *
			 * @param body Boleto creation payload.
			 * @returns The created Boleto.
			 */
			create(body: RESTPostCreateBoletoBody) {
				const wireBody: RESTPostCreateTransparentBody = {
					method: 'BOLETO',
					data: body,
				};

				return client.post<RESTPostCreateBoletoData>(
					Routes.transparents.create,
					{ body: wireBody },
				);
			},
		},

		/**
		 * Outbound PIX transfer operations (Sending money to a third-party PIX key).
		 */
		transfers: {
			/**
			 * Send a PIX transfer to a third-party PIX key.
			 *
			 * @param body Transfer payload.
			 * @returns The created transfer.
			 */
			send(body: RESTPostSendPixTransferBody) {
				return client.post<RESTPostSendPixTransferData>(Routes.transfers.send, {
					body,
				});
			},

			/**
			 * Retrieve a PIX transfer by ID or external ID.
			 *
			 * @param query Query parameters, at least one of `id`/`externalId` is required.
			 * @returns The transfer data.
			 */
			get(query: RESTGetPixTransferQueryParams) {
				return client.get<RESTGetPixTransferData>(Routes.transfers.get(query));
			},

			/**
			 * List PIX transfers with optional pagination.
			 *
			 * @param query Optional query parameters.
			 * @returns A paginated list of transfers.
			 */
			list(query?: RESTGetListPixTransfersQueryParams) {
				return client.get<RESTGetListPixTransfersData>(
					Routes.transfers.list(query),
				);
			},
		},

		/**
		 * Coupon management operations.
		 */
		coupons: {
			/**
			 * Create a new coupon.
			 *
			 * @param body Coupon creation payload.
			 * @returns The created coupon.
			 */
			create(body: RESTPostCreateCouponBody) {
				return client.post<RESTPostCreateCouponData>(Routes.coupons.create, {
					body,
				});
			},

			/**
			 * Delete a coupon.
			 *
			 * @param id Coupon ID.
			 * @returns Deletion result.
			 */
			delete(id: string) {
				return client.post<RESTDeleteCouponData>(Routes.coupons.delete, {
					body: { id },
				});
			},

			/**
			 * Retrieve a coupon by ID.
			 *
			 * @param id Coupon ID.
			 * @returns The coupon data.
			 */
			get(id: string) {
				return client.get<RESTGetCouponData>(Routes.coupons.get(id));
			},

			/**
			 * List coupons with optional filters.
			 *
			 * @param query Optional query parameters.
			 * @returns A list of coupons.
			 */
			list(query?: RESTGetListCouponsQueryParams) {
				return client.get<RESTGetListCouponsData>(Routes.coupons.list(query));
			},

			/**
			 * Toggle the status of a coupon.
			 *
			 * @param id Coupon ID.
			 * @returns Updated coupon status.
			 */
			toggleStatus(id: string) {
				return client.post<RESTPostToggleCouponStatusData>(
					Routes.coupons.toggleStatus,
					{ body: { id } },
				);
			},
		},

		/**
		 * Store-related operations.
		 */
		store: {
			/**
			 * Retrieve store details.
			 *
			 * @returns Store information.
			 */
			get() {
				return client.get<RESTGetStoreDetailsData>(Routes.store.get);
			},
		},

		/**
		 * Monthly recurring revenue (MRR) and analytics.
		 */
		mrr: {
			/**
			 * Retrieve MRR metrics.
			 *
			 * @returns MRR data.
			 */
			get() {
				return client.get<RESTGetMRRData>(Routes.mrr.get);
			},

			/**
			 * Retrieve revenue data for a specific period.
			 *
			 * @param params Date range parameters.
			 * @returns Revenue metrics for the period.
			 */
			revenue({ startDate, endDate }: RESTGetRevenueByPeriodQueryParams) {
				return client.get<RESTGetRevenueByPeriodData>(
					Routes.mrr.revenue(startDate, endDate),
				);
			},

			/**
			 * Retrieve merchant-level revenue data.
			 *
			 * @returns Merchant revenue data.
			 */
			merchant() {
				return client.get<RESTGetMerchantData>(Routes.mrr.merchant);
			},
		},

		/**
		 * Payout management operations (Withdrawing to your own account).
		 */
		payouts: {
			/**
			 * Create a new payout.
			 *
			 * @param body Payout creation payload.
			 * @returns The created payout.
			 */
			create(body: RESTPostCreateNewPayoutBody) {
				return client.post<RESTPostCreateNewWPayoutData>(
					Routes.payouts.create,
					{ body },
				);
			},

			/**
			 * Retrieve a payout by ID.
			 *
			 * @param id Payout ID.
			 * @returns Payout details.
			 */
			get(id: string) {
				return client.get<RESTGetSearchPayoutData>(Routes.payouts.get(id));
			},

			/**
			 * List payouts with optional pagination.
			 *
			 * @param query Optional query parameters.
			 * @returns A list of payouts.
			 */
			list(query?: RESTGetListPayoutsQueryParams) {
				return client.get<RESTGetListPayoutsData>(Routes.payouts.list(query));
			},
		},

		/**
		 * Subscription management operations.
		 */
		subscriptions: {
			/**
			 * Create a new subscription.
			 *
			 * @param body Subscription creation payload.
			 * @returns The created subscription.
			 */
			create(body: RESTPostCreateSubscriptionBody) {
				return client.post<RESTPostCreateSubscriptionData>(
					Routes.subscriptions.create,
					{ body },
				);
			},

			/**
			 * List subscriptions with optional pagination.
			 *
			 * @param query Optional query parameters.
			 * @returns A paginated list of subscriptions.
			 */
			list(query?: RESTGetListSubscriptionsQueryParams) {
				return client.get<RESTGetListSubscriptionsData>(
					Routes.subscriptions.list(query),
				);
			},

			/**
			 * Cancel a subscription immediately (No grace period).
			 *
			 * @param id Subscription ID.
			 * @returns The cancelled subscription.
			 */
			cancel(id: string) {
				return client.post<RESTPostCancelSubscriptionData>(
					Routes.subscriptions.cancel,
					{ body: { id } },
				);
			},

			/**
			 * Change the product of a subscription. The change is applied at
			 * the next billing cycle; only one pending change can exist at a
			 * time.
			 *
			 * @param id Subscription ID.
			 * @param body The new product and quantity.
			 * @returns The requested plan change.
			 */
			changePlan(
				id: string,
				body: Omit<RESTPostChangeSubscriptionPlanBody, 'id'>,
			) {
				return client.post<RESTPostChangeSubscriptionPlanData>(
					Routes.subscriptions.changePlan,
					{ body: { id, ...body } },
				);
			},

			/**
			 * Record usage for a pay-as-you-go (no-cycle) product.
			 *
			 * @param id Subscription ID.
			 * @param body The product, unit count, and action.
			 * @returns The recorded usage.
			 */
			recordUsage(
				id: string,
				body: Omit<RESTPostRecordSubscriptionUsageBody, 'id'>,
			) {
				return client.post<RESTPostRecordSubscriptionUsageData>(
					Routes.subscriptions.recordUsage,
					{ body: { id, ...body } },
				);
			},
		},

		/**
		 * Product management operations.
		 */
		products: {
			/**
			 * Create a new product.
			 *
			 * @param body Product creation payload.
			 * @returns The created product.
			 */
			create(body: RESTPostCreateProductBody) {
				return client.post<RESTPostCreateProductData>(Routes.products.create, {
					body,
				});
			},

			/**
			 * Retrieve a product by query parameters.
			 *
			 * @param query Product query parameters.
			 * @returns The product data.
			 */
			get(query: RESTGetProductQueryParams) {
				return client.get<RESTGetProductData>(Routes.products.get(query));
			},

			/**
			 * List products with optional pagination.
			 *
			 * @param query Optional query parameters.
			 * @returns A list of products.
			 */
			list(query?: RESTGetListProductsQueryParams) {
				return client.get<RESTGetListProductsData>(Routes.products.list(query));
			},

			/**
			 * Permanently delete a product.
			 *
			 * @param id Product ID.
			 * @returns Deletion result.
			 */
			delete(id: string) {
				return client.post<RESTDeleteProductData>(Routes.products.delete(id));
			},
		},

		/**
		 * Webhook management operations.
		 */
		webhooks: {
			/**
			 * Create a new webhook.
			 *
			 * @param body Webhook creation payload.
			 * @returns The created webhook.
			 */
			create(body: RESTPostCreateWebhookBody) {
				return client.post<RESTPostCreateWebhookData>(Routes.webhooks.create, {
					body,
				});
			},

			/**
			 * List webhooks with optional filters.
			 *
			 * @param query Optional query parameters.
			 * @returns A paginated list of webhooks.
			 */
			list(query?: RESTGetListWebhooksQueryParams) {
				return client.get<RESTGetListWebhooksData>(Routes.webhooks.list(query));
			},

			/**
			 * Retrieve a webhook by ID.
			 *
			 * @param id Webhook ID.
			 * @returns The webhook data.
			 */
			get(id: string) {
				return client.get<RESTGetWebhookData>(Routes.webhooks.get(id));
			},

			/**
			 * Permanently delete a webhook.
			 *
			 * @param id Webhook ID.
			 * @returns Deletion result.
			 */
			delete(id: string) {
				return client.post<RESTPostDeleteWebhookData>(Routes.webhooks.delete, {
					body: { id },
				});
			},
		},
	};
};
