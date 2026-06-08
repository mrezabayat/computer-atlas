#!/usr/bin/env node
// Read-only path-coverage audit: which topics appear in >=1 learning path,
// which appear in none ("path-orphans"), and how big each path is.
import { readFileSync, readdirSync } from "node:fs";
import { basename } from "node:path";

const topicFiles = readdirSync("src/content/topics", { recursive: true }).filter((f) =>
  f.endsWith(".mdx"),
);
const topicCat = new Map(); // slug -> category folder
for (const f of topicFiles) {
  const parts = f.replace(/\\/g, "/").split("/");
  topicCat.set(basename(f, ".mdx"), parts[0]);
}

function pathTopicSlugs(fm) {
  // grab the topics: block up to the next top-level key
  const block = fm.match(/^topics:\s*\n([\s\S]*?)(?=^[A-Za-z][\w-]*:|\Z)/m);
  if (!block) return [];
  const out = [];
  for (const line of block[1].split("\n")) {
    const dashed = line.match(/^\s+-\s+(.+)$/);
    if (!dashed) continue;
    let v = dashed[1].trim();
    const r = v.match(/^ref:\s*(.+)$/);
    out.push((r ? r[1] : v).trim().replace(/^['"]|['"]$/g, ""));
  }
  return out;
}

const inPaths = new Map(); // slug -> [path names]
const pathSizes = [];
for (const f of readdirSync("src/content/paths").filter((f) => f.endsWith(".mdx"))) {
  const src = readFileSync(`src/content/paths/${f}`, "utf8");
  const fm = (src.match(/^---\r?\n([\s\S]*?)\r?\n---/) || [, ""])[1];
  const slugs = pathTopicSlugs(fm);
  pathSizes.push([f.replace(".mdx", ""), slugs.length]);
  for (const s of slugs) {
    if (!inPaths.has(s)) inPaths.set(s, []);
    inPaths.get(s).push(f.replace(".mdx", ""));
  }
}

const all = [...topicCat.keys()];
const covered = all.filter((s) => inPaths.has(s));
const orphans = all.filter((s) => !inPaths.has(s));

console.log(`topics: ${all.length} | in >=1 path: ${covered.length} | path-orphans: ${orphans.length}`);
console.log(`\npath sizes:`);
pathSizes.sort((a, b) => b[1] - a[1]).forEach(([n, c]) => console.log(`  ${c}\t${n}`));

const byCat = {};
for (const s of orphans) (byCat[topicCat.get(s)] ||= []).push(s);
console.log(`\npath-orphans by category:`);
for (const [c, list] of Object.entries(byCat).sort())
  console.log(`  ${c} (${list.length}): ${list.sort().join(", ")}`);
