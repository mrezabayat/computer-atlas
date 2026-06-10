---
description: Classify and enrich a topic MDX file to the v2 structure (taxonomy + Visual Map, Under the Hood, Trade-offs, Try it yourself)
---

Enrich the topic file at: $ARGUMENTS

Follow the canonical enrichment prompt in `docs/enrichment-prompt.md` exactly. In summary:

1. Read `docs/enrichment-prompt.md` and `src/lib/taxonomy.json` first.
2. Read the topic file. Classify it into exactly one `domain` + `subcategory` from the taxonomy; add both to frontmatter along with `structure: 2`, and bump `updated` to today.
3. Rewrite the body to the v2 section order, preserving the author's existing explanations. Merge any "Why it matters" prose into *More detail* / *Engineering Trade-offs* / *Real-world examples* and remove that heading. Generate the missing sections per the applicability matrix for the topic's `kind` (people/organizations/events skip diagram/code/terminal sections).
4. Ensure *Learn next* has ≥3 internal `/t/<slug>` links to topics that exist in `src/content/topics/`, mirrored in the `related`/`nextSteps` frontmatter (no slug in two relation fields).
5. Verify with `npm run lint:content` and `node scripts/check-refs.mjs`; fix any errors it reports.
6. Run the *Try it yourself* command(s) once (WSL/bash) to confirm they work; fix or simplify if they don't.

Edit the file in place. Do not change `title`, `category`, `kind`, `level`, `importance`, or `status`.
