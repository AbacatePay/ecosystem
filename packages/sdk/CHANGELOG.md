# Changelog

All notable changes to `@abacatepay/sdk` are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

## [3.0.0] - 2026-10-12

### Fixed

- **Breaking:** list methods use the API's cursor pagination. They take `after`, `before`, `limit` (1-100), `startDate`, `endDate` and the filters each route accepts, and resolve with `pagination: { hasMore, next, before }`. `page` and `cursor` were removed: the API ignored them, so only the first page was ever returned. To read every page, send `pagination.next` as `after` until it is `null` (do not rely on `hasMore` alone). Lists no longer send `limit=20` implicitly, so they return up to 100 items (the API default) unless you pass `limit`.
- `customers.delete`, `coupons.delete` and `webhooks.delete` send the ID in the query string, where the API reads it; every call used to fail with 422.
- `paymentLinks.get` calls `/payment-links/get` and `store.get()` calls `/stores/get`; both called paths that do not exist and always answered `Not found`.
- `payouts.get(id)` looks the payout up by its ID (it sent the ID as `externalId`, so it never found it). It also accepts `{ id }` or `{ externalId }`, URL-encoded.
- **Breaking:** `payouts.create` requires the `pix: { type, key }` destination the API requires (every call failed with 422); `externalId` is optional.
- **Breaking:** `subscriptions.create` takes the real body (`items`, `methods`, `customerId`, `externalId`, `returnUrl`, `completionUrl`, `coupons`, `upSellProductId`, `card`, `retryPolicy`, `metadata`) and resolves with the subscription checkout it creates; the old body was missing the required `items` and every call failed with 422.
- **Breaking:** `coupons.create` requires `maxRedeems` (422 when omitted). `discount` is in basis points for `PERCENTAGE` coupons (1000 = 10%).
- **Breaking:** `transfers.list` requires `{ id }`, as the API does (calls without it failed with 422), and `transfers.get({ externalId })` works (the API needs the `id` key, so an empty one is sent).
- `checkouts.refund`, `paymentLinks.refund` and `pix.refund` resolve with the real refund (`{ id, status, amount, reason, originalId, createdAt }`) instead of a `refundPublicId` that never existed.
- `pix.simulate` no longer sends a body (the API ignores it).
- Requests that create, send or refund money are no longer retried after they may have reached the API, through `@abacatepay/rest` 1.1.0: only `GET` requests are retried on timeouts and 5xx, other methods only on 429. A retried card charge, payout or PIX transfer could charge or send money twice.
- Every request and response type follows `@abacatepay/types` 4.0.0, which matches the API (see its changelog).

### Added

- `card.create`: transparent card charges (`POST /transparents/create` with `method: 'CARD'`), with a single-use `token` from AbacatePay.js or a saved `cardToken` (exactly one, enforced by the type) and up to 12 installments.
- `transparents.get`, `transparents.list` (with the `method` filter) and `transparents.refund`, for PIX, Boleto and card charges.
- `checkouts.delete`, `paymentLinks.delete`, `subscriptions.get`, `subscriptions.checkouts.get`, `subscriptions.checkouts.list`, `subscriptions.checkouts.delete`, `stores.get`, `stores.list`, `bankStatement.list`, `mrr.byDay`, `reports.list` and `reports.run`.
- Lookups by filters: `customers.get` (`email`, `taxId`), `checkouts.get` and `paymentLinks.get` (`externalId`, `customerId`, `method`), `coupons.get(id, status)`; `subscriptions.changePlan` accepts `items` for multi-product plans.

### Changed

- **Breaking:** depends on `@abacatepay/types` `^4.0.0` and `@abacatepay/rest` `^1.1.0`. Fields the API silently dropped are no longer accepted: `customer` and `frequency` in `checkouts.create`, `metadata` in `customers.create` and `coupons.create`, and `description` in `boleto.create`.
- **Breaking:** response types follow the API: checkouts and payment links use `CheckoutStatus`, transparent charges use `TransparentStatus`, `APIBoleto` has `brCode`/`brCodeBase64` at the top level, and `APISubscription` lost the fields the API never returns.
- The default request timeout is 30 seconds (was 5); set `rest.timeout` to change it.

### Deprecated

- `store.get()` (use `stores.get()`), `pix.list()` (use `transparents.list()`) and the `metadata` argument of `pix.simulate`, which the API ignores.

## [2.0.3] - 2026-07-27

### Fixed

- Declaration files (`.d.ts`) are now bundled into a single self-contained file per entrypoint (via `dts-bundle-generator`), same as the `.js` output already was. Found by testing a real, strict TypeScript consumer (`moduleResolution: "nodenext"`): `dist/index.d.ts` still said `export * from './v2'` after the earlier `.js`-bundling fix, since declaration emission is a separate step that walks the original unbundled source. `@abacatepay/rest`/`@abacatepay/types` stay as real `import`s in the bundled declaration (not inlined) — inlining would have silently duplicated `@abacatepay/types`'s `enum` declarations into a nominally incompatible copy, breaking any consumer code that mixes a value returned by this SDK with a type imported directly from `@abacatepay/types`.

## [2.0.2] - 2026-07-27

### Changed

- The build no longer inlines `@abacatepay/rest` and `@abacatepay/types` into `dist` — they're now real `import`s resolved via `node_modules` at install time, like any other npm dependency. Bundle size dropped from ~14KB to ~5KB. No behavior change; both were already listed as real `dependencies`.

### Fixed

- Fixed a bug this change surfaced: `sdk/v1` imported `Routes` from the deep subpath `@abacatepay/types/v1/routes`, which was never actually produced by `types`' bundled build. Now imports it from the `@abacatepay/types/v1` barrel instead (see `@abacatepay/types`'s changelog).

## [2.0.1] - 2026-07-27

### Fixed

- `/v1` and `/v2` subpath exports now actually resolve under Node.js. The build only ever bundled the root entrypoint despite `package.json` declaring these subpaths — `@abacatepay/sdk/v1` failed with `ERR_MODULE_NOT_FOUND` for every real npm consumer, even before the 2.0.0 rewrite.

## [2.0.0] - 2026-07-27

### Added

- v2: `webhooks`, `paymentLinks`, `transfers`, and `boleto` domains; `checkouts.refund`, `pix.list`/`pix.refund`, `subscriptions.cancel`/`changePlan`/`recordUsage`, `products.delete`.

### Changed

- **Breaking:** no method throws anymore — every call resolves to `{ data, error, success }`, the same shape the AbacatePay API returns.
- **Breaking:** `customers.delete`, `coupons.delete`, and `coupons.toggleStatus` now send `POST` instead of `DELETE`/`PATCH` — those never matched what the real API expects.
- `AbacatePay` from `@abacatepay/sdk/v1` is now deprecated: frozen (no new features) and emits a one-time `console.warn` pointing at the v2 default export.

### Removed

- **Breaking:** `AbacatePayError`/`HTTPError` re-exports removed (nothing throws them anymore; see `@abacatepay/rest`'s changelog).
