# Contributing to CS Map

CS Map is content-first and open. Adding or improving a topic is just editing a Markdown/MDX file in this repo. This guide explains how.

## Ways to help

- **Suggest a new topic** — [open a "new topic" issue](.github/ISSUE_TEMPLATE/new-topic.yml).
- **Improve an existing topic** — click "Edit on GitHub" on any topic page, or just open a PR.
- **Fix relationships** — missing a prerequisite or related link? Add it; the build will tell you if any slug is wrong.
- **Add a learning path** — curate an ordered sequence of existing topics under a clear theme.

## Repository tour

```
src/
├── content/
│   ├── topics/        # one .mdx file per topic (organized in category folders for convenience)
│   ├── categories/    # one .md file per top-level category
│   └── paths/         # learning roadmaps as .mdx
├── content.config.ts  # the authoritative schemas
├── lib/
│   ├── categories.ts  # the 16 categories
│   └── graph.ts       # computes inverse relationships at build time
└── site.config.ts     # site URL and GitHub repo metadata (edit when forking)
```

## Anatomy of a topic file

Topics live at `src/content/topics/<category>/<slug>.mdx`. **The folder is for authoring convenience; the URL is always `/t/<slug>`.** Slugs must be unique across the whole Atlas — changing a slug changes the URL, so prefer adding to `aliases` over renaming.

### Frontmatter cheat-sheet

```yaml
---
title: Memory                    # required
aliases: ["RAM", "main memory"]  # optional, helps search and future redirects
category: hardware               # required, one of the 16 categories (see src/lib/categories.ts)
kind: technology                 # optional, default 'concept'
                                 # one of: concept | technology | protocol | language
                                 # | tool | field | person | organization | historical-event
summary: |                       # required, max 280 chars; shown in cards and search
  Fast, temporary storage where a running program keeps the
  data it is actively using.
level: beginner                  # required: beginner | intermediate | advanced
status: draft                    # optional, default 'draft': stub | draft | reviewed
tags: ["ram", "storage"]         # optional

# Only forward relationships are stored. Inverses are computed at build time:
#   subtopics       = inverse of partOf
#   leadsTo         = inverse of nextSteps
#   requiredBy      = inverse of prerequisites
#   appearsInRoadmaps = computed from paths

prerequisites: ["cpu"]           # topics that should be read first
related: ["storage"]             # topics that are conceptually nearby
partOf: []                       # larger topics this one is a part of
nextSteps: ["storage"]           # where to go next, in suggested order

updated: 2026-06-04              # ISO date, required
---
```

### Article structure (required)

Every topic body uses the same headings so the site stays coherent and beginners always know where to find what:

```md
## In simple terms

One short paragraph in plain language. Imagine explaining this to a curious
friend at a dinner table.

## More detail

The accurate version. Tables, lists, and small examples welcome.

## Why it matters

Why should anyone care? Where does this show up in real systems?

## Real-world examples

Concrete instances. Products, protocols, anecdotes.

## Common misconceptions

Bullet list of "people often think X, but actually Y".

## Learn next

Pointers to neighbouring topics. Link to other Atlas pages with `/t/<slug>`.
```

Empty sections are allowed for `status: stub` pages and will be marked clearly on the site. Do not leave drift sections like "Misc" or "Notes" — if you have content that doesn't fit, expand "More detail".

## Anatomy of a learning path

Paths live at `src/content/paths/<slug>.mdx`. They are an ordered list of existing topic slugs:

```yaml
---
title: How Computers Work
summary: A beginner-friendly path from bits to operating systems.
audience: beginner               # beginner | intermediate | advanced
topics:
  - bits
  - binary-numbers
  - boolean-logic
  - logic-gates
  - cpu
  - memory
  - storage
  - operating-system
updated: 2026-06-04
---

A short prose intro to the path (optional).
```

Every topic in a path automatically gets an "Appears in" backlink to the path — no need to sync manually.

## Validation

The build is strict on purpose:

- `npm run check` — TypeScript + Astro type-check.
- `npm run build` — builds the site **and** fails if any topic, path, or relationship references a slug that doesn't exist. This catches almost every broken-link mistake.
- CI runs both on every PR.

If you change a slug, search for references to it (`rg <old-slug>`) and either update them or add the old slug to the new topic's `aliases`.

## Style notes

- Prefer plain language over jargon. Define a term the first time you use it.
- Use sentence case for headings.
- Link to other Atlas pages with `/t/<slug>` so internal links stay valid.
- Tables are great for "X vs Y" and reference data.
- Avoid emojis in topic bodies unless the topic is about them.

## Code changes

If you are changing the site itself (layouts, components, build):

- Match existing code style.
- Run `npm run check` and `npm run build` locally before opening a PR.
- Keep changes scoped — small PRs are easier to review.
