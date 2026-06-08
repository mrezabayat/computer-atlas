#!/usr/bin/env node
// Quick pure-Node validator: every prerequisites/related/partOf/nextSteps/topics
// reference must resolve to an existing topic slug. (astro check does this too,
// but this runs without node_modules installed.)
import { readFileSync, readdirSync } from "node:fs";
import { basename } from "node:path";

const topicFiles = readdirSync("src/content/topics", { recursive: true }).filter((f) =>
  f.endsWith(".mdx"),
);
const slugs = new Set(topicFiles.map((f) => basename(f, ".mdx")));

function frontmatter(src) {
  const m = src.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  return m ? m[1] : "";
}

function refs(fm, name) {
  const inline = fm.match(new RegExp(`^${name}:\\s*\\[([^\\]]*)\\]`, "m"));
  if (inline) {
    return inline[1]
      .split(",")
      .map((s) => s.trim().replace(/^['"]|['"]$/g, ""))
      .filter(Boolean);
  }
  const block = fm.match(new RegExp(`^${name}:\\s*\\n([\\s\\S]*?)(?=^[A-Za-z][\\w-]*:|$)`, "m"));
  if (!block) return [];
  return block[1]
    .split("\n")
    .filter((l) => /^\s+-\s+/.test(l))
    .map((l) => {
      let v = l.replace(/^\s+-\s+/, "").trim();
      const r = v.match(/^ref:\s*(.+)$/);
      return (r ? r[1] : v).trim().replace(/^['"]|['"]$/g, "");
    })
    .filter(Boolean);
}

const bad = [];
for (const f of topicFiles) {
  const fm = frontmatter(readFileSync(`src/content/topics/${f}`, "utf8"));
  for (const field of ["prerequisites", "related", "partOf", "nextSteps"]) {
    for (const r of refs(fm, field)) if (!slugs.has(r)) bad.push(`${f} [${field}] -> ${r}`);
  }
}
for (const f of readdirSync("src/content/paths").filter((f) => f.endsWith(".mdx"))) {
  const fm = frontmatter(readFileSync(`src/content/paths/${f}`, "utf8"));
  for (const r of refs(fm, "topics")) if (!slugs.has(r)) bad.push(`paths/${f} [topics] -> ${r}`);
}

console.log(`check-refs: ${slugs.size} topic slugs`);
if (bad.length) {
  console.error(`BROKEN REFERENCES: ${bad.length}`);
  bad.forEach((x) => console.error(`  ${x}`));
  process.exit(1);
}
console.log("All references resolve. ✓");
