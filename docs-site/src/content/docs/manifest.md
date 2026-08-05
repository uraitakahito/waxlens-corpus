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
      "expect": {
        "valid": true,
        "issues": [{ "rule": "warc/storage-store", "severity": "warning" }]
      }
    },
    // Result differs — all three spelled out.
    {
      "file": "fixtures/good-webrecorder.wacz",
      "description": "…",
      "byProfile": {
        "spec":        { "valid": true,  "issues": [{ "rule": "cdxj/index-not-gzipped", "severity": "warning" }] },
        "browserhive": { "valid": false, "issues": [{ "rule": "cdxj/index-not-gzipped", "severity": "error" }] },
        "lenient":     { "valid": true,  "issues": [{ "rule": "cdxj/index-not-gzipped", "severity": "info" }] }
      }
    }
  ]
}
```

## `defaultProfile` decides how the short form is read

waxlens can validate the same archive under three profiles — `spec`,
`browserhive`, `lenient` — and the rules are the same set with severities
re-graded. **17 of the 29 specimens produce different results depending on which
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
