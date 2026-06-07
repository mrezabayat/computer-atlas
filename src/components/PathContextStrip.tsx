import { useEffect, useState } from "react";

export interface PathContext {
  pathId: string;
  pathTitle: string;
  topicIds: string[];
  titlesById: Record<string, string>;
  index: number;
}

interface Props {
  pathContexts: PathContext[];
}

function readPathParam(): string | null {
  if (typeof window === "undefined") return null;
  const value = new URLSearchParams(window.location.search).get("path");
  if (!value) return null;
  // URLSearchParams already decodes — just make sure it looks like a slug.
  if (!/^[a-z0-9][a-z0-9-]*$/.test(value)) return null;
  return value;
}

function pickContext(
  contexts: PathContext[],
  pathParam: string | null,
): PathContext | null {
  if (!pathParam) return null;
  const ctx = contexts.find((c) => c.pathId === pathParam);
  if (!ctx) return null;
  if (ctx.index < 0 || ctx.index >= ctx.topicIds.length) return null;
  return ctx;
}

function buildTopicHref(slug: string, pathId: string): string {
  return `/t/${slug}?path=${encodeURIComponent(pathId)}`;
}

function buildPathHref(pathId: string): string {
  return `/p/${pathId}`;
}

export default function PathContextStrip({ pathContexts }: Props) {
  // Defer reading the URL until after mount to avoid hydration mismatches.
  const [ctx, setCtx] = useState<PathContext | null>(null);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    setCtx(pickContext(pathContexts, readPathParam()));
  }, [pathContexts]);

  if (!ctx) return null;

  const total = ctx.topicIds.length;
  const position = ctx.index + 1;

  const prevId = ctx.index > 0 ? ctx.topicIds[ctx.index - 1] : null;
  const nextId = ctx.index < total - 1 ? ctx.topicIds[ctx.index + 1] : null;

  const prevTitle = prevId ? ctx.titlesById[prevId] ?? prevId : null;
  const nextTitle = nextId ? ctx.titlesById[nextId] ?? nextId : null;

  return (
    <div
      className="sticky top-0 z-20 -mx-4 mb-4 border-b border-[var(--color-atlas-line)] bg-[var(--color-atlas-surface)]/95 px-4 backdrop-blur sm:rounded-md sm:border sm:bg-[var(--color-atlas-surface)] sm:backdrop-blur-none"
      role="region"
      aria-label="Path navigation"
    >
      <div className="hidden items-center justify-between gap-3 py-2 sm:flex">
        <a
          href={buildPathHref(ctx.pathId)}
          className="min-w-0 text-xs text-[var(--color-atlas-muted)] no-underline hover:text-[var(--color-atlas-ink)]"
        >
          Path:{" "}
          <span className="font-medium text-[var(--color-atlas-ink)]">
            {ctx.pathTitle}
          </span>{" "}
          · {position} of {total}
        </a>
        <div className="flex shrink-0 items-center gap-2 text-sm">
          {prevId && prevTitle ? (
            <a
              href={buildTopicHref(prevId, ctx.pathId)}
              className="rounded-md border border-[var(--color-atlas-line)] px-2 py-1 text-[var(--color-atlas-muted)] no-underline hover:border-[var(--color-atlas-accent)] hover:text-[var(--color-atlas-ink)]"
              rel="prev"
              title={`Previous in ${ctx.pathTitle}`}
            >
              ←{" "}
              <span className="hidden md:inline">{prevTitle}</span>
              <span className="md:hidden">Prev</span>
            </a>
          ) : (
            <span
              className="rounded-md border border-transparent px-2 py-1 text-[var(--color-atlas-muted)]/50"
              aria-hidden="true"
            >
              ← Start
            </span>
          )}
          <a
            href={buildPathHref(ctx.pathId)}
            className="rounded-md border border-[var(--color-atlas-line)] bg-[var(--color-atlas-bg)] px-2 py-1 text-[var(--color-atlas-muted)] no-underline hover:border-[var(--color-atlas-accent)] hover:text-[var(--color-atlas-ink)]"
            title={`Back to ${ctx.pathTitle}`}
          >
            Back to path
          </a>
          {nextId && nextTitle ? (
            <a
              href={buildTopicHref(nextId, ctx.pathId)}
              className="rounded-md border border-[var(--color-atlas-accent)] bg-[var(--color-atlas-accent-soft)] px-2 py-1 font-medium text-[var(--color-atlas-accent)] no-underline hover:bg-[var(--color-atlas-accent)] hover:text-white"
              rel="next"
              title={`Next in ${ctx.pathTitle}`}
            >
              <span className="hidden md:inline">{nextTitle}</span>
              <span className="md:hidden">Next</span>{" "}
              →
            </a>
          ) : (
            <span
              className="rounded-md border border-transparent px-2 py-1 text-[var(--color-atlas-muted)]/50"
              aria-hidden="true"
            >
              End →
            </span>
          )}
        </div>
      </div>

      <div className="flex flex-col sm:hidden">
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          className="flex w-full items-center justify-between gap-2 py-2 text-left text-xs text-[var(--color-atlas-muted)]"
          aria-expanded={expanded}
        >
          <span className="min-w-0 truncate">
            Path:{" "}
            <span className="font-medium text-[var(--color-atlas-ink)]">
              {ctx.pathTitle}
            </span>{" "}
            · {position} of {total}
          </span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
            className={`shrink-0 transition-transform ${expanded ? "rotate-180" : ""}`}
          >
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </button>
        {expanded && (
          <div className="flex flex-wrap items-center gap-2 pb-2 text-sm">
            {prevId ? (
              <a
                href={buildTopicHref(prevId, ctx.pathId)}
                className="rounded-md border border-[var(--color-atlas-line)] px-2 py-1 text-[var(--color-atlas-muted)] no-underline"
                rel="prev"
              >
                ← Prev
              </a>
            ) : null}
            <a
              href={buildPathHref(ctx.pathId)}
              className="rounded-md border border-[var(--color-atlas-line)] bg-[var(--color-atlas-bg)] px-2 py-1 text-[var(--color-atlas-muted)] no-underline"
            >
              Back to path
            </a>
            {nextId ? (
              <a
                href={buildTopicHref(nextId, ctx.pathId)}
                className="rounded-md border border-[var(--color-atlas-accent)] bg-[var(--color-atlas-accent-soft)] px-2 py-1 font-medium text-[var(--color-atlas-accent)] no-underline"
                rel="next"
              >
                Next →
              </a>
            ) : null}
          </div>
        )}
      </div>
    </div>
  );
}
