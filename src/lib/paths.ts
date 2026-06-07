import type { CollectionEntry } from "astro:content";

export interface NormalisedPathTopic {
  /** The topic slug. */
  id: string;
  /** Optional topics are still listed but excluded from the completion denominator. */
  optional: boolean;
  /** Section header attached to this topic; the FIRST topic of each new section carries the label. */
  section: string | undefined;
}

/**
 * Turn the union-shaped `topics:` array from a path's frontmatter into a
 * uniform list. Accepts:
 *   - a bare reference (Astro turns this into `{ id, collection }` or a string)
 *   - a richer object `{ ref, optional?, section? }`
 */
export function normalisePathTopics(
  topics: CollectionEntry<"paths">["data"]["topics"],
): NormalisedPathTopic[] {
  return topics.map((entry) => {
    if (typeof entry === "string") {
      return { id: entry, optional: false, section: undefined };
    }
    // The richer object form.
    if ("ref" in entry) {
      const id =
        typeof entry.ref === "string" ? entry.ref : (entry.ref as { id: string }).id;
      return {
        id,
        optional: entry.optional ?? false,
        section: entry.section,
      };
    }
    // Bare reference object: { id, collection }
    return {
      id: (entry as { id: string }).id,
      optional: false,
      section: undefined,
    };
  });
}

/**
 * Return every topic slug in path order, optional or not.
 * Useful for path navigation, where optional topics still need prev/next slots.
 */
export function pathTopicIds(
  topics: CollectionEntry<"paths">["data"]["topics"],
): string[] {
  return normalisePathTopics(topics).map((t) => t.id);
}

/**
 * Return only the slugs that count toward completion (i.e. exclude optional).
 */
export function requiredPathTopicIds(
  topics: CollectionEntry<"paths">["data"]["topics"],
): string[] {
  return normalisePathTopics(topics)
    .filter((t) => !t.optional)
    .map((t) => t.id);
}
