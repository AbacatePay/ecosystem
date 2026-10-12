import { createREST } from '@abacatepay/rest';
import type {
	CouponStatus,
	DistributiveOmit,
	RESTDeleteProductData,
	RESTGetCheckoutData,
	RESTGetCheckoutQueryParams,
	RESTGetCheckQRCodePixStatusData,
	RESTGetCouponData,
	RESTGetCustomerData,
	RESTGetCustomerQueryParams,
	RESTGetListBankStatementData,
	RESTGetListBankStatementQueryParams,
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
	RESTGetListReportsData,
	RESTGetListStoresData,
	RESTGetListStoresQueryParams,
	RESTGetListSubscriptionCheckoutsData,
	RESTGetListSubscriptionCheckoutsQueryParams,
	RESTGetListSubscriptionsData,
	RESTGetListSubscriptionsQueryParams,
	RESTGetListTransparentsData,
	RESTGetListTransparentsQueryParams,
	RESTGetListWebhooksData,
	RESTGetListWebhooksQueryParams,
	RESTGetMerchantData,
	RESTGetMRRByDayData,
	RESTGetMRRByDayQueryParams,
	RESTGetMRRData,
	RESTGetPaymentLinkData,
	RESTGetPaymentLinkQueryParams,
	RESTGetPixTransferData,
	RESTGetPixTransferQueryParams,
	RESTGetProductData,
	RESTGetProductQueryParams,
	RESTGetRevenueByPeriodData,
	RESTGetRevenueByPeriodQueryParams,
	RESTGetRunReportData,
	RESTGetRunReportQueryParams,
	RESTGetSearchPayoutData,
	RESTGetSearchPayoutQueryParams,
	RESTGetStoreDetailsData,
	RESTGetSubscriptionCheckoutData,
	RESTGetSubscriptionCheckoutQueryParams,
	RESTGetSubscriptionData,
	RESTGetSubscriptionQueryParams,
	RESTGetTransparentData,
	RESTGetWebhookData,
	RESTPostCancelSubscriptionData,
	RESTPostChangeSubscriptionPlanBody,
	RESTPostChangeSubscriptionPlanData,
	RESTPostCreateBoletoBody,
	RESTPostCreateBoletoData,
	RESTPostCreateCardBody,
	RESTPostCreateCardData,
	RESTPostCreateCouponBody,
	RESTPostCreateCouponData,
	RESTPostCreateCustomerBody,
	RESTPostCreateCustomerData,
	RESTPostCreateNewCheckoutBody,
	RESTPostCreateNewCheckoutData,
	RESTPostCreateNewPayoutBody,
	RESTPostCreateNewPayoutData,
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
	RESTPostDeleteCheckoutData,
	RESTPostDeleteCouponData,
	RESTPostDeleteCustomerData,
	RESTPostDeletePaymentLinkData,
	RESTPostDeleteSubscriptionCheckoutData,
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
 *
 * Methods that create, send or refund money are never retried after the request
 * may have reached the API (Only on 429): check the result before trying again.
 *
 * List methods use cursor pagination: send `pagination.next` as `after` to get
 * the next page and stop when it is `null` (Do not rely on `pagination.hasMore` alone).
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
			 * Retrieve a customer by its ID, or by `email`/`taxId`.
			 *
			 * @param query Customer ID, or the lookup filters (At least one of `id`, `email` or `taxId`).
			 * @returns The customer data.
			 */
			get(query: string | RESTGetCustomerQueryParams) {
				return client.get<RESTGetCustomerData>(Routes.customers.get(query));
			},

			/**
			 * Delete a customer.
			 *
			 * @param id Customer ID.
			 * @returns The deleted customer.
			 */
			delete(id: string) {
				return client.post<RESTPostDeleteCustomerData>(
					Routes.customers.delete(id),
				);
			},

			/**
			 * Create a new customer. An existing customer with the same taxId, email or cellphone is returned instead.
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
			 * List customers, newest first.
			 *
			 * @param query Optional filters and cursor (Send `pagination.next` as `after` for the next page).
			 * @returns A cursor-paginated list of customers.
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
			 * List checkouts, newest first.
			 *
			 * @param query Optional filters and cursor (Send `pagination.next` as `after` for the next page).
			 * @returns A cursor-paginated list of checkouts.
			 */
			list(query?: RESTGetListCheckoutsQueryParams) {
				return client.get<RESTGetListCheckoutsData>(
					Routes.checkouts.list(query),
				);
			},

			/**
			 * Retrieve a checkout by its ID, or by `externalId`/`customerId`.
			 *
			 * @param query Checkout ID, or the lookup filters (At least one of `id`, `externalId` or `customerId`).
			 * @returns The checkout data.
			 */
			get(query: string | RESTGetCheckoutQueryParams) {
				return client.get<RESTGetCheckoutData>(Routes.checkouts.get(query));
			},

			/**
			 * Delete a checkout.
			 *
			 * @param id Checkout ID (`bill_...`).
			 * @returns The deleted checkout.
			 */
			delete(id: string) {
				return client.post<RESTPostDeleteCheckoutData>(
					Routes.checkouts.delete(id),
				);
			},

			/**
			 * Refund a paid checkout (Full amount).
			 *
			 * @param id Checkout ID (`bill_...`) or the ID of one of its charges (`char_`, `pix_char_`, `card_`).
			 * @param reason Optional refund reason, shown in the transaction history.
			 * @returns The created refund.
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
			 * List payment links, newest first.
			 *
			 * @param query Optional filters and cursor (Send `pagination.next` as `after` for the next page).
			 * @returns A cursor-paginated list of payment links.
			 */
			list(query?: RESTGetListPaymentLinksQueryParams) {
				return client.get<RESTGetListPaymentLinksData>(
					Routes.paymentLinks.list(query),
				);
			},

			/**
			 * Retrieve a payment link by its ID, or by `externalId`/`customerId`.
			 *
			 * @param query Payment link ID, or the lookup filters.
			 * @returns The payment link data.
			 */
			get(query: string | RESTGetPaymentLinkQueryParams) {
				return client.get<RESTGetPaymentLinkData>(
					Routes.paymentLinks.get(query),
				);
			},

			/**
			 * Delete a payment link.
			 *
			 * @param id Payment link ID (`bill_...`).
			 * @returns The deleted payment link.
			 */
			delete(id: string) {
				return client.post<RESTPostDeletePaymentLinkData>(
					Routes.paymentLinks.delete(id),
				);
			},

			/**
			 * Refund a payment made through a payment link (Full amount).
			 *
			 * @param id ID of the charge to refund (`char_`, `pix_char_` or `card_`), not of the link.
			 * @param reason Optional refund reason, shown in the transaction history.
			 * @returns The created refund.
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
			 * List transparent charges (PIX, Boleto and card).
			 *
			 * @deprecated Use `transparents.list`.
			 * @param query Optional filters and cursor.
			 * @returns A cursor-paginated list of transparent charges.
			 */
			list(query?: RESTGetListTransparentsQueryParams) {
				return client.get<RESTGetListTransparentsData>(
					Routes.transparents.list(query),
				);
			},

			/**
			 * Simulate a PIX payment for testing purposes (Dev mode keys only, PIX QR Codes only).
			 *
			 * @param id PIX QR Code ID.
			 * @param _metadata Deprecated and ignored: the API does not accept a body.
			 * @returns The PIX QR Code. Its `PAID` status is optimistic, the payment is processed asynchronously.
			 */
			simulate(id: string, _metadata?: Record<string, unknown>) {
				return client.post<RESTPostSimulateQRCodePixPaymentData>(
					Routes.transparents.simulatePayment(id),
				);
			},

			/**
			 * Retrieve the current status of a PIX QR Code. Not cached by the API, so use it to poll for the payment.
			 *
			 * @param id PIX QR Code ID.
			 * @returns The PIX payment status.
			 */
			status(id: string) {
				return client.get<RESTGetCheckQRCodePixStatusData>(
					Routes.transparents.checkStatus(id),
				);
			},

			/**
			 * Refund an embedded PIX charge (Full amount).
			 *
			 * @param id ID of the PIX QR Code (`pix_char_...`).
			 * @param reason Optional refund reason, shown in the transaction history.
			 * @returns The created refund.
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
		 * Embedded card charge operations (Checkout transparente de cartão).
		 */
		card: {
			/**
			 * Charge a card tokenized in the browser by AbacatePay.js (`token`, a single-use `ctok_...`
			 * that expires in 60 seconds and must be created for the same `amount`) or saved from a
			 * previous charge (`cardToken`).
			 *
			 * Never retried after the request may have reached the API: a `ctok_` token is single-use
			 * and a retry with `cardToken` could charge the card twice.
			 *
			 * @param body Card charge payload.
			 * @returns The created charge. For installment sales it describes the first installment.
			 */
			create(body: RESTPostCreateCardBody) {
				const wireBody: RESTPostCreateTransparentBody = {
					method: 'CARD',
					data: body,
				};

				return client.post<RESTPostCreateCardData>(Routes.transparents.create, {
					body: wireBody,
				});
			},
		},

		/**
		 * Operations shared by every transparent charge (PIX, Boleto and card).
		 */
		transparents: {
			/**
			 * Retrieve a transparent charge (Cached by the API for up to 60 seconds; use `pix.status` to poll a PIX payment).
			 *
			 * @param id Charge ID (`pix_char_...`, `bole_...` or `card_...`).
			 * @returns The charge.
			 */
			get(id: string) {
				return client.get<RESTGetTransparentData>(Routes.transparents.get(id));
			},

			/**
			 * List transparent charges, newest first.
			 *
			 * @param query Optional filters (Including `method`) and cursor (Send `pagination.next` as `after` for the next page).
			 * @returns A cursor-paginated list of charges.
			 */
			list(query?: RESTGetListTransparentsQueryParams) {
				return client.get<RESTGetListTransparentsData>(
					Routes.transparents.list(query),
				);
			},

			/**
			 * Refund a transparent charge (Full amount). Boletos cannot be refunded.
			 *
			 * @param id Charge ID (`pix_char_...` or `card_...`).
			 * @param reason Optional refund reason, shown in the transaction history.
			 * @returns The created refund.
			 */
			refund(id: string, reason?: string) {
				return client.post<RESTPostRefundTransparentData>(
					Routes.transparents.refund,
					{ body: { id, reason } },
				);
			},
		},

		/**
		 * Outbound PIX transfer operations (Sending money to a third-party PIX key).
		 */
		transfers: {
			/**
			 * Send a PIX transfer to a third-party PIX key. One transfer per store every 30 seconds;
			 * `externalId` is not used to deduplicate requests.
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
			 * Search transactions by a partial ID. The API requires `id`, returns at most 100 items
			 * (Newest first) of any kind and supports no cursor.
			 *
			 * @param query The partial transaction ID to search for.
			 * @returns The matching transactions.
			 */
			list(query: RESTGetListPixTransfersQueryParams) {
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
			 * Create a new coupon. An existing coupon with the same code is returned unchanged.
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
			 * @param id Coupon code.
			 * @returns The deleted coupon.
			 */
			delete(id: string) {
				return client.post<RESTPostDeleteCouponData>(Routes.coupons.delete(id));
			},

			/**
			 * Retrieve a coupon by its code.
			 *
			 * @param id Coupon code.
			 * @param status Only return the coupon when it has this status.
			 * @returns The coupon data.
			 */
			get(id: string, status?: CouponStatus) {
				return client.get<RESTGetCouponData>(Routes.coupons.get(id, status));
			},

			/**
			 * List coupons, newest first.
			 *
			 * @param query Optional filters and cursor (Send `pagination.next` as `after` for the next page).
			 * @returns A cursor-paginated list of coupons.
			 */
			list(query?: RESTGetListCouponsQueryParams) {
				return client.get<RESTGetListCouponsData>(Routes.coupons.list(query));
			},

			/**
			 * Toggle the status of a coupon (`ACTIVE` ↔ `DISABLED`).
			 *
			 * @param id Coupon code.
			 * @returns The updated coupon.
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
		stores: {
			/**
			 * Retrieve your store and its balances (Cached by the API for up to one hour).
			 *
			 * @returns Store information.
			 */
			get() {
				return client.get<RESTGetStoreDetailsData>(Routes.stores.get);
			},

			/**
			 * List stores. Only your own store is returned, with dev and production balances summed.
			 *
			 * @param query Optional filters and cursor.
			 * @returns The stores.
			 */
			list(query?: RESTGetListStoresQueryParams) {
				return client.get<RESTGetListStoresData>(Routes.stores.list(query));
			},
		},

		/**
		 * @deprecated Use `stores`.
		 */
		store: {
			/**
			 * Retrieve your store and its balances.
			 *
			 * @deprecated Use `stores.get()`.
			 * @returns Store information.
			 */
			get() {
				return client.get<RESTGetStoreDetailsData>(Routes.stores.get);
			},
		},

		/**
		 * Bank statement operations (Every movement of your balance).
		 */
		bankStatement: {
			/**
			 * List bank statement entries, newest first.
			 *
			 * @param query Optional filters and cursor (Send `pagination.next` as `after` for the next page).
			 * @returns A cursor-paginated list of entries.
			 */
			list(query?: RESTGetListBankStatementQueryParams) {
				return client.get<RESTGetListBankStatementData>(
					Routes.bankStatement.list(query),
				);
			},
		},

		/**
		 * Public monthly recurring revenue (Trust MRR).
		 *
		 * These routes only accept an `mrr_` token (From the Trust MRR app installation), and that token
		 * is rejected by every other route. Use a separate client:
		 * `AbacatePay({ secret: process.env.ABACATEPAY_MRR_TOKEN })`.
		 */
		mrr: {
			/**
			 * Retrieve the current MRR and the number of active subscriptions. Requires an `mrr_` token.
			 *
			 * @returns MRR data.
			 */
			get() {
				return client.get<RESTGetMRRData>(Routes.mrr.get);
			},

			/**
			 * Retrieve the revenue of a period. Requires an `mrr_` token.
			 *
			 * @param params Date range (`endDate` must be after `startDate`).
			 * @returns Revenue metrics for the period.
			 */
			revenue({ startDate, endDate }: RESTGetRevenueByPeriodQueryParams) {
				return client.get<RESTGetRevenueByPeriodData>(
					Routes.mrr.revenue(startDate, endDate),
				);
			},

			/**
			 * Retrieve the MRR at the end of each day of a period. Requires an `mrr_` token.
			 *
			 * @param params Date range (At most 366 days).
			 * @returns The MRR of each day, keyed by `YYYY-MM-DD`.
			 */
			byDay({ startDate, endDate }: RESTGetMRRByDayQueryParams) {
				return client.get<RESTGetMRRByDayData>(
					Routes.mrr.byDay(startDate, endDate),
				);
			},

			/**
			 * Retrieve the public information of the store. Requires an `mrr_` token.
			 *
			 * @returns Store name, website, creation date and country.
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
			 * Create a new payout to a PIX key of your own store. One payout per store every 30 seconds.
			 *
			 * @param body Payout creation payload.
			 * @returns The created payout.
			 */
			create(body: RESTPostCreateNewPayoutBody) {
				return client.post<RESTPostCreateNewPayoutData>(Routes.payouts.create, {
					body,
				});
			},

			/**
			 * Retrieve a payout by its ID, or by `externalId`.
			 *
			 * @param query Payout ID (`tran_...`), or `{ id }` / `{ externalId }`.
			 * @returns Payout details.
			 */
			get(query: string | RESTGetSearchPayoutQueryParams) {
				return client.get<RESTGetSearchPayoutData>(
					Routes.payouts.get(typeof query === 'string' ? { id: query } : query),
				);
			},

			/**
			 * List payouts, newest first.
			 *
			 * @param query Optional filters and cursor (Send `pagination.next` as `after` for the next page).
			 * @returns A cursor-paginated list of payouts.
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
			 * Create a subscription checkout (`bill_...`). The subscription itself (`subs_...`) is created
			 * when a customer pays it.
			 *
			 * @param body Subscription checkout creation payload.
			 * @returns The created subscription checkout.
			 */
			create(body: RESTPostCreateSubscriptionBody) {
				return client.post<RESTPostCreateSubscriptionData>(
					Routes.subscriptions.create,
					{ body },
				);
			},

			/**
			 * Retrieve a subscription by its ID, the `externalId` of its checkout or its customer.
			 *
			 * @param query At least one of `id`, `externalId` or `customerId`.
			 * @returns The subscription.
			 */
			get(query: RESTGetSubscriptionQueryParams) {
				return client.get<RESTGetSubscriptionData>(
					Routes.subscriptions.get(query),
				);
			},

			/**
			 * List subscriptions, newest first.
			 *
			 * @param query Optional filters and cursor (Send `pagination.next` as `after` for the next page).
			 * @returns A cursor-paginated list of subscriptions.
			 */
			list(query?: RESTGetListSubscriptionsQueryParams) {
				return client.get<RESTGetListSubscriptionsData>(
					Routes.subscriptions.list(query),
				);
			},

			/**
			 * Cancel a subscription immediately (No grace period).
			 *
			 * @param id Subscription ID (`subs_...`).
			 * @returns The cancelled subscription.
			 */
			cancel(id: string) {
				return client.post<RESTPostCancelSubscriptionData>(
					Routes.subscriptions.cancel,
					{ body: { id } },
				);
			},

			/**
			 * Change the products of a subscription. The change is applied at the next billing cycle;
			 * only one pending change can exist at a time.
			 *
			 * @param id Subscription ID.
			 * @param body Either `items` or `productId` + `quantity`.
			 * @returns The requested plan change.
			 */
			changePlan(
				id: string,
				body: DistributiveOmit<RESTPostChangeSubscriptionPlanBody, 'id'>,
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

			/**
			 * Subscription checkouts (`bill_...`), the links customers pay to subscribe.
			 */
			checkouts: {
				/**
				 * Retrieve a subscription checkout by its ID, or by `externalId`/`customerId`.
				 *
				 * @param query Subscription checkout ID, or the lookup filters.
				 * @returns The subscription checkout.
				 */
				get(query: string | RESTGetSubscriptionCheckoutQueryParams) {
					return client.get<RESTGetSubscriptionCheckoutData>(
						Routes.subscriptions.checkouts.get(query),
					);
				},

				/**
				 * List subscription checkouts, newest first.
				 *
				 * @param query Optional filters and cursor (Send `pagination.next` as `after` for the next page).
				 * @returns A cursor-paginated list of subscription checkouts.
				 */
				list(query?: RESTGetListSubscriptionCheckoutsQueryParams) {
					return client.get<RESTGetListSubscriptionCheckoutsData>(
						Routes.subscriptions.checkouts.list(query),
					);
				},

				/**
				 * Delete a subscription checkout. Subscriptions already created by it stay active.
				 *
				 * @param id Subscription checkout ID (`bill_...`).
				 * @returns The deleted subscription checkout.
				 */
				delete(id: string) {
					return client.post<RESTPostDeleteSubscriptionCheckoutData>(
						Routes.subscriptions.checkouts.delete(id),
					);
				},
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
			 * @param query At least one of `id`, `externalId` or `name`.
			 * @returns The product data.
			 */
			get(query: RESTGetProductQueryParams) {
				return client.get<RESTGetProductData>(Routes.products.get(query));
			},

			/**
			 * List products, newest first.
			 *
			 * @param query Optional filters and cursor (Send `pagination.next` as `after` for the next page).
			 * @returns A cursor-paginated list of products.
			 */
			list(query?: RESTGetListProductsQueryParams) {
				return client.get<RESTGetListProductsData>(Routes.products.list(query));
			},

			/**
			 * Delete a product (And every variation of its group).
			 *
			 * @param id Product ID.
			 * @returns The deleted product.
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
			 * List webhooks, newest first.
			 *
			 * @param query Optional filters and cursor (Send `pagination.next` as `after` for the next page).
			 * @returns A cursor-paginated list of webhooks.
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
			 * Delete a webhook.
			 *
			 * @param id Webhook ID.
			 * @returns The deletion result (No `data`).
			 */
			delete(id: string) {
				return client.post<RESTPostDeleteWebhookData>(
					Routes.webhooks.delete(id),
				);
			},
		},

		/**
		 * Financial reports.
		 */
		reports: {
			/**
			 * List the available reports and the input each one takes.
			 *
			 * @returns The report catalog.
			 */
			list() {
				return client.get<RESTGetListReportsData>(Routes.reports.list);
			},

			/**
			 * Run a report.
			 *
			 * @param query The report ID and, for period reports, `startDate` and `endDate`.
			 * @returns The report, with raw and pt-BR formatted values.
			 */
			run(query: RESTGetRunReportQueryParams) {
				return client.get<RESTGetRunReportData>(Routes.reports.run(query));
			},
		},
	};
};
