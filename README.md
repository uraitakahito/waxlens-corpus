# waxlens-corpus

[waxlens](https://github.com/uraitakahito/waxlens) の validation rule を検証する
ための WACZ 標本集。 各 rule を **違反させる WACZ** と、 全 rule を **pass する
黄金 WACZ** を収め、 期待結果を単一の `manifest.json` に集約する
(flat fixtures + 中央 manifest)。

WACZ は Git LFS で格納する（`.gitattributes` 参照）。

## 構成

```
fixtures/            全 WACZ 標本 (Git LFS)
  good.wacz                  全 rule pass の黄金 (browserhive producer)
  good-webrecorder.wacz      webrecorder producer の黄金
  warc-deflate.wacz          各 rule を 1 つ違反させた標本 …
  …
manifest.json        各 fixture の期待 validation 結果 (単一の真実源)
scripts/
  check-manifest.mjs manifest ↔ fixtures の整合チェック (waxlens 非依存)
```

## manifest.json のスキーマ

```jsonc
{
  "generatedBy": "waxlens / build-corpus",
  "defaultProfile": "spec",
  "fixtures": [
    // profile 横断で結果が同じ標本は expect 1 本
    {
      "file": "fixtures/warc-deflate.wacz",
      "description": "WARC を DEFLATE 格納 …",
      "expect": { "valid": true, "issues": [{ "rule": "warc/storage-store", "severity": "warning" }] }
    },
    // profile で結果が変わる標本は byProfile
    {
      "file": "fixtures/good-webrecorder.wacz",
      "description": "…",
      "byProfile": {
        "spec":        { "valid": true,  "issues": [] },
        "browserhive": { "valid": false, "issues": [{ "rule": "cdxj/index-not-gzipped", "severity": "error" }] },
        "lenient":     { "valid": true,  "issues": [ … ] }
      }
    }
  ]
}
```

`expect` / `byProfile` の `issues` は **waxlens が実際に `runValidation` した出力**
であって手書きの宣言ではない（生成時に self-validation 済み）。

## 生成方法（破壊的再生成）

標本と manifest は waxlens 側の generator が作る（`buildWacz` は waxlens の
test 内部にあり public API でないため、生成元は waxlens に置く）。

```sh
# waxlens の clone で、CORPUS_DIR にこの repo の絶対パスを渡す
#   ※ vitest は packages/core を CWD に走るので、相対パスは避けて絶対パス推奨
cd /path/to/waxlens
CORPUS_DIR=/path/to/waxlens-corpus pnpm --filter @waxlens/core corpus:build
```

generator は zip entry の mtime を固定値で書くので、同じ waxlens revision
からは **byte 同一**の標本が再生成される（Git LFS の churn なし）。

fixture の追加・変更は waxlens 側の `packages/core/test/corpus/spec.ts` を編集して
再生成する。

## 整合チェック

```sh
node scripts/check-manifest.mjs
```

manifest の参照漏れ・孤児ファイルを検出する（CI 向け、Git LFS 実体の取得は不要）。
