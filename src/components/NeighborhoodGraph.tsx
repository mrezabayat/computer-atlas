import { useMemo, useEffect, useState, useRef } from "react";
import {
  ReactFlow,
  Background,
  Controls,
  Handle,
  Position,
  MarkerType,
  type Edge,
  type Node,
  type EdgeTypes,
  type NodeTypes,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import type { NeighborGraph, RelationKind } from "~/lib/graph";

interface Props {
  centerId: string;
  graph: NeighborGraph;
}

const RELATION_LABELS: Record<RelationKind, string> = {
  prerequisites: "requires",
  related: "related",
  partOf: "part of",
  nextSteps: "next",
  subtopics: "contains",
  leadsTo: "leads to",
  requiredBy: "required by",
};

const RELATION_COLORS: Record<RelationKind, string> = {
  prerequisites: "#d97706",
  related: "#6b7280",
  partOf: "#9333ea",
  nextSteps: "#1f6feb",
  subtopics: "#9333ea",
  leadsTo: "#1f6feb",
  requiredBy: "#d97706",
};

interface LayoutResult {
  nodes: Node[];
  edges: Edge[];
}

function buildLayout(centerId: string, graph: NeighborGraph): LayoutResult {
  const incoming = graph.edges.filter((e) => e.target === centerId);
  const outgoing = graph.edges.filter((e) => e.source === centerId);

  const left = incoming.map((e) => e.source);
  const right = outgoing.map((e) => e.target);

  const nodeMap = new Map(graph.nodes.map((n) => [n.id, n]));
  const placed = new Map<string, { x: number; y: number }>();

  placed.set(centerId, { x: 0, y: 0 });

  const spacingY = 70;
  const spacingX = 260;

  const layoutColumn = (
    ids: string[],
    xOffset: number,
  ): void => {
    const n = ids.length;
    const totalHeight = (n - 1) * spacingY;
    ids.forEach((id, i) => {
      if (placed.has(id)) return;
      placed.set(id, { x: xOffset, y: i * spacingY - totalHeight / 2 });
    });
  };

  layoutColumn(left, -spacingX);
  layoutColumn(right, spacingX);

  const nodes: Node[] = [...placed.entries()].map(([id, pos]) => {
    const data = nodeMap.get(id);
    const isCenter = id === centerId;
    return {
      id,
      position: pos,
      data: {
        label: data?.title ?? id,
        kind: data?.kind ?? "concept",
        level: data?.level ?? "beginner",
        isCenter,
        href: `/t/${id}`,
      },
      type: "atlas",
      draggable: false,
      selectable: !isCenter,
    };
  });

  const edges: Edge[] = graph.edges.map((e, i) => ({
    id: `e${i}-${e.source}-${e.target}-${e.relation}`,
    source: e.source,
    target: e.target,
    label: RELATION_LABELS[e.relation],
    labelStyle: { fontSize: 11, fill: "var(--color-atlas-muted)" },
    labelBgStyle: { fill: "var(--color-atlas-bg)" },
    labelBgPadding: [3, 2],
    labelBgBorderRadius: 4,
    style: { stroke: RELATION_COLORS[e.relation], strokeWidth: 1.75 },
    markerEnd: {
      type: MarkerType.ArrowClosed,
      color: RELATION_COLORS[e.relation],
      width: 22,
      height: 22,
    },
    type: "default",
    animated: false,
  }));

  return { nodes, edges };
}

interface AtlasNodeData {
  label: string;
  kind: string;
  level: string;
  isCenter: boolean;
  href: string;
}

function AtlasNode({ data }: { data: AtlasNodeData }) {
  const cls = data.isCenter
    ? "border-[var(--color-atlas-accent)] bg-[var(--color-atlas-accent-soft)] text-[var(--color-atlas-ink)]"
    : "border-[var(--color-atlas-line)] bg-[var(--color-atlas-surface)] text-[var(--color-atlas-ink)]";

  const handleStyle: React.CSSProperties = {
    width: 6,
    height: 6,
    background: "var(--color-atlas-muted)",
    border: "none",
    opacity: 0.6,
  };

  return (
    <>
      <Handle
        type="target"
        position={Position.Left}
        style={handleStyle}
        isConnectable={false}
      />
      <a
        href={data.isCenter ? undefined : data.href}
        className={`rfg-node inline-block rounded-md border px-3 py-1.5 text-xs font-medium no-underline shadow-sm ${cls}`}
        style={{ pointerEvents: data.isCenter ? "none" : "auto" }}
      >
        {data.label}
      </a>
      <Handle
        type="source"
        position={Position.Right}
        style={handleStyle}
        isConnectable={false}
      />
    </>
  );
}

const nodeTypes: NodeTypes = { atlas: AtlasNode };
const edgeTypes: EdgeTypes = {};

export default function NeighborhoodGraph({ centerId, graph }: Props) {
  const layout = useMemo(
    () => buildLayout(centerId, graph),
    [centerId, graph],
  );

  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const containerRef = useRef<HTMLDivElement>(null);

  if (!mounted) {
    return (
      <div
        className="h-[360px] rounded-lg border border-[var(--color-atlas-line)] bg-[var(--color-atlas-surface)]"
        aria-hidden="true"
      />
    );
  }

  if (layout.nodes.length <= 1) {
    return (
      <p className="rounded-lg border border-[var(--color-atlas-line)] bg-[var(--color-atlas-surface)] p-4 text-sm text-[var(--color-atlas-muted)]">
        No neighborhood to draw yet — this topic has no relationships.
      </p>
    );
  }

  return (
    <div
      ref={containerRef}
      className="h-[360px] w-full overflow-hidden rounded-lg border border-[var(--color-atlas-line)] bg-[var(--color-atlas-surface)]"
    >
      <ReactFlow
        nodes={layout.nodes}
        edges={layout.edges}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        fitView
        fitViewOptions={{ padding: 0.25 }}
        proOptions={{ hideAttribution: true }}
        nodesDraggable={false}
        nodesConnectable={false}
        elementsSelectable={false}
        panOnDrag
        zoomOnScroll={false}
        zoomOnPinch
        minZoom={0.4}
        maxZoom={2}
      >
        <Background gap={20} size={1} color="var(--color-atlas-line)" />
        <Controls
          showInteractive={false}
          position="bottom-right"
          style={{
            border: "1px solid var(--color-atlas-line)",
            borderRadius: "0.375rem",
            background: "var(--color-atlas-surface)",
          }}
        />
      </ReactFlow>
    </div>
  );
}
