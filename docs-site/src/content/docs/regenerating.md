---
title: Regenerating
description: How the specimens are produced — and what the command destroys before it starts.
---

Nothing in `fixtures/` or `manifest.json` is written by hand. Both come out of a
generator that lives in **waxlens**, because the builder it uses (`buildWacz`) is
internal to waxlens's test suite rather than public API.

:::danger[`fixtures/` is deleted before anything is written]
The first thing `corpus:build` does is remove the directory:

```ts
await rm(join(out, "fixtures"), { recursive: true, force: true });
```

This is not an incremental update. **Anything you placed there by hand is gone,
and if it was untracked, Git cannot bring it back.** Check that this repository
is clean before running it.
:::

## Running it

```sh
# From a waxlens clone, pointing CORPUS_DIR at this repository.
# vitest runs with packages/core as its CWD, so use an absolute path.
cd /path/to/waxlens
CORPUS_DIR=/path/to/waxlens-corpus pnpm --filter @waxlens/core corpus:build
CORPUS_DIR=/path/to/waxlens-corpus pnpm --filter @waxlens/core corpus:docs
```

`corpus:build` writes `fixtures/` and `manifest.json`; `corpus:docs` writes the
table on the [Catalogue](/catalogue/) page. Both land in `CORPUS_DIR`, so the
dependency runs one way — waxlens knows about the corpus, never the reverse.

## Generation is deterministic

The generator fixes zip entry mtimes, so the same waxlens revision produces
**byte-identical** specimens. Re-running does not churn Git LFS.

## To change a specimen

Edit `packages/core/test/corpus/spec.ts` in waxlens and regenerate. Each entry
declares how to break the archive (`options`) and which rule that should trip
(`expectRules`) — and the generator asserts the rule really fires before it
records anything.

That assertion is why the manifest cannot lie: `expectRules` is checked, but what
gets **written** is the actual `runValidation` output.

## The generator is a test

All four commands are `vitest run`. That is deliberate — the generator validates
each specimen as it produces it, so a fixture that fails to break in the intended
way never reaches the repository.
