# Changelog

All notable changes to `@abacatepay/better-auth` are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

## [1.0.3] - 2026-07-27

### Fixed

- `dist/index.d.ts`'s one internal reference (`export { version } from './version'`) now has an explicit `.js` extension. Any TypeScript consumer using `moduleResolution: "nodenext"`/`"node16"` would get `error TS2834: Relative import paths need explicit file extensions`.

## [1.0.2] - 2026-07-27

### Fixed

- `CHANGELOG.md` added to the published npm tarball (was previously excluded by `files`, so it only ever existed in the repo, not what `npm install` pulled down).

## [1.0.1] - 2026-07-27

### Fixed

- Package now bundles with `bun build` instead of emitting raw `tsc` output, fixing `ERR_MODULE_NOT_FOUND` under real Node.js ESM resolution.

### Note

This package is currently a stub — despite its description ("Checkouts, Webhooks and OAuth made simple with AbacatePay"), no integration logic is implemented yet.
