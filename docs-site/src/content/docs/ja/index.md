---
title: waxlens-corpus
description: waxlens の validation rule を検証するための WACZ 標本集。29 本のうち 27 本は意図的に壊してあります。
---

[waxlens](https://uraitakahito.github.io/waxlens/ja/) の validation rule を
検証するための WACZ 標本集です。

## 「正しいアーカイブ」を集めたものではありません

| | 件数 |
| --- | --- |
| 意図的に壊してあるもの | **27** |
| 全 rule を通るもの | **2**（`good` / `good-webrecorder`） |

これは正しい WACZ の見本帳ではなく、**壊し方の見本帳**です。消費する側のテストは
waxlens が各々を**見つけること**を assert します。つまり合格条件が逆で、
**27 件については「何も指摘が出ない」ことが失敗**です。

その形だからこそ役に立ちます。仮に rule を全部消しても、正常系だけのコーパスなら
テストは緑のままです。壊れたコーパスなら 27 件が赤くなります。

## 「壊れている」と「無効」は別です

`datapackage-frictionless-bad-name.wacz` の判定は `valid: true` です。
`resources[0].name` が `data.warc.gz` ではなく `DATA.warc.gz`（大文字）で、
Frictionless v1 のスキーマはこれを許しませんが、それは `warning` であり、
warning は valid を覆しません。

つまり「指摘がある」と「無効である」は別の軸です。[カタログ](/catalogue/)は
その両方を記録しています。

## 中身

```
fixtures/            全標本（Git LFS）
manifest.json        waxlens が実際に報告した結果
scripts/
  check-manifest.mjs manifest ↔ fixtures の整合チェック（依存ゼロ）
docs-site/           このサイト
```

標本も manifest も手書きではありません —— [再生成](/regenerating/)を参照。

## 次に読むもの

- **[はじめに](/getting-started/)** —— アーカイブの入手方法（Git LFS にあります）
- **[カタログ](/catalogue/)** —— 全標本と、それぞれが何に違反するか
- **[使い方](/using-it/)** —— rule を書くときに corpus をどう使うか
- **[manifest](/manifest/)** —— スキーマと、`defaultProfile` の意味
- **[再生成](/regenerating/)** —— 標本の作られ方と、何が破壊されるか
- **[整合チェック](/checks/)** —— 3 つの検査がそれぞれ何を見ているか
