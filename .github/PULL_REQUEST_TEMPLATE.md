# Pull request

## What changes?

<!-- One or two sentences. New topic? Edited topic? Fixed relationships? -->

## Topic checklist (delete if not a content change)

- [ ] Frontmatter includes `title`, `category`, `kind`, `summary`, `level`, `status`, `updated`.
- [ ] Slug is unique across the Atlas and matches the filename.
- [ ] Body uses the standardized headings (`In simple terms`, `More detail`, `Why it matters`, `Real-world examples`, `Common misconceptions`, `Learn next`). Empty sections allowed for `status: stub`.
- [ ] All `prerequisites`, `related`, `partOf`, `nextSteps` slugs point to existing topics. (`npm run build` will fail otherwise.)
- [ ] If this changes the URL of an existing topic, the old slug is added to `aliases` to preserve incoming links.

## Validation

- [ ] `npm run check` passes.
- [ ] `npm run build` passes locally (including the broken-reference check).
