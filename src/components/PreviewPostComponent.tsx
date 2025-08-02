'use client'

import { type SanityDocument } from "next-sanity";
import { useEffect, useState } from "react";
import imageUrlBuilder from "@sanity/image-url";
import type { SanityImageSource } from "@sanity/image-url/lib/types/types";
import { createClient } from "next-sanity";
import Link from "next/link";
import Image from "next/image";
import { ArticleContent } from "@/components/ArticleContent";
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

const urlFor = (source: SanityImageSource) =>
  imageUrlBuilder({ projectId: "479cjhmz", dataset: "production" }).image(source);

export default function PreviewPostComponent({ slug, token }: { slug: string; token: string }) {
  const [post, setPost] = useState<SanityDocument | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const previewClient = createClient({
          projectId: "479cjhmz",
          dataset: "production",
          apiVersion: "2023-05-03",
          useCdn: false,
          perspective: 'previewDrafts',
          token: token,
        });

        const fetchedPost = await previewClient.fetch<SanityDocument>(POST_QUERY, { slug });
        setPost(fetchedPost);
      } catch (error) {
        console.error('Preview fetch error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [slug, token]);

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">プレビューを読み込み中...</p>
        </div>
      </main>
    );
  }

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
      {/* プレビューモードインジケーター */}
      <div className="bg-yellow-100 border-b border-yellow-200 px-4 py-2">
        <div className="container mx-auto max-w-4xl">
          <p className="text-yellow-800 text-sm font-medium">
            🔍 プレビューモード - 下書きを表示中
          </p>
        </div>
      </div>

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
              📅 公開: {post.publishedAt 
                ? new Date(post.publishedAt).toLocaleDateString('ja-JP', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })
                : '下書き'
              }
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

        <div className="bg-white rounded-lg shadow-sm p-6 sm:p-8 lg:p-12">
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