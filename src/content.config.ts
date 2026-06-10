import { defineCollection, reference, z } from "astro:content";
import { glob } from "astro/loaders";
import { CATEGORIES } from "~/lib/categories";
import { DOMAIN_SLUGS } from "~/lib/taxonomy";

const TOPIC_KINDS = [
  "concept",
  "technology",
  "protocol",
  "language",
  "tool",
  "field",
  "person",
  "organization",
  "historical-event",
] as const;

const LEVELS = ["beginner", "intermediate", "advanced"] as const;

const IMPORTANCE = ["core", "important", "supplemental"] as const;

const stripDirAndExt = (entry: string): string =>
  entry.replace(/\.mdx?$/, "").split("/").pop() ?? entry;

const topics = defineCollection({
  loader: glob({
    pattern: "**/*.mdx",
    base: "./src/content/topics",
    generateId: ({ entry }) => stripDirAndExt(entry),
  }),
  schema: z.object({
    title: z.string().min(1),
    aliases: z.array(z.string()).default([]),

    category: z.enum(CATEGORIES),

    // Master Computing Taxonomy classification (docs/enrichment-plan.md §3).
    // Optional during the Phase 1–2 migration; becomes required in Phase 3.
    // lint-content.mjs validates that `subcategory` belongs to `domain`.
    domain: z.enum(DOMAIN_SLUGS).optional(),
    subcategory: z.string().optional(),
    // Body structure version: 1 = original six headings, 2 = enriched
    // structure (docs/enrichment-plan.md §4). Drives which lint rules apply.
    structure: z.union([z.literal(1), z.literal(2)]).default(1),

    kind: z.enum(TOPIC_KINDS).default("concept"),

    summary: z.string().min(1).max(280),
    level: z.enum(LEVELS),
    status: z.enum(["stub", "draft", "reviewed"]).default("draft"),
    importance: z.enum(IMPORTANCE).default("important"),
    tags: z.array(z.string()).default([]),

    prerequisites: z.array(reference("topics")).default([]),
    related: z.array(reference("topics")).default([]),
    partOf: z.array(reference("topics")).default([]),
    nextSteps: z.array(reference("topics")).default([]),

    updated: z.coerce.date(),
  }),
});

const categories = defineCollection({
  loader: glob({
    pattern: "**/*.md",
    base: "./src/content/categories",
    generateId: ({ entry }) => stripDirAndExt(entry),
  }),
  schema: z.object({
    title: z.string(),
    slug: z.enum(CATEGORIES),
    summary: z.string().max(400),
    order: z.number().int().nonnegative(),
    icon: z.string().optional(),
  }),
});

const paths = defineCollection({
  loader: glob({
    pattern: "**/*.mdx",
    base: "./src/content/paths",
    generateId: ({ entry }) => stripDirAndExt(entry),
  }),
  schema: z.object({
    title: z.string().min(1),
    summary: z.string().min(1).max(280),
    audience: z.enum(LEVELS),
    // Two accepted forms — keep using bare slugs for simple linear paths,
    // or upgrade individual entries to objects to mark sections / optional topics.
    topics: z
      .array(
        z.union([
          reference("topics"),
          z.object({
            ref: reference("topics"),
            optional: z.boolean().default(false),
            section: z.string().optional(),
          }),
        ]),
      )
      .min(2),
    updated: z.coerce.date(),
  }),
});

export const collections = { topics, categories, paths };
