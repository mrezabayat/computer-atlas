#!/usr/bin/env node
/**
 * Lists topics with zero incoming relationships AND zero appearances in a path.
 * Informational — does not fail. Use to maintain graph density.
 */

import { readFile } from "node:fs/promises";
import { globSync } from "node:fs";
import { basename } from "node:path";

function splitFrontmatter(src) {
  const m = src.match(/^---\n([\s\S]*?)\n---\n?/);
  return m ? m[1] : "";
}

function readList(fm, name) {
  // Inline form: foo: [a, b, c]
  const inline = fm.match(new RegExp(`^${name}:\\s*\\[([^\\]]*)\\]`, "m"));
  if (inline) {
    return inline[1]
      .split(",")
      .map((s) => s.trim().replace(/^['"]|['"]$/g, ""))
      .filter(Boolean);
  }
  // Block form:
  //   name:
  //     - foo
  //     - bar
  const block = fm.match(new RegExp(`^${name}:\\s*\\n((?:\\s+-\\s+.+\\n?)+)`, "m"));
  if (block) {
    return block[1]
      .split("\n")
      .filter((l) => /^\s+-\s+/.test(l))
      .map((l) => l.replace(/^\s+-\s+/, "").trim().replace(/^['"]|['"]$/g, ""));
  }
  return [];
}

const slugOf = (file) => basename(file).replace(/\.mdx$/, "");

async function main() {
  const topicFiles = globSync("src/content/topics/**/*.mdx");
  const pathFiles = globSync("src/content/paths/**/*.mdx");

  const allTopics = new Set(topicFiles.map(slugOf));
  const incoming = new Map();
  for (const s of allTopics) incoming.set(s, 0);

  const bump = (slug) => {
    if (incoming.has(slug)) incoming.set(slug, incoming.get(slug) + 1);
  };

  for (const file of topicFiles) {
    const fm = splitFrontmatter(await readFile(file, "utf8"));
    for (const field of ["prerequisites", "related", "partOf", "nextSteps"]) {
      for (const ref of readList(fm, field)) bump(ref);
    }
  }
  for (const file of pathFiles) {
    const fm = splitFrontmatter(await readFile(file, "utf8"));
    for (const ref of readList(fm, "topics")) bump(ref);
  }

  const orphans = [...incoming.entries()]
    .filter(([, n]) => n === 0)
    .map(([s]) => s)
    .sort();

  const total = allTopics.size;
  const connected = total - orphans.length;
  const pct = total === 0 ? 100 : Math.round((connected / total) * 100);

  console.log(`find-orphans: ${connected}/${total} topics connected (${pct}%)`);
  if (orphans.length === 0) {
    console.log("  no orphans");
    return;
  }
  console.log(`  ${orphans.length} orphan(s):`);
  for (const o of orphans) console.log(`    - ${o}`);

  // Definition-of-done budget: warn (not fail) if > 5 orphans AND < 95% connected.
  if (orphans.length > 5 && pct < 95) {
    console.warn(
      `\n  Above Ring 1 budget (>5 orphans and <95% connected). Add 'related' links to attach orphans.`,
    );
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
