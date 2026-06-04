import { getCollection, type CollectionEntry } from "astro:content";

export type TopicEntry = CollectionEntry<"topics">;
export type PathEntry = CollectionEntry<"paths">;
export type CategoryEntry = CollectionEntry<"categories">;

export type RelationKind =
  | "prerequisites"
  | "related"
  | "partOf"
  | "nextSteps"
  | "subtopics"
  | "leadsTo"
  | "requiredBy";

export interface TopicRelations {
  prerequisites: string[];
  related: string[];
  partOf: string[];
  nextSteps: string[];
  subtopics: string[];
  leadsTo: string[];
  requiredBy: string[];
  appearsInRoadmaps: string[];
}

export interface NeighborGraph {
  nodes: Array<{ id: string; title: string; kind: string; level: string }>;
  edges: Array<{ source: string; target: string; relation: RelationKind }>;
}

const refIds = (
  refs: Array<{ id: string } | string> | undefined,
): string[] => {
  if (!refs) return [];
  return refs.map((r) => (typeof r === "string" ? r : r.id));
};

let cache: {
  topicsById: Map<string, TopicEntry>;
  relationsById: Map<string, TopicRelations>;
  paths: PathEntry[];
} | null = null;

export async function loadGraph() {
  if (cache) return cache;

  const [topics, paths] = await Promise.all([
    getCollection("topics"),
    getCollection("paths"),
  ]);

  const topicsById = new Map<string, TopicEntry>();
  for (const t of topics) topicsById.set(t.id, t);

  const errors: string[] = [];
  const check = (
    sourceId: string,
    field: keyof TopicRelations | "paths.topics",
    targets: string[],
  ) => {
    for (const target of targets) {
      if (!topicsById.has(target)) {
        errors.push(
          `${sourceId}: ${field} references unknown topic "${target}"`,
        );
      }
    }
  };

  const relationsById = new Map<string, TopicRelations>();
  for (const t of topics) {
    const rels: TopicRelations = {
      prerequisites: refIds(t.data.prerequisites),
      related: refIds(t.data.related),
      partOf: refIds(t.data.partOf),
      nextSteps: refIds(t.data.nextSteps),
      subtopics: [],
      leadsTo: [],
      requiredBy: [],
      appearsInRoadmaps: [],
    };
    check(t.id, "prerequisites", rels.prerequisites);
    check(t.id, "related", rels.related);
    check(t.id, "partOf", rels.partOf);
    check(t.id, "nextSteps", rels.nextSteps);
    relationsById.set(t.id, rels);
  }

  for (const p of paths) {
    const topicIds = refIds(p.data.topics);
    check(`path:${p.id}`, "paths.topics", topicIds);
  }

  if (errors.length > 0) {
    throw new Error(
      `Computer Atlas content graph has ${errors.length} broken reference(s):\n  - ${errors.join("\n  - ")}`,
    );
  }

  for (const [id, rels] of relationsById) {
    for (const target of rels.partOf) {
      relationsById.get(target)?.subtopics.push(id);
    }
    for (const target of rels.nextSteps) {
      relationsById.get(target)?.leadsTo.push(id);
    }
    for (const target of rels.prerequisites) {
      relationsById.get(target)?.requiredBy.push(id);
    }
  }

  for (const p of paths) {
    const topicIds = refIds(p.data.topics);
    for (const tid of topicIds) {
      relationsById.get(tid)?.appearsInRoadmaps.push(p.id);
    }
  }

  cache = { topicsById, relationsById, paths };
  return cache;
}

export async function getTopicRelations(
  id: string,
): Promise<TopicRelations | undefined> {
  const { relationsById } = await loadGraph();
  return relationsById.get(id);
}

export async function getNeighborGraph(id: string): Promise<NeighborGraph> {
  const { topicsById, relationsById } = await loadGraph();
  const center = topicsById.get(id);
  const rels = relationsById.get(id);
  if (!center || !rels) return { nodes: [], edges: [] };

  const edges: NeighborGraph["edges"] = [];
  const neighborIds = new Set<string>();

  const addEdges = (
    targets: string[],
    relation: RelationKind,
    direction: "out" | "in",
  ) => {
    for (const t of targets) {
      if (!topicsById.has(t)) continue;
      neighborIds.add(t);
      edges.push(
        direction === "out"
          ? { source: id, target: t, relation }
          : { source: t, target: id, relation },
      );
    }
  };

  addEdges(rels.prerequisites, "prerequisites", "in");
  addEdges(rels.related, "related", "out");
  addEdges(rels.partOf, "partOf", "out");
  addEdges(rels.nextSteps, "nextSteps", "out");

  const nodes: NeighborGraph["nodes"] = [
    {
      id: center.id,
      title: center.data.title,
      kind: center.data.kind,
      level: center.data.level,
    },
    ...[...neighborIds].map((nid) => {
      const n = topicsById.get(nid)!;
      return {
        id: n.id,
        title: n.data.title,
        kind: n.data.kind,
        level: n.data.level,
      };
    }),
  ];

  return { nodes, edges };
}

export async function getAllTopics(): Promise<TopicEntry[]> {
  const { topicsById } = await loadGraph();
  return [...topicsById.values()];
}

export async function getTopicsByCategory(
  category: string,
): Promise<TopicEntry[]> {
  const all = await getAllTopics();
  return all
    .filter((t) => t.data.category === category)
    .sort((a, b) => a.data.title.localeCompare(b.data.title));
}

export async function getAllPaths(): Promise<PathEntry[]> {
  const { paths } = await loadGraph();
  return [...paths].sort((a, b) => a.data.title.localeCompare(b.data.title));
}

export function topicUrl(id: string): string {
  return `/t/${id}`;
}

export function categoryUrl(slug: string): string {
  return `/c/${slug}`;
}

export function pathUrl(id: string): string {
  return `/p/${id}`;
}
