---
title: 整合チェック
description: 3 つの検査がこのコーパスを守っています。それぞれ他では見られないものを見ています。
---

| 検査 | 走る場所 | LFS 実体 | 何を見るか |
| --- | --- | --- | --- |
| `check-manifest.mjs` | ここ | 不要 | manifest ↔ `fixtures/` の**ファイル名** |
| `test:corpus` | waxlens | **必要** | 凍結された bytes が凍結されたレポートを生むか |
| `corpus:docs:check` | waxlens | 不要 | カタログの表が `manifest.json` と一致するか |

## `node scripts/check-manifest.mjs`

manifest が参照しているのに存在しない標本と、誰も宣言していない孤児の `.wacz` を
検出します。見るのは名前だけでアーカイブを開かないので、**LFS の実体を取得する
必要がありません**。素の Node で動き、`npm install` も要りません。

これは意図した性質です —— この repo を clone して検査するのに、ツールチェーンを
用意させたくないからです。

## `test:corpus` —— 本丸の回帰ゲート

重要なのはこれです。manifest をループし、committed な `.wacz` をいまの waxlens で
検証して、出力が**完全に一致する**ことを assert します。

普通のテストは「この入力でこの rule が出る」を確かめますが、それでは 2 つを
見逃します。完全一致なら、出力がずれる 3 つの型すべてを捕まえられます。

| | 意味 |
| --- | --- |
| 発火が消えた | 検出できていた欠陥を見逃すようになった |
| 発火が増えた | 誤検知が入った |
| severity が動いた | `warning` ↔ `error` の格上げ／格下げ |

意図した変更なら `corpus:build` を走らせます。manifest の差分が
**「waxlens の出力がどう変わったか」の記録**になり、PR でレビューできます。

`git lfs pull` が要るのはこの検査だけです。

## `corpus:docs:check`

[カタログ](/catalogue/)の表が `manifest.json` と一致しているかを見ます。ずれていれば
`corpus:docs` を走らせて commit します。manifest は LFS 対象外なので、この検査も
アーカイブの実体を必要としません。
