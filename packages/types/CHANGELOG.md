# Changelog

All notable changes to `@abacatepay/types` are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

## [4.0.0] - 2026-10-12

### Fixed

- **Breaking:** v2 pagination is cursor-based. `APIResponseWithCursorBasedPagination` now describes the real `pagination: { hasMore, next, before }` sibling of `data` (it declared `limit`, `hasNext`, `hasPrevious` and `nextCursor`, which never exist), and every list query type extends the new `RESTCursorPaginationQueryParams` (`after`, `before`, `limit` 1-100, `startDate`, `endDate`) plus the filters each route accepts. `page` and `cursor` were removed: the API silently dropped them, so only the first page was reachable. Page by sending `pagination.next` as `after` until it is `null`; do not rely on `hasMore` alone, part of the API traffic is served by an implementation where it is also `true` when only newer items exist.
- `Routes` builders URL-encode every value (coupon codes and external IDs with `&`, `#`, `+`, `%` or spaces changed the request) and only append the parameters you pass, so lists without `limit` now get the API default of 100 items instead of an implicit `limit=20`.
- **Breaking:** `Routes.customers.delete`, `Routes.coupons.delete` and `Routes.webhooks.delete` are now functions that put the ID in the query string, where the API reads it (sending it in the body got 422 on every call).
- `Routes.paymentLinks.get` calls `/payment-links/get` and `Routes.store.get` calls `/stores/get`; `/payment-links/one` and `/store/get` do not exist and always answered `Not found`.
- **Breaking:** `Routes.payouts.get` takes `{ id }` or `{ externalId }`; it used to send its only argument as `externalId`, so lookups by payout ID never matched.
- **Breaking:** `Routes.transfers.list` requires `{ id }`, which the API requires (422 without it); `limit`, `after`, `before`, `externalId` and `status` were removed because the API ignores them. `Routes.transfers.get` always sends the `id` key the API requires, so lookups by `externalId` alone work, and `RESTGetPixTransferQueryParams` requires at least one of `id`/`externalId`.
- **Breaking:** `RESTPostCreateSubscriptionBody` matches `POST /subscriptions/create`: required `items`, plus `methods`, `customerId`, `externalId`, `returnUrl`, `completionUrl`, `coupons`, `upSellProductId`, `card`, `retryPolicy` and `metadata`. The old `amount`, `name`, `description`, `method` and `frequency` are not API fields and every request that followed the type got 422. `RESTPostCreateSubscriptionData` is a subscription checkout (`APISubscriptionCheckout`), not an `APISubscription`.
- **Breaking:** `RESTPostCreateNewPayoutBody` requires the `pix: { type, key }` destination the API requires (every request got 422) and makes `externalId` optional.
- **Breaking:** `RESTPostCreateCouponBody.maxRedeems` is required (422 when omitted), and `discount` is documented in basis points for `PERCENTAGE` coupons (1000 = 10%); the old "1-100" documentation created 0.1% coupons.
- **Breaking:** request fields the API silently drops were removed: `customer` and `frequency` from `RESTPostCreateNewCheckoutBody` (the route forces `ONE_TIME`), `metadata` from `RESTPostCreateCustomerBody` and `RESTPostCreateCouponBody`, and `description` from `RESTPostCreateBoletoBody`.
- **Breaking:** refund responses (`RESTPostRefundCheckoutData`, `RESTPostRefundPaymentLinkData`, `RESTPostRefundTransparentData`) are `APIRefund` (`{ id, status, amount, reason, originalId, createdAt }`); `refundPublicId` never existed. `RESTPostDeleteWebhookData` has no `data`, as the API returns none.
- **Breaking:** `APIBoleto` exposes `brCode` and `brCodeBase64` at the top level (the nested `pix` object does not exist, so `boleto.pix.brCode` threw at runtime) and gained `identificationNumber`, `providerNumber`, `interest` and `fine`.
- **Breaking:** entities match the API responses. `APICheckout` (shared by checkouts, payment links and subscription checkouts) gained `platformFee`, `methods`, `card`, `dueDate`, `trialDays`, `trialEndsAt`, `nextChargeAt`, `installmentsCount` and `payerInformation`, and `returnUrl`, `completionUrl` and `metadata` are nullable; `APIPaymentLink` is now the same shape. `APICustomer` has nullable `name`, `taxId`, `cellphone`, `zipCode` and `country`, plus `address` and string `metadata`. `APICoupon` has `notes` and no `metadata`. `APIProduct` gained `imageUrl`, `hasFile`, `cycle` and `trialDays`, `description` is never `null` and `currency` is `'BRL'`. `APIPayout` and `APIPixTransfer` have a string `receiptUrl` and an `externalId` that is absent when not set. `APIQRCodePIX` gained `receiptUrl` and always has `metadata`. `APIStore.balance` gained `processingAnticipation`. `APISubscriptionPlanChange` gained `items`. `RESTGetMRRData` values are `{ currency, value }` objects, `RESTGetMerchantData` gained `id` and `country`, and `RESTGetCheckQRCodePixStatusData` gained `id`.
- **Breaking:** `APISubscription` matches `/subscriptions/*`: it gained `checkoutId`, `coupons`, `trialDays` and `trialEndsAt`, lost `currency`, `name`, `description`, `externalId`, `frequency` and `events` (never returned), and `method` is `CARD | PIX`.
- **Breaking:** enums only list values the API returns. `SubscriptionStatus` lost `EXPIRED` and `FAILED`; `CouponStatus` is `ACTIVE | DISABLED | DELETED` (was `ACTIVE | INACTIVE | EXPIRED`); `ProductStatus` is `ACTIVE | ARCHIVED` (was `ACTIVE | INACTIVE`). Checkout and payment link `status` uses the new `CheckoutStatus`, and transparent charges use the new `TransparentStatus`, because `PaymentStatus` lacked `UNDER_DISPUTE`, `ACTIVE`, `REDEEMED`, `APPROVED` and `FAILED`. `PayoutStatus` and `PixTransferStatus` gained `APPROVED`, `REDEEMED`, `UNDER_DISPUTE` and `FAILED` (both are now aliases of the new `TransactionStatus`).
- **Breaking:** v2 webhook payload types match what AbacatePay sends. The envelope has `apiVersion: 2` and `id` is the delivery ID (`log_...`, reused by automatic retries). `checkout.*` data is `{ checkout, customer, payerInformation? }`, `transparent.*` is `{ transparent, customer, payerInformation }` (with the card installment fields), `subscription.*` is `{ subscription, customer, checkout?, payment?, payerInformation? }`, `payout.*` is `{ withdraw }` (a failed payout is `FAILED`, not `CANCELLED`) and `transfer.*` is `{ transfer }`; refund and dispute events add `reason`. Code reading `data.payment`, `data.billing`, `data.pixQrCode` or `data.transaction` stops compiling; it never matched a real payload. Every event is typed now instead of `Record<string, unknown>`.
- The webhook type guards (`isPayoutCompletedWebhookEvent`, `isPayoutFailedWebhookEvent`, `isCheckoutCompletedWebhookEvent`, `isTransparentCompletedWebhookEvent`) are real type predicates.
- Documentation links to `pages/checkouts/reference` and `pages/coupon/reference`, which do not exist, point to the right pages.

