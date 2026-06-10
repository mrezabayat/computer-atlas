# Canonical Topic Enrichment Prompt

> The single transformation prompt used both for migrating existing topics to the v2 structure (Phase 2 of `enrichment-plan.md`) and for finishing any future topic before review. Run it via `/enrich-topic <path>` (see `.claude/commands/enrich-topic.md`) or paste it into any capable LLM along with the topic file.
>
> Design notes that differ from the original spec: the Primary Domain / Sub-category metadata goes in **frontmatter** (`domain`, `subcategory`), never in the body — the topic layout renders the Metadata block. Section applicability depends on the topic's `kind` (see `enrichment-plan.md` §4.2).

---

## Role & Objective

You are an expert Computer Science Librarian and Senior Software Architect. Audit, classify, and structurally enrich the topic MDX file provided below for the Computer Atlas.

## Execution Steps

1. **Analyze** the core concept of the file.
2. **Classify** it into exactly ONE Primary Domain and ONE Sub-category from the Master Computing Taxonomy in `src/lib/taxonomy.ts`. Record them as the frontmatter fields `domain` and `subcategory` (kebab-case slugs). Cross-cutting topics: pick the domain of the topic's *defining* concern; put the secondary lens in `tags`. People/organizations/events: classify by the subject's primary technical contribution.
3. **Preserve and reorganize.** Keep the author's existing explanations — rewrite, reorganize, and enrich them into the target structure below. Merge any existing "Why it matters" prose into *More detail* and/or *Engineering Trade-offs* / *Real-world examples*; the heading itself is retired.
4. **Generate the missing sections** based strictly on accurate computer engineering principles. Never invent benchmarks, version numbers, or product claims you are not sure of.
5. **Update frontmatter:** set `structure: 2`, bump `updated` to today, ensure `related`/`nextSteps` mirror the *Learn next* links (slugs must exist in `src/content/topics/`).
6. **Output ONLY the finalized MDX file.** No conversational prefaces or postfaces.

## Target Body Structure (H2s, in this exact order)

```markdown
## In simple terms
[1–2 paragraph intuitive analogy for beginners]

## The Visual Map
[A clear Mermaid.js diagram (```mermaid fence) showing architecture, flow, or structure — if applicable]

## More detail
[Deep-dive technical explanation using precise computer science terminology]

## Under the Hood
[A relevant C, Python, or assembly snippet, code implementation, or raw system config — if applicable]

## Engineering Trade-offs
[Pros vs cons, complexity trade-offs, performance vs memory overhead]

## Real-world examples
[Where this is explicitly used in production software, hardware, or famous projects]

## Common misconceptions
[1–2 mental errors or myths developers hold about this topic]

## Try it yourself
[A copy-pasteable terminal command or zero-dependency script runnable on stock WSL/Ubuntu
(coreutils/python3 only; tag anything else `# requires: <pkg>`) — if applicable]

## Learn next
[≥3 logically related topics as internal /t/<slug> links, with one line each on why]
```

## Applicability by `kind`

| `kind` | Visual Map | Under the Hood | Trade-offs | Try it yourself |
|---|---|---|---|---|
| concept, technology, protocol, language, tool | required* | required* | required | required* |
| field | required | optional | required | optional |
| person, organization, historical-event | skip | skip | skip | skip |

\* Opt out of a starred section only when it would be genuine filler, with an inline marker, e.g. `{/* no-visual-map: linear concept, nothing to diagram */}`.

## Quality bars (the linter checks these)

- *The Visual Map* contains a ` ```mermaid ` fence; *Under the Hood* a language-tagged fence; *Try it yourself* a `bash`/`sh`/`python` fence.
- Headings appear in the exact order above; no v1 "Why it matters" heading remains.
- *Learn next* has ≥3 internal links; all internal links resolve (`scripts/check-refs.mjs`).
- Summary ≤ 280 chars; no TODO/FIXME in `status: reviewed` files.
- Every *Try it yourself* block was actually executed once before commit.
