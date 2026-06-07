import { useEffect, useState } from "react";
import {
  getProgressMe,
  type ProgressMeState,
} from "~/lib/progress-client";

interface Props {
  pathId: string;
}

/**
 * Tiny inline progress indicator for path cards. Hides itself if the user is
 * signed out or hasn't started this path yet.
 */
export default function PathProgressBar({ pathId }: Props) {
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

  if (state.kind !== "ready") return null;

  const summary = state.data.paths.find((p) => p.pathId === pathId);
  if (!summary || summary.completedCount === 0) return null;

  const done = summary.completedCount >= summary.requiredCount;

  return (
    <div className="mt-3" aria-label="Your progress through this path">
      <div className="flex items-baseline justify-between gap-2 text-xs text-[var(--color-atlas-muted)]">
        <span>
          {summary.completedCount} / {summary.requiredCount} complete
        </span>
        <span>{summary.percent}%</span>
      </div>
      <div
        role="progressbar"
        aria-valuenow={summary.percent}
        aria-valuemin={0}
        aria-valuemax={100}
        className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-[var(--color-atlas-line)]"
      >
        <div
          className={`h-full transition-[width] ${
            done
              ? "bg-emerald-500"
              : "bg-[var(--color-atlas-accent)]"
          }`}
          style={{ width: `${summary.percent}%` }}
        />
      </div>
    </div>
  );
}
