import { useEffect, useState } from "react";
import {
  getProgressMe,
  type ProgressMeState,
} from "~/lib/progress-client";

export default function ContinueLearning() {
  const [state, setState] = useState<ProgressMeState>({ kind: "loading" });

  useEffect(() => {
    let cancelled = false;
    getProgressMe().then((next) => {
      if (!cancelled) setState(next);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  // Hide entirely when signed out, errored, or loading — no flicker for the
  // anonymous static crawler.
  if (state.kind !== "ready") return null;

  const continueWith =
    state.data.paths.find((p) => p.lastProgressedAt && p.nextTopicId) ?? null;
  if (!continueWith) return null;

  const resumeHref = `/t/${continueWith.nextTopicId}?path=${encodeURIComponent(continueWith.pathId)}`;

  return (
    <section
      className="mx-auto max-w-6xl px-4 py-6"
      aria-label="Continue learning"
    >
      <div className="rounded-lg border border-[var(--color-atlas-accent)]/40 bg-[var(--color-atlas-accent-soft)] p-5">
        <div className="flex flex-wrap items-baseline justify-between gap-3">
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-wide text-[var(--color-atlas-accent)]">
              Continue learning
            </p>
            <h2 className="mt-1 truncate text-lg font-semibold text-[var(--color-atlas-ink)]">
              {continueWith.pathTitle}
            </h2>
          </div>
          <a
            href={resumeHref}
            className="rounded-md bg-[var(--color-atlas-accent)] px-3 py-1.5 text-sm font-medium text-white no-underline"
          >
            Resume here →
          </a>
        </div>
        <div className="mt-3">
          <div
            role="progressbar"
            aria-valuenow={continueWith.percent}
            aria-valuemin={0}
            aria-valuemax={100}
            className="h-2 w-full overflow-hidden rounded-full bg-[var(--color-atlas-line)]"
          >
            <div
              className="h-full bg-[var(--color-atlas-accent)]"
              style={{ width: `${continueWith.percent}%` }}
            />
          </div>
          <p className="mt-1.5 text-xs text-[var(--color-atlas-muted)]">
            {continueWith.completedCount} of {continueWith.requiredCount} complete
            · {continueWith.percent}% · <a href="/me" className="underline-offset-2 hover:underline">view all progress</a>
          </p>
        </div>
      </div>
    </section>
  );
}
