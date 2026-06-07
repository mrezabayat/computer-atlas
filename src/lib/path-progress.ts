import { loadGraph } from "./graph";
import { pathTopicIds, requiredPathTopicIds } from "./paths";

export interface ProgressPathSpec {
  pathId: string;
  /** Every topic in the path, in order (includes optional ones). */
  topicIds: string[];
  /** Only the topics that count toward completion. */
  requiredTopicIds: string[];
}

export async function getProgressPathSpec(
  pathId: string,
): Promise<ProgressPathSpec | null> {
  const { paths } = await loadGraph();
  const path = paths.find((p) => p.id === pathId);
  if (!path) return null;

  return {
    pathId: path.id,
    topicIds: pathTopicIds(path.data.topics),
    requiredTopicIds: requiredPathTopicIds(path.data.topics),
  };
}

export async function isValidProgressTarget(
  pathId: string,
  topicId: string,
): Promise<boolean> {
  const spec = await getProgressPathSpec(pathId);
  return Boolean(spec?.topicIds.includes(topicId));
}
