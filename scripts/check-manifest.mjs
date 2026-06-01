#!/usr/bin/env node
/**
 * manifest.json ↔ fixtures/ の整合チェック (waxlens 非依存)。
 *
 *   - manifest が参照する file がすべて実在するか
 *   - fixtures/ に manifest 未記載の孤児 *.wacz が無いか
 *
 * 実 validation との一致 (各 fixture が manifest の期待どおりの issue を
 * 出すか) は waxlens 側が corpus を取得して検証する。ここはファイル名の
 * 整合のみを見るので Git LFS 実体の取得は不要。
 *
 * repo ルートで実行する: `node scripts/check-manifest.mjs`
 */
import { readFile, readdir } from "node:fs/promises";

const manifest = JSON.parse(await readFile("manifest.json", "utf8"));
const listed = new Set(manifest.fixtures.map((f) => f.file.replace(/^fixtures\//, "")));
const actual = new Set((await readdir("fixtures")).filter((n) => n.endsWith(".wacz")));

let problems = 0;
for (const f of listed) {
  if (!actual.has(f)) {
    console.error(`✗ manifest references missing fixture: fixtures/${f}`);
    problems++;
  }
}
for (const f of actual) {
  if (!listed.has(f)) {
    console.error(`✗ orphan fixture not listed in manifest: fixtures/${f}`);
    problems++;
  }
}

if (problems > 0) {
  console.error(`\n${problems} problem(s) found.`);
  process.exit(1);
}
console.log(`OK: ${actual.size} fixtures, manifest と整合しています。`);