### Added

- Types and routes for `GET /subscriptions/get`, `GET /subscriptions/checkouts/get`, `GET /subscriptions/checkouts/list`, `POST /subscriptions/checkouts/delete`, `POST /checkouts/delete`, `POST /payment-links/delete`, `GET /transparents/get`, `GET /bank-statement/list`, `GET /stores/list` (`Routes.stores`), `GET /public-mrr/mrr-by-day`, `GET /reports/list` and `GET /reports/run`.
- Transparent card charges (`POST /transparents/create` with `method: 'CARD'`): `RESTPostCreateCardBody`, which requires exactly one of a single-use `token` (`ctok_...`) or a saved `cardToken`, `RESTPostCreateCardData`, `APICardTransparent` with the installment fields, and the `CARD` arm of `RESTPostCreateTransparentBody`. `APITransparent` describes any item of `/transparents/list` and `/transparents/get`, with the `isPixTransparent`, `isBoletoTransparent` and `isCardTransparent` guards.
- Request fields the API accepts: `externalId`, `utm` and `ensureSameTaxId` for PIX QR Codes; `dueDate`, `interest`, `fine`, `utm`, `customer.zipCode` and `customer.address` for Boletos; `card`, `dueDate` and the `GOOGLE_PAY`/`APPLE_PAY` methods for checkouts; `upSellProductId`, `card`, `interest`, `fine` and `dueDate` for payment links; `startsAt` and `expiresAt` for coupons; `fileUrl`, `cycle` and `trialDays` for products; `items` for `subscriptions/change-plan`; the filters of every list; lookups by `externalId`, `customerId`, `email` or `taxId` where the API supports them.
- Webhooks: the `subscription.plan_changed` and `subscription.payment_failed` events, `StandardWebhookEvent` (the body of Standard Webhooks deliveries), `WebhookV1EventName` (v1 event names a v2 webhook can subscribe to), and `verifyStandardWebhookSignature` to verify deliveries signed with the `webhook-id`, `webhook-timestamp` and `webhook-signature` headers.
- `TransactionStatus`, `TransactionMethod`, `TransactionKind`, `CheckoutStatus`, `TransparentStatus`, `TransparentMethod`, `ProductCycle`, `APIRefund`, `APIBankStatementItem`, `APIReport`, `APIReportSpec`, `APICursorPagination`, `AtLeastOne` and `DistributiveOmit`.

