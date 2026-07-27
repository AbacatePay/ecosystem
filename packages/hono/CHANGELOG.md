# Changelog

All notable changes to `@abacatepay/hono` are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

## [2.0.3] - 2026-07-27

### Fixed

- `dist/index.d.ts`'s one internal reference (`export { version } from './version'`) now has an explicit `.js` extension. Any TypeScript consumer using `moduleResolution: "nodenext"`/`"node16"` would get `error TS2834: Relative import paths need explicit file extensions`.

## [2.0.2] - 2026-07-27

### Changed

- The build no longer inlines `@abacatepay/adapters` (and transitively `@abacatepay/zod`) into `dist` — they're now real `import`s resolved via `node_modules` at install time. Bundle size dropped from ~480KB to ~1.3KB. No behavior change; `@abacatepay/adapters` was already listed as a real `dependency`.

## [2.0.1] - 2026-07-27

### Fixed

- Package now bundles with `bun build` instead of emitting raw `tsc` output. Failed with `ERR_MODULE_NOT_FOUND` transitively, because it imports `@abacatepay/adapters` at runtime and that package had the same bug.

## [2.0.0] - 2026-07-27

### Changed

- **Breaking:** `Webhooks(options)` no longer throws when called without a `secret`. It returns `{ ok: false, handler: null, error: string }` instead of `{ ok: true, handler }` — check `.ok` before using `.handler`.

### Removed

- **Breaking:** `AbacatePayHonoError` class removed — nothing throws it anymore.

### Fixed

- A malformed JSON request body no longer throws uncaught inside the request handler — `JSON.parse` is now wrapped in a `try/catch` and returns a `400` instead (matching `express`/`supabase`, which already did this).
- Event handler names updated to match the corrected v2 taxonomy (see `@abacatepay/adapters`'s changelog): `onBillingPaid`/`onPayoutDone` → `onCheckoutCompleted`/`onPayoutCompleted`.
