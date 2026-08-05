import { defineConfig } from "astro/config";
import starlight from "@astrojs/starlight";

// GitHub Pages の project site なので /waxlens-corpus 配下に出る。
const BASE = "/waxlens-corpus";

const WAXLENS = "https://uraitakahito.github.io/waxlens";

// Rehype プラグイン: markdown 本文内の絶対ローカルリンク (/page/) に base を付与し、
// /ja/ 配下のページからのリンクには /ja ロケールも注入する。Starlight のサイドバーや
// ナビは slug 経由で base/locale-aware だが、MD/MDX 本文に書かれた [text](/page/) は
// 素通しになるため rehype 段で補正する。アセット(最終セグメントに拡張子を持つ href)は
// base のみ付与する。既に base-aware なリンクは二重付与しない。
//
// これで直るのは **markdown 本文だけ**。HTML/JSX の属性と frontmatter は Astro も
// この plugin も触らないので、そちらは scripts/check-base-urls.mjs が出力を見て捕まえる。
function rehypeRebaseLinks() {
  return function (tree: any, file: any): void {
    const path: string = file?.path ?? file?.history?.[0] ?? "";
    const inJa = /[\\/]docs[\\/]ja[\\/]/.test(path);
    const walk = (node: any): void => {
      if (
        node.type === "element" &&
        node.tagName === "a" &&
        typeof node.properties?.href === "string"
      ) {
        const href: string = node.properties.href;
        if (
          href.startsWith("/") &&
          !href.startsWith("//") &&
          !href.startsWith(BASE + "/") &&
          href !== BASE
        ) {
          const lastSeg = href.split(/[?#]/)[0].split("/").pop() ?? "";
          const isAsset = lastSeg.includes(".");
          const locale =
            inJa && !isAsset && !href.startsWith("/ja/") && href !== "/ja" ? "/ja" : "";
          node.properties.href = BASE + locale + href;
        }
      }
      for (const child of node.children ?? []) walk(child);
    };
    walk(tree);
  };
}

// waxlens-corpus ドキュメントサイト。英語(root)と日本語(/ja/)を対で持つ。
//
// catalogue ページの表は waxlens の `corpus:docs` が manifest.json から生成して
// ここに書き込む。fixtures/ と manifest.json と同じ経路(CORPUS_DIR)なので、
// 依存の向きは waxlens → corpus のまま変わらない。
export default defineConfig({
  site: "https://uraitakahito.github.io",
  base: BASE,
  outDir: "dist",
  integrations: [
    starlight({
      title: "waxlens-corpus",
      description:
        "WACZ specimens for testing waxlens validation rules — 29 archives, 27 of them broken on purpose.",
      defaultLocale: "root",
      locales: {
        root: { label: "English", lang: "en" },
        ja: { label: "日本語", lang: "ja" },
      },
      social: [
        {
          icon: "github",
          label: "GitHub",
          href: "https://github.com/uraitakahito/waxlens-corpus",
        },
      ],
      sidebar: [
        {
          label: "Getting started",
          translations: { ja: "はじめに" },
          slug: "getting-started",
        },
        {
          label: "Catalogue",
          translations: { ja: "カタログ" },
          slug: "catalogue",
        },
        {
          label: "Using it",
          translations: { ja: "使い方" },
          slug: "using-it",
        },
        {
          label: "Reference",
          translations: { ja: "リファレンス" },
          items: [
            { label: "manifest", translations: { ja: "manifest" }, slug: "manifest" },
            {
              label: "Regenerating",
              translations: { ja: "再生成" },
              slug: "regenerating",
            },
            { label: "Checks", translations: { ja: "整合チェック" }, slug: "checks" },
          ],
        },
        { label: "waxlens ↗", link: WAXLENS + "/" },
      ],
    }),
  ],
  markdown: {
    rehypePlugins: [rehypeRebaseLinks],
  },
});