### Changed

- `APIWebhook.events` and `RESTPostCreateWebhookBody.events` also accept the v1 event names, which the API accepts and delivers with the v1 payload.

### Deprecated

- `PaymentStatus` (use `CheckoutStatus` or `TransparentStatus`), `APIResponseWithPagination` (now an alias of `APIResponseWithCursorBasedPagination`), `Routes.store` (use `Routes.stores`), `RESTDeleteCustomerBody`, `RESTDeleteCustomerData`, `RESTDeleteCouponBody`, `RESTDeleteCouponData`, `RESTPostDeleteWebhookBody`, `RESTPostCreateNewWPayoutData` (use `RESTPostCreateNewPayoutData`) and `RESTPostSimulateQRCodePixPaymentBody` (the API ignores it).
- `WebhookEventType.CheckoutLost`, `WebhookEventType.TransparentLost` and `WebhookUndocumentedEvent`: AbacatePay never sends `checkout.lost` or `transparent.lost`; a lost dispute arrives as `*.disputed` with `status: 'REFUNDED'`.

### Removed

- **Breaking:** `APISubscriptionEvent`, which no endpoint returns.

## [3.0.3] - 2026-07-27

### Fixed

- Declaration files (`.d.ts`) are now bundled into a single self-contained file per entrypoint (via `dts-bundle-generator`), same as the `.js` output already was. Fixing the `.js` bundling earlier didn't touch declaration emission at all — `tsc --emitDeclarationOnly` still walked the original unbundled source tree, so `dist/v2/index.d.ts` still had extension-less relative exports like `export * from './entities/checkout'`. Any TypeScript consumer using `moduleResolution: "nodenext"`/`"node16"` (a common, often-recommended setting) would get `error TS2834: Relative import paths need explicit file extensions`. Cross-package types (nothing to bundle against here, but see `@abacatepay/sdk`'s changelog) stay as real `import`s, not inlined — inlining would have silently duplicated the `enum` declarations (`PaymentStatus`, `PaymentMethod`, etc.) into a nominally incompatible copy for anyone using both packages together.

## [3.0.2] - 2026-07-27

### Fixed

- `types/v1` didn't re-export `Routes` the way `types/v2` already did, forcing consumers to import the deep subpath `@abacatepay/types/v1/routes` directly. That subpath was never actually produced by the bundled build (only `index`, `v1/index`, `v2/index` are built as complete bundles), so it broke under real Node.js resolution as soon as anything stopped inlining `@abacatepay/types` wholesale. `types/v1` now re-exports `Routes`, matching `v2`.

## [3.0.1] - 2026-07-27

### Fixed

- Package now bundles with `bun build` instead of emitting raw `tsc` output. The root export and the `/v1`/`/v2` subpaths were failing with `ERR_MODULE_NOT_FOUND` under real Node.js ESM resolution (the previous build relied on `moduleResolution: "bundler"`, which emits extension-less relative imports that require an actual bundling step afterward — one never ran).

## [3.0.0] - 2026-07-27

### Added

- v2: types for payment links, the webhooks resource (`APIWebhook`), outbound PIX transfers (`APIPixTransfer`), Boleto (`APIBoleto`), and the subscription lifecycle (cancel, change-plan, record-usage).

### Changed

- **Breaking:** every `RESTxxxData` type is now the full API response envelope (`APIResponse<T>` / `APIResponseWithPagination<T>` / `APIResponseWithCursorBasedPagination<T>`) instead of an unwrapped entity. This is what lets `@abacatepay/rest` stop unwrapping responses and throwing on API errors.
- **Breaking:** the webhook event taxonomy now matches what's actually documented: `payout.done` → `payout.completed`, `billing.paid` split into `checkout.completed` and `transparent.completed`, plus the full set of other v2 events (`checkout.refunded`/`disputed`/`lost`, `transparent.refunded`/`disputed`/`lost`, `subscription.*`, `transfer.*`).
- `PaymentMethod` gained `BOLETO`; `APICheckout` gained `frequency`, `upSellProductId`, `interest`, `fine`.
