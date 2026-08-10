---
title: manifest.json
description: The schema, why the expectations cannot lie, and what defaultProfile decides.
---

`manifest.json` records **what waxlens actually reported** for each specimen. It
is not a hand-written declaration of what ought to happen, which is why it cannot
drift away from the implementation: to change what is in it, you have to change
what waxlens outputs.

```jsonc
{
  "generatedBy": "waxlens / build-corpus",
  "defaultProfile": "spec",
  "fixtures": [
    // Same result under all three profiles — one `expect`.
    {
      "file": "fixtures/warc-deflate.wacz",
      "description": "WARC stored with DEFLATE …",
      "$schema": null,
      "expect": {
        "valid": true,
        "issues": [{ "rule": "warc/storage-store", "severity": "warning" }]
      }
    },
    // Result differs — all three spelled out.
    {
      "file": "fixtures/good-webrecorder.wacz",
      "description": "…",
      "$schema": null,
      "byProfile": {
        "spec":        { "valid": true,  "issues": [{ "rule": "cdxj/index-not-gzipped", "severity": "warning" }] },
        "browserhive": { "valid": false, "issues": [{ "rule": "cdxj/index-not-gzipped", "severity": "error" }] },
        "lenient":     { "valid": true,  "issues": [{ "rule": "cdxj/index-not-gzipped", "severity": "info" }] }
      }
    }
  ]
}
```

## `$schema` is what was found, not what was intended

The **observed** value of the `$schema` that the specimen's `datapackage.json`
declares. It is read back out of the WACZ that was just written, so what gets
recorded is what is actually in the file — not what the generator meant to put
there.

When nothing is declared the value is `null` — **the key is never omitted**.
Omitting it would make "declares nothing" and "not recorded yet (an old
manifest)" the same shape, and they would become indistinguishable.
`corpus-driven` uses the presence of this key to detect a stale manifest and
skip.

**29 of the 30 are `null`.** Exactly one specimen declares a Data Package v2
`$schema` — `datapackage-schema-only`; the rest name their contract with v1's
`profile`. That is why the `$schema` column in the [catalogue](../catalogue/) is
`—` on nearly every row — it is not a rendering gap, it is the recorded fact.

## `defaultProfile` decides how the short form is read

waxlens can validate the same archive under three profiles — `spec`,
`browserhive`, `lenient` — and the rules are the same set with severities
re-graded. **17 of the 30 specimens produce different results depending on which
one you pick.**

For the other 12 the result is identical everywhere, so the manifest writes a
single `expect` rather than repeating it three times. That raises a question:
*which* profile is that one value from? `defaultProfile` answers it.

```ts
// corpus-driven.test.ts — the only place it is consumed
if (fixture.expect) {
  const actual = await validate(abs, manifest.defaultProfile);
  expect(actual).toEqual(fixture.expect);
} else if (fixture.byProfile) {
  // Split results are compared against all three; defaultProfile is not involved.
  for (const profile of ALL_PROFILES) {
    expect(await validate(abs, profile)).toEqual(fixture.byProfile[profile]);
  }
}
```

Changing it does **not** make validation stricter or looser. It only says how to
read entries that carry one value instead of three. Which profile is actually
applied is chosen by `--profile` on the CLI.

The [Profiles](https://uraitakahito.github.io/waxlens/profiles/) page in the
waxlens docs explains what each one re-grades.

## `good-webrecorder` is valid under `spec` and invalid under `browserhive`

That is not a contradiction. It is a well-formed archive **in webrecorder's
style**, and `browserhive` asks a narrower question: is this what BrowserHive
itself would have produced? Profiles are about **whose standard you are
measuring against**.
