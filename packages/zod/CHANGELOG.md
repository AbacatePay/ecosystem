# Changelog

All notable changes to `@abacatepay/zod` are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

## [2.1.0] - 2026-10-12

### Fixed

- The v2 webhook schemas match the payloads AbacatePay sends. `WebhookEvent.parse` rejected every real `checkout.completed`, `transparent.completed`, `payout.*`, `subscription.plan_changed` and `subscription.payment_failed` body, so `@abacatepay/adapters` answered 400 and the events were lost. The envelope has `apiVersion: 2`; `checkout.*` data is `{ checkout, customer, payerInformation? }`; `transparent.*` is `{ transparent, customer, payerInformation }`, including the card installment fields; `subscription.*` is `{ subscription, customer, checkout?, payment?, payerInformation? }`; `payout.*` is `{ withdraw }`, with `FAILED` for failed payouts; `transfer.*` is `{ transfer }`; refund and dispute events add `reason`.
- Webhook objects are loose: fields AbacatePay adds to the payload later are kept instead of failing the whole event. Webhook dates stay ISO strings.
- `APIWebhook.events` accepts the v1 event names the API also stores.

### Added

- `subscription.plan_changed` and `subscription.payment_failed` in `WebhookEventType`, with their schemas.
- Schemas for the data of every event (`WebhookCheckout`, `WebhookTransparent`, `WebhookSubscription`, `WebhookSubscriptionCheckout`, `WebhookSubscriptionPayment`, `WebhookPayout`, `WebhookTransfer`, `WebhookCustomer`, `WebhookPayerInformation`, `WebhookUtms` and the status/method enums), `StandardWebhookEvent` and `BaseStandardWebhookEvent` for Standard Webhooks deliveries (`type`/`timestamp`, no `id`), and `WebhookV1EventName`.

### Changed

- The inferred webhook types follow the new schemas: code that read `data.transaction`, `data.payment`, `data.billing` or `data.pixQrCode` stops compiling (those fields never existed in a real payload).

### Deprecated

- `WebhookUndocumentedEvent`, which now only covers `checkout.lost` and `transparent.lost`: AbacatePay never sends them; a lost dispute arrives as `*.disputed` with `status: 'REFUNDED'`.

## [2.0.3] - 2026-07-27

### Fixed

- Declaration files (`.d.ts`) are now bundled into a single self-contained file per entrypoint (via `dts-bundle-generator`), same as the `.js` output already was. Any TypeScript consumer using `moduleResolution: "nodenext"`/`"node16"` would get `error TS2834: Relative import paths need explicit file extensions` from the unbundled `.d.ts` output the earlier `.js`-bundling fix never touched.

## [2.0.2] - 2026-07-27

### Fixed

- `CHANGELOG.md` added to the published npm tarball (was previously excluded by `files`, so it only ever existed in the repo, not what `npm install` pulled down).

## [2.0.1] - 2026-07-27

### Fixed

- Package now bundles with `bun build` instead of emitting raw `tsc` output. The root export and the `/v1`/`/v2` subpaths were failing with `ERR_MODULE_NOT_FOUND` under real Node.js ESM resolution.

## [2.0.0] - 2026-07-27

### Added

- v2 schemas for payment links, the webhooks resource (`APIWebhook`), outbound PIX transfers (`APIPixTransfer`), Boleto (`APIBoleto`), and the subscription lifecycle (cancel, change-plan, record-usage).

### Fixed

- `APISubscription.frequency.dayOfProcessing` was a sibling field instead of being nested inside `frequency` (typebox already had this right).

### Changed

- **Breaking:** the webhook event taxonomy now matches what's actually documented: `payout.done` → `payout.completed`, `billing.paid` split into `checkout.completed` and `transparent.completed`, plus the full set of other v2 events.
- **Breaking:** `RESTPatchToggleCouponStatusBody`/`Data` renamed to `RESTPostToggleCouponStatusBody`/`Data`, matching the real HTTP method.
- `PaymentMethod` gained `BOLETO`; `APICheckout` gained `frequency`, `upSellProductId`, `interest`, `fine`.
