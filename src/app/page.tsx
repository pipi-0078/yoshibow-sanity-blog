import Link from "next/link";
import Image from "next/image";
import { type SanityDocument } from "next-sanity";
import imageUrlBuilder from "@sanity/image-url";
import type { SanityImageSource } from "@sanity/image-url/lib/types/types";
import { Metadata } from "next";

import { client } from "@/sanity/client";

export const metadata: Metadata = {
  title: "Yoshibow Blog",
  description: "技術やライフスタイルについての記事を発信するブログサイト",
  openGraph: {
    title: "Yoshibow Blog",
    description: "技術やライフスタイルについての記事を発信するブログサイト",
    type: "website",
    url: "https://yoshibow-blog.vercel.app",
  },
};

const POSTS_QUERY = `*[
  _type == "post"
  && defined(slug.current)
]|order(publishedAt desc)[0...6]{_id, title, slug, publishedAt, image, body[0..1]}`;

const FEATURED_POSTS_QUERY = `*[
  _type == "post"
  && defined(slug.current)
]|order(publishedAt desc)[0...3]{_id, title, slug, publishedAt, image, body[0..1]}`;

const options = { next: { revalidate: 30 } };

const { projectId, dataset } = client.config();
const urlFor = (source: SanityImageSource) =>
  projectId && dataset
    ? imageUrlBuilder({ projectId, dataset }).image(source)
    : null;

export default async function IndexPage() {
  const [posts, featuredPosts] = await Promise.all([
    client.fetch<SanityDocument[]>(POSTS_QUERY, {}, options),
    client.fetch<SanityDocument[]>(FEATURED_POSTS_QUERY, {}, options),
  ]);

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b">
        <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="text-2xl font-bold text-gray-900">
              Yoshibow Blog
            </Link>
            <div className="hidden md:flex space-x-8">
              <Link href="#about" className="text-gray-600 hover:text-gray-900 transition-colors">
                About
              </Link>
              <Link href="#posts" className="text-gray-600 hover:text-gray-900 transition-colors">
                記事一覧
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-800 text-white py-20 lg:py-32">
        <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              Welcome to
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-orange-300">
                Yoshibow Blog
              </span>
            </h1>
            <p className="text-xl sm:text-2xl text-blue-100 mb-8 max-w-3xl mx-auto leading-relaxed">
              技術、プログラミング、そしてライフスタイルについて<br className="hidden sm:block" />
              日々学んだことや体験を共有しています
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="#posts" 
                className="inline-flex items-center px-8 py-4 bg-white text-blue-600 font-semibold rounded-lg hover:bg-gray-100 transition-colors shadow-lg"
              >
                記事を読む
                <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
              <Link 
                href="#about" 
                className="inline-flex items-center px-8 py-4 border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-blue-600 transition-all"
              >
                プロフィール
              </Link>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-gray-50 to-transparent"></div>
      </section>

      {/* Featured Posts Section */}
      <section id="featured" className="py-16 lg:py-24">
        <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              注目の記事
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              特におすすめしたい記事をピックアップしました
            </p>
          </div>
          
          {featuredPosts.length > 0 && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {featuredPosts.map((post, index) => {
                const imageUrl = post.image
                  ? urlFor(post.image)?.width(400).height(250).url()
                  : null;
                  
                return (
                  <article 
                    key={post._id}
                    className={`bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 ${
                      index === 0 ? 'lg:col-span-2 lg:row-span-2' : ''
                    }`}
                  >
                    <Link href={`/${post.slug.current}`} className="block">
                      {imageUrl ? (
                        <div className={`bg-gray-200 relative ${index === 0 ? 'aspect-[2/1]' : 'aspect-video'}`}>
                          <Image
                            src={imageUrl}
                            alt={post.title}
                            className="w-full h-full object-cover"
                            fill
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          />
                        </div>
                      ) : (
                        <div className={`bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center ${
                          index === 0 ? 'aspect-[2/1]' : 'aspect-video'
                        }`}>
                          <span className="text-white text-3xl font-bold">YB</span>
                        </div>
                      )}
                      
                      <div className="p-6">
                        <h3 className={`font-bold text-gray-900 mb-3 line-clamp-2 hover:text-blue-600 transition-colors ${
                          index === 0 ? 'text-2xl lg:text-3xl' : 'text-xl'
                        }`}>
                          {post.title}
                        </h3>
                        <time 
                          dateTime={post.publishedAt}
                          className="text-sm text-gray-500"
                        >
                          {new Date(post.publishedAt).toLocaleDateString('ja-JP', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </time>
                      </div>
                    </Link>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-16 lg:py-24 bg-white">
        <div className="container mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="w-32 h-32 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full mx-auto mb-8 flex items-center justify-center">
              <span className="text-white text-4xl font-bold">YB</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
              About Yoshibow
            </h2>
            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
              フロントエンドエンジニアとして働きながら、新しい技術の学習と実践に取り組んでいます。<br className="hidden sm:block" />
              React、Next.js、TypeScriptを中心とした現代的なWeb開発技術に興味があり、<br className="hidden sm:block" />
              日々の学びや体験をこのブログで共有しています。
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <span className="px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">React</span>
              <span className="px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">Next.js</span>
              <span className="px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">TypeScript</span>
              <span className="px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">Tailwind CSS</span>
              <span className="px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">Sanity</span>
            </div>
          </div>
        </div>
      </section>

      {/* Latest Posts Section */}
      <section id="posts" className="py-16 lg:py-24">
        <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              最新の記事
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              最近投稿された記事をご覧ください
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post) => {
              const imageUrl = post.image
                ? urlFor(post.image)?.width(400).height(250).url()
                : null;
                
              return (
                <article 
                  key={post._id}
                  className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                >
                  <Link href={`/${post.slug.current}`} className="block">
                    {imageUrl ? (
                      <div className="aspect-video bg-gray-200 relative">
                        <Image
                          src={imageUrl}
                          alt={post.title}
                          className="w-full h-full object-cover"
                          fill
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                      </div>
                    ) : (
                      <div className="aspect-video bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                        <span className="text-white text-2xl font-bold">YB</span>
                      </div>
                    )}
                    
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 hover:text-blue-600 transition-colors">
                        {post.title}
                      </h3>
                      <time 
                        dateTime={post.publishedAt}
                        className="text-sm text-gray-500"
                      >
                        {new Date(post.publishedAt).toLocaleDateString('ja-JP', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </time>
                    </div>
                  </Link>
                </article>
              );
            })}
          </div>
          
          {posts.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">まだ記事がありません。</p>
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h3 className="text-2xl font-bold mb-4">Yoshibow Blog</h3>
            <p className="text-gray-400 mb-6">
              技術とライフスタイルについて発信するブログ
            </p>
            <div className="flex justify-center space-x-6 mb-8">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <span className="sr-only">Twitter</span>
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <span className="sr-only">GitHub</span>
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                </svg>
              </a>
            </div>
            <div className="border-t border-gray-800 pt-8">
              <p className="text-gray-400 text-sm">
                © 2024 Yoshibow Blog. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}