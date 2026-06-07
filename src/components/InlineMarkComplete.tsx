import { useEffect, useMemo, useState } from "react";
import { authClient } from "~/lib/auth-client";
import type { PathContext } from "./PathContextStrip";

interface Props {
  topicId: string;
  pathContexts: PathContext[];
}

type LoadState = "loading" | "ready" | "signed-out" | "error";

function readPathParam(): string | null {
  if (typeof window === "undefined") return null;
  const value = new URLSearchParams(window.location.search).get("path");
  if (!value) return null;
  if (!/^[a-z0-9][a-z0-9-]*$/.test(value)) return null;
  return value;
}

function pickContext(
  contexts: PathContext[],
  pathParam: string | null,
  topicId: string,
): PathContext | null {
  if (!pathParam) return null;
  const ctx = contexts.find((c) => c.pathId === pathParam);
  if (!ctx) return null;
  if (ctx.index < 0 || ctx.index >= ctx.topicIds.length) return null;
  if (ctx.topicIds[ctx.index] !== topicId) return null;
  return ctx;
}

export default function InlineMarkComplete({ topicId, pathContexts }: Props) {
  const session = authClient.useSession();
  const [ctx, setCtx] = useState<PathContext | null>(null);
  const [state, setState] = useState<LoadState>("loading");
  const [completed, setCompleted] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setCtx(pickContext(pathContexts, readPathParam(), topicId));
  }, [pathContexts, topicId]);

  const userId = session.data?.user?.id;
  const ready =
    ctx !== null && !session.isPending && Boolean(userId);

  useEffect(() => {
    if (!ctx) return;
    if (session.isPending) return;

    if (!userId) {
      setState("signed-out");
      setCompleted(false);
      return;
    }

    let cancelled = false;
    setState("loading");
    setError("");

    fetch(`/api/progress?pathId=${encodeURIComponent(ctx.pathId)}`, {
      headers: { accept: "application/json" },
    })
      .then(async (response) => {
        if (cancelled) return;
        if (response.status === 401) {
          setState("signed-out");
          setCompleted(false);
          return;
        }
        if (!response.ok) {
          setState("error");
          setError("Could not load progress.");
          return;
        }
        const data = (await response.json()) as {
          completedTopicIds?: unknown;
        };
        const ids = Array.isArray(data.completedTopicIds)
          ? data.completedTopicIds.filter(
              (id): id is string => typeof id === "string",
            )
          : [];
        setCompleted(ids.includes(topicId));
        setState("ready");
      })
      .catch(() => {
        if (!cancelled) {
          setState("error");
          setError("Could not load progress.");
        }
      });

    return () => {
      cancelled = true;
    };
  }, [ctx, session.isPending, topicId, userId]);

  const label = useMemo(() => {
    if (!ctx) return "";
    return completed
      ? `Completed in ${ctx.pathTitle}`
      : `Mark this complete in ${ctx.pathTitle}`;
  }, [completed, ctx]);

  if (!ctx) return null;

  if (session.isPending) {
    return (
      <div
        className="mt-8 h-12 animate-pulse rounded-md border border-[var(--color-atlas-line)] bg-[var(--color-atlas-surface)]"
        aria-hidden="true"
      />
    );
  }

  if (!userId) {
    return (
      <p className="mt-8 rounded-md border border-[var(--color-atlas-line)] bg-[var(--color-atlas-surface)] p-3 text-sm text-[var(--color-atlas-muted)]">
        Sign in to track your progress through{" "}
        <a
          href={`/p/${ctx.pathId}`}
          className="text-[var(--color-atlas-accent)] no-underline hover:underline"
        >
          {ctx.pathTitle}
        </a>
        .
      </p>
    );
  }

  const onToggle = async (next: boolean) => {
    if (!ready || saving) return;
    const previous = completed;
    setCompleted(next);
    setSaving(true);
    setError("");

    try {
      const response = await fetch("/api/progress", {
        method: "PUT",
        headers: {
          accept: "application/json",
          "content-type": "application/json",
        },
        body: JSON.stringify({
          pathId: ctx.pathId,
          topicId,
          completed: next,
        }),
      });

      if (response.status === 401) {
        setCompleted(previous);
        setState("signed-out");
        return;
      }

      if (!response.ok) {
        setCompleted(previous);
        setError("Could not save progress.");
        return;
      }
    } catch {
      setCompleted(previous);
      setError("Could not save progress.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="mt-8 flex items-center justify-between gap-3 rounded-md border border-[var(--color-atlas-line)] bg-[var(--color-atlas-surface)] p-3">
      <label className="flex flex-1 items-center gap-3 text-sm">
        <input
          type="checkbox"
          checked={completed}
          disabled={!ready || saving}
          onChange={(event) => onToggle(event.currentTarget.checked)}
          className="h-5 w-5 shrink-0 rounded border-[var(--color-atlas-line)] accent-[var(--color-atlas-accent)] disabled:cursor-not-allowed"
        />
        <span className="text-[var(--color-atlas-ink)]">{label}</span>
      </label>
      {error && (
        <span
          className="text-xs text-red-600 dark:text-red-400"
          role="alert"
        >
          {error}
        </span>
      )}
      {state === "loading" && !error && (
        <span className="text-xs text-[var(--color-atlas-muted)]">Loading…</span>
      )}
    </div>
  );
}
