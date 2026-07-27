# Changelog

All notable changes to `@abacatepay/elysia` are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

## [2.0.2] - 2026-07-27

### Changed

- The build no longer inlines `@abacatepay/adapters` (and transitively `@abacatepay/zod`) or the `elysia` framework itself into `dist` — all are now real `import`s resolved via `node_modules` at install time. Bundle size dropped from ~1MB to ~1.1KB. No behavior change; both were already listed as real dependencies (`@abacatepay/adapters` as a `dependency`, `elysia` as a `peerDependency` — bundling a peer dependency was never correct to begin with).

## [2.0.1] - 2026-07-27

### Fixed

- Package now bundles with `bun build` instead of emitting raw `tsc` output. Failed with `ERR_MODULE_NOT_FOUND` transitively, because it imports `@abacatepay/adapters` at runtime and that package had the same bug.

## [2.0.0] - 2026-07-27

### Changed

- **Breaking:** `Webhooks(options)` no longer throws when called without a `secret`. It returns `{ ok: false, handler: null, error: string }` instead of `{ ok: true, handler }` — check `.ok` before using `.handler`.

### Removed

- **Breaking:** `AbacatePayElysiaError` class removed — nothing throws it anymore.

### Fixed

- Event handler names updated to match the corrected v2 taxonomy (see `@abacatepay/adapters`'s changelog): `onBillingPaid`/`onPayoutDone` → `onCheckoutCompleted`/`onPayoutCompleted`.
