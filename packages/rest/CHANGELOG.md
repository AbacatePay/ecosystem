# Changelog

All notable changes to `@abacatepay/rest` are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

## [1.0.1] - 2026-07-27

### Fixed

- `CHANGELOG.md` added to the published npm tarball (was previously excluded by `files`, so it only ever existed in the repo, not what `npm install` pulled down).

## [1.0.0] - 2026-07-27

### Changed

- **Breaking:** `REST` class replaced with a `createREST()` factory function. `new REST({ ... })` no longer works — use `createREST({ ... })`.
- **Breaking:** nothing throws anymore. Every request resolves to `{ data, error, success }`, matching the shape the AbacatePay API itself returns — including client-side failures (network errors, timeouts, a missing secret), which are normalized into the same shape instead of being thrown.
- **Breaking:** `AbacatePayError` and `HTTPError` classes removed — there's nothing left to `throw` them, and the error is just the `string` already present in the envelope's `.error` field.
- Default API version is now `2` (was `1`).
