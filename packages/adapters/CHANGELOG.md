# Changelog

All notable changes to `@abacatepay/adapters` are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

## [2.0.1] - 2026-07-27

### Fixed

- Package now bundles with `bun build` instead of emitting raw `tsc` output. `@abacatepay/adapters/webhooks` failed with `ERR_MODULE_NOT_FOUND` transitively, because it imports `@abacatepay/zod` at runtime (not just for types) and that package had the same bug.

## [2.0.0] - 2026-07-27

### Changed

- **Breaking:** `WebhookOptions` and `dispatch()` updated to the corrected v2 event taxonomy:
  - `onPayoutDone` → `onPayoutCompleted`
  - `onBillingPaid` split into `onCheckoutCompleted` and `onTransparentCompleted` (checkout and transparent charges have distinct completion payloads in v2)
  - Added handlers for every other documented v2 event: `onCheckoutRefunded`/`Disputed`/`Lost`, `onTransparentRefunded`/`Disputed`/`Lost`, `onSubscriptionCompleted`/`Cancelled`/`Renewed`/`TrialStarted`, `onTransferCompleted`/`Failed`. These are tagged `@unstable` since AbacatePay doesn't document their payload shape yet.
