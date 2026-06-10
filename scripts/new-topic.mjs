#!/usr/bin/env node
/**
 * Scaffold a new topic MDX file with standardized frontmatter and headings.
 *
 * Usage:
 *   node scripts/new-topic.mjs <slug> \
 *     --category <c> --domain <d> --subcategory <s> \
 *     --kind <k> --level <l> [--importance <i>] [--status <s>] \
 *     [--title "..."] [--summary "..."] [--force]
 *
 * Defaults: --kind concept --level beginner --importance important --status draft.
 *
 * Emits the v2 enriched structure (docs/enrichment-plan.md §4); the scaffolded
 * headings depend on --kind per the applicability matrix.
 */

import { mkdir, writeFile, access } from "node:fs/promises";
import { constants, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const REPO_ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");

const TAXONOMY = JSON.parse(
  readFileSync(join(REPO_ROOT, "src", "lib", "taxonomy.json"), "utf8"),
);

const CATEGORIES = [
  "foundations",
  "hardware",
  "computer-architecture",
  "operating-systems",
  "programming-languages",
  "software-engineering",
  "data-and-databases",
  "networks-and-internet",
  "distributed-systems-and-cloud",
  "security-and-privacy",
  "human-computer-interaction",
  "graphics-and-media",
  "artificial-intelligence",
  "applications",
  "history-and-society",
  "operations-and-reliability",
  "mathematical-foundations",
  "low-latency-systems",
];
const KINDS = [
  "concept",
  "technology",
  "protocol",
  "language",
  "tool",
  "field",
  "person",
  "organization",
  "historical-event",
];
const LEVELS = ["beginner", "intermediate", "advanced"];
const STATUSES = ["stub", "draft", "reviewed"];
const IMPORTANCES = ["core", "important", "supplemental"];

const SLUG_RE = /^[a-z0-9][a-z0-9-]*[a-z0-9]$/;

function die(msg) {
  console.error(`new-topic: ${msg}`);
  process.exit(1);
}

function parseArgs(argv) {
  const args = { _: [], flags: {} };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a.startsWith("--")) {
      const k = a.slice(2);
      const v = argv[i + 1];
      if (v === undefined || v.startsWith("--")) die(`flag --${k} needs a value`);
      args.flags[k] = v;
      i += 1;
    } else if (a === "-h" || a === "--help") {
      args.flags.help = "1";
    } else {
      args._.push(a);
    }
  }
  return args;
}

function titleFromSlug(slug) {
  return slug
    .split("-")
    .map((w) => (w.length <= 3 ? w.toUpperCase() : w[0].toUpperCase() + w.slice(1)))
    .join(" ");
}

const HELP = `Scaffold a new topic.

Usage:
  node scripts/new-topic.mjs <slug> --category <c> --domain <d> --subcategory <s>
                              --kind <k> --level <l>
                              [--importance <i>] [--status <s>]
                              [--title "..."] [--summary "..."] [--force]

Categories:   ${CATEGORIES.join(", ")}
Domains:      ${Object.keys(TAXONOMY).join(", ")}
Subcategories: run with --domain <d> and an invalid --subcategory to list them.
Kinds:        ${KINDS.join(", ")}
Levels:       ${LEVELS.join(", ")}
Importances:  ${IMPORTANCES.join(", ")}
Statuses:     ${STATUSES.join(", ")}
`;

const BIO_KINDS = new Set(["person", "organization", "historical-event"]);

