#!/usr/bin/env node
/**
 * Taxonomy & enrichment progress audit (docs/enrichment-plan.md).
 *
 * Reports:
 *   - classification coverage: topics with a valid domain + subcategory
 *     (Phase 1 meter), unclassified topics grouped by site category;
 *   - enrichment coverage: structure: 2 vs structure: 1 (Phase 2 meter);
 *   - per-domain / per-subcategory distribution;
 *   - taxonomy sub-categories with zero topics (coverage gaps — future Ring 4).
 *
 * Informational by default (always exits 0, like audit-importance).
 * Pass --strict to exit 1 when any topic is unclassified or still structure: 1
 * — flip this on in CI at Phase 3.
 */

import { readFile } from "node:fs/promises";
import { readFileSync, globSync } from "node:fs";
import { dirname, join, sep } from "node:path";
import { fileURLToPath } from "node:url";

const REPO_ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const STRICT = process.argv.includes("--strict");

const TAXONOMY = JSON.parse(
  readFileSync(join(REPO_ROOT, "src", "lib", "taxonomy.json"), "utf8"),
);

function splitFrontmatter(src) {
  const m = src.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
  return m ? m[1] : null;
}

function readField(fm, name) {
  const m = fm.match(new RegExp(`^${name}:\\s*(.+)$`, "m"));
  return m ? m[1].trim().replace(/^['"]|['"]$/g, "") : null;
}

async function main() {
  const files = globSync("src/content/topics/**/*.mdx");
  const topics = [];

  for (const file of files) {
    const fm = splitFrontmatter(await readFile(file, "utf8"));
    if (!fm) continue;
    const parts = file.split(sep);
    topics.push({
      file,
      slug: parts[parts.length - 1].replace(/\.mdx$/, ""),
      category: parts[parts.length - 2],
      domain: readField(fm, "domain"),
      subcategory: readField(fm, "subcategory"),
      structure: Number(readField(fm, "structure") ?? "1"),
    });
  }

  const total = topics.length;

  // --- Classification (Phase 1) ---
  const classified = topics.filter(
    (t) =>
      t.domain &&
      Object.hasOwn(TAXONOMY, t.domain) &&
      t.subcategory &&
      Object.hasOwn(TAXONOMY[t.domain].subcategories, t.subcategory),
  );
  const invalid = topics.filter(
    (t) =>
      (t.domain && !Object.hasOwn(TAXONOMY, t.domain)) ||
      (t.domain &&
        Object.hasOwn(TAXONOMY, t.domain) &&
        t.subcategory &&
        !Object.hasOwn(TAXONOMY[t.domain].subcategories, t.subcategory)) ||
      (t.subcategory && !t.domain),
  );
  const unclassified = topics.filter(
    (t) => !classified.includes(t) && !invalid.includes(t),
  );

  console.log(`audit-taxonomy — ${total} topics`);
  console.log(`\nClassification (Phase 1): ${classified.length}/${total} classified${classified.length === total ? " — COMPLETE ✅" : ""}`);

  if (invalid.length) {
    console.log(`\n  ⚠️  ${invalid.length} INVALID classification(s) (lint:content will fail these):`);
    for (const t of invalid) {
      console.log(`    - ${t.slug}  (domain: ${t.domain ?? "—"}, subcategory: ${t.subcategory ?? "—"})`);
    }
  }

  if (unclassified.length) {
    const byCategory = new Map();
    for (const t of unclassified) {
      if (!byCategory.has(t.category)) byCategory.set(t.category, []);
      byCategory.get(t.category).push(t.slug);
    }
    console.log(`\n  Unclassified by site category (${unclassified.length}):`);
    for (const [cat, slugs] of [...byCategory.entries()].sort()) {
      console.log(`    ${cat} (${slugs.length}): ${slugs.join(", ")}`);
    }
  }

  // --- Enrichment (Phase 2) ---
  const v2 = topics.filter((t) => t.structure === 2);
  console.log(`\nEnrichment (Phase 2): ${v2.length}/${total} at structure: 2${v2.length === total ? " — COMPLETE ✅" : ""}`);
  if (v2.length > 0 && v2.length < total) {
    const v1ByCategory = new Map();
    for (const t of topics.filter((x) => x.structure !== 2)) {
      v1ByCategory.set(t.category, (v1ByCategory.get(t.category) ?? 0) + 1);
    }
    console.log("  Remaining structure: 1 by site category:");
    for (const [cat, n] of [...v1ByCategory.entries()].sort()) {
      console.log(`    ${cat}: ${n}`);
    }
  }

  // --- Distribution per domain/subcategory ---
  if (classified.length) {
    console.log("\nDistribution by domain:");
    for (const [domain, def] of Object.entries(TAXONOMY)) {
      const inDomain = classified.filter((t) => t.domain === domain);
      console.log(`  ${def.title}: ${inDomain.length}`);
      for (const [sub, title] of Object.entries(def.subcategories)) {
        const n = inDomain.filter((t) => t.subcategory === sub).length;
        if (n > 0) console.log(`      ${title}: ${n}`);
      }
    }

    const gaps = [];
    for (const [domain, def] of Object.entries(TAXONOMY)) {
      for (const [sub, title] of Object.entries(def.subcategories)) {
        if (!classified.some((t) => t.domain === domain && t.subcategory === sub)) {
          gaps.push(`${def.title} → ${title}`);
        }
      }
    }
    if (gaps.length) {
      console.log(`\nCoverage gaps — sub-categories with zero topics (${gaps.length}):`);
      for (const g of gaps) console.log(`  - ${g}`);
    }
  }

  const failing = unclassified.length + invalid.length + (total - v2.length);
  if (STRICT && failing > 0) {
    console.error(`\naudit-taxonomy --strict: ${unclassified.length} unclassified, ${invalid.length} invalid, ${total - v2.length} not yet structure: 2`);
    process.exit(1);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
