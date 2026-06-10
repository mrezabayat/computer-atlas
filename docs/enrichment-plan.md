# Content Enrichment & Taxonomy Plan

> **Status (2026-06-10):** Phase 0 (infrastructure) shipped and **Phase 1 complete** — `audit:taxonomy` reports **334/334 classified**, lint/check/build green. Ambiguous classification calls are recorded in the per-category commit messages (`git log --grep="Master Computing Taxonomy"`). **Phase 2 (enrichment to `structure: 2`) is now the active phase**: 0/334 enriched; follow §5 Phase 2 order and batch sizes, using `/enrich-topic` per topic.
>
> Follows on from `content-roadmap.md` (all 3 rings complete, 334 topics, all `status: reviewed`). This plan upgrades every topic from the v1 six-heading structure to the enriched v2 structure, classifies every topic into the Master Computing Taxonomy, and installs the tooling so every *future* topic is born classified and enriched.

---

## 1. Goals

1. **Classify** every topic into exactly one Primary Domain + one Sub-category from the Master Computing Taxonomy (§3).
2. **Enrich** every topic body to the v2 section structure (§4): adds *The Visual Map* (Mermaid), *Under the Hood* (code), *Engineering Trade-offs*, and *Try it yourself* (runnable command).
3. **Systematize**: schema, linter, scaffolder, audit script, and a repeatable enrichment prompt so future topics go through the identical pipeline with no manual policing.

## 2. Design decisions (made up front so the migration doesn't churn)

| Decision | Choice | Rationale |
|---|---|---|
| Where does taxonomy metadata live? | **Frontmatter** (`domain` + `subcategory` fields), rendered into the page's "Metadata" block by the topic layout — *not* hand-written in the MDX body | Single source of truth; Zod-validated; queryable for audits; no 334 hand-maintained metadata blocks that can drift |
| Does taxonomy replace the 18 site categories? | **No.** `category` keeps driving folders, URLs, nav, and learning paths. Taxonomy is an orthogonal classification layer | The site's information architecture is proven; the taxonomy is a librarian's index over it |
| How do we track migration progress? | New frontmatter field `structure: 1 \| 2` (default `1`) | Lets the linter enforce v2 headings only on migrated files, so the repo stays green throughout the migration |
| Is "Why it matters" kept? | **Dropped as a heading.** Its prose is merged into *More detail* (conceptual stakes) and/or *Engineering Trade-offs* / *Real-world examples* (practical stakes) during rewrite | The v2 structure covers the same ground with sharper sections; keep the words, retire the heading |
| Are all v2 sections mandatory? | **No — applicability is keyed on `kind`** (§4.2). `person`, `organization`, `historical-event` skip code/diagram/terminal sections | A Mermaid diagram of Ada Lovelace is noise, not enrichment |
| Mermaid rendering | Add build-time rendering (`rehype-mermaid` with Playwright, or `astro-mermaid` client-side as fallback) **before** any diagrams are authored | Authoring 300 diagrams that don't render is wasted work; decide and wire it in Phase 0 |
| One domain only — cross-cutting topics? | Pick the domain of the topic's *defining* concern; put the secondary lens in `tags` | Mirrors the existing "one category folder, cross-listed elsewhere" convention |

## 3. The Master Computing Taxonomy → code

Create **`src/lib/taxonomy.ts`** as the canonical data structure:

```ts
export const TAXONOMY = {
  "hardware-architecture": {
    title: "Hardware & Architecture",
    subcategories: ["pcb-peripherals-ic", "vlsi-soc", "green-computing", "eda",
                    "acceleration-processors-form-factors"],
  },
  "systems-software": { /* … */ },
  // … all 15 domains, sub-categories as kebab-case slugs with display titles
} as const;
```

All 15 domains and every sub-category line from the master taxonomy get a slug + display title. The Zod schema, linter, audit script, and scaffolder all import from this one file (same pattern as `lib/categories.ts`).

### 3.1 Schema change (`src/content.config.ts`)

```ts
domain: z.enum(DOMAINS).optional(),        // Phase 0–2: optional
subcategory: z.string().optional(),        // validated against domain by lint
structure: z.union([z.literal(1), z.literal(2)]).default(1),
```

A Zod `superRefine` (or the linter) checks `subcategory` is valid *for that domain*. After Phase 3 the `.optional()` is removed — taxonomy becomes mandatory.

### 3.2 Category → domain hint table

Per-topic classification is per-topic, but each site category has a dominant domain that resolves ~80% of cases:

