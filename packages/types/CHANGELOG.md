# Changelog

All notable changes to `@abacatepay/types` are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

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
