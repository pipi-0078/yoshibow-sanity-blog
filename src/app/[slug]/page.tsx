import { type SanityDocument } from "next-sanity";
import imageUrlBuilder from "@sanity/image-url";
import type { SanityImageSource } from "@sanity/image-url/lib/types/types";
import { client, previewClient } from "@/sanity/client";
import Link from "next/link";
import Image from "next/image";
import { Metadata } from "next";
import { draftMode } from "next/headers";
import { ArticleContent } from "@/components/ArticleContent";
import PreviewProvider from "@/components/PreviewProvider";
import PreviewPostComponent from "@/components/PreviewPostComponent";
import ShareButtons from "@/components/ShareButtons";
import ClickableImage from "@/components/ClickableImage";

const POST_QUERY = `*[_type == "post" && slug.current == $slug][0]{
  _id,
  title,
  slug,
  publishedAt,
  _updatedAt,
  image,
  body,
  categories[]->{title, slug},
  tags,
  author->{name, image, bio}
}`;

// プレビューモード用のクエリ（下書きも含む）
const PREVIEW_POST_QUERY = `*[_type == "post" && slug.current == $slug]{
  _id,
  title,
  slug,
  publishedAt,
  _updatedAt,
  image,
  body,
  categories[]->{title, slug},
  tags,
  author->{name, image, bio}
} | order(_updatedAt desc)[0]`;

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
  const { isEnabled } = draftMode();
  const currentClient = isEnabled ? previewClient : client;
  const query = isEnabled ? PREVIEW_POST_QUERY : POST_QUERY;
  const post = await currentClient.fetch<SanityDocument>(query, await params, options);
  
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
  const { slug } = await params;
  const { isEnabled } = draftMode();

  // プレビューモードの場合
  if (isEnabled) {
    const token = process.env.SANITY_API_READ_TOKEN;
    if (!token) {
      throw new Error('SANITY_API_READ_TOKEN is required for preview mode');
    }

    return (
      <PreviewProvider token={token}>
        <PreviewPostComponent slug={slug} token={token} />
      </PreviewProvider>
    );
  }

  // 通常モード（公開記事のみ）
  const post = await client.fetch<SanityDocument>(POST_QUERY, { slug }, options);
  
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
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-gray-600 mb-4">
            <time 
              dateTime={post.publishedAt}
              className="text-sm flex items-center"
            >
              📅 公開: {new Date(post.publishedAt).toLocaleDateString('ja-JP', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </time>
            {post._updatedAt && (
              <time 
                dateTime={post._updatedAt}
                className="text-sm flex items-center text-gray-500"
              >
                🔄 最終更新: {new Date(post._updatedAt).toLocaleDateString('ja-JP', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </time>
            )}
          </div>
          
          {post.categories && post.categories.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-6">
              {post.categories.map((category: any) => (
                <span
                  key={category.slug.current}
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
                >
                  {category.title}
                </span>
              ))}
            </div>
          )}

          {/* 著者情報の表示 */}
          {post.author && (
            <div className="flex items-center space-x-4 mb-6 p-4 bg-gray-50 rounded-lg">
              {post.author.image && (
                <Image
                  src={urlFor(post.author.image)?.width(48).height(48).fit('crop').url() || ''}
                  alt={post.author.name || 'author image'}
                  className="h-12 w-12 rounded-full"
                  width={48}
                  height={48}
                />
              )}
              <div>
                <p className="font-semibold text-gray-900">👤 {post.author.name}</p>
                {post.author.bio && (
                  <p className="text-sm text-gray-600">{post.author.bio}</p>
                )}
              </div>
            </div>
          )}
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
            {/* アイキャッチ画像下のコンパクトシェア */}
            <div className="mt-4 bg-white rounded-lg border border-gray-200 shadow-sm">
              <ShareButtons 
                title={post.title}
                url={`https://vibes-life.yoshi-blog2021.com/${post.slug.current}`}
                variant="compact"
              />
            </div>
          </div>
        )}

        <div className="prose max-w-none bg-white rounded-lg shadow-sm p-6 sm:p-8 lg:p-12">
          {Array.isArray(post.body) && (
            <ArticleContent content={post.body} />
          )}
        </div>

        {/* タグ表示 */}
        {post.tags && post.tags.length > 0 && (
          <div className="mt-8 p-6 bg-gray-50 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">🏷️ タグ</h3>
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag: string, index: number) => (
                <span
                  key={index}
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-200 text-gray-800 hover:bg-gray-300 transition-colors"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* シェア機能 */}
        <div className="mt-8">
          <ShareButtons 
            title={post.title}
            url={`https://vibes-life.yoshi-blog2021.com/${post.slug.current}`}
          />
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