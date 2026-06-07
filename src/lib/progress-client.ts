import type { ProgressMeResponse } from "~/pages/api/progress/me";

export type { ProgressMeResponse };

/**
 * Status of an attempt to fetch /api/progress/me.
 */
export type ProgressMeState =
  | { kind: "loading" }
  | { kind: "ready"; data: ProgressMeResponse }
  | { kind: "signed-out" }
  | { kind: "error"; message: string };

let inflight: Promise<ProgressMeState> | null = null;

/**
 * Fetch the current user's progress payload, memoised for the page lifetime so
 * many islands on one page share a single HTTP request.
 *
 * Callers MUST check `state.kind` before using `state.data` — the response is
 * never the raw payload because we also want to communicate "signed out" and
 * "error" without throwing.
 */
export function getProgressMe(): Promise<ProgressMeState> {
  if (inflight) return inflight;

  inflight = (async (): Promise<ProgressMeState> => {
    try {
      const response = await fetch("/api/progress/me", {
        headers: { accept: "application/json" },
      });

      if (response.status === 401) {
        return { kind: "signed-out" };
      }

      if (!response.ok) {
        return { kind: "error", message: "Progress is unavailable right now." };
      }

      const data = (await response.json()) as ProgressMeResponse;
      return { kind: "ready", data };
    } catch {
      return { kind: "error", message: "Progress is unavailable right now." };
    }
  })();

  return inflight;
}

/**
 * Clear the in-page cache. Useful right after a PUT so the next reader sees fresh data.
 */
export function resetProgressMeCache(): void {
  inflight = null;
}
