import { type SanityDocument } from "next-sanity";
import imageUrlBuilder from "@sanity/image-url";
import type { SanityImageSource } from "@sanity/image-url/lib/types/types";
import { client } from "@/sanity/client";
import Link from "next/link";
import Image from "next/image";
import { Metadata } from "next";
import { ArticleContent } from "@/components/ArticleContent";

const POST_QUERY = `*[_type == "post" && slug.current == $slug][0]{
  _id,
  title,
  slug,
  publishedAt,
  image,
  body
}`;

const { projectId, dataset } = client.config();
const urlFor = (source: SanityImageSource) =>
  projectId && dataset
    ? imageUrlBuilder({ projectId, dataset }).image(source)
    : null;

const options = { next: { revalidate: 30 } };

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const post = await client.fetch<SanityDocument>(POST_QUERY, await params, options);
  
  if (!post) {
    return {
      title: "記事が見つかりません | Yoshibow Blog",
    };
  }

  const imageUrl = post.image
    ? urlFor(post.image)?.width(1200).height(630).url()
    : null;

  return {
    title: `${post.title} | Yoshibow Blog`,
    description: post.body && Array.isArray(post.body) 
      ? post.body.find((block: unknown) => (block as { _type: string })._type === 'block')?.children?.[0]?.text?.substring(0, 160) || post.title
      : post.title,
    openGraph: {
      title: post.title,
      description: post.body && Array.isArray(post.body) 
        ? post.body.find((block: unknown) => (block as { _type: string })._type === 'block')?.children?.[0]?.text?.substring(0, 160) || post.title
        : post.title,
      type: "article",
      publishedTime: post.publishedAt,
      images: imageUrl ? [{ url: imageUrl, width: 1200, height: 630 }] : [],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.body && Array.isArray(post.body) 
        ? post.body.find((block: unknown) => (block as { _type: string })._type === 'block')?.children?.[0]?.text?.substring(0, 160) || post.title
        : post.title,
      images: imageUrl ? [imageUrl] : [],
    },
  };
}

export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const post = await client.fetch<SanityDocument>(POST_QUERY, await params, options);
  
  if (!post) {
    return (
      <main className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">記事が見つかりません</h1>
          <Link 
            href="/" 
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            ← ホームに戻る
          </Link>
        </div>
      </main>
    );
  }

  const postImageUrl = post.image
    ? urlFor(post.image)?.width(800).height(450).url()
    : null;

  return (
    <main className="min-h-screen bg-gray-50">
      <article className="container mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        <nav className="mb-8">
          <Link 
            href="/" 
            className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors font-medium"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            記事一覧に戻る
          </Link>
        </nav>

        <header className="mb-8">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4 leading-tight">
            {post.title}
          </h1>
          <div className="flex items-center text-gray-600 mb-6">
            <time 
              dateTime={post.publishedAt}
              className="text-sm"
            >
              {new Date(post.publishedAt).toLocaleDateString('ja-JP', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </time>
          </div>
        </header>

        {postImageUrl && (
          <div className="mb-8">
            <Image
              src={postImageUrl}
              alt={post.title}
              className="w-full aspect-video object-cover rounded-lg shadow-lg"
              width={800}
              height={450}
              priority
            />
          </div>
        )}

        <div className="bg-white rounded-lg shadow-sm p-6 sm:p-8 lg:p-12">
          {Array.isArray(post.body) && (
            <ArticleContent content={post.body} />
          )}
        </div>

        <nav className="mt-12 pt-8 border-t border-gray-200">
          <Link 
            href="/" 
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            記事一覧に戻る
          </Link>
        </nav>
      </article>
    </main>
  );
}