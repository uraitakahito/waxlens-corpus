---
title: rule を書くときの使い方
description: rule を書く・変えるときに corpus をどう使うか。
---

標本を直接 waxlens に渡します。

```sh
waxlens-validate --profile spec       path/to/corpus/fixtures/<name>.wacz
waxlens-validate --profile lenient    path/to/corpus/fixtures/<name>.wacz
```

同じ archive を 2 つの profile で走らせるのが、profile が実際に何を組み替えるかを
見る最短の方法です。意味は[プロファイル](https://uraitakahito.github.io/waxlens/ja/profiles/)に、
どの rule に上書きがあるかは [Rules](https://uraitakahito.github.io/waxlens/ja/rules/) の表にあります。
