---
title: 再生成
description: 標本の作られ方と、コマンドが走る前に何を破壊するか。
---

`fixtures/` も `manifest.json` も手書きではありません。どちらも **waxlens 側**の
generator が作ります —— 使っている builder（`buildWacz`）が waxlens のテスト内部の
ものであって public API ではないためです。

:::danger[`fixtures/` は書き込みの前に削除されます]
`corpus:build` が最初にするのはディレクトリの削除です。

```ts
await rm(join(out, "fixtures"), { recursive: true, force: true });
```

差分更新ではありません。**手で置いたものは消えます。未追跡なら Git からも
戻せません。** 実行前にこの repo が clean であることを確認してください。
:::

## 実行方法

```sh
# waxlens の clone から、CORPUS_DIR にこの repo の絶対パスを渡す。
# vitest は packages/core を CWD に走るので、相対パスは避ける。
cd /path/to/waxlens
CORPUS_DIR=/path/to/waxlens-corpus pnpm --filter @waxlens/core corpus:build
CORPUS_DIR=/path/to/waxlens-corpus pnpm --filter @waxlens/core corpus:docs
```

`corpus:build` は `fixtures/` と `manifest.json` を、`corpus:docs` は
[カタログ](/catalogue/)の表を書きます。どちらも `CORPUS_DIR` 配下に落ちるので、
依存は一方向です —— waxlens が corpus を知っており、逆はありません。

## 生成は決定的です

generator は zip entry の mtime を固定値で書くので、同じ waxlens revision からは
**バイト単位で同一**の標本が出ます。再生成しても Git LFS が膨らみません。

## 標本を変えるには

waxlens 側の `packages/core/test/corpus/spec.ts` を編集して再生成します。各エントリは
「どう壊すか」（`options`）と「どの rule が出るはずか」（`expectRules`）を宣言し、
generator は**記録する前に、その rule が実際に発火したことを assert** します。

manifest が嘘をつけないのはこの構造のためです —— `expectRules` は検査されますが、
**書き込まれるのは実際の `runValidation` の出力**です。

## generator はテストです

4 つのコマンドはすべて `vitest run` です。意図的にそうしてあります —— 生成しながら
その場で検証するので、**意図どおりに壊れなかった標本は repo に届きません**。
