# Changelog

All notable changes to `@abacatepay/better-auth` are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

## [1.0.1] - 2026-07-27

### Fixed

- Package now bundles with `bun build` instead of emitting raw `tsc` output, fixing `ERR_MODULE_NOT_FOUND` under real Node.js ESM resolution.

### Note

This package is currently a stub — despite its description ("Checkouts, Webhooks and OAuth made simple with AbacatePay"), no integration logic is implemented yet.
