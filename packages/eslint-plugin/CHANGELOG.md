# Changelog

All notable changes to `@abacatepay/eslint-plugin` are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

## [0.1.4] - 2026-07-27

### Fixed

- `CHANGELOG.md` added to the published npm tarball (was previously excluded by `files`, so it only ever existed in the repo, not what `npm install` pulled down).

## [0.1.3] - 2026-07-27

### Fixed

- Package now bundles with `bun build` instead of emitting raw `tsc` output, fixing `ERR_MODULE_NOT_FOUND` under real Node.js ESM resolution.
- `build` and `types` npm scripts had swapped bodies — `types` called `bun run types` recursively (an infinite loop) and was never actually invoked by `prepublishOnly`, which is why this went unnoticed. Scripts are now correctly assigned.
