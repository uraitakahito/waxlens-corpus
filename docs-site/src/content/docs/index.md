---
title: waxlens-corpus
description: WACZ specimens for testing waxlens validation rules — 29 archives, 27 of them broken on purpose.
---

A collection of WACZ specimens for exercising [waxlens](https://uraitakahito.github.io/waxlens/)
validation rules.

## It is not a collection of good archives

| | count |
| --- | --- |
| Deliberately broken | **27** |
| Passing everything | **2** (`good`, `good-webrecorder`) |

The corpus is not a showcase of correct WACZ. It is **a catalogue of ways to be
wrong**, and the test that consumes it asserts that waxlens **finds** each one.
The pass condition is inverted from what you might expect: for 27 of the 29
specimens, **an archive producing no findings is a failure**.

That is what makes it useful. If every rule were deleted, a corpus of good
archives would still be green — the tests would notice nothing. A corpus of
broken ones goes red 27 times.

## Broken is not the same as invalid

`datapackage-frictionless-bad-name.wacz` reports `valid: true`. Its
`resources[0].name` is `DATA.warc.gz` instead of `data.warc.gz` — uppercase,
which the Frictionless v1 schema forbids — but that is a `warning`, and warnings
do not overturn validity.

So "has a finding" and "is invalid" are separate axes. The
[catalogue](/catalogue/) records both.

## What is here

```
fixtures/            every specimen (Git LFS)
manifest.json        what waxlens actually reports for each one
scripts/
  check-manifest.mjs manifest ↔ fixtures consistency (no dependencies)
docs-site/           this site
```

Neither the specimens nor the manifest are written by hand — see
[Regenerating](/regenerating/).

## Where to go next

- **[Getting started](/getting-started/)** — obtaining the archives (they are in Git LFS)
- **[Catalogue](/catalogue/)** — every specimen and what it violates
- **[Using it](/using-it/)** — reaching for the corpus while writing a rule
- **[manifest](/manifest/)** — the schema, and what `defaultProfile` means
- **[Regenerating](/regenerating/)** — how specimens are produced, and what gets destroyed
- **[Checks](/checks/)** — the three checks and what each one covers
