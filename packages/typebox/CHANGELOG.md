# Changelog

All notable changes to `@abacatepay/typebox` are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

## [2.0.2] - 2026-07-27

### Fixed

- `CHANGELOG.md` added to the published npm tarball (was previously excluded by `files`, so it only ever existed in the repo, not what `npm install` pulled down).

## [2.0.1] - 2026-07-27

### Fixed

- Package now bundles with `bun build` instead of emitting raw `tsc` output. The root export and the `/v1`/`/v2` subpaths were failing with `ERR_MODULE_NOT_FOUND` under real Node.js ESM resolution.

## [2.0.0] - 2026-07-27

### Added

- v2 schemas for payment links, the webhooks resource (`APIWebhook`), outbound PIX transfers (`APIPixTransfer`), Boleto (`APIBoleto`), and the subscription lifecycle (cancel, change-plan, record-usage).

### Changed

- **Breaking:** the webhook event taxonomy now matches what's actually documented: `payout.done` → `payout.completed`, `billing.paid` split into `checkout.completed` and `transparent.completed`, plus the full set of other v2 events.
- **Breaking:** `RESTPatchToggleCouponStatusBody`/`Data` renamed to `RESTPostToggleCouponStatusBody`/`Data`, matching the real HTTP method.
- `PaymentMethod` gained `BOLETO`; `APICheckout` gained `frequency`, `upSellProductId`, `interest`, `fine`.
