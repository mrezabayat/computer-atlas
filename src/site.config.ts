export const SITE = {
  name: "Computer Atlas",
  url: "https://computer-atlas.mrb-bayat.workers.dev/",
  repo: "https://github.com/mrezabayat/computer-atlas/",
  defaultBranch: "main",
} as const;

const ensureLeadingSlash = (p: string) => (p.startsWith("/") ? p : `/${p}`);

export function editUrl(repoRelativePath: string): string {
  return `${SITE.repo}/edit/${SITE.defaultBranch}${ensureLeadingSlash(
    repoRelativePath,
  )}`;
}

export function newTopicIssueUrl(opts?: {
  title?: string;
  category?: string;
}): string {
  const params = new URLSearchParams({ template: "new-topic.yml" });
  if (opts?.title) params.set("title", `[Topic] ${opts.title}`);
  return `${SITE.repo}/issues/new?${params.toString()}`;
}

export function reportFixUrl(opts?: { topicId?: string }): string {
  const params = new URLSearchParams({ template: "topic-fix.yml" });
  if (opts?.topicId) params.set("title", `[Fix] ${opts.topicId}`);
  return `${SITE.repo}/issues/new?${params.toString()}`;
}

export function repoFileUrl(repoRelativePath: string): string {
  return `${SITE.repo}/blob/${SITE.defaultBranch}${ensureLeadingSlash(
    repoRelativePath,
  )}`;
}
