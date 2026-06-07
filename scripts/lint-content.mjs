#!/usr/bin/env node
/**
 * Content linter — checks topics & paths for things the Zod schema can't catch.
 *
 * Topics:
 *   - status: stub  -> no body checks (stubs are honest placeholders).
 *   - otherwise     -> must contain the six standardized H2 headings.
 *   - status: reviewed -> no TODO / FIXME / "(not yet written)" markers in body.
 *   - summary length <= 280 chars (also enforced by schema; nicer error).
 *
 * Paths:
 *   - must have at least 2 topics.
 *
 * Exit code 1 on any error.
 */

import { readFile } from "node:fs/promises";
import { globSync } from "node:fs";

const REQUIRED_HEADINGS = [
  "## In simple terms",
  "## More detail",
  "## Why it matters",
  "## Real-world examples",
  "## Common misconceptions",
  "## Learn next",
];

const FORBIDDEN_IN_REVIEWED = [
  /\bTODO\b/,
  /\bFIXME\b/,
  /not yet written/i,
];

const errors = [];
const warnings = [];

function err(file, msg) {
  errors.push(`${file}: ${msg}`);
}

function splitFrontmatter(src) {
  const m = src.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
  if (!m) return null;
  return { fm: m[1], body: m[2] };
}

function readField(fm, name) {
  const re = new RegExp(`^${name}:\\s*(.+)$`, "m");
  const m = fm.match(re);
  if (!m) return null;
  return m[1].trim();
}

function readList(text, name) {
  const inline = text.match(new RegExp(`^${name}:\\s*\\[([^\\]]*)\\]`, "m"));
  if (inline) {
    return inline[1]
      .split(",")
      .map((s) => s.trim().replace(/^['"]|['"]$/g, ""))
      .filter(Boolean);
  }
  const block = text.match(
    new RegExp(`^${name}:\\s*\\n((?:\\s+-\\s+.+\\n?)+)`, "m"),
  );
  if (block) {
    return block[1]
      .split("\n")
      .filter((l) => /^\s+-\s+/.test(l))
      .map((l) => l.replace(/^\s+-\s+/, "").trim().replace(/^['"]|['"]$/g, ""));
  }
  return [];
}

const RELATION_FIELDS = ["prerequisites", "related", "partOf", "nextSteps"];

async function lintTopic(file) {
  const src = await readFile(file, "utf8");
  const split = splitFrontmatter(src);
  if (!split) {
    err(file, "missing or malformed frontmatter");
    return;
  }
  const { fm, body } = split;

  const status = (readField(fm, "status") ?? "draft").replace(/['"]/g, "");
  const summary = readField(fm, "summary") ?? "";
  const summaryText = summary.replace(/^['"]|['"]$/g, "").replace(/^\|\s*/, "");

  if (summaryText.length > 280) {
    err(file, `summary is ${summaryText.length} chars (max 280)`);
  }

  // Detect the same slug appearing in more than one relation field. Causes
  // duplicate arrows in the neighborhood graph and confuses readers.
  const seen = new Map(); // slug -> first field it appeared in
  for (const field of RELATION_FIELDS) {
    for (const slug of readList(fm, field)) {
      if (seen.has(slug) && seen.get(slug) !== field) {
        err(
          file,
          `"${slug}" appears in both \`${seen.get(slug)}\` and \`${field}\` — pick the stronger one (prerequisites > nextSteps > partOf > related).`,
        );
      } else {
        seen.set(slug, field);
      }
    }
  }

  if (status === "stub") return;

  for (const h of REQUIRED_HEADINGS) {
    if (!body.includes(h)) {
      err(file, `missing required heading "${h}"`);
    }
  }

  if (status === "reviewed") {
    for (const re of FORBIDDEN_IN_REVIEWED) {
      if (re.test(body)) {
        err(file, `status: reviewed but body contains ${re}`);
      }
    }
  }
}

async function lintPath(file) {
  const src = await readFile(file, "utf8");
  const split = splitFrontmatter(src);
  if (!split) {
    err(file, "missing or malformed frontmatter");
    return;
  }
  // Find the topics block: from "topics:" up to the next top-level key.
  // Topics can either be `  - slug` (one per line) or
  //   - ref: slug
  //     optional: true       (multi-line objects)
  // Count any line whose indentation is `^  -` (two-space + dash) as one entry.
  const blockMatch = split.fm.match(
    /^topics:\s*\n([\s\S]*?)(?=^[A-Za-z][\w-]*:|\Z)/m,
  );
  if (!blockMatch) {
    err(file, "no topics list found in frontmatter");
    return;
  }
  const items = blockMatch[1].split("\n").filter((l) => /^\s+-\s+/.test(l));
  if (items.length < 2) {
    err(file, `path has only ${items.length} topic(s); need at least 2`);
  }
}

async function main() {
  const topicFiles = globSync("src/content/topics/**/*.mdx");
  const pathFiles = globSync("src/content/paths/**/*.mdx");

  await Promise.all(topicFiles.map(lintTopic));
  await Promise.all(pathFiles.map(lintPath));

  const total = topicFiles.length + pathFiles.length;
  if (warnings.length) {
    console.warn("warnings:");
    for (const w of warnings) console.warn(`  - ${w}`);
  }
  if (errors.length) {
    console.error(`\nlint-content failed: ${errors.length} error(s) across ${total} file(s):`);
    for (const e of errors) console.error(`  - ${e}`);
    process.exit(1);
  }
  console.log(`lint-content OK (${total} files: ${topicFiles.length} topics, ${pathFiles.length} paths)`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
