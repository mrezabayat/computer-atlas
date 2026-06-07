import readingTime from "reading-time";
import type { TopicEntry } from "./graph";

/**
 * Estimated reading time for a single topic in minutes.
 * Computed from the raw MDX body; rounded up so a 1.2-minute read is 2.
 * Falls back to 1 if the body is empty (stub).
 */
export function topicReadingTimeMinutes(topic: TopicEntry): number {
  const body = topic.body ?? "";
  if (!body.trim()) return 1;
  const { minutes } = readingTime(body);
  return Math.max(1, Math.ceil(minutes));
}

export interface PathReadingTotals {
  /** Sum of reading time for required (non-optional) topics. */
  requiredMinutes: number;
  /** Sum of reading time for optional topics only. */
  optionalMinutes: number;
}

export function sumPathReadingTime(
  required: TopicEntry[],
  optional: TopicEntry[] = [],
): PathReadingTotals {
  const sum = (xs: TopicEntry[]) =>
    xs.reduce((acc, t) => acc + topicReadingTimeMinutes(t), 0);
  return {
    requiredMinutes: sum(required),
    optionalMinutes: sum(optional),
  };
}
