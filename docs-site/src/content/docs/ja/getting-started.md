---
title: archive の入手方法
description: 29 本の WACZ 標本を手に入れる方法（Git LFS に入っています）。
---

WACZ は **Git LFS** 管理です。実体を得る方法は 3 つあります。

```sh
# A. clone(git-lfs があれば実体まで smudge される)
git clone https://github.com/uraitakahito/waxlens-corpus

# B. 1 本だけ HTTP で取得(LFS の実体は media URL から。raw URL は不可)
base=https://media.githubusercontent.com/media/uraitakahito/waxlens-corpus/main/fixtures
curl -sL "$base/good.wacz" -o good.wacz

# C. waxlens から決定的に再生成(DL 不要・byte 同一)
#    CORPUS_DIR は絶対パスで。--filter は packages/core を cwd にして走らせるので、
#    相対パスはそこ基準で解決され、黙って何も見つからない。
CORPUS_DIR="$(cd ../waxlens-corpus && pwd)" pnpm --filter @waxlens/core corpus:build
```

方法 C があるのは、標本が**集めたものではなく生成したもの**だからです。同じ入力から
同じバイト列が出るので、corpus の checkout は利便性であって真実の源ではありません。
