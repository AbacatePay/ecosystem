# Changelog

All notable changes to `@abacatepay/fastify` are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

## [2.0.1] - 2026-07-27

### Fixed

- Package now bundles with `bun build` instead of emitting raw `tsc` output. Failed with `ERR_MODULE_NOT_FOUND` transitively, because it imports `@abacatepay/adapters` at runtime and that package had the same bug.

## [2.0.0] - 2026-07-27

### Changed

- **Breaking:** `Webhooks(options)` no longer throws when called without a `secret`. It returns `{ ok: false, handler: null, error: string }` instead of `{ ok: true, handler }` — check `.ok` before using `.handler`.

### Removed

- **Breaking:** `AbacatePayFastifyError` class removed — nothing throws it anymore.

### Fixed

- A malformed JSON request body no longer throws uncaught inside the request handler — `JSON.parse` is now wrapped in a `try/catch` and returns a `400` instead (matching `express`/`supabase`, which already did this).
- Event handler names updated to match the corrected v2 taxonomy (see `@abacatepay/adapters`'s changelog): `onBillingPaid`/`onPayoutDone` → `onCheckoutCompleted`/`onPayoutCompleted`.
