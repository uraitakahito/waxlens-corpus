# waxlens-corpus

[waxlens](https://github.com/uraitakahito/waxlens) の validation rule を検証する
ための WACZ 標本集。**29 本のうち 27 本は意図的に壊してあり**、期待結果は
`manifest.json` に集約しています。

📖 **[ドキュメント](https://uraitakahito.github.io/waxlens-corpus/)**
（[日本語](https://uraitakahito.github.io/waxlens-corpus/ja/)）

## 使いはじめる

```sh
git clone https://github.com/uraitakahito/waxlens-corpus
cd waxlens-corpus
git lfs pull                      # WACZ の実体（名前の検査だけなら不要）
node scripts/check-manifest.mjs   # 依存ゼロ。npm install は要らない
```

## ⚠ 再生成は破壊的です

`corpus:build` は `fixtures/` を**ディレクトリごと削除してから**書き直します。
手で置いたファイルは消え、未追跡なら Git からも戻せません。実行前にこの repo が
clean であることを確認してください。手順は
[再生成](https://uraitakahito.github.io/waxlens-corpus/ja/regenerating/)にあります。

## ライセンス

[Unlicense](LICENSE)
