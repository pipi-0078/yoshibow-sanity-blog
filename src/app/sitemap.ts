import { client } from "@/sanity/client";
import { type SanityDocument } from "next-sanity";

const POSTS_QUERY = `*[
  _type == "post"
  && defined(slug.current)
]{slug, publishedAt}`;

export default async function sitemap() {
  const baseUrl = "https://yoshibow-blog.vercel.app";

  const posts = await client.fetch<SanityDocument[]>(POSTS_QUERY);

  const postUrls = posts.map((post) => ({
    url: `${baseUrl}/${post.slug.current}`,
    lastModified: new Date(post.publishedAt),
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 1,
    },
    ...postUrls,
  ];
}