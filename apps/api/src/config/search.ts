import { MeiliSearch } from "meilisearch";
import { env } from "./env";

export const meiliClient = new MeiliSearch({
  host: env.MEILISEARCH_HOST,
  apiKey: env.MEILISEARCH_API_KEY,
});

export const POSTS_INDEX = "posts";

export async function initSearchIndexes() {
  try {
    const postsIndex = meiliClient.index(POSTS_INDEX);
    await postsIndex.updateSettings({
      searchableAttributes: ["title", "excerpt", "content", "author", "tags"],
      filterableAttributes: ["status", "authorId", "tags", "publishedAt"],
      sortableAttributes: ["publishedAt", "viewCount"],
    });
    console.log("✅ Meilisearch indexes initialised");
  } catch {
    console.warn("⚠️  Meilisearch unavailable — search disabled");
  }
}
