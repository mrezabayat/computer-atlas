# Computer Atlas

A browsable, searchable map of computer science and computing topics — built as a static site with [Astro](https://astro.build) and MDX.

Adding a new topic is as simple as creating one MDX file with structured frontmatter. The site validates the topic graph at build time: broken slug references fail the build.

## Stack

- [Astro](https://astro.build) v6 with content collections
- MDX for topic and path content
- [Zod](https://zod.dev) schemas for typed frontmatter
- [Tailwind CSS](https://tailwindcss.com) v4 for styling
- [Pagefind](https://pagefind.app) for static search _(added in Phase 2)_
- [React Flow](https://reactflow.dev) for neighborhood graphs _(added in Phase 3)_

## Local development

```bash
npm install
npm run dev      # http://localhost:4321
npm run build    # static output in dist/
npm run preview  # serve the built site
```

## Content model

Three collections live under `src/content/`:

- `topics/` — one MDX file per topic. Folders mirror categories for authoring convenience, but URLs are flat (`/t/<slug>`).
- `categories/` — one Markdown file per top-level category (16 total).
- `paths/` — learning roadmaps that link an ordered list of topics.

Topic frontmatter (see [`src/content.config.ts`](src/content.config.ts) for the authoritative schema):

```yaml
---
title: Memory
category: hardware
kind: technology         # concept | technology | protocol | language | tool | field | person | organization | historical-event
summary: One-sentence summary, max 280 chars.
level: beginner          # beginner | intermediate | advanced
status: draft            # stub | draft | reviewed
tags: [ram, storage]
prerequisites: [cpu]
related: [storage]
partOf: []
nextSteps: [storage]
updated: 2026-06-04
---
```

Only **forward** relationships (`prerequisites`, `related`, `partOf`, `nextSteps`) are authored. The inverses (`subtopics`, `leadsTo`, `requiredBy`, `appearsInRoadmaps`) are computed at build time in [`src/lib/graph.ts`](src/lib/graph.ts).

## Article structure

Every topic body uses the same headings so the site stays coherent:

```md
## In simple terms
## More detail
## Why it matters
## Real-world examples
## Common misconceptions
## Learn next
```

## Routes

| Route                | Purpose                                          |
| -------------------- | ------------------------------------------------ |
| `/`                  | Home: hero, search, category grid, recent topics |
| `/c/<category>`      | Category page, topics grouped by level           |
| `/t/<topic>`         | Topic page (flat slug)                           |
| `/p/<path>`          | Learning path                                    |
| `/paths`             | Index of learning paths                          |
| `/search`            | Search (Phase 2)                                 |
| `/about`             | About                                            |
| `/contribute`        | How to contribute                                |

## License

MIT
