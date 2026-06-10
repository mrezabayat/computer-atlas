/**
 * The Master Computing Taxonomy — the librarian's index over the Atlas.
 *
 * Orthogonal to the 18 site categories (`lib/categories.ts`): `category` keeps
 * driving folders, URLs, and navigation; `domain`/`subcategory` classify each
 * topic into exactly one place in this hierarchy. See docs/enrichment-plan.md.
 *
 * The data lives in taxonomy.json so the plain-JS scripts (lint-content,
 * audit-taxonomy, new-topic) can read the same source of truth.
 */
import TAXONOMY_DATA from "./taxonomy.json";

export const TAXONOMY = TAXONOMY_DATA;

export type DomainSlug = keyof typeof TAXONOMY;

export const DOMAIN_SLUGS = Object.keys(TAXONOMY) as [
  DomainSlug,
  ...DomainSlug[],
];

export const isDomainSlug = (value: string): value is DomainSlug =>
  Object.hasOwn(TAXONOMY, value);

export const domainLabel = (domain: DomainSlug): string =>
  TAXONOMY[domain].title;

export const isSubcategoryOf = (domain: DomainSlug, sub: string): boolean =>
  Object.hasOwn(TAXONOMY[domain].subcategories, sub);

export const subcategoryLabel = (
  domain: DomainSlug,
  sub: string,
): string | undefined =>
  (TAXONOMY[domain].subcategories as Record<string, string>)[sub];
