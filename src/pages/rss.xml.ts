import type { APIContext } from "astro";
import rss from "@astrojs/rss";
import { getAllTopics, topicUrl } from "~/lib/graph";
import { categoryLabel, type CategorySlug } from "~/lib/categories";

export async function GET(context: APIContext) {
  const topics = await getAllTopics();
  const sorted = [...topics].sort(
    (a, b) => b.data.updated.getTime() - a.data.updated.getTime(),
  );

  return rss({
    title: "Computer Atlas",
    description:
      "A browsable, searchable map of computer science and computing topics.",
    site: context.site ?? "https://computer-atlas.example.com",
    items: sorted.map((t) => ({
      title: t.data.title,
      pubDate: t.data.updated,
      description: t.data.summary,
      link: topicUrl(t.id),
      categories: [
        categoryLabel(t.data.category as CategorySlug),
        t.data.kind,
        t.data.level,
        ...t.data.tags,
      ],
    })),
    customData: `<language>en</language>`,
  });
}
