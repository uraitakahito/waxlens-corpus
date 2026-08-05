/**
 * ビルド成果物に、base の付いていない内部参照が残っていないか検査する。
 *
 * このサイトは https://uraitakahito.github.io/waxlens-corpus/ に置かれるため、
 * astro.config.ts が `base` を受け取る。Astro は **Markdown のリンク記法には
 * base と locale を補う**が、**HTML / JSX の属性には一切触れない**。つまり
 *
 *     [データパッケージ](/standard/data-package)     → /datapackage/ja/standard/… ✅
 *     <a href="/standard/data-package/">             → /standard/data-package/    ❌ 404
 *
 * の差が出る。そしてビルドは警告を出さないので、公開するまで気付けない。
 *
 * ソースではなく **出力 HTML** を見るのが要点。starlight-links-validator は
 * 書き換え前のソースを見るため base を知らず、このリポジトリでは 415 件の
 * 誤検知を出した(datapackage で実測)。出力を見れば、Astro が
 * 補ったあとの最終形をそのまま判定できるので誤検知が出ない。
 *
 *   node scripts/check-base-urls.mjs docs-site/dist /waxlens-corpus
 */
import { readdirSync, readFileSync, statSync } from "node:fs"
import { join } from "node:path"

const [dir, rawBase] = process.argv.slice(2)

if (!dir || !rawBase) {
  console.error("usage: node scripts/check-base-urls.mjs <build-dir> <base>")
  process.exit(2)
}

// base は末尾スラッシュの有無が揺れる(DP_BASE=/datapackage、未設定なら /)。
// 前方一致で使うので、"/datapackage/" の形に正規化しておく。
const base = `${rawBase.replace(/\/+$/, "")}/`

const htmlFiles = d =>
  readdirSync(d).flatMap(name => {
    const path = join(d, name)
    if (statSync(path).isDirectory()) return htmlFiles(path)
    return path.endsWith(".html") ? [path] : []
  })

const offenders = new Map()

for (const file of htmlFiles(dir)) {
  const html = readFileSync(file, "utf8")
  for (const [, ref] of html.matchAll(/(?:href|src)="(\/[^"]*)"/g)) {
    if (ref.startsWith(base)) continue
    // "//example.com/x" はプロトコル相対 URL。内部参照ではない。
    if (ref.startsWith("//")) continue
    const pages = offenders.get(ref) ?? new Set()
    pages.add(file.slice(dir.length) || "/")
    offenders.set(ref, pages)
  }
}

if (offenders.size === 0) {
  console.log(`ok: base (${base}) の付いていない内部参照はありません`)
  process.exit(0)
}

console.error(`base (${base}) の付いていない内部参照が ${offenders.size} 種あります:\n`)
for (const [ref, pages] of [...offenders].sort(([a], [b]) => a.localeCompare(b))) {
  console.error(`  ${ref}`)
  console.error(`      ${pages.size} ページ  例: ${[...pages][0]}`)
}
console.error(
  "\nMarkdown のリンク記法にするか、base を明示してください。" +
    "\n  .astro / .mdx : import.meta.env.BASE_URL" +
    "\n  astro.config.ts: BASE 定数"
)
process.exit(1)