/** v2 body skeleton per kind (docs/enrichment-plan.md §4.2). */
function v2Body(kind, status) {
  const todo =
    status === "stub"
      ? "(Stub — not yet written. [Contribute](/contribute) to help fill this in.)"
      : "TODO.";

  if (BIO_KINDS.has(kind)) {
    return `## In simple terms

${todo}

## More detail

## Real-world examples

## Common misconceptions

## Learn next
`;
  }
  if (kind === "field") {
    return `## In simple terms

${todo}

## The Visual Map

\`\`\`mermaid
flowchart LR
  A[TODO] --> B[TODO]
\`\`\`

## More detail

## Engineering Trade-offs

## Real-world examples

## Common misconceptions

## Learn next
`;
  }
  return `## In simple terms

${todo}

## The Visual Map

\`\`\`mermaid
flowchart LR
  A[TODO] --> B[TODO]
\`\`\`

## More detail

## Under the Hood

\`\`\`c
/* TODO */
\`\`\`

## Engineering Trade-offs

## Real-world examples

## Common misconceptions

## Try it yourself

\`\`\`bash
# TODO — must run on stock WSL/Ubuntu (coreutils/python3 only)
\`\`\`

## Learn next
`;
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  if (args.flags.help || args._.length === 0) {
    console.log(HELP);
    process.exit(args._.length === 0 ? 1 : 0);
  }

  const slug = args._[0];
  if (!SLUG_RE.test(slug)) {
    die(`slug "${slug}" must be lowercase, alphanumeric, hyphenated, no leading/trailing dash.`);
  }

  const category = args.flags.category;
  if (!category) die("missing --category");
  if (!CATEGORIES.includes(category)) die(`unknown category "${category}"`);

  const domain = args.flags.domain;
  if (!domain) die("missing --domain (Master Computing Taxonomy; see src/lib/taxonomy.json)");
  if (!Object.hasOwn(TAXONOMY, domain)) {
    die(`unknown domain "${domain}". Valid: ${Object.keys(TAXONOMY).join(", ")}`);
  }

  const subcategory = args.flags.subcategory;
  if (!subcategory) die(`missing --subcategory. Valid for "${domain}": ${Object.keys(TAXONOMY[domain].subcategories).join(", ")}`);
  if (!Object.hasOwn(TAXONOMY[domain].subcategories, subcategory)) {
    die(
      `subcategory "${subcategory}" is not in domain "${domain}". Valid: ${Object.keys(TAXONOMY[domain].subcategories).join(", ")}`,
    );
  }

  const kind = args.flags.kind ?? "concept";
  if (!KINDS.includes(kind)) die(`unknown kind "${kind}"`);

  const level = args.flags.level ?? "beginner";
  if (!LEVELS.includes(level)) die(`unknown level "${level}"`);

  const importance = args.flags.importance ?? "important";
  if (!IMPORTANCES.includes(importance)) die(`unknown importance "${importance}"`);

  const status = args.flags.status ?? "draft";
  if (!STATUSES.includes(status)) die(`unknown status "${status}"`);

  const title = args.flags.title ?? titleFromSlug(slug);
  const summary =
    args.flags.summary ?? `TODO: one-sentence summary of ${title} (max 280 chars).`;

  const today = new Date().toISOString().slice(0, 10);

  const outDir = join(REPO_ROOT, "src", "content", "topics", category);
  const outPath = join(outDir, `${slug}.mdx`);
  if (!args.flags.force) {
    try {
      await access(outPath, constants.F_OK);
      die(`refusing to overwrite ${outPath} (use --force)`);
    } catch {
      /* file does not exist — good */
    }
  }

  const body = `---
title: ${title}
category: ${category}
domain: ${domain}
subcategory: ${subcategory}
structure: 2
kind: ${kind}
summary: ${JSON.stringify(summary)}
level: ${level}
status: ${status}
importance: ${importance}
tags: []
prerequisites: []
related: []
partOf: []
nextSteps: []
updated: ${today}
---

${v2Body(kind, status)}`;

  await mkdir(outDir, { recursive: true });
  await writeFile(outPath, body);

  console.log(`Created ${outPath}`);
  console.log(`Edit the file and remove TODOs. Add cross-links with prerequisites/related/partOf/nextSteps as appropriate.`);
  console.log(`Run: npm run check && npm run build`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
