# Changelog

All notable changes to `@abacatepay/sdk` are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

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
