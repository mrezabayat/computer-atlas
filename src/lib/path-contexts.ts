import { loadGraph } from "./graph";
import { pathTopicIds } from "./paths";
import type { PathContext } from "~/components/PathContextStrip";

/**
 * Navigation payload for the PathContextStrip + InlineMarkComplete islands.
 *
 * Keep this struct minimal — see "Settled design decisions" in the plan.
 * No summaries, descriptions, reading times, or progress.
 *
 * Optional topics are included in topicIds — they still get prev/next slots
 * in the path, they just don't count toward completion.
 */
export async function buildPathContexts(
  topicId: string,
  appearsInRoadmaps: string[],
): Promise<PathContext[]> {
  const { paths, topicsById } = await loadGraph();

  return appearsInRoadmaps
    .map((pid) => {
      const path = paths.find((p) => p.id === pid);
      if (!path) return null;

      const topicIds = pathTopicIds(path.data.topics);
      const index = topicIds.indexOf(topicId);
      if (index < 0) return null;

      const titlesById: Record<string, string> = {};
      for (const id of topicIds) {
        titlesById[id] = topicsById.get(id)?.data.title ?? id;
      }

      return {
        pathId: pid,
        pathTitle: path.data.title,
        topicIds,
        titlesById,
        index,
      } satisfies PathContext;
    })
    .filter((ctx): ctx is PathContext => ctx !== null);
}