| Site category | Default domain (hint) |
|---|---|
| foundations | Theory of Computing *or* Algorithms & Mathematics (split per topic) |
| hardware | Hardware & Architecture |
| computer-architecture | Systems Software → Computer architecture |
| operating-systems | Systems Software |
| programming-languages | Software Engineering & Notation |
| software-engineering | Software Development Process (process topics) / Software Engineering & Notation (tooling) |
| data-and-databases | Information Systems |
| networks-and-internet | Networks & Communications |
| distributed-systems-and-cloud | Concurrency & Parallelism → Distributed computing (infra topics → Networks & Communications) |
| security-and-privacy | Security & Privacy |
| human-computer-interaction | Human-Centered Computing |
| graphics-and-media | Graphics & Media |
| artificial-intelligence | Artificial Intelligence / Machine Learning (split per topic) |
| applications | Applied Computing |
| history-and-society | Domain of the subject's primary contribution (e.g. `alan-turing` → Theory of Computing) |
| operations-and-reliability | Software Development Process (deploy/process) / Systems Software → Dependability (reliability) |
| mathematical-foundations | Algorithms & Mathematics |
| low-latency-systems | Concurrency & Parallelism (or Systems Software for kernel-adjacent topics) |

Edge rule for `kind: person | historical-event | organization`: classify by the subject's defining technical contribution, never by "History" (the taxonomy has no history domain).

## 4. The v2 content structure

### 4.1 Target section order

```markdown
## In simple terms          ← exists (keep, polish)
## The Visual Map           ← NEW: Mermaid diagram (if applicable)
## More detail              ← exists (keep; absorb "Why it matters" prose)
## Under the Hood           ← NEW: C / Python / asm / config snippet (if applicable)
## Engineering Trade-offs   ← NEW: pros/cons, complexity, perf vs memory
## Real-world examples      ← exists (keep)
## Common misconceptions    ← exists (keep)
## Try it yourself          ← NEW: copy-pasteable WSL/Linux command or zero-dep script
## Learn next               ← exists (keep; must name ≥3 topics, mirrored in frontmatter `related`/`nextSteps`)
```

The "Metadata" block (Primary Domain / Sub-category) is **rendered by the topic layout from frontmatter** — authors never write it in the body.

### 4.2 Applicability matrix (enforced by linter)

| `kind` | Visual Map | Under the Hood | Trade-offs | Try it yourself |
|---|---|---|---|---|
| concept, technology, protocol, language, tool | required* | required* | required | required* |
| field | required | optional | required | optional |
| person, organization, historical-event | skip | skip | skip (use "Common misconceptions" for myths) | skip |

\* A topic may opt out of a starred section with an HTML comment `{/* no-visual-map: reason */}` (etc.) when a diagram/snippet would genuinely be filler — the linter accepts the marker, so opt-outs are deliberate and greppable.

### 4.3 Section quality bars (what the linter can check mechanically)

> Heading structure is enforced for every non-stub `structure: 2` topic; the per-section quality bars below kick in at `status: reviewed`, so in-progress drafts stay committable.

