# Changelog

All notable changes to `@abacatepay/sdk` are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

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
