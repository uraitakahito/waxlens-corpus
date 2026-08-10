---
title: Getting the archives
description: How to obtain the 30 WACZ specimens (they live in Git LFS).
---

The WACZ files are stored with **Git LFS**. Three ways to obtain them:

```sh
# A. Clone (with git-lfs installed, the real bytes are smudged in)
git clone https://github.com/uraitakahito/waxlens-corpus

# B. Fetch one over HTTP — from the media URL; the raw URL will not do
base=https://media.githubusercontent.com/media/uraitakahito/waxlens-corpus/main/fixtures
curl -sL "$base/good.wacz" -o good.wacz

# C. Regenerate deterministically from waxlens — no download, byte-identical
#    CORPUS_DIR must be absolute: --filter runs the script in packages/core,
#    so a relative path resolves there and quietly finds nothing.
CORPUS_DIR="$(cd ../waxlens-corpus && pwd)" pnpm --filter @waxlens/core corpus:build
```

Option C exists because the specimens are **built, not collected**: the same
inputs produce the same bytes, so a corpus checkout is a convenience rather than
a source of truth.
