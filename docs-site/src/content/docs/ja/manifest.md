---
title: manifest.json
description: スキーマと、期待値が嘘をつけない理由と、defaultProfile が決めていること。
---

`manifest.json` は、各標本について **waxlens が実際に報告した結果**を記録した
ものです。「こうあるべき」という手書きの宣言ではないので、実装とズレようが
ありません —— 中身を変えたければ、waxlens の出力を変えるしかないからです。

```jsonc
{
  "generatedBy": "waxlens / build-corpus",
  "defaultProfile": "spec",
  "fixtures": [
    // 3 profile で結果が同じ標本は expect 1 本
    {
      "file": "fixtures/warc-deflate.wacz",
      "description": "WARC を DEFLATE 格納 …",
      "$schema": null,
      "expect": {
        "valid": true,
        "issues": [{ "rule": "warc/storage-store", "severity": "warning" }]
      }
    },
    // 結果が割れる標本は 3 つとも書く
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

## `$schema` は「見に行った結果」です

各標本の `datapackage.json` が宣言する `$schema` の**実測値**です。生成時に
書き出した WACZ を開いて読むので、記録されるのは「宣言したつもり」ではなく
実際にファイルへ入っているものです。

宣言が無ければ `null` —— **キーごと省略はしません**。省略すると「宣言が無い」と
「まだ記録していない古い manifest」が同じ形になり、区別が付かなくなるからです。
`corpus-driven` はこのキーの有無で古い manifest を検出して skip します。

**現在 29 件すべてが `null` です。** Data Package v2 の `$schema` を名乗る標本は
まだ 1 つもなく、v1 の `profile` で名乗るものだけが入っています。
[カタログ](../catalogue/)の `$schema` 列が全行 `—` なのはそのためで、これは表示の
不備ではなく**記録された事実**です。

## `defaultProfile` は「省略形の読み方」を決めます

waxlens は同じアーカイブを 3 つの profile —— `spec` / `browserhive` /
`lenient` —— で検証できます。rule の集合は同じで、severity が組み替わります。
**29 件のうち 17 件は、どれを選ぶかで結果が変わります。**

残る 12 件はどこでも同じ結果なので、manifest は 3 回繰り返す代わりに `expect` を
1 本だけ書きます。すると「その 1 本はどの profile の値なのか」という問いが立ち、
`defaultProfile` がそれに答えます。

```ts
// corpus-driven.test.ts —— 唯一の消費箇所
if (fixture.expect) {
  const actual = await validate(abs, manifest.defaultProfile);
  expect(actual).toEqual(fixture.expect);
} else if (fixture.byProfile) {
  // 割れるものは 3 つ全部と突き合わせる。defaultProfile は関係ない。
  for (const profile of ALL_PROFILES) {
    expect(await validate(abs, profile)).toEqual(fixture.byProfile[profile]);
  }
}
```

この値を変えても検証が厳しく／緩くなることは**ありません**。1 本しか値を持たない
エントリの読み方を述べているだけです。実際に適用する profile は CLI の
`--profile` で選びます。

各 profile が何を組み替えるかは waxlens 側の
[プロファイル](https://uraitakahito.github.io/waxlens/ja/profiles/)にあります。

## `good-webrecorder` は spec で valid、browserhive で invalid です

矛盾ではありません。**webrecorder 流には**正しいアーカイブであり、`browserhive`
はもっと狭い問いを立てています —— 「これは BrowserHive 自身が出すはずの形か」。
profile とは、**誰の基準で測るか**ということです。
