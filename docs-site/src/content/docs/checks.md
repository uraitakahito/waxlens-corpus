---
title: Checks
description: Three checks guard this corpus. Each one covers something the others cannot.
---

| Check | Runs where | Needs LFS | What it covers |
| --- | --- | --- | --- |
| `check-manifest.mjs` | here | no | manifest ↔ `fixtures/` **file names** |
| `test:corpus` | waxlens | **yes** | frozen bytes still produce the frozen report |
| `corpus:docs:check` | waxlens | no | the catalogue table matches `manifest.json` |

## `node scripts/check-manifest.mjs`

Catches specimens the manifest references but that are missing, and orphan
`.wacz` files nobody declared. It reads names only — never opening an archive —
so **the LFS payloads do not need to be fetched**, and it runs on plain Node with
no `npm install`.

That property is deliberate: cloning this repository and checking it should not
require a toolchain.

## `test:corpus` — the real regression gate

This is the one that matters. It loops the manifest, validates each committed
`.wacz` with the current waxlens, and asserts the output matches **exactly**.

Ordinary tests assert "this input trips this rule", which misses two things.
Exact matching catches all three ways output can drift:

| | meaning |
| --- | --- |
| a finding disappeared | a defect that used to be caught no longer is |
| a finding appeared | a false positive was introduced |
| a severity moved | `warning` ↔ `error` re-grading |

When a change is intentional, run `corpus:build` and the manifest diff becomes
the record of **how waxlens's output changed** — reviewable in the pull request.

This is the only check that needs `git lfs pull`.

## `corpus:docs:check`

Verifies the table on the [Catalogue](/catalogue/) page still matches
`manifest.json`. If it has drifted, run `corpus:docs` and commit. The manifest is
not in LFS, so this check does not need the archives either.
