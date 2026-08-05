---
title: Using it while developing a rule
description: How to reach for the corpus while writing or changing a rule.
---

Point waxlens at a specimen directly:

```sh
waxlens-validate --profile spec       path/to/corpus/fixtures/<name>.wacz
waxlens-validate --profile lenient    path/to/corpus/fixtures/<name>.wacz
```

Running the same archive under two profiles is the quickest way to see what a
profile actually re-grades — the [Profiles](https://uraitakahito.github.io/waxlens/profiles/) page explains
what that means, and the [Rules](https://uraitakahito.github.io/waxlens/rules/) table lists which rules have
overrides at all.