- **The Visual Map** contains a ` ```mermaid ` fence.
- **Under the Hood** contains a code fence with a language tag.
- **Try it yourself** contains a fenced `bash`/`sh`/`python` block; convention: must run on stock WSL/Ubuntu with no installs beyond coreutils/python3 (spot-checked in review, not CI-executed).
- **Learn next** contains ≥3 internal `/t/…` links.
- Headings appear in the §4.1 order.

## 5. Phases

### Phase 0 — Infrastructure (1 PR, no content changes)

1. `src/lib/taxonomy.ts` (all 15 domains + sub-categories).
2. Schema: add `domain`, `subcategory`, `structure` (all optional/defaulted — zero topics break).
3. **Mermaid rendering** wired into the Astro build; one demo diagram on a scratch page to verify dark/light themes and Pagefind indexing behavior.
4. Topic layout renders the Metadata block when `domain` is present.
5. `lint-content.mjs` v2: keeps v1 rules for `structure: 1`; applies §4 rules for `structure: 2`; validates `subcategory` ∈ `domain`.
6. `new-topic.mjs`: add `--domain`/`--subcategory` (required), scaffold v2 headings, emit `structure: 2`.
7. New `scripts/audit-taxonomy.mjs`: reports per-domain/sub-category coverage, lists unclassified topics and `structure: 1` stragglers — the migration progress meter (same role `audit-importance.mjs` played for the rings).
8. Add `lint:content` + `audit:taxonomy` to the `npm run check` chain / CI.

**Gate:** `npm run check && npm run build` green with zero content edits.

### Phase 1 — Classification pass (fast, frontmatter-only)

Walk all 334 topics and add `domain` + `subcategory` using the §3.2 hint table; flag ambiguous ones (expect ~30: cross-cutting topics like `cache-coherence`, `tls`, `gpu`, history figures) for individual decisions recorded in the commit message. **No body edits in this phase** — classification disagreements shouldn't block or tangle with prose rewrites.

Batching: one site category per commit (18 commits), `audit-taxonomy` after each.

**Gate:** `audit:taxonomy` reports 334/334 classified; every sub-category used at least once is valid.

### Phase 2 — Enrichment migration (the long haul)

Per topic: rewrite body to §4.1 (keep existing explanations — reorganize and enrich, don't regenerate), author the new sections, set `structure: 2`, bump `updated`.

- **Order:** one site category at a time, Ring 1 (core) topics first within each — highest-traffic pages get enriched first. Suggested category order: foundations → operating-systems → networks → … (by traffic/centrality), `history-and-society` last (smallest delta — its kinds skip most new sections).
- **Batch size:** 5–8 topics per PR/commit, gated each time with `npm run lint:content && node scripts/check-refs.mjs && npm run build`.
- **Effort estimate:** ~280 topics get the full 4 new sections, ~54 (person/history/field kinds) get partial. At 6–8 topics per sitting this is ~40–50 sittings; tracked by `audit:taxonomy`'s `structure: 1` counter, exactly like the ring checkboxes in `content-roadmap.md`.
- **Quality rule for generated sections:** *Engineering Trade-offs* and *Try it yourself* must be technically verifiable claims/commands — every `Try it yourself` block is executed once in WSL before commit.

**Gate per category:** linter clean, no orphans regression, build green, spot-render 2 pages with Mermaid diagrams.

### Phase 3 — Flip the defaults (1 PR)

When `audit:taxonomy` reports 0 stragglers:

1. Schema: `domain`/`subcategory` required; `structure` default `2` (then delete the field and v1 lint branch in a follow-up once nothing references it).
2. `new-topic.mjs` refuses to scaffold without taxonomy flags (already done in Phase 0 — verify).
3. Update `CONTRIBUTING.md` + the topic issue template with the v2 checklist.
4. Re-measure Pagefind index size and build time (content volume roughly doubles per page; the roadmap already flagged a re-measure at ~300 topics).

## 6. The system for future topics

A new topic cannot merge unclassified or unenriched once Phase 3 lands:

1. **Scaffold** — `new-topic.mjs` requires `--domain`/`--subcategory` (validated against `taxonomy.ts`) and emits the v2 skeleton with per-`kind` applicable sections.
2. **Enforce** — `lint-content.mjs` in CI rejects: missing/invalid taxonomy, missing v2 headings (per applicability matrix), missing mermaid/code/command fences, <3 Learn-next links, headings out of order.
3. **Author/transform** — the canonical enrichment prompt lives at **`docs/enrichment-prompt.md`** (the "Execution Steps" prompt: analyze concept → classify against taxonomy → keep & reorganize existing prose → generate missing sections → output only the file). Also installed as a Claude Code command at **`.claude/commands/enrich-topic.md`** so `/enrich-topic <path>` runs the same transform on any file — the same prompt serves migration (Phase 2) and future intake, so old and new content can't diverge.
4. **Audit** — `audit:taxonomy` joins `audit:importance` / `audit:orphans` in the routine health checks; it also reports domain *coverage gaps* (taxonomy sub-categories with zero topics), which becomes the seed list for a future Ring 4.

## 7. Risks & open questions

- **Mermaid in MDX/Astro:** build-time rendering (`rehype-mermaid`) needs Playwright in CI; client-side rendering ships ~200 KB JS. Decide in Phase 0 with the demo page. *Recommendation: build-time — this is a content site; keep pages static.*
- **Page length:** v2 roughly doubles per-page content. Watch Pagefind index size and the `/t/…` reading experience; consider `<details>` for *Under the Hood* on beginner-level topics if pages feel heavy.
- **"Try it yourself" rot:** commands tested once can break. Mitigation: prefer coreutils/python3-only commands; tag anything needing installs explicitly (`# requires: ffmpeg`).
- **Taxonomy fit friction:** a few topics (e.g. `spreadsheet`, `dark-pattern`, biography pages) will fit awkwardly. Rule: best defensible single placement, note the runner-up in the PR description, move on — the taxonomy serves readers, not the other way around.
- **`subcategory` as free string vs enum:** start as string validated by the linter against `taxonomy.ts`; promote to a Zod discriminated union in Phase 3 if it's stable.
